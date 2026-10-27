const mongoose = require('mongoose');

const seatHoldSchema = new mongoose.Schema(
  {
    showtimeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime',
      required: true,
      index: true,
    },
    seats: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one seat must be held',
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    holdToken: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'released', 'confirmed'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// MongoDB TTL Index to automatically delete documents after expiresAt
seatHoldSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for fast queries of active holds for a showtime
seatHoldSchema.index({ showtimeId: 1, status: 1, expiresAt: 1 });

const SeatHold = mongoose.model('SeatHold', seatHoldSchema);
module.exports = SeatHold;
