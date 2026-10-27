const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { connectDB, disconnectDB } = require('../config/db');

dotenv.config();

const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Screen = require('../models/Screen');
const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');
const SeatHold = require('../models/SeatHold');

const { usersData, moviesData, theatresData } = require('./seedData');
const { generateDefaultLayout } = require('../controllers/screenController');
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../config/constants');

const seedDatabase = async () => {
  try {
    console.log('[Seeder] Starting database seed process...');
    await connectDB();

    // 1. Clear existing collections
    console.log('[Seeder] Clearing old collections...');
    await Promise.all([
      User.deleteMany(),
      Movie.deleteMany(),
      Theatre.deleteMany(),
      Screen.deleteMany(),
      Showtime.deleteMany(),
      Booking.deleteMany(),
      SeatHold.deleteMany(),
    ]);

    // 2. Seed Users
    console.log('[Seeder] Seeding users...');
    const hashedUsers = await Promise.all(
      usersData.map(async (u) => {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(u.password, salt);
        return {
          name: u.name,
          email: u.email.toLowerCase(),
          passwordHash,
          role: u.role,
          phone: u.phone,
        };
      })
    );
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`[Seeder] Seeded ${createdUsers.length} users`);

    // 3. Seed Movies
    console.log('[Seeder] Seeding movies...');
    const createdMovies = await Movie.insertMany(moviesData);
    console.log(`[Seeder] Seeded ${createdMovies.length} movies`);

    // 4. Seed Theatres & Screens
    console.log('[Seeder] Seeding theatres & screens...');
    const createdTheatres = await Theatre.insertMany(theatresData);

    const screenDefinitions = [
      { name: 'Screen 1 – IMAX Experience', screenType: 'IMAX', rowCount: 9, seatsPerRow: 14 },
      { name: 'Screen 2 – Dolby Cinema', screenType: 'Dolby Cinema', rowCount: 8, seatsPerRow: 12 },
      { name: 'Screen 3 – Standard Digital', screenType: 'Standard', rowCount: 7, seatsPerRow: 10 },
    ];

    const allScreens = [];
    for (const theatre of createdTheatres) {
      for (const def of screenDefinitions) {
        const layout = generateDefaultLayout(def.rowCount, def.seatsPerRow);
        const screen = await Screen.create({
          theatreId: theatre._id,
          name: def.name,
          screenType: def.screenType,
          seatLayout: layout,
        });
        allScreens.push(screen);
      }
    }
    console.log(`[Seeder] Seeded ${createdTheatres.length} theatres with ${allScreens.length} screens`);

    // 5. Seed Showtimes
    console.log('[Seeder] Generating showtimes for current and upcoming days...');
    const showtimesToInsert = [];
    const nowShowingMovies = createdMovies.filter((m) => m.status === 'now_showing');

    // Slot times throughout the day
    const timeSlots = [
      { hour: 10, minute: 30 },
      { hour: 14, minute: 0 },
      { hour: 17, minute: 30 },
      { hour: 20, minute: 45 },
    ];

    // Generate across 4 days (today + next 3 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let dayOffset = 0; dayOffset <= 3; dayOffset++) {
      const showDate = new Date(today);
      showDate.setDate(showDate.getDate() + dayOffset);

      allScreens.forEach((screen, screenIdx) => {
        timeSlots.forEach((slot, slotIdx) => {
          // Select movie cyclically
          const movie = nowShowingMovies[(screenIdx + slotIdx + dayOffset) % nowShowingMovies.length];
          const startTime = new Date(showDate);
          startTime.setHours(slot.hour, slot.minute, 0, 0);

          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + (movie.duration || 120) + 20); // movie duration + 20m cleanup

          // Pricing variance based on screen type
          let pricing = { Regular: 12.0, Premium: 16.0, VIP: 22.0 };
          if (screen.screenType === 'IMAX') {
            pricing = { Regular: 17.0, Premium: 22.0, VIP: 29.0 };
          } else if (screen.screenType === 'Dolby Cinema') {
            pricing = { Regular: 15.0, Premium: 19.0, VIP: 25.0 };
          }

          showtimesToInsert.push({
            movieId: movie._id,
            theatreId: screen.theatreId,
            screenId: screen._id,
            startTime,
            endTime,
            pricing,
            bookedSeats: [],
            status: 'scheduled',
          });
        });
      });
    }

    const createdShowtimes = await Showtime.insertMany(showtimesToInsert);
    console.log(`[Seeder] Seeded ${createdShowtimes.length} showtimes`);

    // 6. Seed sample confirmed booking for demo user John Doe
    console.log('[Seeder] Adding sample booking for customer demo experience...');
    const customer = createdUsers.find((u) => u.email === 'john@example.com');
    if (customer && createdShowtimes.length > 0) {
      const sampleShowtime = createdShowtimes[0];
      const sampleSeats = [
        { seatId: 'B5', category: 'VIP', price: sampleShowtime.pricing.VIP },
        { seatId: 'B6', category: 'VIP', price: sampleShowtime.pricing.VIP },
      ];

      sampleShowtime.bookedSeats = ['B5', 'B6'];
      await sampleShowtime.save();

      const subtotal = sampleSeats.reduce((s, c) => s + c.price, 0);
      const convenienceFee = 3.0;
      const tax = parseFloat((subtotal * 0.08).toFixed(2));
      const totalAmount = subtotal + convenienceFee + tax;

      await Booking.create({
        bookingReference: 'IMV-DEMO88',
        userId: customer._id,
        showtimeId: sampleShowtime._id,
        seats: sampleSeats,
        ticketQuantity: 2,
        subtotal,
        convenienceFee,
        tax,
        totalAmount,
        paymentStatus: PAYMENT_STATUS.PAID,
        bookingStatus: BOOKING_STATUS.CONFIRMED,
        paymentDetails: {
          method: 'Demo Visa Card',
          transactionId: 'TXN-SEED9921',
          cardLast4: '4242',
        },
      });
      console.log('[Seeder] Seeded sample booking reference: IMV-DEMO88');
    }

    console.log('[Seeder] Seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('[Seeder] Seeding error:', error);
    throw error;
  }
};

// If run directly from CLI
if (require.main === module) {
  seedDatabase()
    .then(async () => {
      console.log('[Seeder] Done! Exiting.');
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('[Seeder] Failed:', err);
      await disconnectDB();
      process.exit(1);
    });
}

module.exports = { seedDatabase };
