import { pgTable, text, varchar, timestamp, integer, decimal, boolean, pgEnum, uuid, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'organizer', 'admin']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'cancelled']);

// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  role: userRoleEnum('role').notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Categories Table
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
});

// Events Table
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: uuid('category').notNull().references(() => categories.id),
  imageUrl: text('image_url').notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  venue: varchar('venue', { length: 255 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull().default('0'),
  totalTickets: integer('total_tickets').notNull().default(0),
  availableTickets: integer('available_tickets').notNull().default(0),
  organizerId: uuid('organizer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  isPublished: boolean('is_published').notNull().default(false),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  organizerIdx: index('events_organizer_id_idx').on(table.organizerId),
  categoryIdx: index('events_category_idx').on(table.category),
  startDateIdx: index('events_start_date_idx').on(table.startDate),
  isPublishedIdx: index('events_is_published_idx').on(table.isPublished),
  // Composite index for common query pattern (published events ordered by date)
  publishedStartDateIdx: index('events_published_start_date_idx').on(table.isPublished, table.startDate),
}));

// Bookings Table
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  numberOfTickets: integer('number_of_tickets').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: bookingStatusEnum('status').notNull().default('confirmed'),
  bookingDate: timestamp('booking_date').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('bookings_user_id_idx').on(table.userId),
  eventIdx: index('bookings_event_id_idx').on(table.eventId),
  statusIdx: index('bookings_status_idx').on(table.status),
  // Composite index for user's confirmed bookings query
  userStatusIdx: index('bookings_user_status_idx').on(table.userId, table.status),
}));

// Payments Table
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizerId: uuid('organizer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  bookingId: uuid('booking_id').references(() => bookings.id, { onDelete: 'set null' }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull().default('usd'),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('payments_user_id_idx').on(table.userId),
  organizerIdx: index('payments_organizer_id_idx').on(table.organizerId),
  statusIdx: index('payments_status_idx').on(table.status),
  stripeIntentIdx: index('payments_stripe_intent_idx').on(table.stripePaymentIntentId),
  // Composite indexes for common query patterns
  userStatusIdx: index('payments_user_status_idx').on(table.userId, table.status),
  organizerStatusIdx: index('payments_organizer_status_idx').on(table.organizerId, table.status),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  organizedEvents: many(events),
  bookings: many(bookings),
  paymentsAsUser: many(payments, { relationName: 'userPayments' }),
  paymentsAsOrganizer: many(payments, { relationName: 'organizerPayments' }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
  }),
  bookings: many(bookings),
  payments: many(payments),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  event: one(events, {
    fields: [bookings.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  payment: one(payments, {
    fields: [bookings.id],
    references: [payments.bookingId],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
    relationName: 'userPayments',
  }),
  organizer: one(users, {
    fields: [payments.organizerId],
    references: [users.id],
    relationName: 'organizerPayments',
  }),
  event: one(events, {
    fields: [payments.eventId],
    references: [events.id],
  }),
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
}));
