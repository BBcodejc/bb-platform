import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// Admin emails that are allowed to access admin routes
const ADMIN_EMAILS = [
  'bbcodejc@gmail.com',
  // Add more admin emails here if needed
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
 * Verify the user is an authenticated admin.
 * Checks both authentication AND that the user's email is in ADMIN_EMAILS.
 * Returns 401 if not logged in, 403 if not an admin.
 */
export async function requireAdmin(request: NextRequest): Promise<{
  user: any | null;
  error: NextResponse | null;
}> {
  const { user, error } = await requireAuth(request);

  if (error) return { user: null, error };

  if (!user?.email || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Forbidden — admin access required' },
        { status: 403 }
      ),
    };
  }

  return { user, error: null };
}
