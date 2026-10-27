import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Film, ShieldAlert, Monitor } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminTheatresPage = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Theatre Modal State
  const [theatreModalOpen, setTheatreModalOpen] = useState(false);
  const [theatreForm, setTheatreForm] = useState({
    name: '',
    address: '',
    city: 'New York',
    facilities: 'IMAX, Dolby Atmos, Reserved Seating',
  });

  // Screen Modal State
  const [screenModalOpen, setScreenModalOpen] = useState(false);
  const [selectedTheatreId, setSelectedTheatreId] = useState(null);
  const [screenForm, setScreenForm] = useState({
    name: 'Screen 1 – IMAX',
    screenType: 'IMAX',
    rowCount: 8,
    seatsPerRow: 12,
  });

  const fetchTheatres = async () => {
    setLoading(true);
    try {
      const res = await api.get('/theatres');
      if (res.data.success) {
        setTheatres(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching theatres:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  const handleCreateTheatre = async (e) => {
    e.preventDefault();
    try {
      await api.post('/theatres', theatreForm);
      setTheatreModalOpen(false);
      setTheatreForm({ name: '', address: '', city: 'New York', facilities: 'IMAX, Dolby Atmos' });
      fetchTheatres();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create theatre');
    }
  };

  const handleCreateScreen = async (e) => {
    e.preventDefault();
    if (!selectedTheatreId) return;
    try {
      await api.post(`/theatres/${selectedTheatreId}/screens`, screenForm);
      setScreenModalOpen(false);
      fetchTheatres();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create screen');
    }
  };

  const handleDeleteTheatre = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await api.delete(`/theatres/${id}`);
      if (res.data.success) {
        fetchTheatres();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting theatre');
    }
  };

  const handleDeleteScreen = async (screenId) => {
    if (!window.confirm('Delete this screen?')) return;
    try {
      await api.delete(`/screens/${screenId}`);
      fetchTheatres();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting screen');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-light mb-1">Theatres & Screens Management</h3>
          <p className="text-secondary small mb-0">Configure multiplex cinema locations, screens, and auditoriums</p>
        </div>
        <button
          type="button"
          className="btn btn-cinema btn-sm d-flex align-items-center gap-2"
          onClick={() => setTheatreModalOpen(true)}
        >
          <Plus size={16} />
          <span>Add New Theatre</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading theatre locations..." />
      ) : (
        <div className="d-flex flex-column gap-4">
          {theatres.map((theatre) => (
            <div key={theatre._id} className="im-card p-4 shadow-sm">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center pb-3 mb-3 border-bottom border-secondary border-opacity-25 gap-3">
                <div>
                  <h5 className="fw-bold text-light mb-1">{theatre.name}</h5>
                  <div className="d-flex align-items-center gap-2 text-secondary small">
                    <MapPin size={14} className="text-danger" />
                    <span>{theatre.address}, {theatre.city}</span>
                    <span className="badge bg-secondary">{theatre.city}</span>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                    onClick={() => {
                      setSelectedTheatreId(theatre._id);
                      setScreenModalOpen(true);
                    }}
                  >
                    <Plus size={14} />
                    <span>Add Screen</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm text-danger p-1"
                    title="Delete Theatre"
                    onClick={() => handleDeleteTheatre(theatre._id, theatre.name)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Screens List */}
              <div className="row g-3">
                {(theatre.screens || []).length === 0 ? (
                  <div className="col-12 text-muted small p-2">
                    No screens configured yet. Click "+ Add Screen" to add an auditorium layout.
                  </div>
                ) : (
                  theatre.screens.map((sc) => (
                    <div key={sc._id} className="col-12 col-md-4">
                      <div className="bg-dark rounded p-3 border border-secondary border-opacity-25 h-100 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <span className="badge bg-danger">{sc.screenType}</span>
                            <button
                              type="button"
                              className="btn btn-link p-0 text-secondary"
                              onClick={() => handleDeleteScreen(sc._id)}
                              title="Delete Screen"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="fw-bold text-light mb-1">{sc.name}</div>
                          <small className="text-muted d-block">
                            Capacity: {sc.totalCapacity || 96} seats ({sc.seatLayout?.rows?.length || 8} rows)
                          </small>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Theatre Modal */}
      {theatreModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-cinema" style={{ backgroundColor: '#141724' }}>
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title fw-bold text-light">Add New Cinema Location</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setTheatreModalOpen(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateTheatre}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="text-secondary small mb-1">Theatre Name *</label>
                    <input
                      type="text"
                      className="form-control form-control-dark"
                      required
                      placeholder="e.g. IMovies Cinema Manhattan"
                      value={theatreForm.name}
                      onChange={(e) => setTheatreForm({ ...theatreForm, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="text-secondary small mb-1">Address *</label>
                    <input
                      type="text"
                      className="form-control form-control-dark"
                      required
                      placeholder="Street address"
                      value={theatreForm.address}
                      onChange={(e) => setTheatreForm({ ...theatreForm, address: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="text-secondary small mb-1">City *</label>
                    <input
                      type="text"
                      className="form-control form-control-dark"
                      required
                      placeholder="e.g. New York, Los Angeles"
                      value={theatreForm.city}
                      onChange={(e) => setTheatreForm({ ...theatreForm, city: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="text-secondary small mb-1">Facilities (comma-separated)</label>
                    <input
                      type="text"
                      className="form-control form-control-dark"
                      placeholder="IMAX, Dolby Atmos, Valet Parking"
                      value={theatreForm.facilities}
                      onChange={(e) => setTheatreForm({ ...theatreForm, facilities: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer border-secondary border-opacity-25">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm text-light"
                    onClick={() => setTheatreModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-cinema btn-sm px-4">
                    Create Theatre
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Screen Modal */}
      {screenModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-cinema" style={{ backgroundColor: '#141724' }}>
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title fw-bold text-light">Add Screen Auditorium</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setScreenModalOpen(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateScreen}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="text-secondary small mb-1">Screen Name *</label>
                    <input
                      type="text"
                      className="form-control form-control-dark"
                      required
                      placeholder="e.g. Screen 1 – IMAX Experience"
                      value={screenForm.name}
                      onChange={(e) => setScreenForm({ ...screenForm, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="text-secondary small mb-1">Screen Type</label>
                    <select
                      className="form-select form-control-dark"
                      value={screenForm.screenType}
                      onChange={(e) => setScreenForm({ ...screenForm, screenType: e.target.value })}
                    >
                      <option value="IMAX">IMAX</option>
                      <option value="Dolby Cinema">Dolby Cinema</option>
                      <option value="Standard">Standard Digital</option>
                      <option value="4DX">4DX</option>
                      <option value="3D">RealD 3D</option>
                    </select>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="text-secondary small mb-1">Rows Count</label>
                      <input
                        type="number"
                        min="4"
                        max="12"
                        className="form-control form-control-dark"
                        value={screenForm.rowCount}
                        onChange={(e) => setScreenForm({ ...screenForm, rowCount: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="text-secondary small mb-1">Seats Per Row</label>
                      <input
                        type="number"
                        min="6"
                        max="16"
                        className="form-control form-control-dark"
                        value={screenForm.seatsPerRow}
                        onChange={(e) => setScreenForm({ ...screenForm, seatsPerRow: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="small text-muted">
                    Seating categories (VIP, Premium, Regular) will be automatically arranged. Total capacity: {screenForm.rowCount * screenForm.seatsPerRow} seats.
                  </div>
                </div>
                <div className="modal-footer border-secondary border-opacity-25">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm text-light"
                    onClick={() => setScreenModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-cinema btn-sm px-4">
                    Save Screen
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

export default AdminTheatresPage;
