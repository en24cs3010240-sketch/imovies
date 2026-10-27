import React from 'react';
import MovieCard from './MovieCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { Film } from 'lucide-react';

const MovieGrid = ({ movies = [], loading = false, emptyMessage = 'No movies found matching your criteria.' }) => {
  if (loading) {
    return <LoadingSpinner text="Fetching movie showtimes & titles..." />;
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-5 my-4 p-4 rounded-4 border border-secondary border-opacity-25 bg-dark">
        <Film size={48} className="text-muted mb-3" />
        <h5 className="text-light fw-bold">No Movies Available</h5>
        <p className="text-secondary small mb-0">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {movies.map((movie) => (
        <div key={movie._id} className="col-6 col-md-4 col-lg-3">
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
