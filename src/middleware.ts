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
    '/elite',
    '/library',
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
    '/api/concepts/search',     // Public concept search
    '/api/concepts/categories', // Public category list
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

  // Allow public concepts GET (but not POST/PATCH/DELETE — those are checked in route handlers)
  const isPublicConceptsGet =
    pathname.startsWith('/api/concepts') &&
    request.method === 'GET' &&
    !pathname.includes('/videos');

  if (isPublicRoute || isPublicApi || isPublicConceptsGet) {
    return response;
  }

  // For /admin routes AND /api/admin routes, verify authentication at middleware level
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin') || pathname.startsWith('/api/elite-players') || pathname.startsWith('/api/coaching') || pathname.startsWith('/api/upload')) {
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
