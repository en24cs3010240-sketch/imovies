const mongoose = require('mongoose');
const { MOVIE_STATUS } = require('../config/constants');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Synopsis / description is required'],
      trim: true,
    },
    posterUrl: {
      type: String,
      required: [true, 'Poster image URL is required'],
      trim: true,
    },
    backdropUrl: {
      type: String,
      default: '',
      trim: true,
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required'],
      index: true,
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      trim: true,
      index: true,
    },
    duration: {
      type: Number, // Duration in minutes
      required: [true, 'Duration in minutes is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    cast: {
      type: [String],
      default: [],
    },
    director: {
      type: String,
      default: '',
      trim: true,
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    certification: {
      type: String,
      default: 'PG-13',
      trim: true,
    },
    trailerUrl: {
      type: String,
      default: '',
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.0,
    },
    votesCount: {
      type: Number,
      default: 100,
    },
    status: {
      type: String,
      enum: Object.values(MOVIE_STATUS),
      default: MOVIE_STATUS.NOW_SHOWING,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for search and listings
movieSchema.index({ title: 'text', description: 'text', director: 'text' });

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
