# EventHub - Event Management Platform

A modern, full-stack event management platform built with Next.js and Express.js. Features event creation, ticket booking, user authentication, and analytics dashboards.

## 🚀 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons

### Backend

- **Express.js** - Node.js web framework
- **TypeScript** - Type-safe API development
- **Drizzle ORM** - Type-safe database ORM
- **PostgreSQL** - Primary database (Supabase)
- **JWT** - Authentication & authorization
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
EventHub/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── db/             # Database schema & migrations
│   │   ├── types/          # TypeScript interfaces
│   │   ├── utils/          # Helper functions
│   │   └── validators/     # Request validation
│   └── package.json
│
└── frontend/               # Next.js application
    ├── app/               # Next.js App Router pages
    ├── components/        # Reusable React components
    ├── lib/              # API client & utilities
    ├── store/            # Zustand state management
    └── package.json
```

## 🎯 Features

### Core Functionality

- **User Authentication** - Register, login, JWT-based auth
- **Event Management** - Create, read, update, delete events
- **Ticket Booking** - Book tickets with stripe payment, view bookings, cancel bookings
- **Categories** - Organize events by category
- **Search & Filters** - Find events by keyword, category, price, location
- **Analytics** - Dashboard with booking statistics

### User Roles

- **User** - Browse events, book tickets, manage bookings
- **Organizer** - Create events, manage tickets, view analytics
- **Admin** - Full platform access

## 🏗️ Architecture

### Backend Architecture

```
Clean Separation of Concerns:
├── Routes → Controllers → Services → Database
├── Middleware for cross-cutting concerns
├── Validation layer for request data
└── Centralized error handling
```

### Database Schema

- **Users** - User accounts with role-based access
- **Events** - Event details, pricing, availability
- **Bookings** - Ticket purchases and reservations
- **Categories** - Event categorization
- **Payments** - Payment records for booking tickets

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Supabase account)

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=your-stripe-secret-key
GOOGLE_CLIENT_ID=your-google-client-id  # backend only needs client ID for token verification
```

4. Start the development server:

```bash
npm run dev
```

The API will run on `http://localhost:5000`

5. (Optional) Seed the database with demo data:

```bash
npm run db:seed
```

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies (React 19 + Stripe/Google peers may require force):

```bash
npm install --force
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Edit `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. Start the development server:

```bash
npm run dev
```

The application will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication

```
POST   /api/auth/register    - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/profile      - Get user profile (protected)
```

### Events

```
GET    /api/events                   - Get all events
GET    /api/events/featured          - Get featured events
GET    /api/events/upcoming          - Get upcoming events
GET    /api/events/:id               - Get event by ID
GET    /api/events/my-events         - Get organizer's events (protected)
POST   /api/events                   - Create event (organizer only)
PUT    /api/events/:id               - Update event (organizer only)
DELETE /api/events/:id               - Delete event (organizer only)
```

### Bookings

```
POST   /api/bookings                 - Create booking (protected)
GET    /api/bookings/my-bookings     - Get user bookings (protected)
GET    /api/bookings/stats           - Get booking statistics (protected)
GET    /api/bookings/:id             - Get booking by ID (protected)
PATCH  /api/bookings/:id/cancel      - Cancel booking (protected)
```

### Categories

```
GET    /api/categories               - Get all categories
GET    /api/categories/:id           - Get category by ID
GET    /api/categories/slug/:slug    - Get category by slug
```

---
