/**
 * Test Data Factories
 * Helper functions to create test data
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Create a mock user object
 */
export function createMockUser(overrides?: Partial<any>) {
  return {
    id: uuidv4(),
    email: `test-${Date.now()}@example.com`,
    password: '$2b$10$hashedPasswordExample',
    firstName: 'Test',
    lastName: 'User',
    role: 'user' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Create a mock organizer object
 */
export function createMockOrganizer(overrides?: Partial<any>) {
  return createMockUser({
    role: 'organizer',
    firstName: 'Test',
    lastName: 'Organizer',
    ...overrides,
  });
}

/**
 * Create a mock event object
 */
export function createMockEvent(overrides?: Partial<any>) {
  const now = new Date();
  const startDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // 3 hours after start

  return {
    id: uuidv4(),
    title: 'Test Event',
    description: 'This is a test event description',
    category: 'test-category-id',
    imageUrl: 'https://example.com/image.jpg',
    location: 'Test City',
    venue: 'Test Venue',
    startDate,
    endDate,
    price: '50.00',
    totalTickets: 100,
    availableTickets: 100,
    organizerId: uuidv4(),
    isPublished: true,
    tags: ['test', 'event'],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Create a mock booking object
 */
export function createMockBooking(overrides?: Partial<any>) {
  const now = new Date();

  return {
    id: uuidv4(),
    eventId: uuidv4(),
    userId: uuidv4(),
    numberOfTickets: 2,
    totalAmount: '100.00',
    status: 'confirmed' as const,
    bookingDate: now,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Create a mock category object
 */
export function createMockCategory(overrides?: Partial<any>) {
  return {
    id: uuidv4(),
    name: 'Test Category',
    slug: 'test-category',
    description: 'Test category description',
    icon: 'test-icon',
    ...overrides,
  };
}

/**
 * Create a mock payment object
 */
export function createMockPayment(overrides?: Partial<any>) {
  const now = new Date();

  return {
    id: uuidv4(),
    userId: uuidv4(),
    organizerId: uuidv4(),
    eventId: uuidv4(),
    bookingId: uuidv4(),
    amount: '100.00',
    currency: 'usd',
    status: 'succeeded',
    stripePaymentIntentId: `pi_test_${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Create a mock JWT token payload
 */
export function createMockTokenPayload(overrides?: Partial<any>) {
  return {
    id: uuidv4(),
    email: 'test@example.com',
    role: 'user',
    ...overrides,
  };
}

/**
 * Create mock pagination metadata
 */
export function createMockPagination(overrides?: Partial<any>) {
  return {
    page: 1,
    pageSize: 20,
    totalCount: 50,
    totalPages: 3,
    hasNext: true,
    hasPrev: false,
    ...overrides,
  };
}
