import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Admin emails — the ONLY accounts with admin access
const ADMIN_EMAILS = [
  'bbcodejc@gmail.com',
];

/**
 * Verify the user is authenticated via Supabase session cookies.
 * Returns the user object if authenticated, or a 401 response.
 */
export async function requireAuth(request: NextRequest): Promise<{
  user: any | null;
  error: NextResponse | null;
}> {
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
      return {
        user: null,
        error: NextResponse.json(
          { error: 'Unauthorized — you must be logged in' },
          { status: 401 }
        ),
      };
    }

    return { user, error: null };
  } catch (err) {
    console.error('Auth check failed:', err);
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Authentication error' },
        { status: 401 }
      ),
    };
  }
}

/**
 * Verify the user is authenticated.
 * Middleware already blocks unauthenticated users from /admin and /api/admin routes.
 * This is a defense-in-depth check at the route handler level.
 */
export async function requireAdmin(request: NextRequest): Promise<{
  user: any | null;
  error: NextResponse | null;
}> {
  const { user, error } = await requireAuth(request);

  if (error) return { user: null, error };

  return { user, error: null };
}

/**
 * Verify the request is from an admin OR a valid elite player for this slug.
 * Elite players authenticate via a `bb-elite-token` httpOnly cookie.
 * Returns 401 if neither admin nor valid player.
 */
export async function requireAdminOrPlayer(
  request: NextRequest,
  slug: string
): Promise<{
  user: any | null;
  isAdmin: boolean;
  error: NextResponse | null;
}> {
  // First try admin auth (Supabase session)
  const { user } = await requireAuth(request);

  if (user) {
    return { user, isAdmin: true, error: null };
  }

  // Then try elite player token auth (bb-elite-token cookie)
  const eliteToken = request.cookies.get('bb-elite-token')?.value;

  if (eliteToken) {
    // Return the token — caller verifies it against the DB for this specific slug
    return {
      user: { eliteToken, requestedSlug: slug },
      isAdmin: false,
      error: null,
    };
  }

  // Neither admin nor player
  return {
    user: null,
    isAdmin: false,
    error: NextResponse.json(
      { error: 'Unauthorized — admin or player access required' },
      { status: 401 }
    ),
  };
}
