import React from 'react';
import { X } from 'lucide-react';

const TrailerModal = ({ isOpen, onClose, trailerUrl, movieTitle }) => {
  if (!isOpen || !trailerUrl) return null;

  // Convert youtube watch URL to embed URL
  let embedUrl = trailerUrl;
  const ytMatch = trailerUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-secondary" style={{ backgroundColor: '#11131f' }}>
          <div className="modal-header border-secondary border-opacity-50 py-3">
            <h5 className="modal-title text-light fw-bold">
              {movieTitle ? `${movieTitle} – Official Trailer` : 'Movie Trailer'}
            </h5>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary text-light rounded-circle p-1"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
          <div className="modal-body p-0">
            <div className="ratio ratio-16x9">
              <iframe
                src={embedUrl}
                title={movieTitle || 'Trailer'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
