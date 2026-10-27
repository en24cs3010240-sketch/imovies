const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAllBookings,
  getAllUsers,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

// Apply admin protection to all routes in this router
router.use(protect);
router.use(authorize(ROLES.ADMIN));

router.get('/dashboard', getAdminDashboard);
router.get('/bookings', getAllBookings);
router.get('/users', getAllUsers);

module.exports = router;
