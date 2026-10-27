import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '300px' }}>
      <div className="spinner-border text-danger mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted small fw-medium">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
