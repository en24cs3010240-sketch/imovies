import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Ticket, Calendar, Clock, MapPin, Printer, Film, Download, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ConfirmationPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e50914', '#ffffff', '#fbbf24', '#38bdf8'],
      });
    } catch (e) {}

    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        if (res.data.success) {
          setBooking(res.data.data);
        } else {
          setError('Booking record not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading booking confirmation');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving digital movie ticket..." />;
  }

  if (error || !booking) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-block p-4 rounded-3 shadow">
          <h4>Booking Not Found</h4>
          <p>{error || 'Could not find booking reference.'}</p>
          <Link to="/dashboard" className="btn btn-cinema btn-sm">
            View My Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const showtime = booking.showtimeId;
  const movie = showtime?.movieId;
  const theatre = showtime?.theatreId;
  const screen = showtime?.screenId;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
    <div className="container py-5">
      <div className="text-center mb-4">
        <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-25 rounded-circle p-3 text-success mb-3 shadow">
          <CheckCircle2 size={42} />
        </div>
        <h2 className="fw-bold text-light mb-1">Booking Confirmed!</h2>
        <p className="text-secondary small">
          Your e-ticket is ready and has been added to your profile. Please present this reference at the cinema entrance.
        </p>
      </div>

      {/* Main Digital Ticket Stub */}
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="ticket-stub shadow-lg mb-4">
            {/* Top Bar with Reference */}
            <div className="d-flex flex-wrap justify-content-between align-items-center pb-3 border-bottom border-secondary border-opacity-25 mb-4 gap-2">
              <div className="d-flex align-items-center gap-2">
                <Ticket className="text-danger" size={24} />
                <span className="brand-logo fs-4">IMOVIES PASS</span>
              </div>
              <div className="text-end">
                <span className="text-secondary small d-block">Booking Reference</span>
                <span className="badge bg-danger fs-6 font-monospace px-3 py-1">
                  {booking.bookingReference}
                </span>
              </div>
            </div>

            {/* Movie Info & Details */}
            <div className="row g-4 align-items-center mb-4">
              <div className="col-4 col-sm-3 text-center">
                <img
                  src={movie?.posterUrl}
                  alt={movie?.title}
                  className="rounded-3 shadow w-100"
                  style={{ aspectRatio: '2/3', objectFit: 'cover' }}
                />
              </div>
              <div className="col-8 col-sm-9">
                <h4 className="fw-bold text-light mb-1">{movie?.title}</h4>
                <div className="d-flex flex-wrap gap-2 text-secondary small mb-3">
                  <span className="badge bg-secondary">{movie?.certification || 'PG-13'}</span>
                  <span>{movie?.language}</span>
                  <span>•</span>
                  <span>{movie?.duration} mins</span>
                </div>

                <div className="row g-3 small text-secondary">
                  <div className="col-12 col-sm-6">
                    <div className="d-flex align-items-center gap-2 text-light mb-1">
                      <MapPin size={15} className="text-danger flex-shrink-0" />
                      <strong>{theatre?.name}</strong>
                    </div>
                    <div className="text-muted ms-4">{theatre?.address}, {theatre?.city}</div>
                  </div>

                  <div className="col-12 col-sm-6">
                    <div className="d-flex align-items-center gap-2 text-light mb-1">
                      <Film size={15} className="text-danger flex-shrink-0" />
                      <strong>{screen?.name} ({screen?.screenType})</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Date, Time & Seats Bar */}
            <div className="bg-dark rounded-3 p-3 mb-4 border border-secondary border-opacity-25">
              <div className="row g-3 text-center text-sm-start">
                <div className="col-12 col-sm-4 border-end-sm border-secondary border-opacity-25">
                  <span className="text-secondary small d-block mb-1">Date</span>
                  <div className="d-flex align-items-center justify-content-center justify-content-sm-start gap-1 text-light fw-bold">
                    <Calendar size={16} className="text-danger" />
                    <span>{formatDate(showtime?.startTime)}</span>
                  </div>
                </div>

                <div className="col-12 col-sm-4 border-end-sm border-secondary border-opacity-25">
                  <span className="text-secondary small d-block mb-1">Showtime</span>
                  <div className="d-flex align-items-center justify-content-center justify-content-sm-start gap-1 text-light fw-bold">
                    <Clock size={16} className="text-danger" />
                    <span>{formatTime(showtime?.startTime)}</span>
                  </div>
                </div>

                <div className="col-12 col-sm-4">
                  <span className="text-secondary small d-block mb-1">Seats ({booking.ticketQuantity})</span>
                  <div className="d-flex flex-wrap gap-1 justify-content-center justify-content-sm-start">
                    {booking.seats.map((s) => (
                      <span key={s.seatId} className="badge bg-danger text-light px-2 py-1">
                        {s.seatId}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment & QR summary */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-25 gap-3">
              <div className="small text-secondary text-center text-sm-start">
                <div>Paid via: <strong className="text-light">{booking.paymentDetails?.method} (•••• {booking.paymentDetails?.cardLast4})</strong></div>
                <div>Transaction ID: <span className="font-monospace text-muted">{booking.paymentDetails?.transactionId}</span></div>
                <div className="fs-5 fw-bold text-light mt-1">
                  Total Paid: <span className="text-danger">${booking.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              {/* QR Code visual representation */}
              <div className="text-center p-2 bg-light rounded shadow-sm text-dark">
                <div
                  className="d-flex align-items-center justify-content-center border border-dark rounded font-monospace fw-bold"
                  style={{ width: '90px', height: '90px', fontSize: '0.65rem', textAlign: 'center' }}
                >
                  [ QR VALID: {booking.bookingReference} ]
                </div>
                <span className="small d-block mt-1 text-muted fw-bold" style={{ fontSize: '0.65rem' }}>
                  SCAN AT GATE
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <button
              type="button"
              className="btn btn-outline-light btn-sm d-flex align-items-center gap-2"
              onClick={handlePrint}
            >
              <Printer size={16} />
              <span>Print or Save Ticket</span>
            </button>

            <div className="d-flex gap-2">
              <Link to="/dashboard" className="btn btn-outline-secondary text-light btn-sm">
                View in My Bookings
              </Link>
              <Link to="/movies" className="btn btn-cinema btn-sm d-flex align-items-center gap-1">
                <span>Browse More Movies</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
