// ============================================
// BB PLAYER SYSTEM - DECISION ENGINE
// Generates adaptive daily sessions based on context
// ============================================

import type {
  BBPlayer,
  DailyContext,
  DayType,
  Environment,
  Equipment,
  WeeklySchedule,
  LimitingFactor,
  CoachSettings,
  DailyLog,
  DecisionContext,
  GeneratedSession,
  DailyFocus,
  DailyTask,
  DailyCue,
  TaskCategory,
  GameDaySession,
  OffDaySession,
  PracticeDaySession,
  CalibrationRoutine,
} from '@/types/bb-player-system';

// ============================================
// TASK LIBRARIES (JSON-driven)
// ============================================

const SHOOTING_TASKS: Partial<DailyTask>[] = [
  {
    title: 'Deep Distance Calibration',
    description: 'Find your deep distance line and dial in ball flight',
    category: 'shooting',
    duration: 10,
    requiredEnvironments: ['court'],
    excludedDayTypes: ['travel-day'],
    cues: [
      'Back rim is a good miss',
      'Control distance before direction',
      'No mechanical thoughts - just target',
    ],
  },
  {
    title: '14-Spot Series',
    description: 'Plus/Minus scoring from 14 game spots',
    category: 'shooting',
    duration: 15,
    requiredEnvironments: ['court'],
    excludedDayTypes: ['travel-day', 'off-day'],
    cues: [
      'Back rim = neutral, directional miss = -1',
      'Build to +5 before moving',
      'Same rhythm, different spots',
    ],
  },
  {
    title: 'Catch Variety Work',
    description: 'High pass, middle pass, low pass - adjust and fire',
    category: 'shooting',
    duration: 8,
    requiredEnvironments: ['court'],
    requiredEquipment: ['passer'],
    cues: [
      'Catch everything to shoot',
      'Adjust feet, not hands',
      'Same release point regardless of catch',
    ],
  },
  {
    title: 'Form Shooting (No Hoop)',
    description: 'Ball flight visualization and release work',
    category: 'shooting',
    duration: 10,
    requiredEnvironments: ['home', 'no-hoop'],
    cues: [
      'Feel the ball leave your fingertips',
      'Visualize the arc to back rim',
      'Smooth is fast',
    ],
  },
];

const MOVEMENT_TASKS: Partial<DailyTask>[] = [
  {
    title: 'Movement Exploration',
    description: 'Free-form movement patterns with awareness',
    category: 'movement',
    duration: 10,
    cues: [
      'Vary speeds and directions',
      'Notice what feels restricted',
      'Move through stiffness, not around it',
    ],
  },
  {
    title: 'Footwork Patterns',
    description: 'Game-speed footwork with defensive slide variations',
    category: 'movement',
    duration: 8,
    requiredEnvironments: ['court', 'weight-room'],
    cues: [
      'Hip turn bias on closeouts',
      'Push off back foot, not pull with front',
      'Wide base, active hands',
    ],
  },
  {
    title: 'Pregame Movement Prep',
    description: 'Activate movement patterns for game conditions',
    category: 'movement',
    duration: 6,
    requiredDayTypes: ['game-day'],
    cues: [
      'Light sweat, not fatigue',
      'Prime the nervous system',
      'Feel explosive, not exhausted',
    ],
  },
];

const BALL_HANDLING_TASKS: Partial<DailyTask>[] = [
  {
    title: 'Ball Manipulation',
    description: 'Fingertip control and ball familiarity',
    category: 'ball-handling',
    duration: 8,
    cues: [
      'Dribble hard, high',
      'Eyes up, feel the ball',
      'Vary speeds constantly',
    ],
  },
  {
    title: 'Handle Under Constraint',
    description: 'Strobes or defender pressure on handle',
    category: 'ball-handling',
    duration: 10,
    requiredEquipment: ['strobes', 'defender'],
    cues: [
      'Trust peripheral vision',
      'Delayed accelerations',
      'Protect the ball with body angles',
    ],
  },
  {
    title: 'Home Ball Work',
    description: 'Stationary dribbling and ball control',
    category: 'ball-handling',
    duration: 10,
    requiredEnvironments: ['home', 'no-hoop'],
    cues: [
      'Fingertip control only',
      'Eyes closed challenge',
      'Work weak hand double the reps',
    ],
  },
];

const VISION_TASKS: Partial<DailyTask>[] = [
  {
    title: 'Vision Training',
    description: 'Peripheral awareness and reaction work',
    category: 'vision',
    duration: 8,
    requiredEquipment: ['strobes'],
    cues: [
      'Soft focus, wide gaze',
      'See the whole floor',
      'React to movement, not anticipation',
    ],
  },
  {
    title: 'Film Study',
    description: 'Watch game clips with specific focus',
    category: 'film',
    duration: 15,
    requiredEnvironments: ['home'],
    cues: [
      'Watch without judgment first',
      'Identify decision points',
      'Note body positioning trends',
    ],
  },
];

