// Elite Player Dashboard Types
// For NBA, Pro, and Elite College Players

export interface ElitePlayer {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  position: string;
  team: string;
  teamLogo?: string;
  headshotUrl?: string;
  bbLevel: 1 | 2 | 3 | 4;
  bbLevelName?: string; // "BB 2 - Calibrated"
  seasonStatus: 'in-season' | 'off-season' | 'playoffs' | 'pre-season';
  accessToken?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyFocus {
  id: string;
  playerId: string;
  date: string;
  focusCue: string;
  createdBy?: string;
  createdAt?: string;
}

export interface PregameCue {
  id: string;
  playerId: string;
  cueText: string;
  category: 'shooting' | 'decision' | 'mindset' | 'movement' | 'defense' | 'rebounding' | 'handle' | 'finishing';
  icon?: string;
  priority?: number;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Alias for backwards compatibility
export type DailyCue = PregameCue;

export interface VideoExample {
  url: string;
  caption?: string;
  thumbnailUrl?: string;
}

export interface LimitingFactor {
  id: string;
  playerId: string;
  name: string;
  shortDescription?: string;
  awarenesssCue?: string;
  severity?: 'low' | 'medium' | 'high';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  failureExample?: VideoExample;
  successExample?: VideoExample;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// GAME DAY PROTOCOL (Tommy's Structure)
// ============================================

export interface ScoringSettings {
  backRim: number; // 0 = neutral
  frontRimComesBack: number; // -1
  directionalMiss: number; // -1 (left/right)
  skidForward: number; // -1 or 0 (configurable)
  make: number; // +1
  targetScore: number; // "Plus 5" or "Plus 3"
}

export interface ShotType {
  id: string;
  name: string;
  description?: string;
  category: 'catch-shoot' | 'off-dribble' | 'post' | 'pull-up';
  isActive: boolean;
}

export interface PregameSpot {
  id: string;
  name: string;
  position: 'corner-left' | 'corner-right' | 'wing-left' | 'wing-right' | 'top';
  shotTypes: string[];
  reps: number;
  notes?: string;
}

export interface GameDayProtocol {
  id: string;
  playerId: string;
  name: string;
  duration: string;
  scoringSettings: ScoringSettings;
  spots: PregameSpot[];
  shotTypeVariety: ShotType[];
  postSection: {
    enabled: boolean;
    moves: string[];
  };
  offBallPrinciples: string[];
  defensePrinciples: string[];
  reboundingPrinciples: string[];
  handlePrinciples: string[];
  finishingPrinciples: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// WEEKLY REVIEW
// ============================================

export interface WeeklyReview {
  id: string;
  playerId: string;
  weekStart: string;
  weekEnd: string;
  summary: string;
  whatChanged: string[];
  priorities: string[];
  shootingTrend?: 'improving' | 'declining' | 'stable';
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// STATS & GAMES
// ============================================

export interface GameScoutingReport {
  id: string;
  playerId: string;
  opponent: string;
  opponentLogo?: string;
  gameDate: string;
  isHome: boolean;
  minutesPlayed?: number;
  threePointAttempts: number;
  threePointMakes: number;
  threePointPercentage?: number;
  points?: number;
  fieldGoalAttempts?: number;
  fieldGoalMakes?: number;
  bbNotes?: string;
  huntingNextGame?: string;
  videoClips?: string[] | VideoClip[];
  customMetrics?: Record<string, number | string>;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlayerStats {
  id: string;
  playerId: string;
  rolling3Game3PT?: number;
  rolling5Game3PT?: number;
  avgShotVolume?: number;
  currentStreak: 'hot' | 'cold' | 'neutral';
  streakGames: number;
  backRimPercentage?: number;
  directionalMissPercentage?: number;
  lastUpdated?: string;
}

// ============================================
// VIDEO LIBRARY
// ============================================

export interface VideoClip {
  id: string;
  playerId: string;
  gameId?: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  tags: string[];
  bbCue?: string;
  category?: 'game-clip' | 'training' | 'breakdown' | 'reference';
  createdAt?: string;
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

// ============================================
// COACH NOTES & VOICE NOTES
// ============================================

export interface CoachNote {
  id: string;
  playerId: string;
  date: string;
  text: string;
  createdBy?: string;
  createdAt?: string;
}

export interface VoiceNote {
  id: string;
  playerId: string;
  title: string;
  url: string;
  duration?: number;
  transcript?: string;
  createdBy?: string;
  createdAt?: string;
}

// ============================================
// PLAYER INPUT / CHECK-IN
// ============================================

export interface PlayerInput {
  id: string;
  playerId: string;
  date: string;
  shotFeeling?: string;
  confidence: number;
  energyLevel?: number;
  focusLevel?: number;
  notes?: string;
  createdAt?: string;
}

// ============================================
// FULL DASHBOARD
// ============================================

export interface ElitePlayerDashboard {
  player: ElitePlayer;
  todaysFocus: DailyFocus | null;
  pregameCues: PregameCue[];
  limitingFactors: LimitingFactor[];
  gameDayProtocol: GameDayProtocol | null;
  weeklyReview: WeeklyReview | null;
  recentGames: GameScoutingReport[];
  stats: PlayerStats | null;
  videoLibrary: VideoClip[];
  coachNotes: CoachNote[];
  voiceNotes: VoiceNote[];
  dailyCues: PregameCue[];
  recentInputs?: PlayerInput[];
}

// ============================================
// DEFAULT PROTOCOL TEMPLATE (Tommy's Structure)
// ============================================

export const DEFAULT_SHOT_TYPES: ShotType[] = [
  { id: 'catch-shoot', name: 'Catch & Shoot', category: 'catch-shoot', isActive: true },
  { id: 'pass-fake-shoot', name: 'Pass Fake + Shoot', category: 'catch-shoot', isActive: true },
  { id: 'pump-fake-shoot', name: 'Pump Fake + Shoot', category: 'catch-shoot', isActive: true },
  { id: 'pump-stepback', name: 'Pump Fake Break Line Stepback + Shoot', category: 'off-dribble', isActive: true },
  { id: 'slide-dribble-3', name: 'Slide Dribble to 3 (L/R)', category: 'off-dribble', isActive: true },
  { id: 'elongated-pump-pullup', name: 'Elongated Pump Fake + 1 Dribble Pull-up', category: 'pull-up', isActive: true },
  { id: 'long-pump-stop-pullup', name: 'Long Pump Fake → Smooth Stop → 1st Dribble Pull-up', category: 'pull-up', isActive: true },
  { id: '2nd-dribble-stepback', name: '2nd Dribble Pull-up + Stepback', category: 'pull-up', isActive: true },
];

export const DEFAULT_POST_MOVES = [
  'Fade left shoulder (aggressive)',
  'Fade right shoulder (aggressive)',
  'Stepback from left block',
  'Stepback from right block',
];

export const DEFAULT_OFF_BALL_PRINCIPLES = [
  'Late lift / late drift',
  'Move when dribbler is about to pick up',
  'Be a release valve',
  'Catch everything to shoot',
];

export const DEFAULT_DEFENSE_PRINCIPLES = [
  'Step toward then hip turn bias',
  'Reach & recover',
  'Deflections',
  'Play passing angles',
];

export const DEFAULT_REBOUNDING_PRINCIPLES = [
  'Locate ball early',
  'Predict trajectory / camera angle',
  'Crash elbows / short corners on long threes',
];

export const DEFAULT_HANDLE_PRINCIPLES = [
  'Vary reaction time',
  'Dribble hard / high',
  'Delayed accelerations',
  'Gallop / blow-by',
];

export const DEFAULT_FINISHING_PRINCIPLES = [
  'Max airspace',
  'Hunt pull-up',
  'Avoid crowded rim unless pump fake creates angle',
];

export const DEFAULT_SCORING_SETTINGS: ScoringSettings = {
  backRim: 0,
  frontRimComesBack: -1,
  directionalMiss: -1,
  skidForward: 0,
  make: 1,
  targetScore: 5,
};

export const DEFAULT_PREGAME_SPOTS: PregameSpot[] = [
  { id: 'corner-left', name: 'Corner Left', position: 'corner-left', shotTypes: [], reps: 5 },
  { id: 'corner-right', name: 'Corner Right', position: 'corner-right', shotTypes: [], reps: 5 },
  { id: 'wing-left', name: 'Wing Left', position: 'wing-left', shotTypes: [], reps: 5 },
  { id: 'wing-right', name: 'Wing Right', position: 'wing-right', shotTypes: [], reps: 5 },
  { id: 'top', name: 'Top of Key', position: 'top', shotTypes: [], reps: 5 },
];
