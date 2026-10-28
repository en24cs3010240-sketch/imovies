import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CityProvider } from './context/CityContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import FloatingDemoButton from './components/common/FloatingDemoButton';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import UserDashboardPage from './pages/UserDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminMoviesPage from './pages/admin/AdminMoviesPage';
import AdminTheatresPage from './pages/admin/AdminTheatresPage';
import AdminShowtimesPage from './pages/admin/AdminShowtimesPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CityProvider>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />

            <div className="flex-grow-1">
              <Routes>
                {/* Public Customer Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/movies/:id" element={<MovieDetailsPage />} />
                <Route path="/booking/:showtimeId" element={<BookingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Customer Protected Routes */}
                <Route
                  path="/confirmation/:bookingId"
                  element={
                    <ProtectedRoute>
                      <ConfirmationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="movies" element={<AdminMoviesPage />} />
                  <Route path="theatres" element={<AdminTheatresPage />} />
                  <Route path="showtimes" element={<AdminShowtimesPage />} />
                  <Route path="bookings" element={<AdminBookingsPage />} />
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            <FloatingDemoButton />
            <Footer />
          </div>
        </CityProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
