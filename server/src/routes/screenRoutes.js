const express = require('express');
const router = express.Router();
const {
  getScreenById,
  updateScreen,
  deleteScreen,
} = require('../controllers/screenController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

router.route('/:id')
  .get(getScreenById)
  .put(protect, authorize(ROLES.ADMIN), updateScreen)
  .delete(protect, authorize(ROLES.ADMIN), deleteScreen);

module.exports = router;
