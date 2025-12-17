import { db } from './index';
import { sql } from 'drizzle-orm';

export async function runMigrations() {
  console.log('Running database migrations...');

  try {
    const safeExecute = async (label: string, query: any) => {
      try {
        await db.execute(query);
      } catch (err: any) {
        if (err?.code === '42P07') {
          console.log(`✓ ${label} already exists`);
          return;
        }
        throw err;
      }
    };

    // Enable UUID extension
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // Create enums
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('user', 'organizer', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create users table
    await safeExecute(
      'users table',
      sql`CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role user_role NOT NULL DEFAULT 'user',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )`
    );

    // Create categories table
    await safeExecute(
      'categories table',
      sql`CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        icon VARCHAR(50)
      )`
    );

    // Create events table
    await safeExecute(
      'events table',
      sql`CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        location VARCHAR(255) NOT NULL,
        venue VARCHAR(255) NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0,
        total_tickets INTEGER NOT NULL DEFAULT 0,
        available_tickets INTEGER NOT NULL DEFAULT 0,
        organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        is_published BOOLEAN NOT NULL DEFAULT false,
        tags TEXT[],
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )`
    );

    // Create bookings table
    await safeExecute(
      'bookings table',
      sql`CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        number_of_tickets INTEGER NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status booking_status NOT NULL DEFAULT 'confirmed',
        booking_date TIMESTAMP NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )`
    );

    // Create payments table
    await safeExecute(
      'payments table',
      sql`CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) NOT NULL DEFAULT 'usd',
        stripe_payment_intent_id VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )`
    );

    console.log('✓ Database migrations completed successfully');
    return true;
  } catch (error: any) {
    if (error.message && error.message.includes('already exists')) {
      console.log('✓ Database tables already exist');
      return true;
    }
    console.error('Error running migrations:', error);
    throw error;
  }
}
