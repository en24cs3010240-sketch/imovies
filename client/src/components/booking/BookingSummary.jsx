import React from 'react';
import { Film, Calendar, Clock, MapPin, Ticket, ShieldCheck, Trash2 } from 'lucide-react';

const BookingSummary = ({
  movie,
  theatre,
  screen,
  showtime,
  selectedSeats = [],
  onRemoveSeat,
  onProceed,
  loading = false,
}) => {
  const subtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const convenienceFee = selectedSeats.length > 0 ? parseFloat((selectedSeats.length * 1.5).toFixed(2)) : 0;
  const tax = selectedSeats.length > 0 ? parseFloat((subtotal * 0.08).toFixed(2)) : 0;
  const total = parseFloat((subtotal + convenienceFee + tax).toFixed(2));

  const formatShowDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatShowTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="im-card p-4 shadow-lg sticky-top" style={{ top: '90px' }}>
      <h5 className="fw-bold text-light pb-3 border-bottom border-secondary border-opacity-25 d-flex align-items-center gap-2">
        <Ticket size={20} className="text-danger" />
        <span>Booking Summary</span>
      </h5>

      {/* Movie Details Preview */}
      <div className="d-flex gap-3 my-3">
        {movie?.posterUrl && (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="rounded"
            style={{ width: '64px', height: '90px', objectFit: 'cover' }}
          />
        )}
        <div>
          <h6 className="fw-bold text-light mb-1">{movie?.title}</h6>
          <div className="text-secondary small mb-1">
            <span className="badge bg-secondary me-1">{movie?.certification || 'PG-13'}</span>
            <span>{movie?.language}</span>
          </div>
          <div className="text-danger small fw-semibold">
            {screen?.name} ({screen?.screenType})
          </div>
        </div>
      </div>

      {/* Location & Time info */}
      <div className="bg-dark rounded-3 p-3 my-3 border border-secondary border-opacity-25 small">
        <div className="d-flex align-items-center gap-2 text-secondary mb-2">
          <MapPin size={15} className="text-danger flex-shrink-0" />
          <span className="text-light fw-medium">{theatre?.name}, {theatre?.city}</span>
        </div>
        <div className="d-flex align-items-center justify-content-between text-secondary">
          <div className="d-flex align-items-center gap-1">
            <Calendar size={14} />
            <span>{formatShowDate(showtime?.startTime)}</span>
          </div>
          <div className="d-flex align-items-center gap-1 text-light fw-bold">
            <Clock size={14} className="text-danger" />
            <span>{formatShowTime(showtime?.startTime)}</span>
          </div>
        </div>
      </div>

      {/* Selected Seats Badges */}
      <div className="my-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-secondary small fw-bold text-uppercase">Selected Seats ({selectedSeats.length})</span>
          {selectedSeats.length > 0 && (
            <span className="text-muted small">Max 8 seats</span>
          )}
        </div>

        {selectedSeats.length === 0 ? (
          <div className="p-3 text-center text-muted small border border-secondary border-dashed rounded-3">
            Please click on available seats from the layout to select.
          </div>
        ) : (
          <div className="d-flex flex-wrap gap-2 mb-2">
            {selectedSeats.map((s) => (
              <span
                key={s.seatId}
                className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50 py-2 px-2 d-flex align-items-center gap-1"
              >
                <strong>{s.seatId}</strong>
                <small className="text-muted">(${s.price})</small>
                {onRemoveSeat && (
                  <button
                    type="button"
                    className="btn btn-link p-0 text-danger ms-1"
                    onClick={() => onRemoveSeat(s.seatId)}
                    title="Remove seat"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Cost Breakdown */}
      {selectedSeats.length > 0 && (
        <div className="border-top border-secondary border-opacity-25 pt-3 my-3 small">
          <div className="d-flex justify-content-between text-secondary mb-1">
            <span>Ticket Price ({selectedSeats.length})</span>
            <span className="text-light">${subtotal.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between text-secondary mb-1">
            <span>Convenience Fee</span>
            <span className="text-light">${convenienceFee.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between text-secondary mb-2">
            <span>Tax (8%)</span>
            <span className="text-light">${tax.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25 fs-5 fw-bold text-light">
            <span>Total Payable:</span>
            <span className="text-danger">${total.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Checkout CTA */}
      <div className="mt-4">
        <button
          type="button"
          className="btn btn-cinema w-100 py-2 d-flex align-items-center justify-content-center gap-2"
          disabled={selectedSeats.length === 0 || loading}
          onClick={onProceed}
        >
          {loading ? (
            <div className="spinner-border spinner-border-sm" role="status"></div>
          ) : (
            <>
              <Ticket size={18} />
              <span>Proceed to Checkout</span>
            </>
          )}
        </button>
        <div className="d-flex align-items-center justify-content-center gap-1 text-muted small mt-2">
          <ShieldCheck size={14} className="text-success" />
          <span>Simulated demo checkout • No real card needed</span>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
