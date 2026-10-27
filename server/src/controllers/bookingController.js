const crypto = require('crypto');
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const SeatHold = require('../models/SeatHold');
const Screen = require('../models/Screen');
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../config/constants');

// Generate human-readable unique booking reference
const generateBookingReference = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'IMV-';
  for (let i = 0; i < 7; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
};

// @desc    Create and confirm ticket booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const {
      showtimeId,
      seats, // Array of { seatId: 'A1', category: 'VIP', price: 22 }
      holdToken,
      paymentMethod = 'Demo Card',
      cardLast4 = '4242',
    } = req.body;

    const userId = req.user._id;

    if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Showtime ID and at least one seat are required',
      });
    }

    const seatIds = seats.map((s) => (typeof s === 'string' ? s : s.seatId));

    // 1. Fetch showtime
    const showtime = await Showtime.findById(showtimeId).populate('screenId');
    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }

    if (showtime.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'This showtime has been cancelled' });
    }

    if (new Date(showtime.startTime) < new Date()) {
      return res.status(400).json({ success: false, message: 'This showtime has already passed' });
    }

    // 2. Atomic seat reservation check: ensure NONE of seatIds are in bookedSeats
    // Atomic update prevents race conditions & double-booking
    const updatedShowtime = await Showtime.findOneAndUpdate(
      {
        _id: showtimeId,
        bookedSeats: { $nin: seatIds },
      },
      {
        $push: { bookedSeats: { $each: seatIds } },
      },
      { new: true }
    );

    if (!updatedShowtime) {
      return res.status(409).json({
        success: false,
        message: 'One or more of the selected seats were just booked by another customer. Please select different seats.',
      });
    }

    // 3. Calculate financial breakdown
    const screen = showtime.screenId;
    const categoryMap = new Map();
    if (screen && screen.seatLayout && screen.seatLayout.rows) {
      screen.seatLayout.rows.forEach((r) => {
        (r.seats || []).forEach((s) => {
          categoryMap.set(s.seatId, s.category);
        });
      });
    }

    const enrichedSeats = seats.map((item) => {
      const sId = typeof item === 'string' ? item : item.seatId;
      const cat = (typeof item === 'object' && item.category) || categoryMap.get(sId) || 'Regular';
      const price = (showtime.pricing && showtime.pricing[cat]) || 12.0;
      return {
        seatId: sId,
        category: cat,
        price,
      };
    });

    const subtotal = enrichedSeats.reduce((sum, s) => sum + s.price, 0);
    const convenienceFee = parseFloat((enrichedSeats.length * 1.5).toFixed(2));
    const tax = parseFloat((subtotal * 0.08).toFixed(2)); // 8% standard tax
    const totalAmount = parseFloat((subtotal + convenienceFee + tax).toFixed(2));

    // 4. Generate unique reference and create booking
    let reference = generateBookingReference();
    let isUnique = false;
    while (!isUnique) {
      const existing = await Booking.findOne({ bookingReference: reference });
      if (!existing) isUnique = true;
      else reference = generateBookingReference();
    }

    const booking = await Booking.create({
      bookingReference: reference,
      userId,
      showtimeId: showtime._id,
      seats: enrichedSeats,
      ticketQuantity: enrichedSeats.length,
      subtotal,
      convenienceFee,
      tax,
      totalAmount,
      paymentStatus: PAYMENT_STATUS.PAID,
      bookingStatus: BOOKING_STATUS.CONFIRMED,
      paymentDetails: {
        method: paymentMethod,
        transactionId: 'TXN-' + crypto.randomBytes(4).toString('hex').toUpperCase(),
        cardLast4: cardLast4.slice(-4),
      },
    });

    // 5. Clean up seat hold
    if (holdToken) {
      await SeatHold.deleteMany({ showtimeId: showtime._id, holdToken });
    }
    await SeatHold.deleteMany({
      showtimeId: showtime._id,
      seats: { $in: seatIds },
    });

    // 6. Return populated booking
    const populatedBooking = await Booking.findById(booking._id)
      .populate('userId', 'name email phone')
      .populate({
        path: 'showtimeId',
        populate: [
          { path: 'movieId', select: 'title posterUrl duration rating certification language' },
          { path: 'theatreId', select: 'name address city' },
          { path: 'screenId', select: 'name screenType' },
        ],
      });

    res.status(201).json({
      success: true,
      message: 'Tickets booked successfully!',
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings of logged in user
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate({
        path: 'showtimeId',
        populate: [
          { path: 'movieId', select: 'title posterUrl duration rating certification language' },
          { path: 'theatreId', select: 'name address city' },
          { path: 'screenId', select: 'name screenType' },
        ],
      })
      .sort({ createdAt: -1 });

    const now = new Date();
    const upcoming = [];
    const past = [];

    bookings.forEach((b) => {
      const showStartTime = b.showtimeId && b.showtimeId.startTime ? new Date(b.showtimeId.startTime) : null;
      if (showStartTime && showStartTime >= now && b.bookingStatus === BOOKING_STATUS.CONFIRMED) {
        upcoming.push(b);
      } else {
        past.push(b);
      }
    });

    res.status(200).json({
      success: true,
      total: bookings.length,
      upcoming,
      past,
      all: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate({
        path: 'showtimeId',
        populate: [
          { path: 'movieId', select: 'title posterUrl duration rating certification language trailerUrl' },
          { path: 'theatreId', select: 'name address city phone' },
          { path: 'screenId', select: 'name screenType' },
        ],
      });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Authorization: User must own booking or be admin
    if (
      booking.userId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: you do not own this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an eligible booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id).populate('showtimeId');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Authorization check
    if (
      booking.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: you do not have permission to cancel this booking',
      });
    }

    if (booking.bookingStatus === BOOKING_STATUS.CANCELLED) {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled',
      });
    }

    // Eligibility check: showtime must be in the future
    if (booking.showtimeId && new Date(booking.showtimeId.startTime) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a booking for a showtime that has already started or passed',
      });
    }

    // Extract seat IDs to release
    const seatIds = booking.seats.map((s) => s.seatId);

    // Atomically release booked seats back to showtime
    if (booking.showtimeId) {
      await Showtime.findByIdAndUpdate(booking.showtimeId._id, {
        $pull: { bookedSeats: { $in: seatIds } },
      });
    }

    // Update booking status
    booking.bookingStatus = BOOKING_STATUS.CANCELLED;
    booking.paymentStatus = PAYMENT_STATUS.REFUNDED;
    booking.cancellationReason = reason || 'Customer requested cancellation';
    booking.cancelledAt = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Simulated refund processed.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
