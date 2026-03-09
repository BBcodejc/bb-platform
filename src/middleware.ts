import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // Update the session (refresh tokens if needed)
  const response = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/login',
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
    // '/library', — REMOVED: library is admin-only
    '/system',
    '/masterclass',
    '/contact',
  ];

  // Public API routes (webhooks, public forms, public data)
  const publicApiRoutes = [
    '/api/webhook',        // Stripe/Calendly webhooks
    '/api/intake',         // Public intake form
    '/api/checkout',       // Stripe checkout
    '/api/gear',           // Public gear store
    '/api/applications',   // Public application form
    '/api/unsubscribe',    // Email unsubscribe
    '/api/cron',           // Cron jobs (secured by Vercel)
    '/api/bb-portal',      // Player portal (has own auth)
    '/api/portal',         // Player portal (has own auth)
    '/api/player',         // Player-facing (has own auth)
    '/api/elite/auth',     // Elite auth endpoints
    // '/api/concepts/search',     — REMOVED: library is admin-only
    // '/api/concepts/categories', — REMOVED: library is admin-only
    '/api/leads',          // Lead capture form
  ];

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route) || pathname === '/'
  );

  // Check if it's a public API route
  const isPublicApi = publicApiRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isPublicRoute || isPublicApi) {
    return response;
  }

  // For /elite/ pages (NOT /elite/login), check for elite token cookie OR admin Supabase auth
  // This protects player portal pages so only authenticated players/admins can view them
  if (pathname.startsWith('/elite/') && !pathname.startsWith('/elite/login')) {
    const eliteToken = request.cookies.get('bb-elite-token')?.value;
    if (eliteToken) {
      // Player has an elite token cookie — allow through (API routes verify token validity)
      return response;
    }

    // No elite token — check for admin Supabase auth as fallback
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value;
            },
            set() {},
            remove() {},
          },
        }
      );

      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        // No auth at all — redirect to elite login
        const loginUrl = new URL('/elite/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
      // Admin/coach user — allow through
    } catch {
      const loginUrl = new URL('/elite/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // For /admin routes AND /api/admin routes, verify authentication at middleware level
  if (pathname.startsWith('/admin') || pathname.startsWith('/library') || pathname.startsWith('/api/admin') || pathname.startsWith('/api/elite-players') || pathname.startsWith('/api/coaching') || pathname.startsWith('/api/upload') || pathname.startsWith('/api/concepts')) {
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value;
            },
            set() {},
            remove() {},
          },
        }
      );

      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        // For API routes, return 401 JSON
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          );
        }
        // For page routes, redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (err) {
      console.error('Middleware auth error:', err);
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Authentication error' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

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
