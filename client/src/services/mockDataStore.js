// Client-side resilient data store for live deployments (e.g. Vercel, Netlify, offline)
// Spans showtimes across 60 days (2 months) into the future from current local date.

const INITIAL_MOVIES = [
  {
    _id: 'mov-1',
    title: 'Dune: Part Two',
    description:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    posterUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    language: 'English',
    duration: 166,
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem', 'Austin Butler'],
    director: 'Denis Villeneuve',
    releaseDate: '2024-03-01',
    certification: 'PG-13',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    rating: 8.6,
    votesCount: 420000,
    status: 'now_showing',
  },
  {
    _id: 'mov-2',
    title: 'Oppenheimer',
    description:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, examining the moral, political, and personal consequences of scientific discovery.',
    posterUrl:
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    genre: ['Biography', 'Drama', 'History'],
    language: 'English',
    duration: 180,
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.', 'Florence Pugh'],
    director: 'Christopher Nolan',
    releaseDate: '2023-07-21',
    certification: 'R',
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    rating: 8.9,
    votesCount: 650000,
    status: 'now_showing',
  },
  {
    _id: 'mov-3',
    title: 'Interstellar',
    description:
      'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    posterUrl:
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1600&q=80',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    duration: 169,
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    director: 'Christopher Nolan',
    releaseDate: '2014-11-07',
    certification: 'PG-13',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    rating: 8.7,
    votesCount: 1950000,
    status: 'now_showing',
  },
  {
    _id: 'mov-4',
    title: 'Spider-Man: Across the Spider-Verse',
    description:
      'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    posterUrl:
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1600&q=80',
    genre: ['Animation', 'Action', 'Adventure'],
    language: 'English',
    duration: 140,
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya'],
    director: 'Joaquim Dos Santos, Kemp Powers',
    releaseDate: '2023-06-02',
    certification: 'PG',
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    rating: 8.7,
    votesCount: 360000,
    status: 'now_showing',
  },
  {
    _id: 'mov-5',
    title: 'The Dark Knight',
    description:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    posterUrl:
      'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=600&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'English',
    duration: 152,
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine', 'Gary Oldman'],
    director: 'Christopher Nolan',
    releaseDate: '2008-07-18',
    certification: 'PG-13',
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    rating: 9.0,
    votesCount: 2800000,
    status: 'now_showing',
  },
  {
    _id: 'mov-6',
    title: 'Inception',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    posterUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    genre: ['Action', 'Sci-Fi', 'Adventure'],
    language: 'English',
    duration: 148,
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy', 'Ken Watanabe'],
    director: 'Christopher Nolan',
    releaseDate: '2010-07-16',
    certification: 'PG-13',
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    rating: 8.8,
    votesCount: 2500000,
    status: 'now_showing',
  },
  {
    _id: 'mov-7',
    title: 'Gladiator II',
    description:
      'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
    posterUrl:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80',
    genre: ['Action', 'Adventure', 'Drama'],
    language: 'English',
    duration: 148,
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
    director: 'Ridley Scott',
    releaseDate: '2024-11-22',
    certification: 'R',
    trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
    rating: 8.2,
    votesCount: 85000,
    status: 'upcoming',
  },
  {
    _id: 'mov-8',
    title: 'Avatar: The Way of Water',
    description:
      'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    posterUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    language: 'English',
    duration: 192,
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang'],
    director: 'James Cameron',
    releaseDate: '2022-12-16',
    certification: 'PG-13',
    trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
    rating: 7.6,
    votesCount: 460000,
    status: 'now_showing',
  },
  {
    _id: 'mov-9',
    title: 'Deadpool & Wolverine',
    description:
      'Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool. They team up to defeat a common enemy in an irreverent, dimension-hopping superhero adventure.',
    posterUrl:
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    genre: ['Action', 'Comedy', 'Sci-Fi'],
    language: 'English',
    duration: 128,
    cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Matthew Macfadyen'],
    director: 'Shawn Levy',
    releaseDate: '2024-07-26',
    certification: 'R',
    trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
    rating: 8.0,
    votesCount: 290000,
    status: 'now_showing',
  },
];

