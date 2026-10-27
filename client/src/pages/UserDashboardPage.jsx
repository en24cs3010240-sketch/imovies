import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, User, Phone, Mail, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const UserDashboardPage = () => {
  const { user, updateProfile } = useAuth();
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'past', 'profile'

  // Profile edit state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  // Cancellation modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my');
      if (res.data.success) {
        setUpcoming(res.data.upcoming || []);
        setPast(res.data.past || []);
      }
    } catch (err) {
      console.error('Error fetching my bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);
    try {
      const res = await updateProfile({ name, phone });
      if (res.success) {
        setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setProfileMessage({ type: 'danger', text: 'Failed to update profile.' });
      }
    } catch (err) {
      setProfileMessage({ type: 'danger', text: err.response?.data?.message || 'Error updating profile.' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleInitiateCancel = (booking) => {
    setSelectedBookingToCancel(booking);
    setCancelReason('');
    setActionError(null);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBookingToCancel) return;
    setCancelling(true);
    setActionError(null);
    try {
      const res = await api.patch(`/bookings/${selectedBookingToCancel._id}/cancel`, {
        reason: cancelReason || 'Customer requested cancellation',
      });
      if (res.data.success) {
        setCancelModalOpen(false);
        setSelectedBookingToCancel(null);
        fetchBookings();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container py-4">
      {/* Header Banner */}
      <div className="im-card p-4 mb-4 shadow">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle bg-danger text-light d-flex align-items-center justify-content-center fw-bold fs-3"
              style={{ width: '60px', height: '60px' }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="fw-bold text-light mb-1">{user?.name}</h4>
              <div className="text-secondary small d-flex flex-wrap align-items-center gap-3">
                <span className="d-flex align-items-center gap-1">
                  <Mail size={14} />
                  {user?.email}
                </span>
                {user?.phone && (
                  <span className="d-flex align-items-center gap-1">
                    <Phone size={14} />
                    {user?.phone}
                  </span>
                )}
                <span className="badge bg-secondary">{user?.role}</span>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2">
            <Link to="/movies" className="btn btn-cinema btn-sm">
              Book More Tickets
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs border-secondary border-opacity-50 mb-4">
        <li className="nav-item">
          <button
            className={`nav-link text-light ${activeTab === 'upcoming' ? 'active bg-dark fw-bold border-danger border-bottom-0 text-danger' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Bookings ({upcoming.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link text-light ${activeTab === 'past' ? 'active bg-dark fw-bold border-danger border-bottom-0 text-danger' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past & Cancelled ({past.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link text-light ${activeTab === 'profile' ? 'active bg-dark fw-bold border-danger border-bottom-0 text-danger' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Settings
          </button>
        </li>
      </ul>

      {/* Tab Contents */}
      {loading ? (
        <LoadingSpinner text="Loading your bookings..." />
      ) : activeTab === 'upcoming' ? (
        <div>
          {upcoming.length === 0 ? (
            <div className="im-card p-5 text-center">
              <Ticket size={48} className="text-muted mb-3" />
              <h5 className="text-light fw-bold">No Upcoming Bookings</h5>
              <p className="text-secondary small mb-3">
                You do not have any upcoming movie tickets reserved right now.
              </p>
              <Link to="/movies" className="btn btn-cinema btn-sm">
                Browse What's Showing
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              {upcoming.map((b) => {
                const showtime = b.showtimeId;
                const movie = showtime?.movieId;
                const theatre = showtime?.theatreId;
                const screen = showtime?.screenId;

                return (
                  <div key={b._id} className="col-12 col-lg-6">
                    <div className="im-card p-4 h-100 d-flex flex-column shadow">
                      {/* Booking Header */}
                      <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom border-secondary border-opacity-25">
                        <span className="badge bg-danger font-monospace px-2 py-1">
                          {b.bookingReference}
                        </span>
                        <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50">
                          Confirmed
                        </span>
                      </div>

                      {/* Movie and Details */}
                      <div className="d-flex gap-3 mb-3">
                        {movie?.posterUrl && (
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="rounded shadow"
                            style={{ width: '70px', height: '100px', objectFit: 'cover' }}
                          />
                        )}
                        <div className="flex-grow-1">
                          <h6 className="fw-bold text-light mb-1">{movie?.title}</h6>
                          <div className="text-secondary small mb-2">
                            <span className="badge bg-secondary me-1">{movie?.certification || 'PG-13'}</span>
                            <span>{screen?.name}</span>
                          </div>
                          <div className="small text-secondary d-flex align-items-center gap-1">
                            <MapPin size={14} className="text-danger" />
                            <span>{theatre?.name}, {theatre?.city}</span>
                          </div>
                        </div>
                      </div>

                      {/* Showtime & Seats */}
                      <div className="bg-dark rounded p-3 mb-3 small border border-secondary border-opacity-25">
                        <div className="row g-2">
                          <div className="col-6">
                            <span className="text-muted d-block">Date</span>
                            <strong className="text-light">{formatDate(showtime?.startTime)}</strong>
                          </div>
                          <div className="col-6">
                            <span className="text-muted d-block">Showtime</span>
                            <strong className="text-danger">{formatTime(showtime?.startTime)}</strong>
                          </div>
                          <div className="col-12 mt-2 pt-2 border-top border-secondary border-opacity-25">
                            <span className="text-muted d-block mb-1">Seats:</span>
                            <div className="d-flex flex-wrap gap-1">
                              {b.seats.map((s) => (
                                <span key={s.seatId} className="badge bg-danger text-light">
                                  {s.seatId}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
                        <span className="fs-6 fw-bold text-light">
                          Paid: <strong className="text-danger">${b.totalAmount.toFixed(2)}</strong>
                        </span>
                        <div className="d-flex gap-2">
                          <Link to={`/confirmation/${b._id}`} className="btn btn-outline-light btn-sm">
                            View Ticket
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleInitiateCancel(b)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : activeTab === 'past' ? (
        <div>
          {past.length === 0 ? (
            <div className="im-card p-5 text-center">
              <h5 className="text-light fw-bold">No Past Bookings</h5>
              <p className="text-secondary small mb-0">Your past or cancelled bookings will show here.</p>
            </div>
          ) : (
            <div className="row g-4">
              {past.map((b) => {
                const showtime = b.showtimeId;
                const movie = showtime?.movieId;
                const theatre = showtime?.theatreId;
                const isCancelled = b.bookingStatus === 'cancelled';

                return (
                  <div key={b._id} className="col-12 col-lg-6">
                    <div className="im-card p-4 h-100 opacity-75 shadow-sm">
                      <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom border-secondary border-opacity-25">
                        <span className="badge bg-secondary font-monospace">
                          {b.bookingReference}
                        </span>
                        {isCancelled ? (
                          <span className="badge bg-danger bg-opacity-25 text-danger border border-danger">
                            Cancelled (Refunded)
                          </span>
                        ) : (
                          <span className="badge bg-secondary">Completed</span>
                        )}
                      </div>

                      <div className="d-flex gap-3 mb-3">
                        {movie?.posterUrl && (
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="rounded"
                            style={{ width: '60px', height: '85px', objectFit: 'cover' }}
                          />
                        )}
                        <div>
                          <h6 className="fw-bold text-light mb-1">{movie?.title || 'Movie'}</h6>
                          <div className="small text-muted">{theatre?.name}</div>
                          <div className="small text-secondary mt-1">
                            {formatDate(showtime?.startTime)} • {formatTime(showtime?.startTime)}
                          </div>
                          <div className="small text-muted mt-1">
                            Seats: {b.seats.map((s) => s.seatId).join(', ')}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25 small text-secondary">
                        <span>Total: ${b.totalAmount.toFixed(2)}</span>
                        <Link to={`/confirmation/${b._id}`} className="text-secondary text-decoration-none">
                          Ticket Summary →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Profile Settings Tab */
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="im-card p-4 shadow">
              <h5 className="fw-bold text-light mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                Update Account Information
              </h5>

              {profileMessage && (
                <div className={`alert alert-${profileMessage.type} small py-2 px-3 mb-3`}>
                  {profileMessage.text}
                </div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div className="mb-3">
                  <label className="text-secondary small mb-1">Full Name</label>
                  <input
                    type="text"
                    className="form-control form-control-dark"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="text-secondary small mb-1">Email Address</label>
                  <input
                    type="email"
                    className="form-control form-control-dark opacity-75"
                    value={user?.email || ''}
                    disabled
                  />
                  <small className="text-muted">Email cannot be changed.</small>
                </div>

                <div className="mb-4">
                  <label className="text-secondary small mb-1">Phone Number</label>
                  <input
                    type="text"
                    className="form-control form-control-dark"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-cinema btn-sm px-4"
                  disabled={profileSaving}
                >
                  {profileSaving ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && selectedBookingToCancel && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-cinema" style={{ backgroundColor: '#141724' }}>
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title fw-bold text-light">Cancel Booking</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setCancelModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="alert alert-warning small d-flex align-items-start gap-2 mb-3">
                  <AlertTriangle size={18} className="flex-shrink-0 mt-1" />
                  <div>
                    Are you sure you want to cancel booking <strong>{selectedBookingToCancel.bookingReference}</strong>?
                    Your reserved seats will be released immediately and a simulated refund of <strong>${selectedBookingToCancel.totalAmount.toFixed(2)}</strong> will be processed.
                  </div>
                </div>

                {actionError && (
                  <div className="alert alert-danger small py-2 px-3 mb-3">
                    {actionError}
                  </div>
                )}

                <div className="mb-3">
                  <label className="text-secondary small mb-1">Reason for cancellation (optional)</label>
                  <textarea
                    className="form-control form-control-dark"
                    rows="2"
                    placeholder="e.g. Schedule conflict, changed plans"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-secondary border-opacity-25">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm text-light"
                  onClick={() => setCancelModalOpen(false)}
                  disabled={cancelling}
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm px-3"
                  onClick={handleConfirmCancel}
                  disabled={cancelling}
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboardPage;