const RECOVERY_TASKS: Partial<DailyTask>[] = [
  {
    title: 'Active Recovery',
    description: 'Light movement and mobility work',
    category: 'recovery',
    duration: 15,
    requiredDayTypes: ['off-day', 'travel-day'],
    cues: [
      'Move through full ranges',
      'Breathe into tight spots',
      'No forcing, just exploring',
    ],
  },
  {
    title: 'Foam Rolling & Mobility',
    description: 'Target areas of restriction',
    category: 'recovery',
    duration: 10,
    requiredEquipment: ['foam-roller'],
    cues: [
      'Slow rolls, pause on tender spots',
      'Breathe and relax into pressure',
      'Follow with movement',
    ],
  },
];

const MENTAL_TASKS: Partial<DailyTask>[] = [
  {
    title: 'Visualization',
    description: 'Mental rehearsal of game scenarios',
    category: 'mental',
    duration: 5,
    cues: [
      'See shots going in with perfect arc',
      'Feel the confidence in your body',
      'Visualize specific game situations',
    ],
  },
  {
    title: 'Breathing Reset',
    description: 'Box breathing for nervous system regulation',
    category: 'mental',
    duration: 3,
    cues: [
      '4 seconds in, 4 hold, 4 out, 4 hold',
      'Calm the system before competition',
      'Reset between tasks',
    ],
  },
];

const LIVE_PLAY_TASKS: Partial<DailyTask>[] = [
  {
    title: 'Live Play Awareness Drills',
    description: 'Decision-making under game conditions',
    category: 'live-play',
    duration: 15,
    requiredDayTypes: ['practice-day'],
    requiredEnvironments: ['court'],
    cues: [
      'Read the defense, not your plan',
      'Hunt your shot, don\'t wait for it',
      'Play passing angles',
    ],
  },
];

// ============================================
// DEFAULT CUES BY DAY TYPE
// ============================================

const GAME_DAY_CUES: DailyCue[] = [
  { id: 'gd-1', text: 'Back rim is a good miss', category: 'shooting', priority: 1 },
  { id: 'gd-2', text: 'Hunt your shot, don\'t wait', category: 'decision', priority: 2 },
  { id: 'gd-3', text: 'Same shot, every time', category: 'mindset', priority: 3 },
  { id: 'gd-4', text: 'Play with controlled aggression', category: 'mindset', priority: 4 },
];

const PRACTICE_DAY_CUES: DailyCue[] = [
  { id: 'pd-1', text: 'Make practice game-like', category: 'mindset', priority: 1 },
  { id: 'pd-2', text: 'Read the defense, not your plan', category: 'decision', priority: 2 },
  { id: 'pd-3', text: 'Work on what you avoid', category: 'mindset', priority: 3 },
];

const OFF_DAY_CUES: DailyCue[] = [
  { id: 'od-1', text: 'Recovery is training', category: 'mindset', priority: 1 },
  { id: 'od-2', text: 'Move with intention, not intensity', category: 'movement', priority: 2 },
  { id: 'od-3', text: 'Prepare the body for the next demand', category: 'recovery', priority: 3 },
];

const TRAVEL_DAY_CUES: DailyCue[] = [
  { id: 'td-1', text: 'Stay loose, stay ready', category: 'mindset', priority: 1 },
  { id: 'td-2', text: 'Hydrate and move when possible', category: 'recovery', priority: 2 },
  { id: 'td-3', text: 'Mental prep can happen anywhere', category: 'mental', priority: 3 },
];

// ============================================
// DEFAULT CALIBRATION ROUTINES
// ============================================

const DEFAULT_PREGAME_CALIBRATION: CalibrationRoutine = {
  id: 'pregame-default',
  name: 'Standard Pre-Game Calibration',
  duration: 15,
  spots: [
    { id: 'corner-l', name: 'Corner Left', position: 'corner-left', shotTypes: ['catch-shoot'], targetScore: 3 },
    { id: 'wing-l', name: 'Wing Left', position: 'wing-left', shotTypes: ['catch-shoot'], targetScore: 3 },
    { id: 'top', name: 'Top of Key', position: 'top', shotTypes: ['catch-shoot'], targetScore: 3 },
    { id: 'wing-r', name: 'Wing Right', position: 'wing-right', shotTypes: ['catch-shoot'], targetScore: 3 },
    { id: 'corner-r', name: 'Corner Right', position: 'corner-right', shotTypes: ['catch-shoot'], targetScore: 3 },
  ],
  scoringSettings: {
    backRim: 0,
    frontRimComesBack: -1,
    directionalMiss: -1,
    skidForward: 0,
    make: 1,
    targetScore: 3,
  },
  principles: [
    'Same shot, every spot',
    'Back rim is neutral',
    'Build confidence, not fatigue',
  ],
};

