// ============================================
// BB PLAYER SYSTEM TYPES
// Daily Adaptive Performance Platform
// ============================================

// ============================================
// CORE PLAYER PROFILE
// ============================================

export interface BBPlayer {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position: string;
  team?: string;
  teamLogo?: string;
  headshotUrl?: string;
  level: 'elite' | 'pro' | 'college' | 'high-school' | 'youth';
  seasonStatus: 'in-season' | 'off-season' | 'playoffs' | 'pre-season';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;

  // Player-specific settings
  settings?: PlayerSettings;
}

export interface PlayerSettings {
  defaultEquipment: Equipment[];
  preferredSessionLength: number; // in minutes
  notificationsEnabled: boolean;
  timezone?: string;
}

// ============================================
// DAILY SESSION CONTEXT
// ============================================

export type DayType = 'game-day' | 'practice-day' | 'off-day' | 'travel-day';
export type Environment = 'court' | 'weight-room' | 'home' | 'no-hoop' | 'outdoor';
export type Equipment =
  | 'rebounder'
  | 'passer'
  | 'defender'
  | 'blockers'
  | 'strobes'
  | 'aqua-vest'
  | 'oversize-ball'
  | 'resistance-bands'
  | 'foam-roller'
  | 'none';

export interface DailyContext {
  id: string;
  playerId: string;
  date: string;

  // Daily inputs from player
  dayType: DayType;
  timeAvailable: 15 | 30 | 45 | 60 | 90 | 120; // minutes
  environment: Environment;
  equipment: Equipment[];

  // Auto-generated based on schedule
  isGameDay: boolean;
  hoursUntilGame?: number;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// WEEKLY SCHEDULE
// ============================================

export interface ScheduleEntry {
  id: string;
  playerId: string;
  date: string;
  dayType: DayType;

  // Game details (if game day)
  opponent?: string;
  opponentLogo?: string;
  gameTime?: string;
  isHome?: boolean;

  // Practice details (if practice day)
  practiceTime?: string;
  practiceType?: 'full' | 'shootaround' | 'walkthrough' | 'film';

  // Travel details (if travel day)
  destination?: string;
  departureTime?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface WeeklySchedule {
  playerId: string;
  weekStart: string;
  weekEnd: string;
  entries: ScheduleEntry[];
}

// ============================================
// DAILY TASKS & RECOMMENDATIONS
// ============================================

export type TaskCategory =
  | 'movement'
  | 'shooting'
  | 'ball-handling'
  | 'vision'
  | 'recovery'
  | 'mental'
  | 'live-play'
  | 'film';

export interface DailyTask {
  id: string;
  playerId: string;
  date: string;

  // Task definition
  title: string;
  description: string;
  category: TaskCategory;
  duration: number; // minutes
  priority: 'required' | 'recommended' | 'optional';

  // Conditions for showing this task
  requiredDayTypes?: DayType[];
  requiredEnvironments?: Environment[];
  requiredEquipment?: Equipment[];
  excludedDayTypes?: DayType[];

  // Coaching content
  cues: string[];
  videoUrl?: string;
  coachNotes?: string;
  progressionVariants?: string[];

  // Tracking
  isCompleted: boolean;
  completedAt?: string;
  playerNotes?: string;
  feelRating?: 1 | 2 | 3 | 4 | 5;

  // Display
  icon?: string;
  displayOrder: number;

  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// DAILY FOCUS & COACHING LAYER
// ============================================

export interface DailyFocus {
  id: string;
  playerId: string;
  date: string;

  // Main focus
  headline: string;
  subtext?: string;

  // Limiting factors to address today
  limitingFactorIds?: string[];

  // Key cues for the day
  cues: DailyCue[];

