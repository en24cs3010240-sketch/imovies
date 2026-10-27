const { ROLES, MOVIE_STATUS, SEAT_CATEGORIES } = require('../config/constants');

const usersData = [
  {
    name: 'Cinema Administrator',
    email: 'admin@imovies.com',
    password: 'Admin@123456',
    role: ROLES.ADMIN,
    phone: '+1 (555) 019-2834',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Customer@123456',
    role: ROLES.CUSTOMER,
    phone: '+1 (555) 234-5678',
  },
  {
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    password: 'Customer@123456',
    role: ROLES.CUSTOMER,
    phone: '+1 (555) 876-5432',
  },
];

const moviesData = [
  {
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
    releaseDate: new Date('2024-03-01'),
    certification: 'PG-13',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    rating: 8.6,
    votesCount: 420000,
    status: MOVIE_STATUS.NOW_SHOWING,
  },
  {
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
    releaseDate: new Date('2023-07-21'),
    certification: 'R',
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    rating: 8.9,
    votesCount: 650000,
    status: MOVIE_STATUS.NOW_SHOWING,
  },
  {
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
    releaseDate: new Date('2014-11-07'),
    certification: 'PG-13',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    rating: 8.7,
    votesCount: 1950000,
    status: MOVIE_STATUS.NOW_SHOWING,
  },
  {
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
    releaseDate: new Date('2023-06-02'),
    certification: 'PG',
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    rating: 8.7,
    votesCount: 360000,
    status: MOVIE_STATUS.NOW_SHOWING,
  },
  {
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
    releaseDate: new Date('2008-07-18'),
    certification: 'PG-13',
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    rating: 9.0,
    votesCount: 2800000,
    status: MOVIE_STATUS.NOW_SHOWING,
  },
  {
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
    releaseDate: new Date('2010-07-16'),
    certification: 'PG-13',
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    rating: 8.8,
    votesCount: 2500000,
    status: MOVIE_STATUS.NOW_SHOWING,
  },
  {
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
    releaseDate: new Date('2024-11-22'),
    certification: 'R',
    trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
    rating: 8.2,
    votesCount: 85000,
    status: MOVIE_STATUS.UPCOMING,
  },
  {
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
    releaseDate: new Date('2022-12-16'),
    certification: 'PG-13',
    trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
    rating: 7.6,
    votesCount: 460000,
    status: MOVIE_STATUS.NOW_SHOWING,
  },
  {
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
    releaseDate: new Date('2024-07-26'),
    certification: 'R',
    trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
    rating: 8.0,
    votesCount: 290000,
    status: MOVIE_STATUS.NOW_SHOWING,
  },
];

const theatresData = [
  {
    name: 'IMovies Grand Cinema – Times Square',
    address: '234 W 42nd St',
    city: 'New York',
    state: 'NY',
    zipCode: '10036',
    phone: '+1 (212) 398-3939',
    facilities: ['IMAX Laser', 'Dolby Atmos', 'Recliner Loungers', 'Gourmet Bar', 'Reserved Seating'],
  },
  {
    name: 'IMovies Star Pavilion – Hollywood',
    address: '6925 Hollywood Blvd',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90028',
    phone: '+1 (323) 461-3331',
    facilities: ['Dolby Cinema', 'IMAX', 'Valet Parking', 'VIP Dine-In', 'Wheelchair Access'],
  },
  {
    name: 'IMovies Millennium – River East',
    address: '322 E Illinois St',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60611',
    phone: '+1 (312) 896-9300',
    facilities: ['RealD 3D', 'Dolby Atmos', 'Arcade & Lounge', 'Heated Recliners'],
  },
  {
    name: 'IMovies Metreon – Downtown',
    address: '135 4th St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    phone: '+1 (415) 369-6000',
    facilities: ['IMAX 70mm', 'Dolby Vision', 'Organic Cafe', 'Assisted Listening'],
  },
];

module.exports = {
  usersData,
  moviesData,
  theatresData,
};
