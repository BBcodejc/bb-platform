import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Update the session (refresh tokens if needed)
  const response = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/api',
    '/_next',
    '/favicon.ico',
    '/intake',
    '/start',
    '/gear',
    '/checkout',
    '/protocols',
    '/start-here',
    '/leaderboard',
    '/senaptec',
    '/elite/login',
    '/elite',
  ];

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route) || pathname === '/'
  );

  if (isPublicRoute) {
    return response;
  }

  // For protected routes, check if user is authenticated
  // The actual auth check happens in the page/layout components
  // This middleware just ensures cookies are properly handled

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
