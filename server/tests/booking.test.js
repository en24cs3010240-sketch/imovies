const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Movie = require('../src/models/Movie');
const Theatre = require('../src/models/Theatre');
const Screen = require('../src/models/Screen');
const Showtime = require('../src/models/Showtime');
const { generateDefaultLayout } = require('../src/controllers/screenController');
const bcrypt = require('bcryptjs');
require('./setup');

describe('Seat Hold & Double-Booking Prevention APIs', () => {
  let customer1Token;
  let customer2Token;
  let testShowtime;

  beforeEach(async () => {
    const salt = await bcrypt.genSalt(10);

    const u1 = await User.create({
      name: 'Alice',
      email: 'alice@example.com',
      passwordHash: await bcrypt.hash('Secret123', salt),
      role: 'customer',
    });
    customer1Token = u1.generateAuthToken();

    const u2 = await User.create({
      name: 'Bob',
      email: 'bob@example.com',
      passwordHash: await bcrypt.hash('Secret123', salt),
      role: 'customer',
    });
    customer2Token = u2.generateAuthToken();

    const movie = await Movie.create({
      title: 'Dune: Part Two',
      description: 'Epic Sci-Fi sequel',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401',
      genre: ['Sci-Fi'],
      language: 'English',
      duration: 166,
      releaseDate: new Date(),
    });

    const theatre = await Theatre.create({
      name: 'IMovies Cinema NY',
      address: 'Broadway Ave',
      city: 'New York',
    });

    const screen = await Screen.create({
      theatreId: theatre._id,
      name: 'Screen 1',
      screenType: 'IMAX',
      seatLayout: generateDefaultLayout(6, 8),
    });

    const startTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow
    const endTime = new Date(startTime.getTime() + 180 * 60 * 1000);

    testShowtime = await Showtime.create({
      movieId: movie._id,
      theatreId: theatre._id,
      screenId: screen._id,
      startTime,
      endTime,
      pricing: { Regular: 12.0, Premium: 16.0, VIP: 22.0 },
      bookedSeats: [],
    });
  });

  test('POST /api/showtimes/:id/holds should create a temporary seat hold', async () => {
    const res = await request(app)
      .post(`/api/showtimes/${testShowtime._id}/holds`)
      .set('Authorization', `Bearer ${customer1Token}`)
      .send({
        seats: ['A1', 'A2'],
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.holdToken).toBeDefined();
    expect(res.body.seats).toEqual(['A1', 'A2']);
  });

  test('POST /api/showtimes/:id/holds should reject holding seats held by another user', async () => {
    // Customer 1 holds A1
    const holdRes = await request(app)
      .post(`/api/showtimes/${testShowtime._id}/holds`)
      .set('Authorization', `Bearer ${customer1Token}`)
      .send({ seats: ['A1'] });

    expect(holdRes.statusCode).toBe(200);

    // Customer 2 attempts to hold A1
    const conflictRes = await request(app)
      .post(`/api/showtimes/${testShowtime._id}/holds`)
      .set('Authorization', `Bearer ${customer2Token}`)
      .send({ seats: ['A1', 'A2'] });

    expect(conflictRes.statusCode).toBe(409);
    expect(conflictRes.body.success).toBe(false);
    expect(conflictRes.body.conflictedSeats).toContain('A1');
  });

  test('POST /api/bookings should book seats and prevent duplicate bookings', async () => {
    // 1. Customer 1 books A1 and A2
    const bookingRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customer1Token}`)
      .send({
        showtimeId: testShowtime._id,
        seats: [{ seatId: 'A1', category: 'VIP', price: 22.0 }],
      });

    expect(bookingRes.statusCode).toBe(201);
    expect(bookingRes.body.success).toBe(true);
    expect(bookingRes.body.data.bookingReference).toBeDefined();

    // 2. Customer 2 attempts to book the same seat A1
    const duplicateBookingRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customer2Token}`)
      .send({
        showtimeId: testShowtime._id,
        seats: [{ seatId: 'A1', category: 'VIP', price: 22.0 }],
      });

    expect(duplicateBookingRes.statusCode).toBe(409);
    expect(duplicateBookingRes.body.success).toBe(false);
  });

  test('PATCH /api/bookings/:id/cancel should cancel booking and release seats', async () => {
    // Customer 1 books seat B1
    const bookingRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customer1Token}`)
      .send({
        showtimeId: testShowtime._id,
        seats: [{ seatId: 'B1', category: 'VIP', price: 22.0 }],
      });

    const bookingId = bookingRes.body.data._id;

    // Customer cancels booking
    const cancelRes = await request(app)
      .patch(`/api/bookings/${bookingId}/cancel`)
      .set('Authorization', `Bearer ${customer1Token}`)
      .send({ reason: 'Schedule conflict' });

    expect(cancelRes.statusCode).toBe(200);
    expect(cancelRes.body.success).toBe(true);
    expect(cancelRes.body.data.bookingStatus).toBe('cancelled');

    // Verify seat B1 is now freed and can be booked by Customer 2
    const rebookRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customer2Token}`)
      .send({
        showtimeId: testShowtime._id,
        seats: [{ seatId: 'B1', category: 'VIP', price: 22.0 }],
      });

    expect(rebookRes.statusCode).toBe(201);
    expect(rebookRes.body.success).toBe(true);
  });
});