const INITIAL_THEATRES = [
  {
    _id: 'th-1',
    name: 'IMovies Grand Cinema – Times Square',
    address: '234 W 42nd St',
    city: 'New York',
    state: 'NY',
    zipCode: '10036',
    facilities: ['IMAX Laser', 'Dolby Atmos', 'Recliner Loungers', 'Gourmet Bar'],
  },
  {
    _id: 'th-2',
    name: 'IMovies Star Pavilion – Hollywood',
    address: '6925 Hollywood Blvd',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90028',
    facilities: ['Dolby Cinema', 'IMAX', 'Valet Parking', 'VIP Dine-In'],
  },
  {
    _id: 'th-3',
    name: 'IMovies Millennium – River East',
    address: '322 E Illinois St',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60611',
    facilities: ['RealD 3D', 'Dolby Atmos', 'Arcade & Lounge', 'Heated Recliners'],
  },
  {
    _id: 'th-4',
    name: 'IMovies Metreon – Downtown',
    address: '135 4th St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    facilities: ['IMAX 70mm', 'Dolby Vision', 'Organic Cafe'],
  },
];

const createStandardSeatLayout = (rowsCount = 8, seatsPerRow = 12) => {
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
  const rows = [];
  for (let r = 0; r < rowsCount; r++) {
    const rowName = rowLetters[r] || `R${r + 1}`;
    let category = 'Regular';
    if (r < 2) category = 'VIP';
    else if (r < 5) category = 'Premium';

    const seats = [];
    for (let s = 1; s <= seatsPerRow; s++) {
      seats.push({
        seatId: `${rowName}${s}`,
        seatNumber: s,
        category,
        isActive: true,
      });
    }
    rows.push({ rowName, category, seats });
  }
  return { rows };
};

const INITIAL_SCREENS = [
  { _id: 'sc-1', theatreId: 'th-1', name: 'Screen 1 – IMAX Experience', screenType: 'IMAX', totalCapacity: 126, seatLayout: createStandardSeatLayout(9, 14) },
  { _id: 'sc-2', theatreId: 'th-1', name: 'Screen 2 – Dolby Cinema', screenType: 'Dolby Cinema', totalCapacity: 96, seatLayout: createStandardSeatLayout(8, 12) },
  { _id: 'sc-3', theatreId: 'th-2', name: 'Screen 1 – IMAX Experience', screenType: 'IMAX', totalCapacity: 126, seatLayout: createStandardSeatLayout(9, 14) },
  { _id: 'sc-4', theatreId: 'th-2', name: 'Screen 2 – Dolby Cinema', screenType: 'Dolby Cinema', totalCapacity: 96, seatLayout: createStandardSeatLayout(8, 12) },
  { _id: 'sc-5', theatreId: 'th-3', name: 'Screen 1 – IMAX Experience', screenType: 'IMAX', totalCapacity: 126, seatLayout: createStandardSeatLayout(9, 14) },
  { _id: 'sc-6', theatreId: 'th-4', name: 'Screen 1 – IMAX 70mm', screenType: 'IMAX', totalCapacity: 126, seatLayout: createStandardSeatLayout(9, 14) },
];

