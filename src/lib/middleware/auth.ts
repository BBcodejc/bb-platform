// ============================================
// AUTHENTICATION & PERMISSION MIDDLEWARE
// Role-based access control
// ============================================

import { createClient } from '@/lib/supabase/client';
import type { UserRole } from '@/types/elite-profile';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  playerSlug?: string;
  playerId?: string;
}

export interface AuthResult {
  isAuthenticated: boolean;
  user: AuthUser | null;
  error?: string;
}

// Permission constants
export const ROLE_ADMIN: UserRole = 'admin';
export const ROLE_COACH: UserRole = 'coach';
export const ROLE_PLAYER: UserRole = 'player';

// Elite profile access - Admin and Coach only
export const ELITE_ROLES: UserRole[] = [ROLE_ADMIN, ROLE_COACH];

// Check if user can access elite profiles
export function canAccessElite(role: UserRole | undefined): boolean {
  if (!role) return false;
  return ELITE_ROLES.includes(role);
}

// Check if user can edit elite profiles
export function canEditElite(role: UserRole | undefined): boolean {
  if (!role) return false;
  return ELITE_ROLES.includes(role);
}

// Check if user is admin
export function isAdmin(role: UserRole | undefined): boolean {
  return role === ROLE_ADMIN;
}

// Check if user is coach
export function isCoach(role: UserRole | undefined): boolean {
  return role === ROLE_COACH;
}

// Check if user is player
export function isPlayer(role: UserRole | undefined): boolean {
  return role === ROLE_PLAYER;
}

// Get current user from Supabase auth
export async function getCurrentUser(): Promise<AuthResult> {
  try {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        isAuthenticated: false,
        user: null,
        error: 'Not authenticated',
      };
    }

    const role = (user.user_metadata?.role as UserRole) || ROLE_PLAYER;
    const name = user.user_metadata?.name as string | undefined;
    const playerSlug = user.user_metadata?.player_slug as string | undefined;
    const playerId = user.user_metadata?.player_id as string | undefined;

    return {
      isAuthenticated: true,
      user: {
        id: user.id,
        email: user.email || '',
        role,
        name,
        playerSlug,
        playerId,
      },
    };
  } catch (err) {
    console.error('Auth error:', err);
    return {
      isAuthenticated: false,
      user: null,
      error: 'Authentication error',
    };
  }
}

// Verify elite access (for API routes)
export async function verifyEliteAccess(): Promise<{ allowed: boolean; user: AuthUser | null; error?: string }> {
  const auth = await getCurrentUser();

  if (!auth.isAuthenticated || !auth.user) {
    return { allowed: false, user: null, error: 'Not authenticated' };
  }

  if (!canAccessElite(auth.user.role)) {
    return { allowed: false, user: auth.user, error: 'Elite access denied' };
  }

  return { allowed: true, user: auth.user };
}

// Verify player access (for API routes)
export async function verifyPlayerAccess(playerId: string): Promise<{ allowed: boolean; user: AuthUser | null; error?: string }> {
  const auth = await getCurrentUser();

  if (!auth.isAuthenticated || !auth.user) {
    return { allowed: false, user: null, error: 'Not authenticated' };
  }

  // Admins and coaches can access any player
  if (canAccessElite(auth.user.role)) {
    return { allowed: true, user: auth.user };
  }

  // Players can only access their own profile
  if (auth.user.playerId === playerId) {
    return { allowed: true, user: auth.user };
  }

  return { allowed: false, user: auth.user, error: 'Access denied' };
}

// Get elite edit permissions based on role
export function getEliteEditPermissions(role: UserRole | undefined) {
  if (!role || !canEditElite(role)) {
    return {
      canEditProfile: false,
      canEditCues: false,
      canEditLimitingFactors: false,
      canEditProtocol: false,
      canEditWeeklyReview: false,
      canAddNotes: false,
      canAddVoiceNotes: false,
      canAddVideos: false,
    };
  }

  return {
    canEditProfile: true,
    canEditCues: true,
    canEditLimitingFactors: true,
    canEditProtocol: true,
    canEditWeeklyReview: true,
    canAddNotes: true,
    canAddVoiceNotes: true,
    canAddVideos: true,
  };
}
