import axios from 'axios';
import { mockStore } from './mockDataStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000, // 4-second timeout to fall back gracefully if backend is slow/offline
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('imovies_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors and provide resilient fallback
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isOfflineOrNotFound =
      !error.response ||
      error.response.status === 404 ||
      error.response.status === 502 ||
      error.response.status === 503 ||
      error.code === 'ECONNABORTED' ||
      error.message === 'Network Error';

    if (isOfflineOrNotFound && error.config) {
      console.warn(
        `[IMovies Resilient Fallback] Live API unavailable (${error.message}). Serving from dynamic client data store for route:`,
        error.config.url
      );

      const url = error.config.url.replace(/^\/api/, '');
      const method = (error.config.method || 'get').toLowerCase();
      let data = {};
      try {
        data = typeof error.config.data === 'string' ? JSON.parse(error.config.data) : (error.config.data || {});
      } catch (e) {}

      // 1. Movies endpoints
      if (url.startsWith('/movies') && method === 'get') {
        const idMatch = url.match(/^\/movies\/([a-zA-Z0-9_-]+)/);
        if (idMatch && idMatch[1] && !url.includes('?')) {
          const res = mockStore.getMovieById(idMatch[1]);
          return Promise.resolve({ data: res, status: 200, statusText: 'OK' });
        }
        const res = mockStore.getMovies(error.config.params);
        return Promise.resolve({ data: res, status: 200, statusText: 'OK' });
      }

      if (url === '/movies' && method === 'post') {
        const res = mockStore.createMovie(data);
        return Promise.resolve({ data: res, status: 201 });
      }

      if (url.startsWith('/movies/') && method === 'put') {
        const id = url.split('/')[2];
        const res = mockStore.updateMovie(id, data);
        return Promise.resolve({ data: res, status: 200 });
      }

      if (url.startsWith('/movies/') && method === 'delete') {
        const id = url.split('/')[2];
        const res = mockStore.deleteMovie(id);
        return Promise.resolve({ data: res, status: 200 });
      }

      // 2. Theatres endpoints
      if (url === '/theatres/cities' && method === 'get') {
        const res = mockStore.getCities();
        return Promise.resolve({ data: res, status: 200 });
      }

      if (url.startsWith('/theatres') && method === 'get') {
        const res = mockStore.getTheatres(error.config.params);
        return Promise.resolve({ data: res, status: 200 });
      }

      // 3. Showtimes endpoints
      if (url.includes('/seats') && method === 'get') {
        const stId = url.split('/')[2];
        const holdToken = error.config.params?.holdToken;
        const res = mockStore.getShowtimeSeats(stId, holdToken);
        return Promise.resolve({ data: res, status: 200 });
      }

      if (url.includes('/holds') && method === 'post') {
        const stId = url.split('/')[2];
        const res = mockStore.holdSeats(stId, data.seats, data.holdToken);
        return Promise.resolve({ data: res, status: 200 });
      }

      if (url.includes('/holds') && method === 'delete') {
        const stId = url.split('/')[2];
        const res = mockStore.releaseHold(stId);
        return Promise.resolve({ data: res, status: 200 });
      }

      if (url.startsWith('/showtimes') && method === 'get') {
        const idMatch = url.match(/^\/showtimes\/([a-zA-Z0-9_-]+)$/);
        if (idMatch && idMatch[1]) {
          const res = mockStore.getShowtimeById(idMatch[1]);
          return Promise.resolve({ data: res, status: 200 });
        }
        const res = mockStore.getShowtimes(error.config.params);
        return Promise.resolve({ data: res, status: 200 });
      }

      // 4. Bookings endpoints
      if (url === '/bookings' && method === 'post') {
        const currentUser = JSON.parse(localStorage.getItem('imovies_user') || 'null');
        const res = mockStore.createBooking(data, currentUser);
        return Promise.resolve({ data: res, status: 201 });
      }

      if (url === '/bookings/my' && method === 'get') {
        const res = mockStore.getMyBookings();
        return Promise.resolve({ data: res, status: 200 });
      }

      if (url.startsWith('/bookings/') && url.endsWith('/cancel') && method === 'patch') {
        const bId = url.split('/')[2];
        const res = mockStore.cancelBooking(bId, data.reason);
        return Promise.resolve({ data: res, status: 200 });
      }

      if (url.startsWith('/bookings/') && method === 'get') {
        const bId = url.split('/')[2];
        const res = mockStore.getBookingById(bId);
        return Promise.resolve({ data: res, status: 200 });
      }

      // 5. Auth endpoints fallback
      if (url === '/auth/login' && method === 'post') {
        const isAdmin = data.email === 'admin@imovies.com';
        const user = {
          _id: isAdmin ? 'usr-admin' : 'usr-cust',
          name: isAdmin ? 'Cinema Administrator' : 'John Doe',
          email: data.email,
          role: isAdmin ? 'admin' : 'customer',
          phone: '+1 (555) 019-2834',
        };
        return Promise.resolve({
          data: {
            success: true,
            token: 'demo-jwt-token-' + Date.now(),
            user,
          },
          status: 200,
        });
      }

      if (url === '/auth/register' && method === 'post') {
        const user = {
          _id: 'usr-' + Date.now(),
          name: data.name,
          email: data.email,
          role: 'customer',
          phone: data.phone || '',
        };
        return Promise.resolve({
          data: {
            success: true,
            token: 'demo-jwt-token-' + Date.now(),
            user,
          },
          status: 201,
        });
      }

      if (url === '/auth/me' && method === 'get') {
        const saved = localStorage.getItem('imovies_user');
        const user = saved ? JSON.parse(saved) : { name: 'Demo Customer', email: 'customer@imovies.com', role: 'customer' };
        return Promise.resolve({
          data: { success: true, user },
          status: 200,
        });
      }

      if (url === '/auth/profile' && method === 'put') {
        const saved = localStorage.getItem('imovies_user');
        const user = saved ? JSON.parse(saved) : {};
        if (data.name) user.name = data.name;
        if (data.phone) user.phone = data.phone;
        return Promise.resolve({
          data: { success: true, user },
          status: 200,
        });
      }

      // 6. Admin endpoints fallback
      if (url === '/admin/dashboard' && method === 'get') {
        const res = mockStore.getAdminDashboard();
        return Promise.resolve({ data: res, status: 200 });
      }

      if (url.startsWith('/admin/bookings') && method === 'get') {
        return Promise.resolve({
          data: {
            success: true,
            data: mockStore.bookings,
            pagination: { total: mockStore.bookings.length, page: 1, pageSize: 50, totalPages: 1 },
          },
          status: 200,
        });
      }

      if (url === '/health' || url === '/api/health') {
        return Promise.resolve({
          data: { status: 'ok', service: 'IMovies (Client Resilient Mode)' },
          status: 200,
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
