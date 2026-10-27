const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');

// @desc    Get aggregated admin dashboard metrics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalMovies,
      totalTheatres,
      totalShowtimes,
      totalBookings,
      revenueResult,
      recentBookings,
    ] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments(),
      Theatre.countDocuments(),
      Showtime.countDocuments({ status: { $ne: 'cancelled' } }),
      Booking.countDocuments(),
      Booking.aggregate([
        { $match: { bookingStatus: 'confirmed' } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]),
      Booking.find()
        .populate('userId', 'name email')
        .populate({
          path: 'showtimeId',
          populate: [
            { path: 'movieId', select: 'title' },
            { path: 'theatreId', select: 'name city' },
          ],
        })
        .sort({ createdAt: -1 })
        .limit(8),
    ]);

    const totalRevenue = (revenueResult[0] && revenueResult[0].totalRevenue) || 0;

    // Aggregate bookings by status
    const statusCounts = await Booking.aggregate([
      { $group: { _id: '$bookingStatus', count: { $sum: 1 } } },
    ]);

    const bookingStatusMap = {
      confirmed: 0,
      cancelled: 0,
      pending: 0,
    };
    statusCounts.forEach((s) => {
      bookingStatusMap[s._id] = s.count;
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalMovies,
        totalTheatres,
        totalShowtimes,
        totalBookings,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        confirmedBookings: bookingStatusMap.confirmed,
        cancelledBookings: bookingStatusMap.cancelled,
      },
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for admin with search & filtering
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.bookingStatus = status;
    }

    if (search) {
      query.$or = [
        { bookingReference: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNumber - 1) * pageSize;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('userId', 'name email phone')
        .populate({
          path: 'showtimeId',
          populate: [
            { path: 'movieId', select: 'title posterUrl duration' },
            { path: 'theatreId', select: 'name city address' },
            { path: 'screenId', select: 'name screenType' },
          ],
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      Booking.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page: pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users for admin
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNumber - 1) * pageSize;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page: pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAllBookings,
  getAllUsers,
};
