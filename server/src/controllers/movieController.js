const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');

// @desc    Get all movies with filters & search
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res, next) => {
  try {
    const {
      search,
      genre,
      language,
      status,
      sort = '-releaseDate',
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    // Search query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { director: { $regex: search, $options: 'i' } },
        { cast: { $regex: search, $options: 'i' } },
      ];
    }

    // Genre filter
    if (genre && genre !== 'All') {
      query.genre = { $in: [new RegExp(genre, 'i')] };
    }

    // Language filter
    if (language && language !== 'All') {
      query.language = { $regex: language, $options: 'i' };
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNumber - 1) * pageSize;

    const [movies, total] = await Promise.all([
      Movie.find(query).sort(sort).skip(skip).limit(pageSize),
      Movie.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: movies,
      pagination: {
        total,
        page: pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID with showtime availability
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    // Also fetch upcoming showtimes for this movie
    const upcomingShowtimes = await Showtime.find({
      movieId: movie._id,
      startTime: { $gte: new Date(Date.now() - 30 * 60 * 1000) }, // allow recent showtimes within 30 min
      status: { $ne: 'cancelled' },
    })
      .populate('theatreId', 'name city address facilities')
      .populate('screenId', 'name screenType totalCapacity')
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      data: movie,
      showtimes: upcomingShowtimes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new movie
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = async (req, res, next) => {
  try {
    const {
      title,
      description,
      posterUrl,
      backdropUrl,
      genre,
      language,
      duration,
      cast,
      director,
      releaseDate,
      certification,
      trailerUrl,
      rating,
      status,
    } = req.body;

    const movie = await Movie.create({
      title,
      description,
      posterUrl,
      backdropUrl: backdropUrl || posterUrl,
      genre: Array.isArray(genre) ? genre : genre.split(',').map((g) => g.trim()),
      language,
      duration: Number(duration),
      cast: Array.isArray(cast) ? cast : (cast || '').split(',').map((c) => c.trim()).filter(Boolean),
      director,
      releaseDate: releaseDate || new Date(),
      certification: certification || 'PG-13',
      trailerUrl: trailerUrl || '',
      rating: rating ? Number(rating) : 8.0,
      status: status || 'now_showing',
    });

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie details
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // Parse array fields if passed as strings
    if (req.body.genre && !Array.isArray(req.body.genre)) {
      req.body.genre = req.body.genre.split(',').map((g) => g.trim());
    }
    if (req.body.cast && !Array.isArray(req.body.cast)) {
      req.body.cast = req.body.cast.split(',').map((c) => c.trim()).filter(Boolean);
    }

    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: updatedMovie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // Check if future showtimes exist
    const futureShowtimes = await Showtime.countDocuments({
      movieId: movie._id,
      startTime: { $gte: new Date() },
      status: { $ne: 'cancelled' },
    });

    if (futureShowtimes > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete movie: it has ${futureShowtimes} active future showtimes. Cancel or remove those showtimes first.`,
      });
    }

    await Movie.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
