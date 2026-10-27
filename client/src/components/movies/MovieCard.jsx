import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Play, Ticket } from 'lucide-react';
import TrailerModal from '../common/TrailerModal';

const MovieCard = ({ movie }) => {
  const [trailerOpen, setTrailerOpen] = useState(false);

  const formatDuration = (mins) => {
    if (!mins) return '';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <>
      <div className="movie-poster-card h-100 d-flex flex-column">
        {/* Poster Container with Badges */}
        <div className="position-relative overflow-hidden">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="movie-poster-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
            }}
          />

          {/* Rating Badge */}
          {movie.rating && (
            <div
              className="position-absolute top-0 start-0 m-2 px-2 py-1 rounded d-flex align-items-center gap-1 shadow"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)', fontSize: '0.78rem' }}
            >
              <Star size={13} className="text-warning fill-warning" />
              <span className="fw-bold text-light">{movie.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Certification Badge */}
          {movie.certification && (
            <div
              className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded shadow fw-bold"
              style={{ backgroundColor: 'rgba(229, 9, 20, 0.85)', backdropFilter: 'blur(4px)', fontSize: '0.75rem' }}
            >
              {movie.certification}
            </div>
          )}

          {/* Hover Trailer Overlay Button */}
          {movie.trailerUrl && (
            <button
              onClick={() => setTrailerOpen(true)}
              className="btn btn-sm btn-dark position-absolute bottom-0 start-50 translate-middle-x mb-3 rounded-pill px-3 py-1 d-flex align-items-center gap-1 shadow"
              style={{ backgroundColor: 'rgba(12, 13, 20, 0.85)', border: '1px solid rgba(255, 255, 255, 0.2)', fontSize: '0.8rem' }}
            >
              <Play size={13} className="text-danger fill-danger" />
              <span>Trailer</span>
            </button>
          )}
        </div>

        {/* Info Content */}
        <div className="p-3 d-flex flex-column flex-grow-1">
          <div className="d-flex align-items-center justify-content-between text-muted small mb-1">
            <span className="text-truncate" style={{ maxWidth: '65%' }}>
              {(movie.genre || []).slice(0, 2).join(', ')}
            </span>
            <span className="d-flex align-items-center gap-1">
              <Clock size={12} />
              {formatDuration(movie.duration)}
            </span>
          </div>

          <h6 className="fw-bold text-light mb-2 text-truncate" title={movie.title}>
            <Link to={`/movies/${movie._id}`} className="text-light text-decoration-none">
              {movie.title}
            </Link>
          </h6>

          <div className="text-secondary small mb-3">
            <span className="badge bg-secondary bg-opacity-25 text-light me-1">{movie.language}</span>
            {movie.status === 'upcoming' && (
              <span className="badge bg-warning bg-opacity-25 text-warning">Coming Soon</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-auto d-grid gap-2">
            <Link
              to={`/movies/${movie._id}`}
              className="btn btn-cinema btn-sm d-flex align-items-center justify-content-center gap-1"
            >
              <Ticket size={16} />
              <span>{movie.status === 'upcoming' ? 'View Details' : 'Book Tickets'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerUrl={movie.trailerUrl}
        movieTitle={movie.title}
      />
    </>
  );
};

export default MovieCard;
