import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Ticket, Film, Users, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentBookings(res.data.recentBookings || []);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Compiling administrative analytics..." />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-light mb-1">Administrative Overview</h3>
          <p className="text-secondary small mb-0">Live box office revenue, bookings, and operations</p>
        </div>
        <Link to="/admin/showtimes" className="btn btn-cinema btn-sm">
          + Schedule Showtime
        </Link>
      </div>

      {/* KPI Metric Cards */}
      <div className="row g-4 mb-4">
        {/* Total Revenue */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="im-card p-4 shadow-sm border-start border-danger border-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small text-uppercase fw-bold">Confirmed Revenue</span>
              <div className="p-2 bg-danger bg-opacity-25 rounded-circle text-danger">
                <DollarSign size={20} />
              </div>
            </div>
            <h3 className="fw-bold text-light mb-1">
              ${stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '0.00'}
            </h3>
            <span className="text-success small d-flex align-items-center gap-1">
              <TrendingUp size={14} /> From confirmed reservations
            </span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="im-card p-4 shadow-sm border-start border-primary border-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small text-uppercase fw-bold">Total Bookings</span>
              <div className="p-2 bg-primary bg-opacity-25 rounded-circle text-primary">
                <Ticket size={20} />
              </div>
            </div>
            <h3 className="fw-bold text-light mb-1">
              {stats?.totalBookings || 0}
            </h3>
            <span className="text-secondary small">
              {stats?.confirmedBookings || 0} confirmed • {stats?.cancelledBookings || 0} cancelled
            </span>
          </div>
        </div>

        {/* Active Movies */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="im-card p-4 shadow-sm border-start border-warning border-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small text-uppercase fw-bold">Movies in Catalog</span>
              <div className="p-2 bg-warning bg-opacity-25 rounded-circle text-warning">
                <Film size={20} />
              </div>
            </div>
            <h3 className="fw-bold text-light mb-1">
              {stats?.totalMovies || 0}
            </h3>
            <span className="text-secondary small">Across {stats?.totalTheatres || 0} theatres</span>
          </div>
        </div>

        {/* Registered Users */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="im-card p-4 shadow-sm border-start border-info border-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small text-uppercase fw-bold">Registered Users</span>
              <div className="p-2 bg-info bg-opacity-25 rounded-circle text-info">
                <Users size={20} />
              </div>
            </div>
            <h3 className="fw-bold text-light mb-1">
              {stats?.totalUsers || 0}
            </h3>
            <span className="text-secondary small">Customers & staff</span>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="im-card p-4 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom border-secondary border-opacity-25">
          <h5 className="fw-bold text-light mb-0">Recent Box Office Bookings</h5>
          <Link to="/admin/bookings" className="btn btn-outline-secondary btn-sm text-light d-flex align-items-center gap-1">
            <span>View All</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center py-4 text-muted small">No customer bookings recorded yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="text-secondary small text-uppercase">
                <tr>
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Movie & Theatre</th>
                  <th>Seats</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <span className="badge bg-danger bg-opacity-25 text-danger font-monospace">
                        {b.bookingReference}
                      </span>
                    </td>
                    <td>
                      <div className="text-light fw-medium">{b.userId?.name || 'Customer'}</div>
                      <small className="text-muted">{b.userId?.email}</small>
                    </td>
                    <td>
                      <div className="text-light">{b.showtimeId?.movieId?.title || 'Movie'}</div>
                      <small className="text-muted">{b.showtimeId?.theatreId?.name}</small>
                    </td>
                    <td>
                      <span className="badge bg-dark border border-secondary text-light">
                        {b.seats?.map((s) => s.seatId).join(', ') || `${b.ticketQuantity} seats`}
                      </span>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
