import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Ticket, Star, Sparkles, Shield, Film, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { mockStore } from '../services/mockDataStore';
import MovieGrid from '../components/movies/MovieGrid';
import TrailerModal from '../components/common/TrailerModal';
import { useCity } from '../context/CityContext';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Drama', 'Crime', 'Biography'];

const HomePage = () => {
  const { selectedCity } = useCity();
  const [nowShowing, setNowShowing] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const [showingRes, upcomingRes] = await Promise.all([
          api.get('/movies?status=now_showing&limit=12'),
          api.get('/movies?status=upcoming&limit=4'),
        ]);

        if (showingRes?.data?.success && showingRes?.data?.data?.length > 0) {
          setNowShowing(showingRes.data.data);
          setFeaturedMovie(showingRes.data.data[0]);
        } else {
          const fallback = mockStore.getMovies({ status: 'now_showing' });
          setNowShowing(fallback.data);
          setFeaturedMovie(fallback.data[0]);
        }

        if (upcomingRes?.data?.success && upcomingRes?.data?.data?.length > 0) {
          setUpcoming(upcomingRes.data.data);
        } else {
          const fallbackUp = mockStore.getMovies({ status: 'upcoming' });
          setUpcoming(fallbackUp.data);
        }
      } catch (err) {
        console.warn('Network issue fetching home movies, using resilient store:', err.message);
        const fallback = mockStore.getMovies({ status: 'now_showing' });
        setNowShowing(fallback.data);
        setFeaturedMovie(fallback.data[0]);
        const fallbackUp = mockStore.getMovies({ status: 'upcoming' });
        setUpcoming(fallbackUp.data);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filteredShowing =
    selectedGenre === 'All'
      ? nowShowing
      : nowShowing.filter((m) =>
          (m.genre || []).some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
        );

  return (
    <div className="pb-5">
      {/* Hero Featured Movie Banner */}
      {featuredMovie && (
        <div className="container pt-3 pt-md-4">
          <div
            className="hero-banner shadow-lg"
            style={{
              backgroundImage: `url(${featuredMovie.backdropUrl || featuredMovie.posterUrl})`,
            }}
          >
            <div className="hero-gradient-overlay"></div>
            <div className="hero-content">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-danger text-uppercase px-2 py-1 fw-bold">Featured Spotlight</span>
                <span className="badge bg-dark bg-opacity-75 border border-secondary text-warning d-flex align-items-center gap-1">
                  <Star size={13} className="fill-warning text-warning" />
                  {featuredMovie.rating?.toFixed(1) || '8.5'}
                </span>
                <span className="badge bg-dark bg-opacity-75 border border-secondary text-light">
                  {featuredMovie.certification || 'PG-13'}
                </span>
              </div>

              <h1 className="display-4 fw-extrabold text-light mb-2 text-shadow" style={{ fontWeight: 800 }}>
                {featuredMovie.title}
              </h1>

              <p className="lead text-light text-opacity-75 mb-3 line-clamp-3 fs-6" style={{ maxWidth: '620px' }}>
                {featuredMovie.description}
              </p>

              <div className="d-flex flex-wrap align-items-center gap-3">
                <Link
                  to={`/movies/${featuredMovie._id}`}
                  className="btn btn-cinema px-4 py-2 d-flex align-items-center gap-2 shadow"
                >
                  <Ticket size={18} />
                  <span>Book Tickets Now</span>
                </Link>

                {featuredMovie.trailerUrl && (
                  <button
                    onClick={() => setTrailerOpen(true)}
                    className="btn btn-outline-light px-4 py-2 d-flex align-items-center gap-2 rounded-3"
                    style={{ backdropFilter: 'blur(4px)' }}
                  >
                    <Play size={18} className="text-danger fill-danger" />
                    <span>Watch Trailer</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="container mt-5">
        {/* Genre Pill Filter Bar */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="fw-bold text-light mb-1 d-flex align-items-center gap-2">
              <Film className="text-danger" size={26} />
              <span>Now Showing in {selectedCity}</span>
            </h3>
            <p className="text-secondary small mb-0">
              Browse current cinema releases with instant seat reservation
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  selectedGenre === genre ? 'btn-danger' : 'btn-outline-secondary text-light'
                }`}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Now Showing Grid */}
        <MovieGrid
          movies={filteredShowing}
          loading={loading}
          emptyMessage={`No movies currently showing in ${selectedGenre} category.`}
        />

        {/* Feature Highlights Banner */}
        <div className="row g-4 my-5">
          <div className="col-12 col-md-4">
            <div className="im-card p-4 h-100 text-center">
              <div className="rounded-circle bg-danger bg-opacity-25 p-3 d-inline-block text-danger mb-3">
                <Sparkles size={28} />
              </div>
              <h5 className="fw-bold text-light">IMAX & Dolby Formats</h5>
              <p className="text-secondary small mb-0">
                Experience sound and picture engineered for maximum sensory immersion with reserved premium loungers.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="im-card p-4 h-100 text-center">
              <div className="rounded-circle bg-primary bg-opacity-25 p-3 d-inline-block text-primary mb-3">
                <Ticket size={28} />
              </div>
              <h5 className="fw-bold text-light">Real-Time Seat Locks</h5>
              <p className="text-secondary small mb-0">
                Guaranteed zero double-booking with atomic database reservations and live countdown timers.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="im-card p-4 h-100 text-center">
              <div className="rounded-circle bg-success bg-opacity-25 p-3 d-inline-block text-success mb-3">
                <Shield size={28} />
              </div>
              <h5 className="fw-bold text-light">Instant Mobile Tickets</h5>
              <p className="text-secondary small mb-0">
                Paperless digital e-tickets delivered straight to your dashboard with instant QR entry confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        {upcoming.length > 0 && (
          <div className="mt-5">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h3 className="fw-bold text-light mb-1">Coming Soon</h3>
                <p className="text-secondary small mb-0">Upcoming releases heading to theatres near you</p>
              </div>
              <Link to="/movies?status=upcoming" className="text-danger small text-decoration-none fw-semibold d-flex align-items-center">
                <span>View All Upcoming</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            <MovieGrid movies={upcoming} loading={false} />
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {featuredMovie && (
        <TrailerModal
          isOpen={trailerOpen}
          onClose={() => setTrailerOpen(false)}
          trailerUrl={featuredMovie.trailerUrl}
          movieTitle={featuredMovie.title}
        />
      )}
    </div>
  );
};

export default HomePage;
