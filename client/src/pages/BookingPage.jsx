import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SeatMap from '../components/booking/SeatMap';
import BookingSummary from '../components/booking/BookingSummary';
import PaymentModal from '../components/booking/PaymentModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ChevronLeft, AlertCircle } from 'lucide-react';

const BookingPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [showtime, setShowtime] = useState(null);
  const [layout, setLayout] = useState(null);
  const [pricing, setPricing] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [holdToken, setHoldToken] = useState(() => {
    return localStorage.getItem(`imv_hold_${showtimeId}`) || null;
  });
  const [holdExpiresAt, setHoldExpiresAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Load showtime and seat layout
  const fetchSeatLayout = async () => {
    try {
      const [showtimeRes, seatsRes] = await Promise.all([
        api.get(`/showtimes/${showtimeId}`),
        api.get(`/showtimes/${showtimeId}/seats${holdToken ? `?holdToken=${holdToken}` : ''}`),
      ]);

      if (showtimeRes.data.success) {
        setShowtime(showtimeRes.data.data);
      }
      if (seatsRes.data.success) {
        setLayout(seatsRes.data.layout);
        setPricing(seatsRes.data.pricing || {});
      }
    } catch (err) {
      console.error('Error loading showtime seats:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to load showtime layout');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeatLayout();
  }, [showtimeId]);

  // Request backend hold whenever user updates seats
  const syncHoldWithBackend = async (newSeats) => {
    if (newSeats.length === 0) {
      // If cleared, release existing hold
      if (holdToken) {
        try {
          await api.delete(`/showtimes/${showtimeId}/holds/${holdToken}`);
        } catch (e) {}
        setHoldToken(null);
        setHoldExpiresAt(null);
        localStorage.removeItem(`imv_hold_${showtimeId}`);
      }
      return;
    }

    try {
      const res = await api.post(`/showtimes/${showtimeId}/holds`, {
        seats: newSeats.map((s) => s.seatId),
        holdToken,
      });

      if (res.data.success) {
        setHoldToken(res.data.holdToken);
        setHoldExpiresAt(res.data.expiresAt);
        localStorage.setItem(`imv_hold_${showtimeId}`, res.data.holdToken);
        setErrorMessage(null);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setErrorMessage(err.response.data.message);
        // Refresh layout to reflect updated taken seats
        fetchSeatLayout();
      } else {
        setErrorMessage(err.response?.data?.message || 'Error reserving seats');
      }
    }
  };

  const handleSeatToggle = (seatObj) => {
    setErrorMessage(null);
    let updated;
    const exists = selectedSeats.some((s) => s.seatId === seatObj.seatId);

    if (exists) {
      updated = selectedSeats.filter((s) => s.seatId !== seatObj.seatId);
    } else {
      updated = [...selectedSeats, seatObj];
    }

    setSelectedSeats(updated);
    syncHoldWithBackend(updated);
  };

  const handleRemoveSeat = (seatId) => {
    const updated = selectedSeats.filter((s) => s.seatId !== seatId);
    setSelectedSeats(updated);
    syncHoldWithBackend(updated);
  };

  const handleHoldExpired = () => {
    setSelectedSeats([]);
    setHoldExpiresAt(null);
    setHoldToken(null);
    localStorage.removeItem(`imv_hold_${showtimeId}`);
    setErrorMessage('Your temporary seat hold has expired. Please re-select your seats.');
    fetchSeatLayout();
  };

  const handleProceedToPayment = () => {
    if (!isAuthenticated) {
      // Redirect to login preserving this showtime booking
      navigate(`/login?redirect=${encodeURIComponent(`/booking/${showtimeId}`)}`);
      return;
    }
    setPaymentModalOpen(true);
  };

  const handleConfirmPayment = async ({ method, cardLast4 }) => {
    setBookingLoading(true);
    setErrorMessage(null);

    try {
      const res = await api.post('/bookings', {
        showtimeId,
        seats: selectedSeats,
        holdToken,
        paymentMethod: method,
        cardLast4,
      });

      if (res.data.success) {
        // Clear local hold
        localStorage.removeItem(`imv_hold_${showtimeId}`);
        const bookingId = res.data.data._id;
        navigate(`/confirmation/${bookingId}`);
      }
    } catch (err) {
      console.error('Booking confirmation failed:', err);
      setPaymentModalOpen(false);
      if (err.response?.status === 409) {
        setErrorMessage('One or more of your selected seats were just taken. Please choose other seats.');
        fetchSeatLayout();
      } else {
        setErrorMessage(err.response?.data?.message || 'Booking payment could not be processed.');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Preparing cinema seating plan..." />;
  }

  if (errorMessage && !showtime) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-block p-4 rounded-3 shadow">
          <h4>Showtime Unavailable</h4>
          <p>{errorMessage}</p>
          <Link to="/movies" className="btn btn-cinema btn-sm">
            Browse Other Movies
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const convenienceFee = selectedSeats.length > 0 ? parseFloat((selectedSeats.length * 1.5).toFixed(2)) : 0;
  const tax = selectedSeats.length > 0 ? parseFloat((subtotal * 0.08).toFixed(2)) : 0;
  const totalAmount = parseFloat((subtotal + convenienceFee + tax).toFixed(2));

  return (
    <div className="container py-4">
      {/* Back button & Title */}
      <div className="d-flex align-items-center gap-2 mb-4">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm text-light rounded-circle p-2"
          onClick={() => navigate(-1)}
          title="Back to movie details"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h4 className="fw-bold text-light mb-0">Select Your Seats</h4>
          <span className="text-secondary small">
            {showtime?.movieId?.title} • {showtime?.theatreId?.name}
          </span>
        </div>
      </div>

      {/* Error / Conflict Alert */}
      {errorMessage && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 mb-4 rounded-3 shadow">
          <AlertCircle size={20} className="flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Layout Grid & Summary Column */}
      <div className="row g-4">
        {/* Cinema Seat Map (Left / Main) */}
        <div className="col-12 col-lg-8">
          <SeatMap
            layout={layout}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
            pricing={pricing}
            maxSeats={8}
            holdExpiresAt={holdExpiresAt}
            onHoldExpired={handleHoldExpired}
          />
        </div>

        {/* Order Summary Sidebar (Right) */}
        <div className="col-12 col-lg-4">
          <BookingSummary
            movie={showtime?.movieId}
            theatre={showtime?.theatreId}
            screen={showtime?.screenId}
            showtime={showtime}
            selectedSeats={selectedSeats}
            onRemoveSeat={handleRemoveSeat}
            onProceed={handleProceedToPayment}
            loading={bookingLoading}
          />
        </div>
      </div>

      {/* Simulated Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        totalAmount={totalAmount}
        seatsCount={selectedSeats.length}
        onConfirmPayment={handleConfirmPayment}
        loading={bookingLoading}
      />
    </div>
  );
};

export default BookingPage;