// Dynamically generate showtimes for the next 60 days (2 full months)
export const generate60DaysShowtimes = (movies, theatres, screens) => {
  const showtimes = [];
  const nowShowing = movies.filter((m) => m.status === 'now_showing');
  if (nowShowing.length === 0) return [];

  const timeSlots = [
    { hour: 10, minute: 30 },
    { hour: 14, minute: 0 },
    { hour: 17, minute: 30 },
    { hour: 20, minute: 45 },
  ];

  const baseToday = new Date();
  baseToday.setHours(0, 0, 0, 0);

  // Generate for 60 consecutive days
  for (let dayOffset = 0; dayOffset < 60; dayOffset++) {
    const showDate = new Date(baseToday);
    showDate.setDate(showDate.getDate() + dayOffset);

    screens.forEach((screen, screenIdx) => {
      timeSlots.forEach((slot, slotIdx) => {
        const movie = nowShowing[(screenIdx + slotIdx + dayOffset) % nowShowing.length];
        const theatre = theatres.find((t) => t._id === screen.theatreId);

        const startTime = new Date(showDate);
        startTime.setHours(slot.hour, slot.minute, 0, 0);

        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + (movie.duration || 120) + 20);

        let pricing = { Regular: 12.0, Premium: 16.0, VIP: 22.0 };
        if (screen.screenType === 'IMAX') {
          pricing = { Regular: 17.0, Premium: 22.0, VIP: 29.0 };
        } else if (screen.screenType === 'Dolby Cinema') {
          pricing = { Regular: 15.0, Premium: 19.0, VIP: 25.0 };
        }

        showtimes.push({
          _id: `st-${dayOffset}-${screen._id}-${slotIdx}`,
          movieId: movie,
          theatreId: theatre,
          screenId: screen,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          pricing,
          bookedSeats: dayOffset === 0 && slotIdx === 0 ? ['B5', 'B6'] : [],
          status: 'scheduled',
        });
      });
    });
  }

  return showtimes;
};

// Data Store State with localStorage persistence
class MockDataStore {
  constructor() {
    this.init();
  }

  init() {
    // Movies
    const savedMovies = localStorage.getItem('imv_mock_movies');
    this.movies = savedMovies ? JSON.parse(savedMovies) : INITIAL_MOVIES;

    // Theatres & Screens
    this.theatres = INITIAL_THEATRES.map((t) => ({
      ...t,
      screens: INITIAL_SCREENS.filter((s) => s.theatreId === t._id),
    }));
    this.screens = INITIAL_SCREENS;

    // Dynamic 60 days showtimes
    this.showtimes = generate60DaysShowtimes(this.movies, this.theatres, this.screens);

    // Bookings
    const savedBookings = localStorage.getItem('imv_mock_bookings');
    this.bookings = savedBookings ? JSON.parse(savedBookings) : [];

    // Holds
    this.holds = new Map();
  }

  saveMovies() {
    localStorage.setItem('imv_mock_movies', JSON.stringify(this.movies));
  }

  saveBookings() {
    localStorage.setItem('imv_mock_bookings', JSON.stringify(this.bookings));
  }