  // Deep work module (optional)
  deepWorkModule?: DeepWorkModule;

  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyCue {
  id: string;
  text: string;
  category: 'shooting' | 'decision' | 'mindset' | 'movement' | 'defense' | 'rebounding' | 'handle' | 'finishing' | 'recovery' | 'mental';
  icon?: string;
  priority: number;
}

export interface DeepWorkModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  tasks: DailyTask[];
  videoUrl?: string;
}

// ============================================
// LIMITING FACTORS
// ============================================

export interface LimitingFactor {
  id: string;
  playerId: string;

  // Core info
  name: string;
  shortDescription?: string;
  severity: 'low' | 'medium' | 'high';
  priority: number;

  // Coaching content
  awarenessCue?: string;
  drills?: DrillReference[];
  failureExample?: VideoExample;
  successExample?: VideoExample;

  // Status
  isActive: boolean;
  isAddressed: boolean;
  progressNotes?: string[];

  createdAt?: string;
  updatedAt?: string;
}

export interface VideoExample {
  url: string;
  caption?: string;
  thumbnailUrl?: string;
}

export interface DrillReference {
  id: string;
  name: string;
  description?: string;
  videoUrl?: string;
  duration?: number;
}

// ============================================
// SESSION TEMPLATES BY DAY TYPE
// ============================================

export interface SessionTemplate {
  id: string;
  name: string;
  dayType: DayType;

  // Conditions
  environments: Environment[];
  minTime: number;
  maxTime: number;
  requiredEquipment?: Equipment[];

  // Structure
  sections: SessionSection[];

  // Metadata
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SessionSection {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  duration: number;
  tasks: DailyTask[];
  isRequired: boolean;
}

// ============================================
// GAME DAY SPECIFIC
// ============================================

export interface GameDaySession {
  id: string;
  playerId: string;
  gameDate: string;
  opponent: string;

  // Pre-game
  pregameCues: DailyCue[];
  calibrationRoutine: CalibrationRoutine;
  mentalFocus: string[];

  // Post-game
  reflection?: GameReflection;

  createdAt?: string;
  updatedAt?: string;
}

export interface CalibrationRoutine {
  id: string;
  name: string;
  duration: number;
  spots: CalibrationSpot[];
  scoringSettings: ScoringSettings;
  principles: string[];
}

export interface CalibrationSpot {
  id: string;
  name: string;
  position: 'corner-left' | 'corner-right' | 'wing-left' | 'wing-right' | 'top' | 'elbow-left' | 'elbow-right';
  shotTypes: string[];
  targetScore: number;
}

export interface ScoringSettings {
  backRim: number;
  frontRimComesBack: number;
  directionalMiss: number;
  skidForward: number;
  make: number;
  targetScore: number;
}

export interface GameReflection {
  id: string;
  playerId: string;
  gameDate: string;

  // Stats (optional)
  minutesPlayed?: number;
  points?: number;
  threePointAttempts?: number;
  threePointMakes?: number;

  // Feel
  overallFeeling: 1 | 2 | 3 | 4 | 5;
  shootingConfidence: 1 | 2 | 3 | 4 | 5;

  // Reflection
  whatWorked?: string;
  whatToImprove?: string;
  huntingNextGame?: string;

  createdAt?: string;
}

// ============================================
// OFF DAY SPECIFIC
// ============================================

export interface OffDaySession {
  id: string;
  playerId: string;
  date: string;

  // Options based on environment
  movementExploration?: MovementModule;
  visionWork?: VisionModule;
  manipulation?: ManipulationModule;
  recovery?: RecoveryModule;

  createdAt?: string;
}

export interface MovementModule {
  id: string;
  title: string;
  exercises: Exercise[];
  duration: number;
}

export interface VisionModule {
  id: string;
  title: string;
  exercises: Exercise[];
  duration: number;
}

export interface ManipulationModule {
  id: string;
  title: string;
  exercises: Exercise[];
  duration: number;
  requiresEquipment: Equipment[];
}

export interface RecoveryModule {
  id: string;
  title: string;
  exercises: Exercise[];
  duration: number;
}

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  sets?: number;
  reps?: number | string;
  duration?: number;
  videoUrl?: string;
  cues?: string[];
}

// ============================================
// PRACTICE DAY SPECIFIC
// ============================================

export interface PracticeDaySession {
  id: string;
  playerId: string;
  date: string;

