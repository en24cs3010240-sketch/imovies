import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Film, MapPin, Calendar, Ticket, ArrowLeft, Shield } from 'lucide-react';

const AdminLayout = () => {
  return (
    <div className="container-fluid px-0">
      <div className="row g-0">
        {/* Sidebar */}
        <aside className="col-12 col-md-3 col-xl-2 admin-sidebar p-3 p-md-4">
          <div className="d-flex align-items-center gap-2 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
            <Shield className="text-warning" size={24} />
            <div>
              <div className="fw-bold text-light" style={{ fontSize: '1.05rem' }}>Admin Console</div>
              <small className="text-secondary">IMovies Operations</small>
            </div>
          </div>

          <nav className="nav flex-column gap-1 mb-4">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/movies"
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <Film size={18} />
              <span>Movies Catalog</span>
            </NavLink>

            <NavLink
              to="/admin/theatres"
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <MapPin size={18} />
              <span>Theatres & Screens</span>
            </NavLink>

            <NavLink
              to="/admin/showtimes"
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <Calendar size={18} />
              <span>Showtimes Schedule</span>
            </NavLink>

            <NavLink
              to="/admin/bookings"
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <Ticket size={18} />
              <span>Customer Bookings</span>
            </NavLink>
          </nav>

          <div className="mt-auto pt-3 border-top border-secondary border-opacity-25">
            <Link to="/" className="btn btn-outline-secondary text-light btn-sm w-100 d-flex align-items-center justify-content-center gap-2">
              <ArrowLeft size={15} />
              <span>Return to Cinema</span>
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="col-12 col-md-9 col-xl-10 p-3 p-md-4 p-xl-5" style={{ minHeight: 'calc(100vh - 72px)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
