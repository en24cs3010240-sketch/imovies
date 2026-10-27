const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
};

const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
};

const PAYMENT_STATUS = {
  PAID: 'paid',
  REFUNDED: 'refunded',
  PENDING: 'pending',
  FAILED: 'failed',
};

const MOVIE_STATUS = {
  NOW_SHOWING: 'now_showing',
  UPCOMING: 'upcoming',
  ENDED: 'ended',
};

const SEAT_CATEGORIES = {
  REGULAR: 'Regular',
  PREMIUM: 'Premium',
  VIP: 'VIP',
};

const DEFAULT_HOLD_DURATION_MINUTES = 8;
const MAX_SEATS_PER_BOOKING = 8;

module.exports = {
  ROLES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  MOVIE_STATUS,
  SEAT_CATEGORIES,
  DEFAULT_HOLD_DURATION_MINUTES,
  MAX_SEATS_PER_BOOKING,
};
