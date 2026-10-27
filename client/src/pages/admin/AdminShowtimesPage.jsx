import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Clock, Film, MapPin, DollarSign } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminShowtimesPage = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter
  const [selectedMovieId, setSelectedMovieId] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    movieId: '',
    theatreId: '',
    screenId: '',
    startTime: '',
    endTime: '',
    regularPrice: 14.0,
    premiumPrice: 18.0,
    vipPrice: 24.0,
  });

  const [availableScreens, setAvailableScreens] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [showRes, movRes, thRes] = await Promise.all([
        api.get('/showtimes'),
        api.get('/movies?limit=50'),
        api.get('/theatres'),
      ]);

      if (showRes.data.success) setShowtimes(showRes.data.data);
      if (movRes.data.success) setMovies(movRes.data.data);
      if (thRes.data.success) {
        setTheatres(thRes.data.data);
        if (thRes.data.data.length > 0) {
          setAvailableScreens(thRes.data.data[0].screens || []);
        }
      }
    } catch (err) {
      console.error('Error fetching showtimes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTheatreChange = (e) => {
    const tid = e.target.value;
    const selected = theatres.find((t) => t._id === tid);
    setAvailableScreens(selected?.screens || []);
    setFormData({
      ...formData,
      theatreId: tid,
      screenId: selected?.screens?.[0]?._id || '',
    });
  };

  const handleOpenCreate = () => {
    const defaultMovie = movies[0]?._id || '';
    const defaultTheatre = theatres[0]?._id || '';
    const screens = theatres[0]?.screens || [];

    // Default start time: 3 hours from now
    const now = new Date();
    now.setHours(now.getHours() + 3, 0, 0, 0);
    const startStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    const end = new Date(now.getTime() + 150 * 60000);
    const endStr = new Date(end.getTime() - end.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    setFormData({
      movieId: defaultMovie,
      theatreId: defaultTheatre,
      screenId: screens[0]?._id || '',
      startTime: startStr,
      endTime: endStr,
      regularPrice: 14.0,
      premiumPrice: 18.0,
      vipPrice: 24.0,
    });
    setAvailableScreens(screens);
    setFormError(null);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        movieId: formData.movieId,
        theatreId: formData.theatreId,
        screenId: formData.screenId,
        startTime: new Date(formData.startTime),
        endTime: new Date(formData.endTime),
        pricing: {
          Regular: Number(formData.regularPrice),
          Premium: Number(formData.premiumPrice),
          VIP: Number(formData.vipPrice),
        },
      };

      await api.post('/showtimes', payload);
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to schedule showtime');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteShowtime = async (id) => {
    if (!window.confirm('Are you sure you want to delete this showtime?')) return;
    try {
      const res = await api.delete(`/showtimes/${id}`);
      if (res.data.success) {
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting showtime');
    }
  };

  const filteredShowtimes = showtimes.filter((st) => {
    if (selectedMovieId === 'all') return true;
    return st.movieId?._id === selectedMovieId;
  });

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-light mb-1">Showtimes Scheduling</h3>
          <p className="text-secondary small mb-0">Schedule screenings, set seat tier pricing, and avoid auditorium conflicts</p>
        </div>
        <button
          type="button"
          className="btn btn-cinema btn-sm d-flex align-items-center gap-2"
          onClick={handleOpenCreate}
        >
          <Plus size={16} />
          <span>Schedule New Showtime</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="im-card p-3 mb-4 shadow-sm d-flex align-items-center gap-3">
        <label className="text-secondary small fw-bold mb-0">Filter Movie:</label>
        <select
          className="form-select form-control-dark"
          style={{ maxWidth: '300px' }}
          value={selectedMovieId}
          onChange={(e) => setSelectedMovieId(e.target.value)}
        >
          <option value="all">All Movies</option>
          {movies.map((m) => (
            <option key={m._id} value={m._id}>
              {m.title}
            </option>
          ))}
        </select>
        <span className="text-muted small ms-auto">{filteredShowtimes.length} showtimes found</span>
      </div>

      {/* Showtimes Table */}
      {loading ? (
        <LoadingSpinner text="Loading showtimes schedule..." />
      ) : (
        <div className="im-card shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="text-secondary small text-uppercase">
                <tr>
                  <th>Movie</th>
                  <th>Theatre & Screen</th>
                  <th>Start & End Time</th>
                  <th>Ticket Pricing</th>
                  <th>Booked</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShowtimes.map((st) => (
                  <tr key={st._id}>
                    <td>
                      <div className="fw-bold text-light">{st.movieId?.title || 'Unknown Film'}</div>
                      <small className="text-muted">{st.movieId?.duration} mins</small>
                    </td>
                    <td>
                      <div className="text-light">{st.theatreId?.name}</div>
                      <small className="text-muted">{st.screenId?.name} ({st.theatreId?.city})</small>
                    </td>
                    <td>
                      <div className="text-danger fw-semibold">{formatDateTime(st.startTime)}</div>
                      <small className="text-muted">Until {formatDateTime(st.endTime)}</small>
                    </td>
                    <td>
                      <div className="small">
                        <span className="text-secondary">Reg:</span> ${st.pricing?.Regular} |{' '}
                        <span className="text-info">Prem:</span> ${st.pricing?.Premium} |{' '}
                        <span className="text-warning">VIP:</span> ${st.pricing?.VIP}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-secondary">
                        {(st.bookedSeats || []).length} seats booked
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm p-1"
                        title="Delete Showtime"
                        onClick={() => handleDeleteShowtime(st._id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {modalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content modal-cinema" style={{ backgroundColor: '#141724' }}>
              <div className="modal-header border-secondary border-opacity-25 py-3">
                <h5 className="modal-title fw-bold text-light">Schedule New Showtime</h5>
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
                    <div className="col-12 col-md-6">
                      <label className="text-secondary small mb-1">Select Movie *</label>
                      <select
                        className="form-select form-control-dark"
                        required
                        value={formData.movieId}
                        onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                      >
                        {movies.map((m) => (
                          <option key={m._id} value={m._id}>
                            {m.title} ({m.duration} mins)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="text-secondary small mb-1">Select Theatre *</label>
                      <select
                        className="form-select form-control-dark"
                        required
                        value={formData.theatreId}
                        onChange={handleTheatreChange}
                      >
                        {theatres.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.name} ({t.city})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="text-secondary small mb-1">Screen / Auditorium *</label>
                      <select
                        className="form-select form-control-dark"
                        required
                        value={formData.screenId}
                        onChange={(e) => setFormData({ ...formData, screenId: e.target.value })}
                      >
                        {availableScreens.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name} ({s.screenType})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 col-md-6"></div>

                    <div className="col-12 col-md-6">
                      <label className="text-secondary small mb-1">Start Date & Time *</label>
                      <input
                        type="datetime-local"
                        className="form-control form-control-dark"
                        required
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="text-secondary small mb-1">End Date & Time *</label>
                      <input
                        type="datetime-local"
                        className="form-control form-control-dark"
                        required
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      />
                    </div>

                    {/* Tiered Pricing */}
                    <div className="col-12">
                      <label className="text-secondary small mb-2 d-block fw-bold">Seat Category Pricing ($USD)</label>
                      <div className="row g-2">
                        <div className="col-4">
                          <label className="text-muted small">Regular ($)</label>
                          <input
                            type="number"
                            step="0.5"
                            className="form-control form-control-dark"
                            value={formData.regularPrice}
                            onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}
                          />
                        </div>
                        <div className="col-4">
                          <label className="text-info small">Premium Lounge ($)</label>
                          <input
                            type="number"
                            step="0.5"
                            className="form-control form-control-dark"
                            value={formData.premiumPrice}
                            onChange={(e) => setFormData({ ...formData, premiumPrice: e.target.value })}
                          />
                        </div>
                        <div className="col-4">
                          <label className="text-warning small">VIP Recliner ($)</label>
                          <input
                            type="number"
                            step="0.5"
                            className="form-control form-control-dark"
                            value={formData.vipPrice}
                            onChange={(e) => setFormData({ ...formData, vipPrice: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-secondary border-opacity-25 py-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm text-light"
                    onClick={() => setModalOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-cinema btn-sm px-4"
                    disabled={submitting}
                  >
                    {submitting ? 'Scheduling...' : 'Save Showtime'}
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

export default AdminShowtimesPage;
