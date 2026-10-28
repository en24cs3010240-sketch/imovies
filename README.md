# IMovies – Movie Ticket Booking Made Simple

![IMovies Banner](https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80)

[![Node.js Version](https://img.shields.io/badge/Node.js-v20+-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Express Version](https://img.shields.io/badge/Express-4.19-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-green.svg)](https://www.mongodb.com/)
[![Tests](https://img.shields.io/badge/Tests-14%20Passing-success.svg)](./server/tests/)
[![License](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)

A modern, full-stack cinema ticket booking web application built with the **MERN** stack (MongoDB, Express, React, Node.js). **IMovies** features real-time seat availability, double-booking prevention with atomic locks and hold timers, interactive seat selection across tiered pricing categories (VIP Recliner, Premium Lounge, Regular Standard), simulated checkout, digital e-ticket stubs with QR verification, customer dashboard with booking management & eligible cancellations, and a comprehensive protected administrative dashboard for managing movies, theatres, screens, and showtimes.

---

## 🎥 Live Demo & Video Walkthrough

- 🌐 **Live Web Application**: [https://imovies-red.vercel.app](https://imovies-red.vercel.app)
- 💻 **GitHub Repository**: [https://github.com/en24cs3010240-sketch/imovies](https://github.com/en24cs3010240-sketch/imovies)
- 🎬 **YouTube Demo Video Walkthrough**: [Watch Full Feature Walkthrough on YouTube](https://www.youtube.com/watch?v=Way9Dexny3w)
- ⚡ **Interactive In-App Tour**: Click the **"Demo Video"** button in the top navigation bar or the hero section of any running instance.

### ⏱️ Video Walkthrough Timestamps & Chapters

| Timestamp | Chapter | What's Covered |
| :--- | :--- | :--- |
| `00:00` | **Home Page & 60-Day Schedules** | City selection (New York, LA, SF, Chicago), genre filtering, and browsing 2 full months of continuous movie screenings. |
| `00:45` | **Movie Details & Trailer Player** | Synopsis, director, cast, certification, and responsive YouTube modal trailer playback. |
| `01:30` | **Interactive Seat Map & 8-Min Hold** | Selecting VIP / Premium / Regular seats with real-time countdown timer & concurrency lock. |
| `02:15` | **Checkout, Test Payment & QR Ticket** | 1-click test card autofill, simulated payment gateway, celebration confetti, and printable QR e-ticket stub. |
| `03:00` | **Customer Dashboard & Cancellations** | Order history review, PDF print ticket, and self-service cancellation with simulated refund. |
| `03:45` | **Protected Administrator Dashboard** | Box office revenue analytics, movie catalog CRUD, multiplex screens management, and showtimes scheduling. |

### 🔑 Instant Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Customer** | `john@example.com` | `Customer@123456` |
| **Administrator** | `admin@imovies.com` | `Admin@123456` |

---

## Table of Contents

1. [Live Demo & Video Walkthrough](#-live-demo--video-walkthrough)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Architecture & Concurrency Protection](#architecture--concurrency-protection)
5. [Prerequisites](#prerequisites)
6. [Installation & Setup](#installation--setup)
7. [Environment Variables](#environment-variables)
8. [Database Setup & Seeding](#database-setup--seeding)
9. [Default User & Administrator Credentials](#default-user--administrator-credentials)
10. [Running the Application](#running-the-application)
11. [REST API Documentation](#rest-api-documentation)
12. [Automated Testing](#automated-testing)
13. [Troubleshooting & FAQ](#troubleshooting--faq)
14. [Deployment Instructions](#deployment-instructions)

---

## Features

### 🎬 Customer Experience
- **Cinematic Dark Theme**: Charcoal and obsidian aesthetic with crimson red accents (`#e50914`), glowing curved screens, and accessible high-contrast typography.
- **Dynamic Home Page**: Hero spotlight featuring trailer previews, currently showing blockbusters, upcoming releases, city switcher, and genre filter pills.
- **Rich Movie Catalog & Search**: Instant search by title, actor, or director; filtering by genre, language, and release status; sorted by release date or IMDb rating.
- **Dedicated Movie Details**: Backdrop headers, verified synopsis, director, full cast, certification badges (PG, PG-13, R), official trailer modal embeds, and schedule tabs grouped by theatre.
- **Interactive Cinema Seat Map**:
  - Curved screen visual with neon ambient glow.
  - Multi-tier seat categories: **VIP Recliner**, **Premium Lounge**, and **Regular Standard**.
  - Distinct interactive states: Available, Selected (crimson glow), Held by another user (pulsing amber outline), and Booked/Sold Out (disabled).
  - Configurable maximum seat limit per booking (8 seats).
  - Dynamic subtotal, convenience fee, and tax calculation.
- **Atomic Backend Seat Holds**:
  - Automatically reserves chosen seats for 8 minutes with an active live countdown timer.
  - Concurrent lock protection prevents two customers from selecting or confirming the same seat simultaneously.
  - Automatic expiration and instant manual release if seats are deselected.
- **Simulated Instant Checkout**:
  - Order summary breakdown with transparency.
  - Simulated card payment and UPI QR code flows with single-click test card autofill.
  - Zero sensitive payment data stored.
- **Digital E-Tickets & Confirmation**:
  - Instant celebratory confetti animation on booking completion.
  - Printable/PDF-friendly cinema ticket stub with unique alphanumeric reference code (e.g., `IMV-8K2Q9Z`), seat details, auditorium format, and simulated gate check-in QR code.
- **Customer Dashboard**:
  - View Upcoming bookings vs. Past/Cancelled reservations.
  - Cancel eligible bookings (prior to showtime start) with automatic seat release and simulated refund processing.
  - Profile update for full name and phone number.

### 🛡️ Administrator Operations
- **Aggregated Analytics Dashboard**: Real-time metrics for total box office revenue, confirmed vs. cancelled bookings, active movies in catalog, and registered users.
- **Movie Catalog Management**: Complete CRUD operations to add, update, and archive films (titles, posters, backdrops, genres, certification, runtime, YouTube trailer links).
- **Theatres & Screens Management**:
  - Create multiplex locations across cities (New York, Los Angeles, Chicago, San Francisco).
  - Add screens with specific formats (IMAX, Dolby Cinema, 3D, Standard Digital) and automated row/seat grid generation.
  - Safe deletion checks that guard against invalidating active screenings.
- **Showtimes Scheduler**:
  - Schedule upcoming screenings by movie, theatre, and screen.
  - Screen conflict validation to prevent overlapping showtimes in the same auditorium.
  - Tiered ticket pricing customization (Regular, Premium, VIP).
  - Safe administrative deletion rules.
- **Booking Management**: Search bookings by reference code, filter by status, review customer details, and execute administrative cancellations.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, React Router v6, Bootstrap 5, Lucide React Icons, Canvas Confetti |
| **Backend** | Node.js, Express.js (RESTful Architecture), Helmet, CORS, Express Rate Limit, Morgan |
| **Database** | MongoDB, Mongoose 8 (Indexes, Schemas, Validation, TTL Indexes) |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs (Salted Password Hashing) |
| **Testing** | Jest, Supertest, MongoMemoryServer |

---

## Architecture & Concurrency Protection

Seat reservation race conditions are eliminated at the database layer through a dual-mechanism architecture:

1. **Temporary Seat Holds (`SeatHold` collection)**:
   - When a customer picks seats on the interactive layout, `POST /api/showtimes/:id/holds` validates that none of the seats are present in `showtime.bookedSeats` or held in an active unexpired `SeatHold`.
   - A MongoDB TTL index (`{ expiresAt: 1 }, { expireAfterSeconds: 0 }`) cleans up stale holds automatically, while queries filter with `{ expiresAt: { $gt: now } }`.
2. **Atomic Booking Confirmation (`Showtime.findOneAndUpdate`)**:
   - During final checkout, the backend executes an atomic conditional update:
     ```javascript
     const updated = await Showtime.findOneAndUpdate(
       { _id: showtimeId, bookedSeats: { $nin: seatIds } },
       { $push: { bookedSeats: { $each: seatIds } } },
       { new: true }
     );
     ```
   - If two customers submit payment for the exact same seat simultaneously, only the first transaction modifies the document. The second request immediately receives a `409 Conflict` response with an explanatory message.

---

## Prerequisites

- **Node.js**: v18.x or v20.x LTS installed (`node -v`)
- **npm**: v9.x or v10.x (`npm -v`)
- **MongoDB** *(Optional)*: A local MongoDB instance (`mongodb://127.0.0.1:27017/imovies`) or MongoDB Atlas URI.
  > **Note:** If a standalone MongoDB instance is not detected, IMovies automatically launches an embedded in-memory MongoDB replica. The project runs immediately out-of-the-box without requiring any manual database installation!

---

## Installation & Setup

1. **Clone or Navigate to the Project Root**:
   ```bash
   cd imovies
   ```

2. **Install Server Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**:
   ```bash
   cd ../client
   npm install
   cd ..
   ```

---

## Environment Variables

The project includes pre-configured environment defaults in `server/.env` and `.env.example`.

### Server Configuration (`server/.env`)
```env
# Application Port
PORT=5000
NODE_ENV=development

# MongoDB Connection String (leave as default for automatic fallback)
MONGODB_URI=mongodb://127.0.0.1:27017/imovies

# Authentication
JWT_SECRET=super_secret_jwt_key_imovies_2026_demo_key
JWT_EXPIRES_IN=7d

# Client URL (for CORS validation)
CLIENT_URL=http://localhost:5173

# Seat Hold Expiration
SEAT_HOLD_DURATION_MINUTES=8
```

---

## Database Setup & Seeding

The seed script initializes 9 blockbuster movies, 4 multiplex theatres across 4 major metropolitan cities, 12 screen auditoriums (IMAX, Dolby Cinema, Digital), 192 scheduled showtimes spanning the upcoming 4 days, pre-configured seat layouts with tiered pricing, and sample confirmed bookings.

To seed manually at any time:
```bash
cd server
npm run seed
```

> **Automatic Initial Seeding:** On fresh startup, if the database has 0 movies, the backend automatically runs the seed routine so you can start browsing and booking immediately!

---

## Default User & Administrator Credentials

The following verified accounts are seeded for immediate demonstration:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@imovies.com` | `Admin@123456` | Full administrative control: `/admin` dashboard, movie catalog CRUD, theatre management, showtime scheduling, booking cancellation |
| **Customer** | `john@example.com` | `Customer@123456` | Booking tickets, viewing seat layouts, personal dashboard (`/dashboard`), ticket cancellation |
| **Customer 2** | `sarah@example.com` | `Customer@123456` | Secondary account for testing concurrent seat booking attempts |

> 💡 **Quick Login Buttons:** On the `/login` page, click **"Customer Demo"** or **"Admin Demo"** to autofill credentials with a single click.

---

## Running the Application

### Option A: Running Development Servers (Recommended)

Open two terminal sessions:

**Terminal 1 — Backend API Server:**
```bash
cd server
npm run dev
# Server will start on http://localhost:5000
```

**Terminal 2 — Frontend Client:**
```bash
cd client
npm run dev
# Client will start on http://localhost:5173
```

Now open **http://localhost:5173** in your browser.

---

### Option B: Running Full-Stack Production Build

Build the React frontend into static assets and serve everything from the Express backend on a single port:

```bash
# 1. Build frontend
cd client
npm run build

# 2. Start server (serves both API and frontend bundle)
cd ../server
npm start
```

Now open **http://localhost:5000** in your browser.

---

## REST API Documentation

### 1. Authentication Endpoints (`/api/auth`)
- `POST /api/auth/register` — Register a new customer (`name`, `email`, `password`, `phone`).
- `POST /api/auth/login` — Sign in and receive a JWT token.
- `GET /api/auth/me` — Retrieve the authenticated user profile *(Protected)*.
- `PUT /api/auth/profile` — Update name or phone number *(Protected)*.
- `POST /api/auth/logout` — Invalidate session.

### 2. Movies Endpoints (`/api/movies`)
- `GET /api/movies` — List movies with search, genre, language, status, and sorting filters.
- `GET /api/movies/:id` — Single movie details and upcoming showtimes.
- `POST /api/movies` — Create new movie *(Admin)*.
- `PUT /api/movies/:id` — Update movie details *(Admin)*.
- `DELETE /api/movies/:id` — Remove movie (checks for active future showtimes) *(Admin)*.

### 3. Theatres & Screens Endpoints (`/api/theatres`, `/api/screens`)
- `GET /api/theatres` — List all theatres, optionally filtered by city (`?city=New York`).
- `GET /api/theatres/cities` — Get distinct list of cities.
- `GET /api/theatres/:id` — Get theatre details with screens.
- `POST /api/theatres` — Create theatre *(Admin)*.
- `POST /api/theatres/:theatreId/screens` — Add screen auditorium *(Admin)*.
- `DELETE /api/theatres/:id` — Delete theatre *(Admin)*.
- `DELETE /api/screens/:id` — Delete screen *(Admin)*.

### 4. Showtimes & Seats Endpoints (`/api/showtimes`)
- `GET /api/showtimes` — List showtimes filtered by `movieId`, `theatreId`, `city`, `date`.
- `GET /api/showtimes/:id` — Showtime details.
- `GET /api/showtimes/:id/seats` — Real-time interactive seat layout with availability statuses (`available`, `selected`, `held`, `booked`).
- `POST /api/showtimes/:id/holds` — Atomically hold seats for 8 minutes.
- `DELETE /api/showtimes/:id/holds/:holdToken` — Release held seats manually.
- `POST /api/showtimes` — Schedule a new showtime *(Admin)*.
- `DELETE /api/showtimes/:id` — Cancel or delete showtime *(Admin)*.

### 5. Bookings Endpoints (`/api/bookings`)
- `POST /api/bookings` — Atomically confirm booking and process simulated payment *(Protected)*.
- `GET /api/bookings/my` — Get authenticated customer's upcoming and past bookings *(Protected)*.
- `GET /api/bookings/:id` — Detailed booking confirmation receipt *(Protected)*.
- `PATCH /api/bookings/:id/cancel` — Cancel eligible booking and release seats *(Protected)*.

### 6. Admin Endpoints (`/api/admin`)
- `GET /api/admin/dashboard` — Aggregated revenue, user, and booking KPIs *(Admin)*.
- `GET /api/admin/bookings` — Search and manage all customer bookings *(Admin)*.
- `GET /api/admin/users` — List registered customers and staff *(Admin)*.

### 7. Health Check
- `GET /api/health` — System health check (`status`, `uptime`, `timestamp`).

---

## Automated Testing

Backend integration test suites cover authentication, catalog filtering, seat holds, and atomic double-booking prevention.

To execute the test suite:
```bash
cd server
npm test
```

### Test Suite Summary:
```
 PASS  tests/booking.test.js
  ✓ POST /api/showtimes/:id/holds should create a temporary seat hold
  ✓ POST /api/showtimes/:id/holds should reject holding seats held by another user
  ✓ POST /api/bookings should book seats and prevent duplicate bookings
  ✓ PATCH /api/bookings/:id/cancel should cancel booking and release seats

 PASS  tests/movies.test.js
  ✓ GET /api/movies should return list of movies
  ✓ GET /api/movies/:id should return single movie with details
  ✓ POST /api/movies should allow admin to create a new movie
  ✓ POST /api/movies should forbid non-admin users from creating movies

 PASS  tests/auth.test.js
  ✓ POST /api/auth/register should successfully register a new user
  ✓ POST /api/auth/register should reject duplicate email address
  ✓ POST /api/auth/login should authenticate with valid credentials
  ✓ POST /api/auth/login should reject incorrect password
  ✓ GET /api/auth/me should return current user when token is valid
  ✓ GET /api/auth/me should reject request without token

Test Suites: 3 passed, 3 total
Tests:       14 passed, 14 total
```

---

## Troubleshooting & FAQ

### Q: Do I need to install MongoDB locally to test the app?
**A:** No. If you have MongoDB installed, IMovies connects to it. If not, IMovies automatically runs an embedded MongoDB instance seamlessly.

### Q: How do I create a new Administrator account?
**A:** You can sign up normally through `/register` and then promote the user in the database or use the pre-seeded admin account (`admin@imovies.com` / `Admin@123456`).

### Q: Why do seats appear unavailable?
**A:** A seat will be disabled if another user has booked it or currently has it held with an active countdown timer. Once the hold timer expires, the seat automatically becomes available again.

---

## Deployment Instructions

### Deploy to Render / Railway / Heroku

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of IMovies full-stack platform"
   ```
2. In your cloud provider dashboard:
   - Set Build Command:
     ```bash
     cd client && npm install && npm run build && cd ../server && npm install
     ```
   - Set Start Command:
     ```bash
     cd server && npm start
     ```
   - Provide Environment Variables:
     - `NODE_ENV=production`
     - `PORT=5000`
     - `MONGODB_URI=<your-mongodb-atlas-uri>`
     - `JWT_SECRET=<your-production-secret-key>`
     - `CLIENT_URL=https://your-app-domain.com`

---

## License

This project is licensed under the MIT License — feel free to use it for educational, academic, or portfolio demonstrations.
