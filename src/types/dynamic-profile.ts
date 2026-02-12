// ============================================
// DYNAMIC PLAYER PROFILE TYPES
// Interactive coaching OS for standard players
// Player-editable, logic-driven
// ============================================

export interface DynamicPlayerProfile {
  id: string;

  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  level: 'youth' | 'high-school' | 'college' | 'pro' | 'recreational';

  // Settings
  timezone?: string;
  preferredSessionLength: number;
  notificationsEnabled: boolean;

  // Stats
  adherenceStreak: number;
  totalMinutesTrained: number;

  // Status
  isActive: boolean;
  lastActiveAt?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Day Types
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

// Daily Context (player inputs each day)
export interface DynamicDailyContext {
  id: string;
  playerId: string;
  date: string;

  dayType: DayType;
  timeAvailable: number;
  environment: Environment;
  equipment: Equipment[];

  // Auto-calculated
  isGameDay: boolean;
  hoursUntilGame?: number;

  createdAt: string;
}

// Task Categories
export type TaskCategory =
  | 'movement'
  | 'shooting'
  | 'ball-handling'
  | 'vision'
  | 'recovery'
  | 'mental'
  | 'live-play'
  | 'film';

// Daily Task (auto-generated)
export interface DynamicTask {
  id: string;
  playerId: string;
  date: string;

  title: string;
  description: string;
  category: TaskCategory;
  duration: number;
  priority: 'required' | 'recommended' | 'optional';

  cues: string[];
  videoUrl?: string;

  isCompleted: boolean;
  completedAt?: string;
  feelRating?: 1 | 2 | 3 | 4 | 5;
  playerNotes?: string;

  displayOrder: number;
  createdAt: string;
}

// Daily Focus (auto-generated based on context)
export interface DynamicDailyFocus {
  id: string;
  playerId: string;
  date: string;

  headline: string;
  subtext?: string;
  cues: DynamicCue[];

  createdAt: string;
}

export interface DynamicCue {
  id: string;
  text: string;
  category: 'shooting' | 'decision' | 'mindset' | 'movement' | 'recovery' | 'mental';
  priority: number;
}

// Generated Session
export interface DynamicSession {
  date: string;
  dayType: DayType;
  focus: DynamicDailyFocus;
  tasks: DynamicTask[];
  estimatedDuration: number;
}

// Daily Log (player input)
export interface DynamicDailyLog {
  id: string;
  playerId: string;
  date: string;

  minutesTrained: number;
  shotsAttempted?: number;
  shotsMade?: number;

  overallFeel: 1 | 2 | 3 | 4 | 5;
  energyLevel?: 1 | 2 | 3 | 4 | 5;
  focusLevel?: 1 | 2 | 3 | 4 | 5;

  notes?: string;
  completedTaskIds: string[];

  createdAt: string;
}

// Weekly Progress (auto-calculated)
export interface DynamicWeeklyProgress {
  playerId: string;
  weekStart: string;
  weekEnd: string;

  daysLogged: number;
  totalMinutes: number;
  tasksCompleted: number;
  tasksTotal: number;
  adherenceStreak: number;

  avgFeelRating: number;
  avgEnergyLevel: number;

  focusTrends: Record<TaskCategory, number>;
}

// Schedule Entry
export interface DynamicScheduleEntry {
  id: string;
  playerId: string;
  date: string;
  dayType: DayType;

  // Game details
  opponent?: string;
  gameTime?: string;
  isHome?: boolean;

  // Practice details
  practiceTime?: string;
  practiceType?: 'full' | 'shootaround' | 'walkthrough' | 'film';

  createdAt: string;
}

// Full Dynamic Dashboard
export interface DynamicDashboard {
  player: DynamicPlayerProfile;
  dailyContext: DynamicDailyContext | null;
  session: DynamicSession | null;
  weeklyProgress: DynamicWeeklyProgress | null;
  schedule: DynamicScheduleEntry[];
  recentLogs: DynamicDailyLog[];

  // UI State
  hasCompletedDailySetup: boolean;
}
