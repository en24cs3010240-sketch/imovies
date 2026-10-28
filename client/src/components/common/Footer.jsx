import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="pt-5 pb-4 mt-5 border-top border-secondary border-opacity-25" style={{ backgroundColor: '#0a0b12' }}>
      <div className="container">
        <div className="row g-4">
          {/* Brand Info */}
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #e50914, #990000)' }}
              >
                <Film size={18} color="#fff" />
              </div>
              <span className="brand-logo mb-0" style={{ fontSize: '1.6rem' }}>IMOVIES</span>
            </div>
            <p className="text-secondary small mb-3">
              IMovies is your premier destination for effortless movie ticket bookings. Experience blockbusters with real-time seat availability, IMAX & Dolby sound, and hassle-free instant reservations.
            </p>
            <div className="d-flex align-items-center gap-2 text-muted small">
              <ShieldCheck size={16} className="text-success" />
              <span>100% Secure Simulated Checkout & Instant E-Tickets</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-2">
            <h6 className="text-light fw-bold mb-3 text-uppercase small" style={{ letterSpacing: '1px' }}>Explore</h6>
            <ul className="list-unstyled small text-secondary">
              <li className="mb-2"><Link to="/movies" className="text-secondary text-decoration-none">Now Showing</Link></li>
              <li className="mb-2"><Link to="/movies?status=upcoming" className="text-secondary text-decoration-none">Coming Soon</Link></li>
              <li className="mb-2"><Link to="/movies?genre=Action" className="text-secondary text-decoration-none">Action Blockbusters</Link></li>
              <li className="mb-2"><Link to="/movies?genre=Sci-Fi" className="text-secondary text-decoration-none">Sci-Fi Cinema</Link></li>
              <li className="mb-2"><a href="https://www.youtube.com/watch?v=Way9Dexny3w" target="_blank" rel="noreferrer" className="text-danger text-decoration-none fw-semibold">▶ Watch Demo Video</a></li>
            </ul>
          </div>

          {/* Account */}
          <div className="col-6 col-md-2">
            <h6 className="text-light fw-bold mb-3 text-uppercase small" style={{ letterSpacing: '1px' }}>Account</h6>
            <ul className="list-unstyled small text-secondary">
              <li className="mb-2"><Link to="/dashboard" className="text-secondary text-decoration-none">My Bookings</Link></li>
              <li className="mb-2"><Link to="/login" className="text-secondary text-decoration-none">Customer Login</Link></li>
              <li className="mb-2"><Link to="/register" className="text-secondary text-decoration-none">Create Account</Link></li>
              <li className="mb-2"><Link to="/admin" className="text-secondary text-decoration-none">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="col-12 col-md-4">
            <h6 className="text-light fw-bold mb-3 text-uppercase small" style={{ letterSpacing: '1px' }}>Contact & Help</h6>
            <div className="text-secondary small mb-2 d-flex align-items-center gap-2">
              <MapPin size={16} className="text-danger flex-shrink-0" />
              <span>Available in New York, Los Angeles, Chicago & San Francisco</span>
            </div>
            <div className="text-secondary small mb-2 d-flex align-items-center gap-2">
              <Mail size={16} className="text-danger flex-shrink-0" />
              <span>support@imovies-cinema.example.com</span>
            </div>
            <div className="text-secondary small mb-3 d-flex align-items-center gap-2">
              <Phone size={16} className="text-danger flex-shrink-0" />
              <span>+1 (800) 555-IMOVIES (24/7)</span>
            </div>
            <div className="p-2 rounded bg-dark border border-secondary border-opacity-25 small text-muted">
              Demo Portfolio Project – Built with MERN Stack (React, Express, MongoDB, Node.js).
            </div>
          </div>
        </div>

        <hr className="my-4 border-secondary border-opacity-25" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 small text-secondary">
          <div>© {new Date().getFullYear()} IMovies Entertainment Inc. All rights reserved.</div>
          <div className="d-flex align-items-center gap-1">
            <span>Crafted with</span> <Heart size={14} className="text-danger fill-danger" /> <span>for cinema lovers everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
