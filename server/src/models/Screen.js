const mongoose = require('mongoose');
const { SEAT_CATEGORIES } = require('../config/constants');

const seatSchema = new mongoose.Schema(
  {
    seatId: {
      type: String,
      required: true, // e.g. "A1", "B5"
    },
    seatNumber: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(SEAT_CATEGORIES),
      default: SEAT_CATEGORIES.REGULAR,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const rowSchema = new mongoose.Schema(
  {
    rowName: {
      type: String,
      required: true, // e.g. "A", "B", "C"
    },
    category: {
      type: String,
      enum: Object.values(SEAT_CATEGORIES),
      default: SEAT_CATEGORIES.REGULAR,
    },
    seats: [seatSchema],
  },
  { _id: false }
);

const screenSchema = new mongoose.Schema(
  {
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Screen name is required'],
      trim: true,
    },
    screenType: {
      type: String,
      default: 'Standard',
      enum: ['Standard', 'IMAX', 'Dolby Cinema', '4DX', '3D'],
    },
    seatLayout: {
      rows: [rowSchema],
    },
    totalCapacity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate totalCapacity
screenSchema.pre('save', function (next) {
  if (this.seatLayout && this.seatLayout.rows) {
    let count = 0;
    this.seatLayout.rows.forEach((r) => {
      count += (r.seats || []).filter((s) => s.isActive).length;
    });
    this.totalCapacity = count;
  }
  next();
});

const Screen = mongoose.model('Screen', screenSchema);
module.exports = Screen;
