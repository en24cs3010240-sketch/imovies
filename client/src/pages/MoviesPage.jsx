import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Film, RefreshCw } from 'lucide-react';
import api from '../services/api';
import MovieGrid from '../components/movies/MovieGrid';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Drama', 'Crime', 'Biography', 'Animation', 'Comedy'];
const LANGUAGES = ['All', 'English', 'Spanish', 'French'];

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'all';
  const genre = searchParams.get('genre') || 'All';
  const language = searchParams.get('language') || 'All';
  const sort = searchParams.get('sort') || '-releaseDate';

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (status && status !== 'all') queryParams.append('status', status);
        if (genre && genre !== 'All') queryParams.append('genre', genre);
        if (language && language !== 'All') queryParams.append('language', language);
        if (sort) queryParams.append('sort', sort);

        const res = await api.get(`/movies?${queryParams.toString()}`);
        if (res.data.success) {
          setMovies(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching movies list:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="container py-4">
      {/* Page Title */}
      <div className="mb-4">
        <h2 className="fw-bold text-light mb-1 d-flex align-items-center gap-2">
          <Film className="text-danger" size={28} />
          <span>Movie Catalog</span>
        </h2>
        <p className="text-secondary small">
          Explore current blockbusters, upcoming releases, and showtimes
        </p>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="im-card p-3 p-md-4 mb-4 shadow">
        <div className="row g-3">
          {/* Search Input */}
          <div className="col-12 col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control form-control-dark border-start-0"
                placeholder="Search by title, actor, director..."
                value={search}
                onChange={(e) => updateFilter('search', e.target.value)}
              />
            </div>
          </div>

          {/* Status Tabs */}
          <div className="col-6 col-md-2">
            <select
              className="form-select form-control-dark"
              value={status}
              onChange={(e) => updateFilter('status', e.target.value)}
            >
              <option value="all">All Releases</option>
              <option value="now_showing">Now Showing</option>
              <option value="upcoming">Coming Soon</option>
            </select>
          </div>

          {/* Genre Dropdown */}
          <div className="col-6 col-md-2">
            <select
              className="form-select form-control-dark"
              value={genre}
              onChange={(e) => updateFilter('genre', e.target.value)}
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  Genre: {g}
                </option>
              ))}
            </select>
          </div>

          {/* Language Dropdown */}
          <div className="col-6 col-md-2">
            <select
              className="form-select form-control-dark"
              value={language}
              onChange={(e) => updateFilter('language', e.target.value)}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  Lang: {l}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div className="col-6 col-md-2">
            <select
              className="form-select form-control-dark"
              value={sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
            >
              <option value="-releaseDate">Newest First</option>
              <option value="-rating">Top Rated</option>
              <option value="title">Title (A-Z)</option>
              <option value="duration">Shortest First</option>
            </select>
          </div>
        </div>

        {/* Active Filters Clear Row */}
        {(search || (status && status !== 'all') || (genre && genre !== 'All') || (language && language !== 'All')) && (
          <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top border-secondary border-opacity-25 small">
            <span className="text-secondary">
              Showing filtered results ({movies.length} found)
            </span>
            <button
              type="button"
              className="btn btn-link btn-sm text-danger p-0 text-decoration-none d-flex align-items-center gap-1"
              onClick={handleClearFilters}
            >
              <RefreshCw size={13} />
              <span>Reset all filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Movies Grid */}
      <MovieGrid
        movies={movies}
        loading={loading}
        emptyMessage="No movies match your selected filters. Try broadening your search or resetting filters."
      />
    </div>
  );
};

export default MoviesPage;