// ============================================
// DECISION ENGINE
// ============================================

export class BBDecisionEngine {
  private context: DecisionContext;

  constructor(context: DecisionContext) {
    this.context = context;
  }

  /**
   * Generate a complete daily session based on context
   */
  generateSession(): GeneratedSession {
    const { dailyContext } = this.context;
    const dayType = dailyContext.dayType;

    // Generate focus
    const todaysFocus = this.generateFocus();

    // Generate tasks based on context
    const tasks = this.generateTasks();

    // Calculate total duration
    const estimatedDuration = tasks.reduce((sum, task) => sum + task.duration, 0);

    // Generate day-specific content
    const session: GeneratedSession = {
      date: dailyContext.date,
      dayType,
      todaysFocus,
      tasks,
      estimatedDuration,
    };

    // Add day-specific sessions
    switch (dayType) {
      case 'game-day':
        session.gameDaySession = this.generateGameDaySession();
        break;
      case 'off-day':
        session.offDaySession = this.generateOffDaySession();
        break;
      case 'practice-day':
        session.practiceDaySession = this.generatePracticeDaySession();
        break;
    }

    return session;
  }

  /**
   * Generate daily focus based on limiting factors and coach settings
   */
  private generateFocus(): DailyFocus {
    const { dailyContext, limitingFactors, coachSettings } = this.context;
    const dayType = dailyContext.dayType;

    // Get cues for the day type
    let cues: DailyCue[];
    switch (dayType) {
      case 'game-day':
        cues = GAME_DAY_CUES;
        break;
      case 'practice-day':
        cues = PRACTICE_DAY_CUES;
        break;
      case 'off-day':
        cues = OFF_DAY_CUES;
        break;
      case 'travel-day':
        cues = TRAVEL_DAY_CUES;
        break;
      default:
        cues = PRACTICE_DAY_CUES;
    }

    // Override with coach custom cues if available
    if (coachSettings.customCues && coachSettings.customCues.length > 0) {
      cues = coachSettings.customCues;
    }

    // Generate headline based on day type
    let headline: string;
    let subtext: string | undefined;

    switch (dayType) {
      case 'game-day':
        headline = 'Game Day Focus';
        subtext = 'Trust your preparation. Execute with confidence.';
        break;
      case 'practice-day':
        headline = 'Practice Day Focus';
        subtext = 'Make every rep game-like.';
        break;
      case 'off-day':
        headline = 'Recovery & Preparation';
        subtext = 'Restore the system. Prepare for the next demand.';
        break;
      case 'travel-day':
        headline = 'Travel Day';
        subtext = 'Stay loose and mentally prepared.';
        break;
      default:
        headline = 'Today\'s Focus';
    }

    // Get active limiting factors
    const activeLimitingFactors = limitingFactors
      .filter(lf => lf.isActive && !lf.isAddressed)
      .slice(0, 3);

    return {
      id: `focus-${dailyContext.date}`,
      playerId: this.context.player.id,
      date: dailyContext.date,
      headline,
      subtext,
      cues,
      limitingFactorIds: activeLimitingFactors.map(lf => lf.id),
    };
  }

  /**
   * Generate tasks based on time, environment, equipment, and day type
   */
  private generateTasks(): DailyTask[] {
    const { dailyContext, coachSettings, player } = this.context;
    const { dayType, timeAvailable, environment, equipment } = dailyContext;

    // Collect all potential tasks
    const allTasks = [
      ...SHOOTING_TASKS,
      ...MOVEMENT_TASKS,
      ...BALL_HANDLING_TASKS,
      ...VISION_TASKS,
      ...RECOVERY_TASKS,
      ...MENTAL_TASKS,
      ...LIVE_PLAY_TASKS,
    ];

    // Filter tasks based on conditions
    const eligibleTasks = allTasks.filter(task => {
      // Check day type requirements
      if (task.requiredDayTypes && !task.requiredDayTypes.includes(dayType)) {
        return false;
      }

      // Check day type exclusions
      if (task.excludedDayTypes && task.excludedDayTypes.includes(dayType)) {
        return false;
      }

      // Check environment requirements
      if (task.requiredEnvironments && !task.requiredEnvironments.includes(environment)) {
        return false;
      }

      // Check equipment requirements
      if (task.requiredEquipment) {
        const hasRequired = task.requiredEquipment.some(req => equipment.includes(req));
        if (!hasRequired) {
          return false;
        }
      }

      // Check if module is enabled by coach
      const category = task.category as TaskCategory;
      const moduleKey = this.categoryToModuleKey(category);
      if (moduleKey && coachSettings.enabledModules && !coachSettings.enabledModules[moduleKey]) {
        return false;
      }

      return true;
    });

    // Prioritize tasks based on day type
    const prioritizedTasks = this.prioritizeTasks(eligibleTasks, dayType);

    // Select tasks that fit within time budget
    const selectedTasks: DailyTask[] = [];
    let totalDuration = 0;

    for (const task of prioritizedTasks) {
      if (totalDuration + (task.duration || 10) <= timeAvailable) {
        selectedTasks.push({
          ...task,
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          playerId: player.id,
          date: dailyContext.date,
          priority: selectedTasks.length < 3 ? 'required' : 'recommended',
          isCompleted: false,
          displayOrder: selectedTasks.length,
        } as DailyTask);
        totalDuration += task.duration || 10;
      }
    }

    return selectedTasks;
  }

