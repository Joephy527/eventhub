import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Define route patterns
  const isPublicRoute =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/events') && !pathname.includes('/create') && !pathname.includes('/my-events') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/public');

  const isAuthRoute = pathname === '/login' || pathname === '/register';

  const isProtectedRoute = !isPublicRoute;

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  if (isLoggedIn && req.auth?.user) {
    const userRole = req.auth.user.role;

    // Organizer/Admin only routes
    const organizerRoutes = ['/events/create', '/events/my-events', '/events/edit'];
    const isOrganizerRoute = organizerRoutes.some(route => pathname.startsWith(route));

    if (isOrganizerRoute && userRole !== 'organizer' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard?error=unauthorized', req.url));
    }

    // Admin only routes
    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard?error=unauthorized', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
