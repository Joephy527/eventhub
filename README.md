# EventHub - Event Management Platform

A modern, full-stack event management platform built with Next.js and Express.js. Features event creation, ticket booking, user authentication, and analytics dashboards.

## 🔗 Live URL

http://eventhub-red.vercel.app/

## 🚀 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Lucide React** - Icons

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

- User authentication and role-based access
- Event creation, management, and browsing
- Ticket booking with Stripe payments
- Categories, search, and filters
- Analytics dashboard for organizers

## 🛠️ Local Setup

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

## 🧰 Scripts Reference

### Backend

```bash
npm run dev          # Development with hot reload
npm run build        # Compile TypeScript
npm start            # Production server
npm test             # Run tests
npm run lint         # ESLint check
npm run format       # Prettier format
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:setup     # Migrate + seed
```

### Frontend

```bash
npm run dev          # Development server
npm run build        # Production build
npm start            # Production server
npm test             # Run tests
npm run lint         # Next.js lint
```

## 📚 Documentation

- Environment variables: `backend/.env.example`, `frontend/.env.example`
