import React, { useState, useEffect } from 'react';
import { Film, Plus, Edit2, Trash2, Search, X, Check, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal form states
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const initialForm = {
    title: '',
    description: '',
    posterUrl: '',
    backdropUrl: '',
    genre: 'Action, Sci-Fi',
    language: 'English',
    duration: 120,
    cast: '',
    director: '',
    releaseDate: new Date().toISOString().split('T')[0],
    certification: 'PG-13',
    trailerUrl: '',
    rating: 8.0,
    status: 'now_showing',
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await api.get('/movies?limit=50');
      if (res.data.success) {
        setMovies(res.data.data);
      }
    } catch (err) {
      console.error('Error loading admin movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(initialForm);
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (movie) => {
    setIsEditing(true);
    setEditingId(movie._id);
    setFormData({
      title: movie.title,
      description: movie.description,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl || movie.posterUrl,
      genre: (movie.genre || []).join(', '),
      language: movie.language,
      duration: movie.duration,
      cast: (movie.cast || []).join(', '),
      director: movie.director || '',
      releaseDate: new Date(movie.releaseDate).toISOString().split('T')[0],
      certification: movie.certification || 'PG-13',
      trailerUrl: movie.trailerUrl || '',
      rating: movie.rating || 8.0,
      status: movie.status || 'now_showing',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      const payload = {
        ...formData,
        genre: formData.genre.split(',').map((g) => g.trim()).filter(Boolean),
        cast: formData.cast.split(',').map((c) => c.trim()).filter(Boolean),
        duration: Number(formData.duration),
        rating: Number(formData.rating),
      };

      if (isEditing) {
        await api.put(`/movies/${editingId}`, payload);
      } else {
        await api.post('/movies', payload);
      }

      setModalOpen(false);
      fetchMovies();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving movie');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteMovie = async (movieId, movieTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${movieTitle}"?`)) return;

    try {
      const res = await api.delete(`/movies/${movieId}`);
      if (res.data.success) {
        fetchMovies();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete movie');
    }
  };

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-light mb-1">Movie Catalog Management</h3>
          <p className="text-secondary small mb-0">Create, edit, or archive movies and showtimes</p>
        </div>
        <button
          type="button"
          className="btn btn-cinema btn-sm d-flex align-items-center gap-2"
          onClick={handleOpenCreate}
        >
          <Plus size={16} />
          <span>Add New Movie</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="im-card p-3 mb-4 shadow-sm">
        <div className="input-group">
          <span className="input-group-text bg-dark border-secondary text-secondary">
            <Search size={16} />
          </span>
          <input
            type="text"
            className="form-control form-control-dark border-start-0"
            placeholder="Search movie titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Movies Table */}
      {loading ? (
        <LoadingSpinner text="Loading movies catalog..." />
      ) : (
        <div className="im-card shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="text-secondary small text-uppercase">
                <tr>
                  <th>Poster & Title</th>
                  <th>Genre</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovies.map((movie) => (
                  <tr key={movie._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="rounded"
                          style={{ width: '45px', height: '62px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="text-light fw-bold">{movie.title}</div>
                          <small className="text-muted">{movie.certification} • {movie.language}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="small text-secondary">{(movie.genre || []).join(', ')}</div>
                    </td>
                    <td className="small text-secondary">{movie.duration} mins</td>
                    <td>
                      <span className={`badge ${movie.status === 'now_showing' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {movie.status === 'now_showing' ? 'Now Showing' : 'Upcoming'}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-dark border border-secondary text-warning">
                        ★ {movie.rating?.toFixed(1) || '8.0'}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm p-1 text-light"
                          title="Edit Movie"
                          onClick={() => handleOpenEdit(movie)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm p-1"
                          title="Delete Movie"
                          onClick={() => handleDeleteMovie(movie._id, movie.title)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Movie Modal */}
      {modalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content modal-cinema" style={{ backgroundColor: '#141724' }}>
              <div className="modal-header border-secondary border-opacity-25 py-3">
                <h5 className="modal-title fw-bold text-light">
                  {isEditing ? 'Edit Movie Details' : 'Add New Movie to Catalog'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setModalOpen(false)}
                ></button>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="modal-body p-4">
                  {formError && (
                    <div className="alert alert-danger small py-2 px-3 mb-3">
                      {formError}
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-12 col-md-8">
                      <label className="text-secondary small mb-1">Movie Title *</label>
                      <input
                        type="text"
                        className="form-control form-control-dark"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="text-secondary small mb-1">Status</label>
                      <select
                        className="form-select form-control-dark"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="now_showing">Now Showing</option>
                        <option value="upcoming">Coming Soon</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="text-secondary small mb-1">Synopsis / Description *</label>
                      <textarea
                        className="form-control form-control-dark"
                        rows="3"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="text-secondary small mb-1">Poster Image URL *</label>
                      <input
                        type="url"
                        className="form-control form-control-dark"
                        required
                        value={formData.posterUrl}
                        onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="text-secondary small mb-1">Backdrop Image URL</label>
                      <input
                        type="url"
                        className="form-control form-control-dark"
                        value={formData.backdropUrl}
                        onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="text-secondary small mb-1">Genres (comma-separated)</label>
                      <input
                        type="text"
                        className="form-control form-control-dark"
                        value={formData.genre}
                        onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      />
                    </div>

                    <div className="col-6 col-md-4">
                      <label className="text-secondary small mb-1">Language</label>
                      <input
                        type="text"
                        className="form-control form-control-dark"
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      />
                    </div>

                    <div className="col-6 col-md-4">
                      <label className="text-secondary small mb-1">Duration (minutes)</label>
                      <input
                        type="number"
                        className="form-control form-control-dark"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="text-secondary small mb-1">Cast (comma-separated)</label>
                      <input
                        type="text"
                        className="form-control form-control-dark"
                        value={formData.cast}
                        onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="text-secondary small mb-1">Director</label>
                      <input
                        type="text"
                        className="form-control form-control-dark"
                        value={formData.director}
                        onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="text-secondary small mb-1">Trailer YouTube Link</label>
                      <input
                        type="url"
                        className="form-control form-control-dark"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={formData.trailerUrl}
                        onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                      />
                    </div>

                    <div className="col-6 col-md-3">
                      <label className="text-secondary small mb-1">Certification</label>
                      <select
                        className="form-select form-control-dark"
                        value={formData.certification}
                        onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                      >
                        <option value="G">G</option>
                        <option value="PG">PG</option>
                        <option value="PG-13">PG-13</option>
                        <option value="R">R</option>
                        <option value="NC-17">NC-17</option>
                      </select>
                    </div>

                    <div className="col-6 col-md-3">
                      <label className="text-secondary small mb-1">Rating (0-10)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="form-control form-control-dark"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-secondary border-opacity-25 py-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm text-light"
                    onClick={() => setModalOpen(false)}
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-cinema btn-sm px-4"
                    disabled={formLoading}
                  >
                    {formLoading ? 'Saving...' : isEditing ? 'Update Movie' : 'Create Movie'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMoviesPage;
