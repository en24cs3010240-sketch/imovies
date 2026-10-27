const Screen = require('../models/Screen');
const Showtime = require('../models/Showtime');
const { SEAT_CATEGORIES } = require('../config/constants');

// Helper to generate a default cinema seating layout
const generateDefaultLayout = (rowsCount = 8, seatsPerRow = 12) => {
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
  const rows = [];

  for (let r = 0; r < rowsCount; r++) {
    const rowName = rowLetters[r] || `R${r + 1}`;
    let category = SEAT_CATEGORIES.REGULAR;
    if (r < 2) category = SEAT_CATEGORIES.VIP;
    else if (r < 5) category = SEAT_CATEGORIES.PREMIUM;

    const seats = [];
    for (let s = 1; s <= seatsPerRow; s++) {
      seats.push({
        seatId: `${rowName}${s}`,
        seatNumber: s,
        category,
        isActive: true,
      });
    }

    rows.push({
      rowName,
      category,
      seats,
    });
  }

  return { rows };
};

// @desc    Get screens for a theatre
// @route   GET /api/theatres/:theatreId/screens
// @access  Public
const getScreensByTheatre = async (req, res, next) => {
  try {
    const screens = await Screen.find({ theatreId: req.params.theatreId });
    res.status(200).json({
      success: true,
      data: screens,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get screen by ID
// @route   GET /api/screens/:id
// @access  Public
const getScreenById = async (req, res, next) => {
  try {
    const screen = await Screen.findById(req.params.id).populate('theatreId', 'name city');
    if (!screen) {
      return res.status(404).json({ success: false, message: 'Screen not found' });
    }
    res.status(200).json({
      success: true,
      data: screen,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new screen
// @route   POST /api/theatres/:theatreId/screens
// @access  Private/Admin
const createScreen = async (req, res, next) => {
  try {
    const { theatreId } = req.params;
    const { name, screenType, seatLayout, rowCount = 8, seatsPerRow = 12 } = req.body;

    const layout = seatLayout && seatLayout.rows ? seatLayout : generateDefaultLayout(rowCount, seatsPerRow);

    const screen = await Screen.create({
      theatreId,
      name,
      screenType: screenType || 'Standard',
      seatLayout: layout,
    });

    res.status(201).json({
      success: true,
      message: 'Screen created successfully',
      data: screen,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a screen
// @route   PUT /api/screens/:id
// @access  Private/Admin
const updateScreen = async (req, res, next) => {
  try {
    const screen = await Screen.findById(req.params.id);
    if (!screen) {
      return res.status(404).json({ success: false, message: 'Screen not found' });
    }

    const updated = await Screen.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Screen updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a screen
// @route   DELETE /api/screens/:id
// @access  Private/Admin
const deleteScreen = async (req, res, next) => {
  try {
    const screen = await Screen.findById(req.params.id);
    if (!screen) {
      return res.status(404).json({ success: false, message: 'Screen not found' });
    }

    const showtimes = await Showtime.countDocuments({
      screenId: screen._id,
      startTime: { $gte: new Date() },
      status: { $ne: 'cancelled' },
    });

    if (showtimes > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete screen: it has ${showtimes} active upcoming showtimes scheduled.`,
      });
    }

    await Screen.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Screen deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getScreensByTheatre,
  getScreenById,
  createScreen,
  updateScreen,
  deleteScreen,
  generateDefaultLayout,
};
