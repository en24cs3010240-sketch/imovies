const crypto = require('crypto');
const Showtime = require('../models/Showtime');
const Screen = require('../models/Screen');
const SeatHold = require('../models/SeatHold');
const Booking = require('../models/Booking');
const {
  DEFAULT_HOLD_DURATION_MINUTES,
  MAX_SEATS_PER_BOOKING,
} = require('../config/constants');

// @desc    Get showtimes with filters
// @route   GET /api/showtimes
// @access  Public
const getShowtimes = async (req, res, next) => {
  try {
    const { movieId, theatreId, city, date } = req.query;
    const query = { status: { $ne: 'cancelled' } };

    if (movieId) {
      query.movieId = movieId;
    }

    if (theatreId) {
      query.theatreId = theatreId;
    }

    // Filter by date (defaults to today onwards if no date provided)
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.startTime = { $gte: startOfDay, $lte: endOfDay };
    } else {
      // Default to from current time minus 30 mins
      query.startTime = { $gte: new Date(Date.now() - 30 * 60 * 1000) };
    }

    let showtimes = await Showtime.find(query)
      .populate('movieId', 'title posterUrl duration rating certification genre language')
      .populate('theatreId', 'name city address facilities')
      .populate('screenId', 'name screenType totalCapacity')
      .sort({ startTime: 1 });

    // If city filter is applied, filter populated results
    if (city && city !== 'All') {
      showtimes = showtimes.filter(
        (st) =>
          st.theatreId &&
          st.theatreId.city.toLowerCase() === city.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      count: showtimes.length,
      data: showtimes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single showtime by ID
// @route   GET /api/showtimes/:id
// @access  Public
const getShowtimeById = async (req, res, next) => {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate('movieId')
      .populate('theatreId')
      .populate('screenId');

    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }

    res.status(200).json({
      success: true,
      data: showtime,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get interactive seat availability layout for a showtime
// @route   GET /api/showtimes/:id/seats
// @access  Public
const getShowtimeSeats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { holdToken } = req.query;
    const currentUserId = req.user ? req.user._id.toString() : null;

    const showtime = await Showtime.findById(id).populate('screenId');
    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }

    if (!showtime.screenId || !showtime.screenId.seatLayout) {
      return res.status(404).json({ success: false, message: 'Screen seating layout not found' });
    }

    const now = new Date();

    // Fetch active seat holds for this showtime
    const activeHolds = await SeatHold.find({
      showtimeId: showtime._id,
      status: 'active',
      expiresAt: { $gt: now },
    });

    const heldSeatMap = new Map();
    activeHolds.forEach((hold) => {
      const isMine =
        (holdToken && hold.holdToken === holdToken) ||
        (currentUserId && hold.userId && hold.userId.toString() === currentUserId);

      hold.seats.forEach((seatId) => {
        heldSeatMap.set(seatId, {
          isMine: Boolean(isMine),
          expiresAt: hold.expiresAt,
          holdToken: hold.holdToken,
        });
      });
    });

    const bookedSet = new Set(showtime.bookedSeats || []);

    // Enrich rows with real-time seat status
    const layout = JSON.parse(JSON.stringify(showtime.screenId.seatLayout));
    layout.rows = (layout.rows || []).map((row) => {
      row.seats = (row.seats || []).map((seat) => {
        let status = 'available';
        let holdInfo = null;

        if (bookedSet.has(seat.seatId)) {
          status = 'booked';
        } else if (heldSeatMap.has(seat.seatId)) {
          const hold = heldSeatMap.get(seat.seatId);
          if (hold.isMine) {
            status = 'selected'; // User's own active hold
            holdInfo = { expiresAt: hold.expiresAt, holdToken: hold.holdToken };
          } else {
            status = 'held'; // Held by another user
          }
        }

        return {
          ...seat,
          status,
          price: (showtime.pricing && showtime.pricing[seat.category]) || 12.0,
          holdInfo,
        };
      });
      return row;
    });

    res.status(200).json({
      success: true,
      showtimeId: showtime._id,
      pricing: showtime.pricing,
      layout,
      totalBooked: bookedSet.size,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Hold seats temporarily (5-10 mins) with atomic conflict detection
// @route   POST /api/showtimes/:id/holds
// @access  Public / Optional Private
const holdSeats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { seats, holdToken } = req.body;
    const userId = req.user ? req.user._id : null;

    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Seats array is required and must contain at least one seat',
      });
    }

    if (seats.length > MAX_SEATS_PER_BOOKING) {
      return res.status(400).json({
        success: false,
        message: `You can select a maximum of ${MAX_SEATS_PER_BOOKING} seats per booking`,
      });
    }

    const showtime = await Showtime.findById(id);
    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }

    if (showtime.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'This showtime has been cancelled' });
    }

    // 1. Check if any requested seats are already permanently booked
    const bookedConflicts = seats.filter((s) => showtime.bookedSeats.includes(s));
    if (bookedConflicts.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Seats [${bookedConflicts.join(', ')}] are already booked. Please choose other seats.`,
        conflictedSeats: bookedConflicts,
      });
    }

    const token = holdToken || crypto.randomUUID();
    const now = new Date();
    const durationMinutes = parseInt(process.env.SEAT_HOLD_DURATION_MINUTES, 10) || DEFAULT_HOLD_DURATION_MINUTES;
    const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

    // 2. Check if held by another session
    const existingHolds = await SeatHold.find({
      showtimeId: showtime._id,
      status: 'active',
      expiresAt: { $gt: now },
      seats: { $in: seats },
      holdToken: { $ne: token }, // exclude current session's own hold
    });

    if (existingHolds.length > 0) {
      const heldByOthers = [];
      existingHolds.forEach((h) => {
        h.seats.forEach((s) => {
          if (seats.includes(s)) heldByOthers.push(s);
        });
      });
      return res.status(409).json({
        success: false,
        message: `Seats [${heldByOthers.join(', ')}] are currently held by another customer. Please choose different seats or try again in a few minutes.`,
        conflictedSeats: heldByOthers,
      });
    }

    // 3. Atomically release previous hold for this token if re-selecting
    await SeatHold.deleteMany({
      showtimeId: showtime._id,
      holdToken: token,
    });

    // 4. Create new seat hold
    const hold = await SeatHold.create({
      showtimeId: showtime._id,
      seats,
      userId,
      holdToken: token,
      expiresAt,
      status: 'active',
    });

    res.status(200).json({
      success: true,
      message: `Seats held successfully for ${durationMinutes} minutes`,
      holdToken: token,
      holdId: hold._id,
      seats: hold.seats,
      expiresAt: hold.expiresAt,
      durationSeconds: durationMinutes * 60,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Release held seats
// @route   DELETE /api/showtimes/:id/holds/:holdToken
// @access  Public
const releaseHold = async (req, res, next) => {
  try {
    const { id, holdToken } = req.params;

    await SeatHold.deleteMany({
      showtimeId: id,
      holdToken,
    });

    res.status(200).json({
      success: true,
      message: 'Seats released successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a showtime
// @route   POST /api/showtimes
// @access  Private/Admin
const createShowtime = async (req, res, next) => {
  try {
    const { movieId, theatreId, screenId, startTime, endTime, pricing } = req.body;

    // Validate theatre and screen match
    const screen = await Screen.findOne({ _id: screenId, theatreId });
    if (!screen) {
      return res.status(400).json({
        success: false,
        message: 'Selected screen does not belong to the selected theatre',
      });
    }

    // Check for scheduling overlaps on the same screen
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time',
      });
    }

    const overlap = await Showtime.findOne({
      screenId,
      status: { $ne: 'cancelled' },
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } },
      ],
    });

    if (overlap) {
      return res.status(400).json({
        success: false,
        message: 'A showtime is already scheduled on this screen during the selected time period',
      });
    }

    const showtime = await Showtime.create({
      movieId,
      theatreId,
      screenId,
      startTime: start,
      endTime: end,
      pricing: pricing || { Regular: 12.0, Premium: 16.0, VIP: 22.0 },
    });

    const populated = await Showtime.findById(showtime._id)
      .populate('movieId', 'title duration')
      .populate('theatreId', 'name city')
      .populate('screenId', 'name screenType');

    res.status(201).json({
      success: true,
      message: 'Showtime scheduled successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update showtime
// @route   PUT /api/showtimes/:id
// @access  Private/Admin
const updateShowtime = async (req, res, next) => {
  try {
    const showtime = await Showtime.findById(req.params.id);
    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }

    const updated = await Showtime.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('movieId', 'title')
      .populate('theatreId', 'name')
      .populate('screenId', 'name');

    res.status(200).json({
      success: true,
      message: 'Showtime updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete showtime safely
// @route   DELETE /api/showtimes/:id
// @access  Private/Admin
const deleteShowtime = async (req, res, next) => {
  try {
    const showtime = await Showtime.findById(req.params.id);
    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }

    // Check if any bookings exist
    const bookingsCount = await Booking.countDocuments({
      showtimeId: showtime._id,
      bookingStatus: 'confirmed',
    });

    if (bookingsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete showtime: it already has ${bookingsCount} confirmed bookings. You must cancel the bookings first or set the showtime status to 'cancelled'.`,
      });
    }

    // Clean up any holds
    await SeatHold.deleteMany({ showtimeId: showtime._id });
    await Showtime.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Showtime deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShowtimes,
  getShowtimeById,
  getShowtimeSeats,
  holdSeats,
  releaseHold,
  createShowtime,
  updateShowtime,
  deleteShowtime,
};
