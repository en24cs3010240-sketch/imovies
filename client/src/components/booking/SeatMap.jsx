import React, { useState, useEffect } from 'react';
import { Timer, AlertCircle, Sparkles } from 'lucide-react';

const SeatMap = ({
  layout,
  selectedSeats = [],
  onSeatToggle,
  pricing = {},
  maxSeats = 8,
  holdExpiresAt,
  onHoldExpired,
}) => {
  const [timeLeft, setTimeLeft] = useState(null);

  // Countdown timer for active seat hold
  useEffect(() => {
    if (!holdExpiresAt) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(holdExpiresAt).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setTimeLeft('00:00');
        if (onHoldExpired) onHoldExpired();
      } else {
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(
          `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [holdExpiresAt, onHoldExpired]);

  const isSeatSelected = (seatId) => {
    return selectedSeats.some((s) => s.seatId === seatId);
  };

  const handleSeatClick = (seat, category) => {
    if (seat.status === 'booked' || seat.status === 'held' || !seat.isActive) {
      return;
    }

    const alreadySelected = isSeatSelected(seat.seatId);
    if (!alreadySelected && selectedSeats.length >= maxSeats) {
      alert(`You can select up to ${maxSeats} seats per booking.`);
      return;
    }

    onSeatToggle({
      seatId: seat.seatId,
      category,
      price: pricing[category] || 12.0,
      seatNumber: seat.seatNumber,
    });
  };

  if (!layout || !layout.rows) {
    return <div className="text-center py-5 text-muted">Seating layout not available</div>;
  }

  return (
    <div className="seat-map-wrapper shadow-lg">
      {/* Hold Expiration Alert Banner */}
      {timeLeft && (
        <div className="alert alert-warning d-flex align-items-center justify-content-between py-2 px-3 mb-4 rounded-3 border-warning border-opacity-50">
          <div className="d-flex align-items-center gap-2">
            <Timer size={18} className="text-warning" />
            <span className="small fw-semibold">Seats temporarily reserved for you</span>
          </div>
          <div className="badge bg-dark text-warning border border-warning fs-6 font-monospace px-3 py-1">
            {timeLeft}
          </div>
        </div>
      )}

      {/* Screen Graphic */}
      <div className="cinema-screen-container">
        <div className="cinema-screen-arc"></div>
        <div className="screen-label">SCREEN THIS WAY</div>
      </div>

      {/* Seat Rows Grid */}
      <div className="d-flex flex-column align-items-center mb-4">
        {layout.rows.map((row) => (
          <div key={row.rowName} className="seat-row">
            <span className="row-label">{row.rowName}</span>
            <div className="d-flex align-items-center gap-1 gap-sm-2">
              {row.seats.map((seat) => {
                const selected = isSeatSelected(seat.seatId);
                let seatClass = 'seat-available';

                if (seat.status === 'booked') {
                  seatClass = 'seat-booked';
                } else if (seat.status === 'held') {
                  seatClass = 'seat-held';
                } else if (selected || seat.status === 'selected') {
                  seatClass = 'seat-selected';
                }

                return (
                  <button
                    key={seat.seatId}
                    type="button"
                    className={`seat ${seatClass}`}
                    onClick={() => handleSeatClick(seat, row.category)}
                    disabled={seat.status === 'booked' || seat.status === 'held'}
                    title={`${seat.seatId} - ${row.category} ($${pricing[row.category] || 12})`}
                  >
                    {seat.seatNumber}
                  </button>
                );
              })}
            </div>
            <span className="row-label">{row.rowName}</span>
          </div>
        ))}
      </div>

      {/* Legend & Price Guide */}
      <div className="border-top border-secondary border-opacity-25 pt-4 mt-3">
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 small mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="seat seat-available" style={{ width: '22px', height: '22px' }}></div>
            <span className="text-secondary">Available</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="seat seat-selected" style={{ width: '22px', height: '22px' }}></div>
            <span className="text-secondary">Selected</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="seat seat-held" style={{ width: '22px', height: '22px' }}></div>
            <span className="text-secondary">Held (Another User)</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="seat seat-booked" style={{ width: '22px', height: '22px' }}></div>
            <span className="text-secondary">Sold Out</span>
          </div>
        </div>

        {/* Pricing tiers */}
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 small">
          <span className="badge badge-category-vip px-3 py-2 rounded-pill">
            <Sparkles size={13} className="me-1 inline" /> VIP Recliner: ${pricing.VIP || 22}.00
          </span>
          <span className="badge badge-category-premium px-3 py-2 rounded-pill">
            Premium Lounge: ${pricing.Premium || 16}.00
          </span>
          <span className="badge badge-category-regular px-3 py-2 rounded-pill">
            Regular Standard: ${pricing.Regular || 12}.00
          </span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
