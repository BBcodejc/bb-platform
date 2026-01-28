// ============================================
// SHOOTING EVALUATION TYPES
// ============================================

export type PlayerLevel =
  | 'middle_school'
  | 'high_school'
  | 'prep_juco'
  | 'college'
  | 'pro_overseas'
  | 'rec';

export type Position = 'guard' | 'wing' | 'big';

export type DominantHand = 'right' | 'left' | 'both';

export type MissProfile = 'mostly_short' | 'mostly_long' | 'mostly_left' | 'mostly_right' | 'mixed';

// Section 0 - Player Info
export interface PlayerInfo {
  full_name: string;
  age: number;
  level: PlayerLevel;
  primary_position?: Position;
  dominant_hand: DominantHand;
}

// Section 1 - 14-Spot Baseline
export interface FourteenSpotRound {
  score: number; // 0-14
  miss_profile: MissProfile;
}

export interface FourteenSpotData {
  round_1: FourteenSpotRound;
  round_2: FourteenSpotRound;
  round_3: FourteenSpotRound;
  video_url?: string;
}

// Section 2 - Deep Distance Test
export interface DeepDistanceData {
  deep_distance_steps_behind_line: number;
  deep_line_rim_hits_10: number; // 0-10
  deep_line_total_shots_10: number; // 0-20
  contrast_steps_forward: number;
  contrast_rim_hits_10: number; // 0-10
  contrast_total_shots_10: number; // 0-20
  video_url?: string;
}

// Section 3 - Back-Rim Challenge
export interface BackRimLevel {
  total_shots: number;
  time_seconds: number;
}

export interface BackRimData {
  level_1: BackRimLevel; // 1 back-rim → make
  level_2: BackRimLevel; // 2 back-rim → make
  level_3: BackRimLevel; // 3 back-rim → make
  video_url?: string;
}

// Section 4 - Ball Flight Spectrum
export interface BallFlightArc {
  makes_or_backrim_7: number; // 0-7
  miss_profile: MissProfile;
}

export interface BallFlightData {
  flat: BallFlightArc; // ~25°
  normal: BallFlightArc; // ~45°
  high: BallFlightArc; // ~60°
  video_url?: string;
}

// Section 5 - Fades
export interface FadeDirection {
  makes_or_backrim_7: number; // 0-7
  miss_profile: MissProfile;
}

export interface FadesData {
  fade_right: FadeDirection;
  fade_left: FadeDirection;
  video_url?: string;
}

// Section 6 - Final Notes
export interface FinalNotes {
  anything_else?: string;
}

// Complete Evaluation
export interface ShootingEvaluation {
  submission_id: string;
  submission_timestamp: string;
  prospect_id: string;

  player_info: PlayerInfo;
  fourteen_spot: FourteenSpotData;
  deep_distance: DeepDistanceData;
  back_rim: BackRimData;
  ball_flight: BallFlightData;
  fades: FadesData;
  final_notes: FinalNotes;
}

// Form state for partial completion
export interface ShootingEvalFormState {
  player_info?: Partial<PlayerInfo>;
  fourteen_spot?: Partial<FourteenSpotData>;
  deep_distance?: Partial<DeepDistanceData>;
  back_rim?: Partial<BackRimData>;
  ball_flight?: Partial<BallFlightData>;
  fades?: Partial<FadesData>;
  final_notes?: Partial<FinalNotes>;
}

// Options for dropdowns
export const PLAYER_LEVEL_OPTIONS = [
  { value: 'middle_school', label: 'Middle School' },
  { value: 'high_school', label: 'High School' },
  { value: 'prep_juco', label: 'Prep / JUCO' },
  { value: 'college', label: 'College' },
  { value: 'pro_overseas', label: 'Pro / Overseas' },
  { value: 'rec', label: 'Rec / Men\'s League' },
];

export const POSITION_OPTIONS = [
  { value: 'guard', label: 'Guard' },
  { value: 'wing', label: 'Wing' },
  { value: 'big', label: 'Big' },
];

export const DOMINANT_HAND_OPTIONS = [
  { value: 'right', label: 'Right' },
  { value: 'left', label: 'Left' },
  { value: 'both', label: 'Both' },
];

export const MISS_PROFILE_OPTIONS = [
  { value: 'mostly_short', label: 'Mostly Short' },
  { value: 'mostly_long', label: 'Mostly Long' },
  { value: 'mostly_left', label: 'Mostly Left' },
  { value: 'mostly_right', label: 'Mostly Right' },
  { value: 'mixed', label: 'Mixed' },
];
