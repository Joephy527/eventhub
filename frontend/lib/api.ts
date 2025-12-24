/**
 * DEPRECATED: This file is maintained for backward compatibility.
 *
 * For new code, please use:
 * - Client components: import from '@/lib/api-client'
 * - Server components: import from '@/lib/api-server'
 *
 * The new APIs provide optimized session handling:
 * - api-client: Caches session for 5 minutes (avoids HTTP call on every request)
 * - api-server: Uses auth() directly (zero HTTP overhead)
 */

// Re-export from optimized client API for backward compatibility
export {
  default,
  authAPI,
  eventAPI,
  bookingAPI,
  categoryAPI,
  paymentAPI,
  clearSessionCache,
} from './api-client';
