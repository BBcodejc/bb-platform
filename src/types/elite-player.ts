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

// =====================================================
// PLAYER DASHBOARD TYPES (2K-style)
// =====================================================

export interface SeasonStats {
  id: string;
  playerId: string;
  season: string;
  league: string;
  gamesPlayed: number;
  ppg: number;
  rpg: number;
  apg: number;
  spg: number;
  bpg: number;
  topg: number;
  mpg: number;
  fgPct: number;
  threePtPct: number;
  ftPct: number;
  fgMade: number;
  fgAttempted: number;
  threePtMade: number;
  threePtAttempted: number;
  ftMade: number;
  ftAttempted: number;
  midRangePct?: number;
  paintPct?: number;
  source: 'manual' | 'balldontlie' | 'nba_api';
  lastSyncedAt?: string;
}

export interface BBMetrics {
  id: string;
  playerId: string;
  metricDate: string;
  backRimRate?: number;
  movementBandwidth?: number;
  strobeLevel?: number;
  deepDistanceAccuracy?: number;
  catchShootSpeed?: number;
  offDribbleCalibration?: number;
  energyTransferScore?: number;
  fourteenSpotScore?: number;
  fourteenSpotTotal?: number;
  notes?: string;
  createdBy?: string;
}

export interface Highlight {
  id: string;
  playerId: string;
  title: string;
  description?: string;
  highlightDate: string;
  category: 'game' | 'training' | 'milestone' | 'coaching' | 'personal-best';
  statLine?: string;
  opponent?: string;
  videoUrl?: string;
  isPinned: boolean;
  createdBy?: string;
  createdAt: string;
}

export interface DashboardClip {
  id: string;
  playerId: string;
  videoClipId?: string;
  title: string;
  thumbnailUrl?: string;
  url: string;
  duration?: number;
  category: 'game-clip' | 'training' | 'breakdown' | 'highlight';
  displayOrder: number;
  isActive: boolean;
}

export interface AutoHighlight {
  id: string;
  type: 'auto';
  title: string;
  date: string;
  statLine?: string;
  opponent?: string;
  category: string;
}

export interface PlayerDashboardData {
  player: ElitePlayer;
  seasonStats: SeasonStats | null;
  recentGames: GameScoutingReport[];
  bbMetrics: BBMetrics | null;
  rollingStats: PlayerStats | null;
  upcomingSessions: Array<{
    id: string;
    date: string;
    sessionType: string;
    title: string;
    description?: string;
  }>;
  highlights: Highlight[];
  clips: DashboardClip[];
  videoClips: VideoClip[];
  autoHighlights: AutoHighlight[];
}

// Mappers: snake_case DB rows → camelCase interfaces
export function mapSeasonStatsRow(row: any): SeasonStats {
  return {
    id: row.id,
    playerId: row.player_id,
    season: row.season,
    league: row.league,
    gamesPlayed: row.games_played || 0,
    ppg: parseFloat(row.ppg) || 0,
    rpg: parseFloat(row.rpg) || 0,
    apg: parseFloat(row.apg) || 0,
    spg: parseFloat(row.spg) || 0,
    bpg: parseFloat(row.bpg) || 0,
    topg: parseFloat(row.topg) || 0,
    mpg: parseFloat(row.mpg) || 0,
    fgPct: parseFloat(row.fg_pct) || 0,
    threePtPct: parseFloat(row.three_pt_pct) || 0,
    ftPct: parseFloat(row.ft_pct) || 0,
    fgMade: row.fg_made || 0,
    fgAttempted: row.fg_attempted || 0,
    threePtMade: row.three_pt_made || 0,
    threePtAttempted: row.three_pt_attempted || 0,
    ftMade: row.ft_made || 0,
    ftAttempted: row.ft_attempted || 0,
    midRangePct: row.mid_range_pct ? parseFloat(row.mid_range_pct) : undefined,
    paintPct: row.paint_pct ? parseFloat(row.paint_pct) : undefined,
    source: row.source || 'manual',
    lastSyncedAt: row.last_synced_at,
  };
}

export function mapBBMetricsRow(row: any): BBMetrics {
  return {
    id: row.id,
    playerId: row.player_id,
    metricDate: row.metric_date,
    backRimRate: row.back_rim_rate ? parseFloat(row.back_rim_rate) : undefined,
    movementBandwidth: row.movement_bandwidth ? parseFloat(row.movement_bandwidth) : undefined,
    strobeLevel: row.strobe_level ? parseFloat(row.strobe_level) : undefined,
    deepDistanceAccuracy: row.deep_distance_accuracy ? parseFloat(row.deep_distance_accuracy) : undefined,
    catchShootSpeed: row.catch_shoot_speed ? parseFloat(row.catch_shoot_speed) : undefined,
    offDribbleCalibration: row.off_dribble_calibration ? parseFloat(row.off_dribble_calibration) : undefined,
    energyTransferScore: row.energy_transfer_score ? parseFloat(row.energy_transfer_score) : undefined,
    fourteenSpotScore: row.fourteen_spot_score,
    fourteenSpotTotal: row.fourteen_spot_total || 14,
    notes: row.notes,
    createdBy: row.created_by,
  };
}

export function mapHighlightRow(row: any): Highlight {
  return {
    id: row.id,
    playerId: row.player_id,
    title: row.title,
    description: row.description,
    highlightDate: row.highlight_date,
    category: row.category,
    statLine: row.stat_line,
    opponent: row.opponent,
    videoUrl: row.video_url,
    isPinned: row.is_pinned || false,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

export function mapDashboardClipRow(row: any): DashboardClip {
  return {
    id: row.id,
    playerId: row.player_id,
    videoClipId: row.video_clip_id,
    title: row.title,
    thumbnailUrl: row.thumbnail_url,
    url: row.url,
    duration: row.duration,
    category: row.category,
    displayOrder: row.display_order || 0,
    isActive: row.is_active !== false,
  };
}
