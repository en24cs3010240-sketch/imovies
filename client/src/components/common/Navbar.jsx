import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, MapPin, User, LogOut, Ticket, ShieldAlert, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCity } from '../../context/CityContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { selectedCity, changeCity, cities } = useCity();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg im-navbar sticky-top py-2 px-3 px-lg-4">
      <div className="container-fluid">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #e50914, #990000)' }}
          >
            <Film size={22} color="#fff" />
          </div>
          <span className="brand-logo mb-0">IMOVIES</span>
        </Link>

        {/* City Selector (Desktop) */}
        <div className="d-none d-md-flex align-items-center ms-3 me-auto dropdown">
          <button
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 dropdown-toggle text-light border-secondary"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ borderRadius: '20px', padding: '0.35rem 0.85rem' }}
          >
            <MapPin size={15} className="text-danger" />
            <span>{selectedCity}</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-dark shadow">
            {cities.map((city) => (
              <li key={city}>
                <button
                  className={`dropdown-item ${city === selectedCity ? 'active' : ''}`}
                  onClick={() => changeCity(city)}
                >
                  {city}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile menu toggle button */}
        <button
          className="navbar-toggler border-0 text-light d-lg-none"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Navbar Links & Controls */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="navbarContent">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="d-flex mx-auto my-2 my-lg-0" style={{ maxWidth: '340px', width: '100%' }}>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control form-control-dark border-start-0"
                placeholder="Search movies, actors, directors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* City Selector on mobile */}
          <div className="d-md-none my-2">
            <label className="text-muted small d-block mb-1">Select City:</label>
            <select
              className="form-select form-control-dark"
              value={selectedCity}
              onChange={(e) => changeCity(e.target.value)}
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <ul className="navbar-nav ms-auto align-items-lg-center gap-2 mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                to="/movies"
                className={`nav-link text-light px-3 ${location.pathname === '/movies' ? 'fw-bold text-danger' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Movies
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link
                    to="/dashboard"
                    className="nav-link text-light d-flex align-items-center gap-1 px-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Ticket size={17} className="text-danger" />
                    <span>My Bookings</span>
                  </Link>
                </li>

                {isAdmin && (
                  <li className="nav-item">
                    <Link
                      to="/admin"
                      className="nav-link text-warning d-flex align-items-center gap-1 px-3 fw-semibold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <ShieldAlert size={17} />
                      <span>Admin Panel</span>
                    </Link>
                  </li>
                )}

                <li className="nav-item dropdown">
                  <button
                    className="btn btn-outline-secondary btn-sm dropdown-toggle text-light d-flex align-items-center gap-2"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div
                      className="rounded-circle bg-danger d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{ width: '26px', height: '26px', fontSize: '0.8rem' }}
                    >
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span>{user?.name?.split(' ')[0]}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow">
                    <li>
                      <div className="px-3 py-1">
                        <small className="text-muted d-block">Signed in as</small>
                        <strong className="d-block text-truncate" style={{ maxWidth: '180px' }}>
                          {user?.email}
                        </strong>
                        <span className="badge bg-secondary mt-1">{user?.role}</span>
                      </div>
                    </li>
                    <li><hr className="dropdown-divider border-secondary" /></li>
                    <li>
                      <Link to="/dashboard" className="dropdown-item d-flex align-items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                        <User size={15} /> Dashboard & Profile
                      </Link>
                    </li>
                    {isAdmin && (
                      <li>
                        <Link to="/admin" className="dropdown-item d-flex align-items-center gap-2 text-warning" onClick={() => setMobileMenuOpen(false)}>
                          <ShieldAlert size={15} /> Admin Dashboard
                        </Link>
                      </li>
                    )}
                    <li><hr className="dropdown-divider border-secondary" /></li>
                    <li>
                      <button className="dropdown-item d-flex align-items-center gap-2 text-danger" onClick={handleLogout}>
                        <LogOut size={15} /> Sign Out
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
                <Link
                  to="/login"
                  className="btn btn-outline-light btn-sm px-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-cinema btn-sm px-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
