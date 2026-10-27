const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createBooking);

router.get('/my', protect, getMyBookings);

router.route('/:id')
  .get(protect, getBookingById);

router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router;
