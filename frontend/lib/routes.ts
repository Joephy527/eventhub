/**
 * Route Configuration
 * Centralized route definitions for middleware and navigation
 */

export const routes = {
  // Public routes - accessible to everyone
  public: [
    '/',
    '/events',
    '/events/[id]',
    '/about',
    '/contact',
  ],

  // Auth routes - only accessible when NOT authenticated
  auth: [
    '/login',
    '/register',
  ],

  // Protected routes - requires authentication
  protected: [
    '/dashboard',
    '/profile',
    '/bookings',
    '/bookings/[id]',
  ],

  // Organizer routes - requires 'organizer' or 'admin' role
  organizer: [
    '/events/create',
    '/events/my-events',
    '/events/edit/[id]',
  ],

  // Admin routes - requires 'admin' role
  admin: [
    '/admin',
    '/admin/users',
    '/admin/events',
    '/admin/analytics',
  ],
};

/**
 * Check if a path matches any route pattern
 */
export function matchesRoute(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    // Convert pattern to regex (e.g., '/events/[id]' -> /^\/events\/[^\/]+$/)
    const regex = new RegExp(
      '^' + pattern.replace(/\[.*?\]/g, '[^/]+') + '$'
    );
    return regex.test(path);
  });
}

/**
 * Get the type of route
 */
export function getRouteType(path: string): 'public' | 'auth' | 'protected' | 'organizer' | 'admin' {
  if (matchesRoute(path, routes.auth)) return 'auth';
  if (matchesRoute(path, routes.admin)) return 'admin';
  if (matchesRoute(path, routes.organizer)) return 'organizer';
  if (matchesRoute(path, routes.protected)) return 'protected';
  return 'public';
}
