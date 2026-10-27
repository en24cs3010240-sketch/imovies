const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');
const Movie = require('./models/Movie');
const { seedDatabase } = require('./seed/seeder');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    // Check if database needs initial seeding
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      console.log('[Server] Database is empty. Auto-seeding initial demo movies, theatres, and showtimes...');
      await seedDatabase();
    }

    const server = app.listen(PORT, () => {
      console.log('====================================================');
      console.log(`🍿 IMovies Backend Server running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`🚀 Port: http://localhost:${PORT}`);
      console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
      console.log('====================================================');
    });

    // Graceful shutdown handling
    const shutdown = async (signal) => {
      console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        console.log('[Server] Process terminated safely.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    return server;
  } catch (error) {
    console.error('[Server] Fatal startup error:', error.message);
    process.exit(1);
  }
};

startServer();
