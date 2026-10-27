const express = require('express');
const router = express.Router();
const {
  getShowtimes,
  getShowtimeById,
  getShowtimeSeats,
  holdSeats,
  releaseHold,
  createShowtime,
  updateShowtime,
  deleteShowtime,
} = require('../controllers/showtimeController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

// Seat layouts & holds
router.get('/:id/seats', optionalAuth, getShowtimeSeats);
router.post('/:id/holds', optionalAuth, holdSeats);
router.delete('/:id/holds/:holdToken', releaseHold);

// CRUD
router.route('/')
  .get(getShowtimes)
  .post(protect, authorize(ROLES.ADMIN), createShowtime);

router.route('/:id')
  .get(getShowtimeById)
  .put(protect, authorize(ROLES.ADMIN), updateShowtime)
  .delete(protect, authorize(ROLES.ADMIN), deleteShowtime);

module.exports = router;
