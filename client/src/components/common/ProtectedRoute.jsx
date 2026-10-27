import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner text="Checking authentication status..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-block p-4 rounded-3 shadow">
          <h4>Access Denied (403 Forbidden)</h4>
          <p className="mb-0">Administrator privileges are required to view this area.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