  /**
   * Map task category to coach module key
   */
  private categoryToModuleKey(category: TaskCategory): keyof CoachSettings['enabledModules'] | null {
    const mapping: Record<TaskCategory, keyof CoachSettings['enabledModules'] | null> = {
      'movement': 'movement',
      'shooting': 'shooting',
      'ball-handling': 'ballHandling',
      'vision': 'vision',
      'recovery': 'recovery',
      'mental': 'mental',
      'live-play': 'livePlay',
      'film': 'film',
    };
    return mapping[category] || null;
  }

  /**
   * Prioritize tasks based on day type
   */
  private prioritizeTasks(tasks: Partial<DailyTask>[], dayType: DayType): Partial<DailyTask>[] {
    const priorityOrder: Record<DayType, TaskCategory[]> = {
      'game-day': ['mental', 'shooting', 'movement'],
      'practice-day': ['shooting', 'live-play', 'ball-handling', 'movement'],
      'off-day': ['recovery', 'movement', 'vision', 'mental'],
      'travel-day': ['mental', 'recovery', 'vision'],
    };

    const order = priorityOrder[dayType] || priorityOrder['practice-day'];

    return tasks.sort((a, b) => {
      const aIndex = order.indexOf(a.category as TaskCategory);
      const bIndex = order.indexOf(b.category as TaskCategory);
      const aScore = aIndex === -1 ? 99 : aIndex;
      const bScore = bIndex === -1 ? 99 : bIndex;
      return aScore - bScore;
    });
  }

  /**
   * Generate game day specific session
   */
  private generateGameDaySession(): GameDaySession {
    const { dailyContext, player } = this.context;

    return {
      id: `gds-${dailyContext.date}`,
      playerId: player.id,
      gameDate: dailyContext.date,
      opponent: 'TBD', // Would come from schedule

      pregameCues: GAME_DAY_CUES,
      calibrationRoutine: DEFAULT_PREGAME_CALIBRATION,
      mentalFocus: [
        'Trust your preparation',
        'Play the game, not the score',
        'Hunt your shot with confidence',
      ],
    };
  }

  /**
   * Generate off day specific session
   */
  private generateOffDaySession(): OffDaySession {
    const { dailyContext, player } = this.context;

    return {
      id: `ods-${dailyContext.date}`,
      playerId: player.id,
      date: dailyContext.date,
    };
  }

  /**
   * Generate practice day specific session
   */
  private generatePracticeDaySession(): PracticeDaySession {
    const { dailyContext, player } = this.context;

    return {
      id: `pds-${dailyContext.date}`,
      playerId: player.id,
      date: dailyContext.date,
      livePlayPrompts: [
        'Hunt the shot when the help is late',
        'Play passing angles on defense',
        'Move when the dribbler picks up',
      ],
      decisionMakingCues: [
        'Read the defense, not your plan',
        'Attack closeouts, relocate against help',
        'Make the simple play in traffic',
      ],
    };
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Create a decision context from player data
 */
export function createDecisionContext(
  player: BBPlayer,
  dailyContext: DailyContext,
  schedule: WeeklySchedule,
  limitingFactors: LimitingFactor[],
  coachSettings: CoachSettings,
  recentLogs: DailyLog[]
): DecisionContext {
  return {
    player,
    dailyContext,
    schedule,
    limitingFactors,
    coachSettings,
    recentLogs,
  };
}

/**
 * Generate a session for a player
 */
export function generatePlayerSession(context: DecisionContext): GeneratedSession {
  const engine = new BBDecisionEngine(context);
  return engine.generateSession();
}
