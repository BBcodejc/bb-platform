// ============================================
// ELITE PROFILE TYPES
// Hand-built profiles for NBA/Pro players
// Admin/Coach editable ONLY
// ============================================

export type UserRole = 'admin' | 'coach' | 'player';

export interface ElitePlayerProfile {
  id: string;
  slug: string;

  // Basic Info
  name: string;
  firstName: string;
  lastName: string;
  position: string;
  team: string;
  teamLogo?: string;
  headshotUrl?: string;

  // Status
  seasonStatus: 'in-season' | 'off-season' | 'playoffs' | 'pre-season';
  isActive: boolean;

  // Access
  accessToken?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ElitePregameCue {
  id: string;
  playerId: string;
  text: string;
  category: 'shooting' | 'decision' | 'mindset' | 'movement' | 'defense' | 'rebounding' | 'handle' | 'finishing';
  icon?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface EliteLimitingFactor {
  id: string;
  playerId: string;
  name: string;
  shortDescription?: string;
  awarenessCue?: string;
  severity: 'low' | 'medium' | 'high';
  priority: number;
  notes?: string;
  failureVideoUrl?: string;
  failureVideoCaption?: string;
  successVideoUrl?: string;
  successVideoCaption?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EliteGameDayProtocol {
  id: string;
  playerId: string;
  name: string;
  duration: string;
  spots: ElitePregameSpot[];
  shotTypes: EliteShotType[];
  principles: string[];
  isActive: boolean;
}

export interface ElitePregameSpot {
  id: string;
  name: string;
  position: 'corner-left' | 'corner-right' | 'wing-left' | 'wing-right' | 'top';
  reps: number;
}

export interface EliteShotType {
  id: string;
  name: string;
  category: 'catch-shoot' | 'off-dribble' | 'post' | 'pull-up';
  isActive: boolean;
}

export interface EliteWeeklyReview {
  id: string;
  playerId: string;
  weekStart: string;
  weekEnd: string;
  summary: string;
  whatChanged: string[];
  priorities: string[];
  createdBy: string;
  createdAt: string;
}

export interface EliteCoachNote {
  id: string;
  playerId: string;
  date: string;
  text: string;
  createdBy: string;
  createdAt: string;
}

export interface EliteVoiceNote {
  id: string;
  playerId: string;
  title: string;
  url: string;
  duration?: number;
  transcript?: string;
  createdBy: string;
  createdAt: string;
}

export interface EliteVideoClip {
  id: string;
  playerId: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  tags: string[];
  bbCue?: string;
  category: 'game-clip' | 'training' | 'breakdown' | 'reference';
  createdAt: string;
}

export interface EliteGameReport {
  id: string;
  playerId: string;
  opponent: string;
  opponentLogo?: string;
  gameDate: string;
  isHome: boolean;
  minutesPlayed?: number;
  points?: number;
  threePointAttempts?: number;
  threePointMakes?: number;
  bbNotes?: string;
  huntingNextGame?: string;
  createdAt: string;
}

// Full Elite Dashboard (read-only for player)
export interface EliteDashboard {
  player: ElitePlayerProfile;
  pregameCues: ElitePregameCue[];
  limitingFactors: EliteLimitingFactor[];
  gameDayProtocol: EliteGameDayProtocol | null;
  weeklyReview: EliteWeeklyReview | null;
  coachNotes: EliteCoachNote[];
  voiceNotes: EliteVoiceNote[];
  videoClips: EliteVideoClip[];
  recentGames: EliteGameReport[];
}

// Admin edit permissions
export interface EliteEditPermissions {
  canEditProfile: boolean;
  canEditCues: boolean;
  canEditLimitingFactors: boolean;
  canEditProtocol: boolean;
  canEditWeeklyReview: boolean;
  canAddNotes: boolean;
  canAddVoiceNotes: boolean;
  canAddVideos: boolean;
}
