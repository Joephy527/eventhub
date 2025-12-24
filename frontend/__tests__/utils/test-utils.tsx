/**
 * Testing Utilities
 * Helper functions for component testing
 */

import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

/**
 * Custom render function that wraps components with providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options });
}

/**
 * Create mock session data
 */
export function createMockSession(overrides?: any) {
  return {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      accessToken: 'mock-jwt-token',
      ...overrides?.user,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    ...overrides,
  };
}

/**
 * Create mock event data
 */
export function createMockEvent(overrides?: any) {
  return {
    id: 'event-1',
    title: 'Test Event',
    description: 'Test event description',
    category: 'test-category',
    imageUrl: 'https://example.com/image.jpg',
    location: 'Test City',
    venue: 'Test Venue',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
    price: '50.00',
    totalTickets: 100,
    availableTickets: 75,
    organizerId: 'organizer-1',
    isPublished: true,
    tags: ['test', 'event'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create mock booking data
 */
export function createMockBooking(overrides?: any) {
  return {
    id: 'booking-1',
    eventId: 'event-1',
    userId: 'user-1',
    numberOfTickets: 2,
    totalAmount: '100.00',
    status: 'confirmed' as const,
    bookingDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Wait for async operations
 */
export function waitFor(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock IntersectionObserver (for components using lazy loading)
 */
export function mockIntersectionObserver() {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() {
      return [];
    }
    unobserve() {}
  } as any;
}

/**
 * Mock window.matchMedia (for responsive components)
 */
export function mockMatchMedia() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
