import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase';

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
    const supabase = createServerSupabaseClient();
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
 * Generate a new random access token.
 */
export function generateAccessToken(firstName: string, lastName: string): string {
  const initials = ((firstName?.[0] || 'x') + (lastName?.[0] || 'x')).toLowerCase();
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 6);
  return `${initials}-bb-${year}-${rand}`;
}
