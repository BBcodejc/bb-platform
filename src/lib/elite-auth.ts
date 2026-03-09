import { cookies } from 'next/headers';
import { createServiceRoleClient } from '@/lib/supabase';

export interface EliteTokenUser {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

/**
 * Verify the bb-elite-token cookie against the database.
 * Returns the player if valid, null if invalid.
 */
export async function verifyEliteToken(): Promise<EliteTokenUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('bb-elite-token')?.value;

  if (!token) return null;

  try {
    const supabase = createServiceRoleClient();
    const { data: player, error } = await supabase
      .from('elite_players')
      .select('id, slug, first_name, last_name, is_active')
      .eq('access_token', token)
      .eq('is_active', true)
      .single();

    if (error || !player) return null;

    return {
      id: player.id,
      slug: player.slug,
      firstName: player.first_name,
      lastName: player.last_name,
      isActive: player.is_active,
    };
  } catch {
    return null;
  }
}

/**
 * Verify that a token grants access to a specific player slug.
 */
export async function verifyEliteTokenForSlug(slug: string): Promise<EliteTokenUser | null> {
  const player = await verifyEliteToken();
  if (!player) return null;
  if (player.slug !== slug) return null;
  return player;
}

/**
 * Verify elite player token from a NextRequest (for API route handlers).
 * Also falls back to admin Supabase auth.
 * Returns the player if valid, null if invalid.
 */
export async function verifyEliteRequest(
  request: import('next/server').NextRequest,
  slug: string
): Promise<{ player: EliteTokenUser | null; isAdmin: boolean }> {
  const { createServiceRoleClient: getSvc } = await import('@/lib/supabase');
  const supabase = getSvc();

  // Try elite token first
  const eliteToken = request.cookies.get('bb-elite-token')?.value;
  if (eliteToken) {
    const { data: player, error } = await supabase
      .from('elite_players')
      .select('id, slug, first_name, last_name, is_active')
      .eq('access_token', eliteToken)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (!error && player) {
      return {
        player: {
          id: player.id,
          slug: player.slug,
          firstName: player.first_name,
          lastName: player.last_name,
          isActive: player.is_active,
        },
        isAdmin: false,
      };
    }
  }

  // Fallback: admin Supabase auth
  try {
    const { createServerClient } = await import('@supabase/ssr');
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return request.cookies.get(name)?.value; },
          set() {},
          remove() {},
        },
      }
    );

    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (user) {
      const { data: player } = await supabase
        .from('elite_players')
        .select('id, slug, first_name, last_name, is_active')
        .eq('slug', slug)
        .single();

      if (player) {
        return {
          player: {
            id: player.id,
            slug: player.slug,
            firstName: player.first_name,
            lastName: player.last_name,
            isActive: player.is_active,
          },
          isAdmin: true,
        };
      }
    }
  } catch {
    // Admin auth failed
  }

  return { player: null, isAdmin: false };
}

/**
 * Generate a new random access token.
 */
export function generateAccessToken(firstName: string, lastName: string): string {
  const initials = ((firstName?.[0] || 'x') + (lastName?.[0] || 'x')).toLowerCase();
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 6);
  return `${initials}-bb-${year}-${rand}`;
}
