import axios from 'axios';
import { mockStore } from './mockDataStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Helper function to handle routing through mockStore
const handleMockFallback = (config) => {
  if (!config) return Promise.reject(new Error('No config provided'));

  let cleanUrl = config.url || '';
  if (cleanUrl.startsWith(config.baseURL || '')) {
    cleanUrl = cleanUrl.slice((config.baseURL || '').length);
  }
  cleanUrl = cleanUrl.replace(/^\/api/, '');

  // Extract query string if any
  const [pathname, queryString] = cleanUrl.split('?');
  const queryParams = { ...(config.params || {}) };

  if (queryString) {
    const searchParams = new URLSearchParams(queryString);
    for (const [k, v] of searchParams.entries()) {
      queryParams[k] = v;
    }
  }

  const method = (config.method || 'get').toLowerCase();
  let data = {};
  try {
    data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {};
  } catch (e) {}

  console.warn(`[IMovies Fallback Store] Handling ${method.toUpperCase()} ${cleanUrl} via dynamic store`);

  // 1. Movies endpoints
  if (pathname.startsWith('/movies') && method === 'get') {
    const idMatch = pathname.match(/^\/movies\/([a-zA-Z0-9_-]+)$/);
    if (idMatch && idMatch[1]) {
      const res = mockStore.getMovieById(idMatch[1]);
      return Promise.resolve({ data: res, status: 200, statusText: 'OK' });
    }
    const res = mockStore.getMovies(queryParams);
    return Promise.resolve({ data: res, status: 200, statusText: 'OK' });
  }

  if (pathname === '/movies' && method === 'post') {
    const res = mockStore.createMovie(data);
    return Promise.resolve({ data: res, status: 201 });
  }

  if (pathname.startsWith('/movies/') && method === 'put') {
    const id = pathname.split('/')[2];
    const res = mockStore.updateMovie(id, data);
    return Promise.resolve({ data: res, status: 200 });
  }

  if (pathname.startsWith('/movies/') && method === 'delete') {
    const id = pathname.split('/')[2];
    const res = mockStore.deleteMovie(id);
    return Promise.resolve({ data: res, status: 200 });
  }

  // 2. Theatres endpoints
  if (pathname === '/theatres/cities' && method === 'get') {
    const res = mockStore.getCities();
    return Promise.resolve({ data: res, status: 200 });
  }

  if (pathname.startsWith('/theatres') && method === 'get') {
    const res = mockStore.getTheatres(queryParams);
    return Promise.resolve({ data: res, status: 200 });
  }

  // 3. Showtimes endpoints
  if (pathname.includes('/seats') && method === 'get') {
    const stId = pathname.split('/')[2];
    const holdToken = queryParams.holdToken;
    const res = mockStore.getShowtimeSeats(stId, holdToken);
    return Promise.resolve({ data: res, status: 200 });
  }

  if (pathname.includes('/holds') && method === 'post') {
    const stId = pathname.split('/')[2];
    const res = mockStore.holdSeats(stId, data.seats, data.holdToken);
    return Promise.resolve({ data: res, status: 200 });
  }

  if (pathname.includes('/holds') && method === 'delete') {
    const stId = pathname.split('/')[2];
    const res = mockStore.releaseHold(stId);
    return Promise.resolve({ data: res, status: 200 });
  }

  if (pathname.startsWith('/showtimes') && method === 'get') {
    const idMatch = pathname.match(/^\/showtimes\/([a-zA-Z0-9_-]+)$/);
    if (idMatch && idMatch[1]) {
      const res = mockStore.getShowtimeById(idMatch[1]);
      return Promise.resolve({ data: res, status: 200 });
    }
    const res = mockStore.getShowtimes(queryParams);
    return Promise.resolve({ data: res, status: 200 });
  }

  // 4. Bookings endpoints
  if (pathname === '/bookings' && method === 'post') {
    const currentUser = JSON.parse(localStorage.getItem('imovies_user') || 'null');
    const res = mockStore.createBooking(data, currentUser);
    return Promise.resolve({ data: res, status: 201 });
  }

  if (pathname === '/bookings/my' && method === 'get') {
    const res = mockStore.getMyBookings();
    return Promise.resolve({ data: res, status: 200 });
  }

  if (pathname.startsWith('/bookings/') && pathname.endsWith('/cancel') && method === 'patch') {
    const bId = pathname.split('/')[2];
    const res = mockStore.cancelBooking(bId, data.reason);
    return Promise.resolve({ data: res, status: 200 });
  }

  if (pathname.startsWith('/bookings/') && method === 'get') {
    const bId = pathname.split('/')[2];
    const res = mockStore.getBookingById(bId);
    return Promise.resolve({ data: res, status: 200 });
  }

  // 5. Auth endpoints fallback
  if (pathname === '/auth/login' && method === 'post') {
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

  if (pathname === '/auth/register' && method === 'post') {
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

  if (pathname === '/auth/me' && method === 'get') {
    const saved = localStorage.getItem('imovies_user');
    const user = saved ? JSON.parse(saved) : { name: 'Demo Customer', email: 'customer@imovies.com', role: 'customer' };
    return Promise.resolve({
      data: { success: true, user },
      status: 200,
    });
  }

  if (pathname === '/auth/profile' && method === 'put') {
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
  if (pathname === '/admin/dashboard' && method === 'get') {
    const res = mockStore.getAdminDashboard();
    return Promise.resolve({ data: res, status: 200 });
  }

  if (pathname.startsWith('/admin/bookings') && method === 'get') {
    return Promise.resolve({
      data: {
        success: true,
        data: mockStore.bookings,
        pagination: { total: mockStore.bookings.length, page: 1, pageSize: 50, totalPages: 1 },
      },
      status: 200,
    });
  }

  if (pathname === '/health' || pathname === '/api/health') {
    return Promise.resolve({
      data: { status: 'ok', service: 'IMovies (Client Resilient Mode)' },
      status: 200,
    });
  }

  return Promise.reject(new Error(`Unhandled route in fallback: ${cleanUrl}`));
};

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

// Response interceptor: handles both HTTP errors AND static SPA HTML rewrites!
api.interceptors.response.use(
  (response) => {
    // If a static host returned HTML instead of JSON for an API call
    const contentType = response.headers?.['content-type'] || '';
    const isHtml =
      typeof response.data === 'string' &&
      (contentType.includes('text/html') ||
        response.data.trim().startsWith('<!doctype') ||
        response.data.trim().startsWith('<html'));

    if (isHtml || !response.data || (typeof response.data === 'object' && response.data.success === undefined && !Array.isArray(response.data))) {
      return handleMockFallback(response.config);
    }

    return response;
  },
  (error) => {
    if (error.config) {
      return handleMockFallback(error.config);
    }
    return Promise.reject(error);
  }
);

export default api;
