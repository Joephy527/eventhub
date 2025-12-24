/**
 * Test Helper Functions
 */

import { generateToken } from '../../utils/jwt';
import { createMockTokenPayload } from './factories';

/**
 * Generate a test JWT token
 */
export function generateTestToken(payload?: Partial<any>) {
  const tokenPayload = createMockTokenPayload(payload);
  return generateToken(tokenPayload);
}

/**
 * Create authorization header with JWT token
 */
export function createAuthHeader(payload?: Partial<any>) {
  const token = generateTestToken(payload);
  return `Bearer ${token}`;
}

/**
 * Mock Express Response object for testing
 */
export function createMockResponse() {
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
  return res;
}

/**
 * Mock Express Request object for testing
 */
export function createMockRequest(overrides?: Partial<any>) {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: undefined,
    ...overrides,
  };
}

/**
 * Wait for a promise to resolve (useful for testing async operations)
 */
export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error';
}
