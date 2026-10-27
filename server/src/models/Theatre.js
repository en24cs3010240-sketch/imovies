const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Theatre address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      default: '',
      trim: true,
    },
    zipCode: {
      type: String,
      default: '',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    facilities: {
      type: [String],
      default: ['Parking', 'Cafeteria', 'Air Conditioning', 'Wheelchair Access'],
    },
  },
  {
    timestamps: true,
  }
);

theatreSchema.index({ name: 1, city: 1 });

const Theatre = mongoose.model('Theatre', theatreSchema);
module.exports = Theatre;
