// Elite Player Dashboard Types
// For NBA, Pro, and Elite College Players

export interface ElitePlayer {
  id: string;
  slug: string; // URL-friendly identifier (e.g., "tobias-harris")

  // Basic Info
  firstName: string;
  lastName: string;
  position: string;
  team: string;
  teamLogo?: string;
  headshotUrl?: string;

  // BB Profile
  bbLevel: 1 | 2 | 3 | 4;
  seasonStatus: 'in-season' | 'off-season' | 'playoffs' | 'pre-season';

  // Access Control
  accessToken?: string; // Optional token for private access
  isActive: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface DailyFocus {
  id: string;
  playerId: string;
  date: string;
  focusCue: string; // The main focus for the day
  createdBy: string;
  createdAt: string;
}

export interface LimitingFactor {
  id: string;
  playerId: string;

  // Factor Info
  name: string;
  shortDescription: string;
  awarenesssCue: string; // Player-friendly "what to be aware of"

  // Status
  priority: 'high' | 'medium' | 'low';
  isActive: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface GameScoutingReport {
  id: string;
  playerId: string;

  // Game Info
  opponent: string;
  opponentLogo?: string;
  gameDate: string;
  isHome: boolean;

  // Stats
  minutesPlayed: number;
  threePointAttempts: number;
  threePointMakes: number;
  threePointPercentage: number;

  // Additional Stats (optional)
  points?: number;
  fieldGoalAttempts?: number;
  fieldGoalMakes?: number;

  // BB Notes
  bbNotes: string; // Coach-entered analysis
  huntingNextGame: string; // What to look for next game

  // Video
  videoClips: VideoClip[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface VideoClip {
  id: string;
  playerId: string;
  gameId?: string; // Optional link to game

  // Video Info
  title: string;
  url: string; // YouTube, Drive, or internal URL
  thumbnailUrl?: string;
  duration?: number; // seconds

  // Tags
  tags: VideoTag[];

  // BB Cue
  bbCue?: string; // Optional coaching cue for this clip

  // Timestamps
  createdAt: string;
}

export type VideoTag =
  | 'off-dribble'
  | 'catch-and-shoot'
  | 'fade'
  | 'drift'
  | 'deep-distance'
  | 'constraint'
  | 'strobes'
  | 'oversize-ball'
  | 'game-clip'
  | 'training'
  | 'calibration';

export interface PlayerStats {
  id: string;
  playerId: string;

  // Rolling Averages
  rolling3Game3PT: number;
  rolling5Game3PT: number;

  // Volume
  avgShotVolume: number;

  // Streak
  currentStreak: 'hot' | 'cold' | 'neutral';
  streakGames: number;

  // Miss Profile (if tracked)
  backRimPercentage?: number;
  directionalMissPercentage?: number;

  // Timestamps
  lastUpdated: string;
}

export interface DailyCue {
  id: string;
  playerId: string;

  // Cue Content
  cueText: string;
  category: 'shooting' | 'decision' | 'mindset' | 'movement';

  // Order
  displayOrder: number;
  isActive: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface PlayerInput {
  id: string;
  playerId: string;

  // Input Data
  date: string;
  shotFeeling: string; // Free text
  confidence: 1 | 2 | 3 | 4 | 5;
  notes?: string;

  // Timestamps
  createdAt: string;
}

// Combined Dashboard Data
export interface ElitePlayerDashboard {
  player: ElitePlayer;
  todaysFocus: DailyFocus | null;
  limitingFactors: LimitingFactor[];
  recentGames: GameScoutingReport[];
  stats: PlayerStats | null;
  videoLibrary: VideoClip[];
  dailyCues: DailyCue[];
  recentInputs: PlayerInput[];
}

// Admin Edit Payloads
export interface UpdateDailyFocusPayload {
  focusCue: string;
}

export interface UpdateLimitingFactorPayload {
  name?: string;
  shortDescription?: string;
  awarenessCue?: string;
  priority?: 'high' | 'medium' | 'low';
  isActive?: boolean;
}

export interface CreateGameReportPayload {
  opponent: string;
  opponentLogo?: string;
  gameDate: string;
  isHome: boolean;
  minutesPlayed: number;
  threePointAttempts: number;
  threePointMakes: number;
  points?: number;
  bbNotes: string;
  huntingNextGame: string;
}

export interface AddVideoClipPayload {
  title: string;
  url: string;
  thumbnailUrl?: string;
  gameId?: string;
  tags: VideoTag[];
  bbCue?: string;
}

export interface UpdateDailyCuesPayload {
  cues: Array<{
    id?: string;
    cueText: string;
    category: 'shooting' | 'decision' | 'mindset' | 'movement';
    displayOrder: number;
    isActive: boolean;
  }>;
}

export interface PlayerInputPayload {
  shotFeeling: string;
  confidence: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}
