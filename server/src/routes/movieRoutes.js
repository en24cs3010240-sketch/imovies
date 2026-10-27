const express = require('express');
const router = express.Router();
const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

router.route('/')
  .get(getMovies)
  .post(protect, authorize(ROLES.ADMIN), createMovie);

router.route('/:id')
  .get(getMovieById)
  .put(protect, authorize(ROLES.ADMIN), updateMovie)
  .delete(protect, authorize(ROLES.ADMIN), deleteMovie);

module.exports = router;
