-- =====================================================
-- BB PLAYER SYSTEM DATABASE TABLES
-- Daily Adaptive Performance Platform
-- =====================================================

-- Player Daily Context (what they select each day)
CREATE TABLE IF NOT EXISTS player_daily_context (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES elite_players(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  day_type TEXT NOT NULL CHECK (day_type IN ('game-day', 'practice-day', 'off-day', 'travel-day')),
  time_available INTEGER NOT NULL DEFAULT 30,
  environment TEXT NOT NULL CHECK (environment IN ('court', 'weight-room', 'home', 'no-hoop', 'outdoor')),
  equipment TEXT[] DEFAULT '{}',
  is_game_day BOOLEAN DEFAULT false,
  hours_until_game INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, date)
);

-- Player Daily Tasks (generated tasks for each day)
CREATE TABLE IF NOT EXISTS player_daily_tasks (
  id TEXT PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES elite_players(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('movement', 'shooting', 'ball-handling', 'vision', 'recovery', 'mental', 'live-play', 'film')),
  duration INTEGER NOT NULL DEFAULT 10,
  priority TEXT NOT NULL DEFAULT 'recommended' CHECK (priority IN ('required', 'recommended', 'optional')),
  cues TEXT[] DEFAULT '{}',
  video_url TEXT,
  coach_notes TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  player_notes TEXT,
  feel_rating INTEGER CHECK (feel_rating BETWEEN 1 AND 5),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player Daily Logs (daily tracking)
CREATE TABLE IF NOT EXISTS player_daily_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES elite_players(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  minutes_trained INTEGER NOT NULL DEFAULT 0,
  shots_attempted INTEGER,
  shots_made INTEGER,
  overall_feel INTEGER CHECK (overall_feel BETWEEN 1 AND 5),
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  focus_level INTEGER CHECK (focus_level BETWEEN 1 AND 5),
  notes TEXT,
  completed_task_ids TEXT[] DEFAULT '{}',
  completed_task_count INTEGER DEFAULT 0,
  total_task_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, date)
);

-- Player Schedule Entries (games, practices, travel)
CREATE TABLE IF NOT EXISTS player_schedule_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES elite_players(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  day_type TEXT NOT NULL CHECK (day_type IN ('game-day', 'practice-day', 'off-day', 'travel-day')),
  opponent TEXT,
  opponent_logo TEXT,
  game_time TEXT,
  is_home BOOLEAN,
  practice_time TEXT,
  practice_type TEXT CHECK (practice_type IN ('full', 'shootaround', 'walkthrough', 'film')),
  destination TEXT,
  departure_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coach Settings (per player)
CREATE TABLE IF NOT EXISTS player_coach_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES elite_players(id) ON DELETE CASCADE,
  active_themes TEXT[] DEFAULT '{}',
  enabled_modules JSONB DEFAULT '{"shooting": true, "movement": true, "ballHandling": true, "vision": true, "recovery": true, "mental": true, "livePlay": true, "film": true}',
  custom_cues JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id)
);

-- Game Reflections
CREATE TABLE IF NOT EXISTS player_game_reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES elite_players(id) ON DELETE CASCADE,
  game_date DATE NOT NULL,
  minutes_played INTEGER,
  points INTEGER,
  three_point_attempts INTEGER,
  three_point_makes INTEGER,
  overall_feeling INTEGER CHECK (overall_feeling BETWEEN 1 AND 5),
  shooting_confidence INTEGER CHECK (shooting_confidence BETWEEN 1 AND 5),
  what_worked TEXT,
  what_to_improve TEXT,
  hunting_next_game TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, game_date)
);

-- =====================================================
-- ENABLE RLS ON NEW TABLES
-- =====================================================

ALTER TABLE player_daily_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_schedule_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_coach_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_game_reflections ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Service role full access
CREATE POLICY "Service role full access to player_daily_context" ON player_daily_context
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to player_daily_tasks" ON player_daily_tasks
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to player_daily_logs" ON player_daily_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to player_schedule_entries" ON player_schedule_entries
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to player_coach_settings" ON player_coach_settings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to player_game_reflections" ON player_game_reflections
  FOR ALL USING (auth.role() = 'service_role');

-- Admin/Coach access
CREATE POLICY "Admins can access all player_daily_context" ON player_daily_context
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'coach')
  );

CREATE POLICY "Admins can access all player_daily_tasks" ON player_daily_tasks
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'coach')
  );

CREATE POLICY "Admins can access all player_daily_logs" ON player_daily_logs
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'coach')
  );

CREATE POLICY "Admins can access all player_schedule_entries" ON player_schedule_entries
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'coach')
  );

CREATE POLICY "Admins can access all player_coach_settings" ON player_coach_settings
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'coach')
  );

CREATE POLICY "Admins can access all player_game_reflections" ON player_game_reflections
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'coach')
  );

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_player_daily_context_player_date ON player_daily_context(player_id, date);
CREATE INDEX IF NOT EXISTS idx_player_daily_tasks_player_date ON player_daily_tasks(player_id, date);
CREATE INDEX IF NOT EXISTS idx_player_daily_logs_player_date ON player_daily_logs(player_id, date);
CREATE INDEX IF NOT EXISTS idx_player_schedule_entries_player_date ON player_schedule_entries(player_id, date);
