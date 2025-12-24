/**
 * JWT Utility Tests
 */

import { generateToken, verifyToken } from '../jwt';
import { createMockTokenPayload } from '../../__tests__/utils/factories';

describe('JWT Utility', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload = createMockTokenPayload();
      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT format: header.payload.signature
    });

    it('should include payload data in token', () => {
      const payload = createMockTokenPayload({
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'user',
      });

      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded).toMatchObject({
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'user',
      });
    });

    it('should create different tokens for different payloads', () => {
      const payload1 = createMockTokenPayload({ id: 'user-1' });
      const payload2 = createMockTokenPayload({ id: 'user-2' });

      const token1 = generateToken(payload1);
      const token2 = generateToken(payload2);

      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const payload = createMockTokenPayload({
        id: 'test-id',
        email: 'test@example.com',
        role: 'organizer',
      });

      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded.id).toBe('test-id');
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.role).toBe('organizer');
      expect(decoded.iat).toBeDefined(); // Issued at
      expect(decoded.exp).toBeDefined(); // Expiration
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        verifyToken('invalid.token.here');
      }).toThrow();
    });

    it('should throw error for malformed token', () => {
      expect(() => {
        verifyToken('not-a-jwt-token');
      }).toThrow();
    });

    it('should throw error for empty token', () => {
      expect(() => {
        verifyToken('');
      }).toThrow();
    });

    it('should throw error for token with wrong signature', () => {
      const payload = createMockTokenPayload();
      const token = generateToken(payload);

      // Tamper with the token
      const parts = token.split('.');
      parts[2] = 'tampered-signature';
      const tamperedToken = parts.join('.');

      expect(() => {
        verifyToken(tamperedToken);
      }).toThrow();
    });
  });

  describe('Token expiration', () => {
    it('should include expiration time in token', () => {
      const payload = createMockTokenPayload();
      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded.exp).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });

    it('should have issued at time in token', () => {
      const payload = createMockTokenPayload();
      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded.iat).toBeDefined();
      expect(decoded.iat).toBeLessThanOrEqual(Math.floor(Date.now() / 1000));
    });
  });
});
