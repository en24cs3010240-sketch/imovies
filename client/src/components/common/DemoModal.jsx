import React, { useState } from 'react';
import { X, Play, Video, ExternalLink, CheckCircle2, Shield, Ticket, Star, Sparkles, Copy, Check } from 'lucide-react';

const DemoModal = ({ isOpen, onClose }) => {
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen) return null;

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.88)', backdropFilter: 'blur(10px)', zIndex: 1070 }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-secondary modal-cinema" style={{ backgroundColor: '#11131f' }}>
          {/* Header */}
          <div className="modal-header border-secondary border-opacity-25 py-3 px-4">
            <div className="d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 p-2"
                style={{ background: 'linear-gradient(135deg, #e50914, #990000)' }}
              >
                <Video size={20} color="#fff" />
              </div>
              <div>
                <h5 className="modal-title fw-bold text-light mb-0">
                  IMovies – Product Demo Walkthrough
                </h5>
                <small className="text-secondary">Comprehensive feature demonstration and user guide</small>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary text-light rounded-circle p-1"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              {/* Left Column: Embedded Video Walkthrough */}
              <div className="col-12 col-lg-7">
                <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-lg border border-secondary border-opacity-50 mb-3 bg-black">
                  <iframe
                    src="https://www.youtube.com/embed/Way9Dexny3w?autoplay=0&rel=0"
                    title="IMovies Full-Stack Demo Walkthrough"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  <a
                    href="https://www.youtube.com/watch?v=Way9Dexny3w"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                  >
                    <Play size={14} /> Watch on YouTube <ExternalLink size={12} />
                  </a>
                  <a
                    href="https://imovies-red.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-cinema d-inline-flex align-items-center gap-1"
                  >
                    <ExternalLink size={14} /> Open Live Web App
                  </a>
                </div>

                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 p-3 bg-dark rounded-3 border border-secondary border-opacity-25">
                  <div className="small">
                    <span className="text-light fw-bold d-block">Live Application URL:</span>
                    <a
                      href="https://imovies-red.vercel.app"
                      target="_blank"
                      rel="noreferrer"
                      className="text-danger text-decoration-none font-monospace small"
                    >
                      https://imovies-red.vercel.app <ExternalLink size={12} className="ms-1 inline" />
                    </a>
                  </div>
                  <div className="small">
                    <span className="text-light fw-bold d-block">GitHub Source Code:</span>
                    <a
                      href="https://github.com/en24cs3010240-sketch/imovies"
                      target="_blank"
                      rel="noreferrer"
                      className="text-info text-decoration-none font-monospace small"
                    >
                      github.com/en24cs3010240-sketch/imovies <ExternalLink size={12} className="ms-1 inline" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Demo Video Timestamps & Guide */}
              <div className="col-12 col-lg-5">
                <h6 className="text-uppercase text-secondary fw-bold small mb-3" style={{ letterSpacing: '1px' }}>
                  Demo Walkthrough Chapters
                </h6>

                <div className="d-flex flex-column gap-2 mb-4">
                  <div className="p-2 rounded bg-dark border border-secondary border-opacity-25 small d-flex align-items-start gap-2">
                    <span className="badge bg-danger font-monospace mt-1">00:00</span>
                    <div>
                      <strong className="text-light d-block">Browse Movies & 60-Day Schedules</strong>
                      <span className="text-muted">Filtering by genre, city selection, and viewing 2 months of upcoming screenings.</span>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-dark border border-secondary border-opacity-25 small d-flex align-items-start gap-2">
                    <span className="badge bg-danger font-monospace mt-1">00:45</span>
                    <div>
                      <strong className="text-light d-block">Movie Details & Trailer Player</strong>
                      <span className="text-muted">Synopsis, cast, director, rating, and official YouTube modal trailer embed.</span>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-dark border border-secondary border-opacity-25 small d-flex align-items-start gap-2">
                    <span className="badge bg-danger font-monospace mt-1">01:30</span>
                    <div>
                      <strong className="text-light d-block">Interactive Seat Map & 8-Min Hold</strong>
                      <span className="text-muted">VIP/Premium/Regular tiers with real-time countdown timer to prevent double-booking.</span>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-dark border border-secondary border-opacity-25 small d-flex align-items-start gap-2">
                    <span className="badge bg-danger font-monospace mt-1">02:15</span>
                    <div>
                      <strong className="text-light d-block">Simulated Payment & Digital E-Ticket</strong>
                      <span className="text-muted">1-click test card fill, confetti burst, ticket stub, and check-in QR code.</span>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-dark border border-secondary border-opacity-25 small d-flex align-items-start gap-2">
                    <span className="badge bg-danger font-monospace mt-1">03:00</span>
                    <div>
                      <strong className="text-light d-block">Customer Dashboard & Cancellations</strong>
                      <span className="text-muted">Reviewing booking history and performing self-service cancellations with refunds.</span>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-dark border border-secondary border-opacity-25 small d-flex align-items-start gap-2">
                    <span className="badge bg-danger font-monospace mt-1">03:45</span>
                    <div>
                      <strong className="text-light d-block">Admin Console & Operations</strong>
                      <span className="text-muted">Revenue analytics, catalog management, multiplex screens, and showtime scheduling.</span>
                    </div>
                  </div>
                </div>

                {/* Quick Credentials Box */}
                <div className="p-3 bg-dark rounded-3 border border-secondary border-opacity-25 small">
                  <div className="fw-bold text-light mb-2">Instant Demo Accounts:</div>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-muted">Customer:</span>
                    <span className="font-monospace text-light">john@example.com / Customer@123456</span>
                    <button
                      type="button"
                      className="btn btn-link p-0 text-secondary"
                      onClick={() => copyToClipboard('john@example.com', 'cust')}
                    >
                      {copiedField === 'cust' ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Admin:</span>
                    <span className="font-monospace text-warning">admin@imovies.com / Admin@123456</span>
                    <button
                      type="button"
                      className="btn btn-link p-0 text-secondary"
                      onClick={() => copyToClipboard('admin@imovies.com', 'admin')}
                    >
                      {copiedField === 'admin' ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-secondary border-opacity-25 py-2 px-4">
            <button
              type="button"
              className="btn btn-cinema btn-sm px-4"
              onClick={onClose}
            >
              Start Exploring IMovies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoModal;
