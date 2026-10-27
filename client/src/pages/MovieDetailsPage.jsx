import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, Play, MapPin, Ticket, Film, User } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import TrailerModal from '../components/common/TrailerModal';
import { useCity } from '../context/CityContext';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCity } = useCity();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  // Generate 4 calendar days starting today
  const availableDates = [0, 1, 2, 3].map((offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return {
      offset,
      dateObj: d,
      dayName: offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateFormatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isoString: d.toISOString().split('T')[0],
    };
  });

  const selectedDate = availableDates[selectedDateIndex];

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/movies/${id}`);
        if (res.data.success) {
          setMovie(res.data.data);
          setShowtimes(res.data.showtimes || []);
        } else {
          setError('Movie not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading movie details and showtimes..." />;
  }

  if (error || !movie) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-block p-4 rounded-3 shadow">
          <h4>Movie Not Found</h4>
          <p className="mb-3">{error || 'The movie you are looking for does not exist.'}</p>
          <Link to="/movies" className="btn btn-cinema btn-sm">
            Browse All Movies
          </Link>
        </div>
      </div>
    );
  }

  // Filter showtimes by selected calendar day and city
  const filteredShowtimes = showtimes.filter((st) => {
    const showDate = new Date(st.startTime).toISOString().split('T')[0];
    const matchesDate = showDate === selectedDate.isoString;
    const matchesCity =
      !selectedCity ||
      selectedCity === 'All' ||
      (st.theatreId && st.theatreId.city.toLowerCase() === selectedCity.toLowerCase());
    return matchesDate && matchesCity;
  });

  // Group showtimes by theatre
  const groupedTheatres = {};
  filteredShowtimes.forEach((st) => {
    if (!st.theatreId) return;
    const tid = st.theatreId._id;
    if (!groupedTheatres[tid]) {
      groupedTheatres[tid] = {
        theatre: st.theatreId,
        showtimes: [],
      };
    }
    groupedTheatres[tid].showtimes.push(st);
  });

  const formatShowTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (mins) => {
    if (!mins) return '';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div>
      {/* Movie Backdrop Header */}
      <div
        className="position-relative text-light py-5"
        style={{
          backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '420px',
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(180deg, rgba(12, 13, 20, 0.7) 0%, rgba(12, 13, 20, 0.95) 100%)',
          }}
        ></div>

        <div className="container position-relative py-3">
          <div className="row g-4 align-items-center">
            {/* Poster */}
            <div className="col-12 col-md-4 col-lg-3 text-center text-md-start">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="rounded-3 shadow-lg border border-secondary border-opacity-50"
                style={{ width: '220px', aspectRatio: '2/3', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>

            {/* Info */}
            <div className="col-12 col-md-8 col-lg-9">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="badge bg-danger">{movie.certification || 'PG-13'}</span>
                <span className="badge bg-secondary bg-opacity-50 text-light">{movie.language}</span>
                <span className="badge bg-dark border border-secondary text-warning d-flex align-items-center gap-1">
                  <Star size={13} className="fill-warning text-warning" />
                  {movie.rating?.toFixed(1) || '8.5'} ({movie.votesCount?.toLocaleString() || '120k'} votes)
                </span>
                <span className="text-secondary small d-flex align-items-center gap-1 ms-2">
                  <Clock size={14} />
                  {formatDuration(movie.duration)}
                </span>
              </div>

              <h1 className="display-5 fw-extrabold text-light mb-3">{movie.title}</h1>

              <div className="d-flex flex-wrap gap-2 mb-3">
                {(movie.genre || []).map((g) => (
                  <span key={g} className="badge rounded-pill bg-dark border border-secondary text-secondary px-3 py-1">
                    {g}
                  </span>
                ))}
              </div>

              <p className="text-light text-opacity-75 lead fs-6 mb-4" style={{ maxWidth: '780px' }}>
                {movie.description}
              </p>

              <div className="row g-3 small text-secondary mb-4" style={{ maxWidth: '600px' }}>
                <div className="col-6">
                  <span className="text-muted d-block">Director</span>
                  <strong className="text-light">{movie.director || 'N/A'}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Release Date</span>
                  <strong className="text-light">
                    {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </strong>
                </div>
                <div className="col-12">
                  <span className="text-muted d-block">Cast</span>
                  <strong className="text-light">{(movie.cast || []).join(', ') || 'N/A'}</strong>
                </div>
              </div>

              {movie.trailerUrl && (
                <button
                  type="button"
                  className="btn btn-outline-light d-inline-flex align-items-center gap-2 rounded-pill px-4 py-2"
                  onClick={() => setTrailerOpen(true)}
                  style={{ backdropFilter: 'blur(4px)' }}
                >
                  <Play size={16} className="text-danger fill-danger" />
                  <span>Watch Official Trailer</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes & Booking Section */}
      <div className="container py-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h3 className="fw-bold text-light mb-1 d-flex align-items-center gap-2">
              <Ticket size={24} className="text-danger" />
              <span>Available Theatres & Showtimes</span>
            </h3>
            <p className="text-secondary small mb-0">
              Showing schedules for <strong className="text-light">{selectedCity}</strong>
            </p>
          </div>

          {/* Date Selector Tabs */}
          <div className="d-flex gap-2 overflow-auto pb-2">
            {availableDates.map((item, idx) => (
              <button
                key={item.offset}
                type="button"
                className={`btn btn-sm text-center px-3 py-2 rounded-3 transition-all ${
                  selectedDateIndex === idx
                    ? 'btn-danger shadow'
                    : 'btn-dark border border-secondary border-opacity-50 text-light'
                }`}
                style={{ minWidth: '90px' }}
                onClick={() => setSelectedDateIndex(idx)}
              >
                <div className="small fw-semibold">{item.dayName}</div>
                <div className="small opacity-75">{item.dateFormatted}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Theatres List */}
        {Object.keys(groupedTheatres).length === 0 ? (
          <div className="im-card p-5 text-center my-4">
            <Film size={40} className="text-muted mb-3" />
            <h5 className="text-light fw-bold">No Showtimes Scheduled</h5>
            <p className="text-secondary small mb-3">
              There are no available showtimes for this movie on {selectedDate.dayName} ({selectedDate.dateFormatted}) in {selectedCity}.
            </p>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => setSelectedDateIndex(0)}
            >
              Check Today's Schedule
            </button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {Object.values(groupedTheatres).map(({ theatre, showtimes: stList }) => (
              <div key={theatre._id} className="im-card p-4 shadow-sm">
                {/* Theatre Header */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center pb-3 mb-3 border-bottom border-secondary border-opacity-25 gap-2">
                  <div>
                    <h5 className="fw-bold text-light mb-1">{theatre.name}</h5>
                    <div className="d-flex align-items-center gap-1 text-secondary small">
                      <MapPin size={14} className="text-danger" />
                      <span>{theatre.address}, {theatre.city}</span>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-1">
                    {(theatre.facilities || []).map((fac) => (
                      <span key={fac} className="badge bg-dark text-secondary border border-secondary border-opacity-50 small">
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Showtime Time Slots */}
                <div className="d-flex flex-wrap gap-3">
                  {stList.map((st) => (
                    <div key={st._id} className="text-center">
                      <button
                        type="button"
                        className="btn btn-outline-danger py-2 px-3 rounded-3 d-flex flex-column align-items-center shadow-sm"
                        style={{ minWidth: '105px' }}
                        onClick={() => navigate(`/booking/${st._id}`)}
                      >
                        <span className="fw-bold fs-6">{formatShowTime(st.startTime)}</span>
                        <span className="badge bg-dark text-light border border-secondary mt-1" style={{ fontSize: '0.68rem' }}>
                          {st.screenId?.name || 'Screen 1'}
                        </span>
                        <span className="text-muted mt-1" style={{ fontSize: '0.65rem' }}>
                          {st.screenId?.screenType || 'Digital'}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerUrl={movie.trailerUrl}
        movieTitle={movie.title}
      />
    </div>
  );
};

export default MovieDetailsPage;
