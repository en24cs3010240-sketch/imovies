const request = require('supertest');
const app = require('../src/app');
const Movie = require('../src/models/Movie');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
require('./setup');

describe('Movie Catalog & Admin Endpoints', () => {
  let adminToken;
  let customerToken;
  let sampleMovie;

  beforeEach(async () => {
    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash('Admin@123', salt);
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@imovies.com',
      passwordHash: adminHash,
      role: 'admin',
    });
    adminToken = admin.generateAuthToken();

    // Create regular customer
    const userHash = await bcrypt.hash('Customer@123', salt);
    const customer = await User.create({
      name: 'Regular Customer',
      email: 'customer@imovies.com',
      passwordHash: userHash,
      role: 'customer',
    });
    customerToken = customer.generateAuthToken();

    // Seed a sample movie
    sampleMovie = await Movie.create({
      title: 'Dune: Part Two',
      description: 'Paul Atreides seeks revenge against conspirators.',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401',
      genre: ['Sci-Fi', 'Action'],
      language: 'English',
      duration: 166,
      releaseDate: new Date('2024-03-01'),
      status: 'now_showing',
    });
  });

  test('GET /api/movies should return list of movies', async () => {
    const res = await request(app).get('/api/movies');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].title).toBe('Dune: Part Two');
  });

  test('GET /api/movies/:id should return single movie with details', async () => {
    const res = await request(app).get(`/api/movies/${sampleMovie._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Dune: Part Two');
  });

  test('POST /api/movies should allow admin to create a new movie', async () => {
    const newMovie = {
      title: 'Interstellar',
      description: 'A team of explorers travel through a wormhole in space.',
      posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa',
      genre: ['Sci-Fi', 'Adventure'],
      language: 'English',
      duration: 169,
      releaseDate: '2014-11-07',
    };

    const res = await request(app)
      .post('/api/movies')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newMovie);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Interstellar');
  });

  test('POST /api/movies should forbid non-admin users from creating movies', async () => {
    const res = await request(app)
      .post('/api/movies')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ title: 'Unauthorized Film' });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
