const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema(
  {
    Regular: {
      type: Number,
      required: true,
      default: 12.0,
      min: [0, 'Price must be positive'],
    },
    Premium: {
      type: Number,
      required: true,
      default: 16.0,
      min: [0, 'Price must be positive'],
    },
    VIP: {
      type: Number,
      required: true,
      default: 22.0,
      min: [0, 'Price must be positive'],
    },
  },
  { _id: false }
);

const showtimeSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie ID is required'],
      index: true,
    },
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre ID is required'],
      index: true,
    },
    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Screen',
      required: [true, 'Screen ID is required'],
      index: true,
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
      index: true,
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
    },
    pricing: {
      type: pricingSchema,
      required: true,
      default: () => ({ Regular: 12.0, Premium: 16.0, VIP: 22.0 }),
    },
    bookedSeats: {
      type: [String], // Array of seat IDs, e.g. ["A1", "B4"]
      default: [],
    },
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying showtimes by movie and theatre across dates
showtimeSchema.index({ movieId: 1, startTime: 1 });
showtimeSchema.index({ theatreId: 1, startTime: 1 });
showtimeSchema.index({ screenId: 1, startTime: 1 });

const Showtime = mongoose.model('Showtime', showtimeSchema);
module.exports = Showtime;
