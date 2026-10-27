const mongoose = require('mongoose');
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../config/constants');

const bookedSeatSchema = new mongoose.Schema(
  {
    seatId: {
      type: String,
      required: true, // e.g. "C5"
    },
    category: {
      type: String,
      required: true,
      default: 'Regular',
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    showtimeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime',
      required: [true, 'Showtime ID is required'],
      index: true,
    },
    seats: {
      type: [bookedSeatSchema],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A booking must have at least one seat',
      },
    },
    ticketQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    convenienceFee: {
      type: Number,
      default: 2.5,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PAID,
    },
    bookingStatus: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.CONFIRMED,
      index: true,
    },
    paymentDetails: {
      method: {
        type: String,
        default: 'Demo Credit Card',
      },
      transactionId: {
        type: String,
        default: () => 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      },
      cardLast4: {
        type: String,
        default: '4242',
      },
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ showtimeId: 1, bookingStatus: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