  // API Handlers
  getMovies(query = {}) {
    const { search, genre, language, status, sort = '-releaseDate' } = query;
    let list = [...this.movies];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.director && m.director.toLowerCase().includes(q)) ||
          (m.cast && m.cast.some((c) => c.toLowerCase().includes(q)))
      );
    }

    if (genre && genre !== 'All') {
      list = list.filter((m) =>
        (m.genre || []).some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }

    if (language && language !== 'All') {
      list = list.filter(
        (m) => m.language && m.language.toLowerCase() === language.toLowerCase()
      );
    }

    if (status && status !== 'all') {
      list = list.filter((m) => m.status === status);
    }

    if (sort === '-rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'duration') {
      list.sort((a, b) => a.duration - b.duration);
    } else {
      list.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    }

    return {
      success: true,
      data: list,
      pagination: {
        total: list.length,
        page: 1,
        pageSize: 50,
        totalPages: 1,
      },
    };
  }

  getMovieById(id) {
    const movie = this.movies.find((m) => m._id === id);
    if (!movie) return { success: false, message: 'Movie not found' };

    const movieShowtimes = this.showtimes.filter(
      (st) => st.movieId?._id === movie._id || st.movieId === movie._id
    );

    return {
      success: true,
      data: movie,
      showtimes: movieShowtimes,
    };
  }

  getTheatres(query = {}) {
    let list = [...this.theatres];
    if (query.city && query.city !== 'All') {
      list = list.filter((t) => t.city.toLowerCase() === query.city.toLowerCase());
    }
    return { success: true, data: list };
  }

  getCities() {
    const set = new Set(this.theatres.map((t) => t.city));
    return { success: true, data: Array.from(set).sort() };
  }

  getShowtimes(query = {}) {
    const { movieId, theatreId, city, date } = query;
    let list = [...this.showtimes];

    if (movieId) {
      list = list.filter((st) => (st.movieId?._id || st.movieId) === movieId);
    }
    if (theatreId) {
      list = list.filter((st) => (st.theatreId?._id || st.theatreId) === theatreId);
    }
    if (city && city !== 'All') {
      list = list.filter(
        (st) => st.theatreId?.city?.toLowerCase() === city.toLowerCase()
      );
    }
    if (date) {
      list = list.filter((st) => st.startTime.startsWith(date));
    }

    return { success: true, count: list.length, data: list };
  }

  getShowtimeById(id) {
    const st = this.showtimes.find((s) => s._id === id);
    if (!st) return { success: false, message: 'Showtime not found' };
    return { success: true, data: st };
  }

  getShowtimeSeats(id, holdToken) {
    const st = this.showtimes.find((s) => s._id === id);
    if (!st) return { success: false, message: 'Showtime not found' };

    const screen = st.screenId;
    const bookedSet = new Set(st.bookedSeats || []);
    const layout = JSON.parse(JSON.stringify(screen.seatLayout || createStandardSeatLayout()));

    layout.rows = layout.rows.map((row) => {
      row.seats = row.seats.map((seat) => {
        let status = 'available';
        if (bookedSet.has(seat.seatId)) {
          status = 'booked';
        } else if (this.holds.has(id)) {
          const hold = this.holds.get(id);
          if (hold.seats.includes(seat.seatId)) {
            status = hold.holdToken === holdToken ? 'selected' : 'held';
          }
        }
        return {
          ...seat,
          status,
          price: st.pricing?.[seat.category] || 12.0,
        };
      });
      return row;
    });

    return {
      success: true,
      showtimeId: st._id,
      pricing: st.pricing,
      layout,
      totalBooked: bookedSet.size,
    };
  }

  holdSeats(id, seats, holdToken) {
    const token = holdToken || 'hold-' + Math.random().toString(36).substring(2, 9);
    const expiresAt = new Date(Date.now() + 8 * 60 * 1000).toISOString();
    this.holds.set(id, { seats, holdToken: token, expiresAt });
    return {
      success: true,
      message: 'Seats held successfully',
      holdToken: token,
      seats,
      expiresAt,
      durationSeconds: 480,
    };
  }

  releaseHold(id) {
    this.holds.delete(id);
    return { success: true, message: 'Seats released' };
  }

  createBooking(body, currentUser) {
    const { showtimeId, seats, paymentMethod = 'Demo Card', cardLast4 = '4242' } = body;
    const st = this.showtimes.find((s) => s._id === showtimeId);
    if (!st) return { success: false, message: 'Showtime not found' };

    const seatIds = seats.map((s) => (typeof s === 'string' ? s : s.seatId));
    st.bookedSeats = [...(st.bookedSeats || []), ...seatIds];

    const enrichedSeats = seats.map((item) => {
      const sId = typeof item === 'string' ? item : item.seatId;
      const cat = typeof item === 'object' ? item.category : 'Regular';
      const price = (st.pricing && st.pricing[cat]) || 12.0;
      return { seatId: sId, category: cat, price };
    });

    const subtotal = enrichedSeats.reduce((sum, s) => sum + s.price, 0);
    const fee = parseFloat((enrichedSeats.length * 1.5).toFixed(2));
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const total = parseFloat((subtotal + fee + tax).toFixed(2));

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let ref = 'IMV-';
    for (let i = 0; i < 7; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));

    const newBooking = {
      _id: 'bk-' + Date.now(),
      bookingReference: ref,
      userId: currentUser || { name: 'Demo Customer', email: 'customer@imovies.com' },
      showtimeId: st,
      seats: enrichedSeats,
      ticketQuantity: enrichedSeats.length,
      subtotal,
      convenienceFee: fee,
      tax,
      totalAmount: total,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      paymentDetails: {
        method: paymentMethod,
        transactionId: 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        cardLast4,
      },
      createdAt: new Date().toISOString(),
    };

    this.bookings.unshift(newBooking);
    this.saveBookings();
    this.holds.delete(showtimeId);

    return { success: true, message: 'Tickets booked successfully!', data: newBooking };
  }

  getMyBookings() {
    const now = new Date();
    const upcoming = [];
    const past = [];

    this.bookings.forEach((b) => {
      const start = b.showtimeId?.startTime ? new Date(b.showtimeId.startTime) : null;
      if (start && start >= now && b.bookingStatus === 'confirmed') {
        upcoming.push(b);
      } else {
        past.push(b);
      }
    });

    return {
      success: true,
      total: this.bookings.length,
      upcoming,
      past,
      all: this.bookings,
    };
  }

  getBookingById(id) {
    const b = this.bookings.find((item) => item._id === id || item.bookingReference === id);
    if (!b) return { success: false, message: 'Booking not found' };
    return { success: true, data: b };
  }

  cancelBooking(id, reason) {
    const b = this.bookings.find((item) => item._id === id);
    if (!b) return { success: false, message: 'Booking not found' };

    b.bookingStatus = 'cancelled';
    b.paymentStatus = 'refunded';
    b.cancellationReason = reason || 'Customer requested';
    b.cancelledAt = new Date().toISOString();

    if (b.showtimeId && b.showtimeId.bookedSeats) {
      const cancelSeats = b.seats.map((s) => s.seatId);
      b.showtimeId.bookedSeats = b.showtimeId.bookedSeats.filter(
        (s) => !cancelSeats.includes(s)
      );
    }

    this.saveBookings();
    return { success: true, message: 'Booking cancelled successfully', data: b };
  }

  getAdminDashboard() {
    const totalRev = this.bookings
      .filter((b) => b.bookingStatus === 'confirmed')
      .reduce((s, b) => s + b.totalAmount, 0);

    return {
      success: true,
      stats: {
        totalUsers: 3,
        totalMovies: this.movies.length,
        totalTheatres: this.theatres.length,
        totalShowtimes: this.showtimes.length,
        totalBookings: this.bookings.length,
        totalRevenue: parseFloat(totalRev.toFixed(2)),
        confirmedBookings: this.bookings.filter((b) => b.bookingStatus === 'confirmed').length,
        cancelledBookings: this.bookings.filter((b) => b.bookingStatus === 'cancelled').length,
      },
      recentBookings: this.bookings.slice(0, 8),
    };
  }

  createMovie(body) {
    const newMovie = {
      _id: 'mov-' + Date.now(),
      ...body,
      releaseDate: body.releaseDate || new Date().toISOString(),
    };
    this.movies.unshift(newMovie);
    this.saveMovies();
    return { success: true, message: 'Movie created successfully', data: newMovie };
  }

  updateMovie(id, body) {
    const idx = this.movies.findIndex((m) => m._id === id);
    if (idx === -1) return { success: false, message: 'Movie not found' };
    this.movies[idx] = { ...this.movies[idx], ...body };
    this.saveMovies();
    return { success: true, message: 'Movie updated successfully', data: this.movies[idx] };
  }

  deleteMovie(id) {
    this.movies = this.movies.filter((m) => m._id !== id);
    this.saveMovies();
    return { success: true, message: 'Movie deleted successfully' };
  }
}

export const mockStore = new MockDataStore();
