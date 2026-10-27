import React, { useState, useEffect } from 'react';
import { Search, Ticket, XCircle, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (status !== 'all') query.append('status', status);

      const res = await api.get(`/admin/bookings?${query.toString()}`);
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleCancelBooking = async (bookingId, ref) => {
    if (!window.confirm(`Are you sure you want to administratively cancel booking "${ref}" and refund the transaction?`)) return;

    try {
      const res = await api.patch(`/bookings/${bookingId}/cancel`, {
        reason: 'Administrative cancellation',
      });
      if (res.data.success) {
        alert('Booking cancelled and seats freed.');
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

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
      <div className="mb-4">
        <h3 className="fw-bold text-light mb-1">Customer Bookings Management</h3>
        <p className="text-secondary small mb-0">Search, review, and manage all cinema reservations and refunds</p>
      </div>

      {/* Filters Bar */}
      <div className="im-card p-3 p-md-4 mb-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="row g-3">
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control form-control-dark border-start-0"
                placeholder="Search by reference code (e.g. IMV-)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-danger">
                Search
              </button>
            </div>
          </div>

          <div className="col-12 col-md-3">
            <select
              className="form-select form-control-dark"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed Only</option>
              <option value="cancelled">Cancelled Only</option>
            </select>
          </div>
        </form>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <LoadingSpinner text="Loading bookings records..." />
      ) : (
        <div className="im-card shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="text-secondary small text-uppercase">
                <tr>
                  <th>Booking Ref</th>
                  <th>Customer</th>
                  <th>Movie & Show</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No customer bookings found.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b._id}>
                      <td>
                        <span className="badge bg-danger font-monospace">
                          {b.bookingReference}
                        </span>
                        <small className="text-muted d-block mt-1">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="text-light fw-medium">{b.userId?.name || 'Customer'}</div>
                        <small className="text-muted">{b.userId?.email}</small>
                      </td>
                      <td>
                        <div className="text-light fw-semibold">{b.showtimeId?.movieId?.title}</div>
                        <small className="text-muted">
                          {b.showtimeId?.theatreId?.name} • {formatDateTime(b.showtimeId?.startTime)}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '140px' }}>
                          {b.seats?.map((s) => (
                            <span key={s.seatId} className="badge bg-secondary">
                              {s.seatId}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="fw-bold text-light">
                        ${b.totalAmount.toFixed(2)}
                      </td>
                      <td>
                        {b.bookingStatus === 'confirmed' ? (
                          <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50">
                            Confirmed
                          </span>
                        ) : (
                          <span className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50">
                            Cancelled
                          </span>
                        )}
                      </td>
                      <td className="text-end">
                        {b.bookingStatus === 'confirmed' && (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm py-1 px-2"
                            onClick={() => handleCancelBooking(b._id, b.bookingReference)}
                          >
                            Cancel & Refund
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingsPage;
