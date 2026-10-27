const express = require('express');
const router = express.Router();
const {
  getTheatres,
  getCities,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre,
} = require('../controllers/theatreController');
const {
  getScreensByTheatre,
  createScreen,
} = require('../controllers/screenController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

// City list
router.get('/cities', getCities);

// Screens nested under theatres
router.route('/:theatreId/screens')
  .get(getScreensByTheatre)
  .post(protect, authorize(ROLES.ADMIN), createScreen);

router.route('/')
  .get(getTheatres)
  .post(protect, authorize(ROLES.ADMIN), createTheatre);

router.route('/:id')
  .get(getTheatreById)
  .put(protect, authorize(ROLES.ADMIN), updateTheatre)
  .delete(protect, authorize(ROLES.ADMIN), deleteTheatre);

module.exports = router;
