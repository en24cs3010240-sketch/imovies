const Theatre = require('../models/Theatre');
const Screen = require('../models/Screen');
const Showtime = require('../models/Showtime');

// @desc    Get all theatres, optionally filtered by city
// @route   GET /api/theatres
// @access  Public
const getTheatres = async (req, res, next) => {
  try {
    const { city, search } = req.query;
    const query = {};

    if (city && city !== 'All') {
      query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const theatres = await Theatre.find(query).sort({ city: 1, name: 1 });

    // Attach screen counts to each theatre
    const theatreIds = theatres.map((t) => t._id);
    const screens = await Screen.find({ theatreId: { $in: theatreIds } });

    const screensByTheatre = {};
    screens.forEach((s) => {
      const tid = s.theatreId.toString();
      if (!screensByTheatre[tid]) screensByTheatre[tid] = [];
      screensByTheatre[tid].push(s);
    });

    const enriched = theatres.map((t) => {
      const obj = t.toObject();
      obj.screens = screensByTheatre[t._id.toString()] || [];
      return obj;
    });

    res.status(200).json({
      success: true,
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of all available cities
// @route   GET /api/theatres/cities
// @access  Public
const getCities = async (req, res, next) => {
  try {
    const cities = await Theatre.distinct('city');
    res.status(200).json({
      success: true,
      data: cities.sort(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single theatre by ID
// @route   GET /api/theatres/:id
// @access  Public
const getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    const screens = await Screen.find({ theatreId: theatre._id });

    res.status(200).json({
      success: true,
      data: {
        ...theatre.toObject(),
        screens,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a theatre
// @route   POST /api/theatres
// @access  Private/Admin
const createTheatre = async (req, res, next) => {
  try {
    const { name, address, city, state, zipCode, phone, facilities } = req.body;

    const theatre = await Theatre.create({
      name,
      address,
      city,
      state: state || '',
      zipCode: zipCode || '',
      phone: phone || '',
      facilities: Array.isArray(facilities)
        ? facilities
        : (facilities || '').split(',').map((f) => f.trim()).filter(Boolean),
    });

    res.status(201).json({
      success: true,
      message: 'Theatre created successfully',
      data: theatre,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update theatre
// @route   PUT /api/theatres/:id
// @access  Private/Admin
const updateTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    if (req.body.facilities && !Array.isArray(req.body.facilities)) {
      req.body.facilities = req.body.facilities.split(',').map((f) => f.trim()).filter(Boolean);
    }

    const updated = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Theatre updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete theatre
// @route   DELETE /api/theatres/:id
// @access  Private/Admin
const deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    const activeShowtimes = await Showtime.countDocuments({
      theatreId: theatre._id,
      startTime: { $gte: new Date() },
      status: { $ne: 'cancelled' },
    });

    if (activeShowtimes > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete theatre: it has ${activeShowtimes} active upcoming showtimes scheduled.`,
      });
    }

    // Delete associated screens and theatre
    await Screen.deleteMany({ theatreId: theatre._id });
    await Theatre.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Theatre and its screens deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTheatres,
  getCities,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre,
};