  // Live play awareness
  livePlayPrompts: string[];
  decisionMakingCues: string[];

  // Pre-practice calibration (if time)
  quickCalibration?: CalibrationRoutine;

  createdAt?: string;
}

// ============================================
// PLAYER TRACKING & DATA INPUT
// ============================================

export interface DailyLog {
  id: string;
  playerId: string;
  date: string;

  // Time tracking
  minutesTrained: number;

  // Optional detailed tracking
  shotsAttempted?: number;
  shotsMade?: number;

  // Feel ratings
  overallFeel: 1 | 2 | 3 | 4 | 5;
  energyLevel?: 1 | 2 | 3 | 4 | 5;
  focusLevel?: 1 | 2 | 3 | 4 | 5;

  // Notes
  notes?: string;

  // Tasks completed
  completedTaskIds: string[];

  createdAt?: string;
  updatedAt?: string;
}

export interface WeeklyProgress {
  playerId: string;
  weekStart: string;
  weekEnd: string;

  // Adherence
  daysLogged: number;
  totalMinutes: number;
  tasksCompleted: number;
  tasksTotal: number;
  adherenceStreak: number;

  // Trends
  avgFeelRating: number;
  avgEnergyLevel: number;
  focusTrends: Record<TaskCategory, number>;

  // Shooting (if tracked)
  shootingPercentage?: number;
  shotsAttempted?: number;
}

// ============================================
// COACH ADMIN TYPES
// ============================================

export interface CoachSettings {
  playerId: string;

  // Focus themes (what coach wants player to work on)
  activeThemes: string[];

  // Module toggles
  enabledModules: {
    shooting: boolean;
    movement: boolean;
    ballHandling: boolean;
    vision: boolean;
    recovery: boolean;
    mental: boolean;
    livePlay: boolean;
    film: boolean;
  };

  // Custom daily cues (override defaults)
  customCues?: DailyCue[];

  // Notes
  coachNotes?: CoachNote[];

  // Schedule adjustments
  scheduleOverrides?: ScheduleOverride[];

  updatedAt?: string;
}

export interface CoachNote {
  id: string;
  playerId: string;
  date: string;
  text: string;
  createdBy: string;
  createdAt?: string;
}

export interface ScheduleOverride {
  id: string;
  playerId: string;
  date: string;
  originalDayType: DayType;
  overrideDayType: DayType;
  reason?: string;
  createdBy?: string;
}

// ============================================
// DECISION ENGINE TYPES
// ============================================

export interface DecisionContext {
  player: BBPlayer;
  dailyContext: DailyContext;
  schedule: WeeklySchedule;
  limitingFactors: LimitingFactor[];
  coachSettings: CoachSettings;
  recentLogs: DailyLog[];
}

export interface GeneratedSession {
  date: string;
  dayType: DayType;

  // Focus
  todaysFocus: DailyFocus;

  // Tasks
  tasks: DailyTask[];

  // Total duration
  estimatedDuration: number;

  // Day-specific content
  gameDaySession?: GameDaySession;
  offDaySession?: OffDaySession;
  practiceDaySession?: PracticeDaySession;
}

// ============================================
// FULL DASHBOARD STATE
// ============================================

export interface BBPlayerDashboard {
  player: BBPlayer;

  // Today's context
  dailyContext: DailyContext | null;

  // Generated session
  session: GeneratedSession | null;

  // Schedule
  weeklySchedule: WeeklySchedule;

  // Limiting factors
  limitingFactors: LimitingFactor[];

  // Progress
  weeklyProgress: WeeklyProgress | null;
  recentLogs: DailyLog[];

  // Coach content
  coachNotes: CoachNote[];

  // UI state
  isLoading: boolean;
  hasCompletedDailySetup: boolean;
}
