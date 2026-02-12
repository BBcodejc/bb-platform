-- =====================================================
-- DYNAMIC PLAYERS SYSTEM DATABASE TABLES
-- Completely isolated from Elite profiles
-- =====================================================

-- =====================================================
-- CORE DYNAMIC PLAYERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS dynamic_players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  position TEXT,
  level TEXT NOT NULL DEFAULT 'recreational' CHECK (level IN ('elite', 'pro', 'college', 'high-school', 'youth', 'recreational')),
  adherence_streak INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  default_equipment TEXT[] DEFAULT '{}',
  preferred_session_length INTEGER DEFAULT 30,
  notifications_enabled BOOLEAN DEFAULT true,
  timezone TEXT,
  is_active BOOLEAN DEFAULT true,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DAILY CONTEXT (Player's daily setup)
-- =====================================================

CREATE TABLE IF NOT EXISTS dynamic_daily_context (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES dynamic_players(id) ON DELETE CASCADE,
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

-- =====================================================
-- DAILY FOCUS (Generated coaching headline)
-- =====================================================

CREATE TABLE IF NOT EXISTS dynamic_daily_focus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES dynamic_players(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  headline TEXT NOT NULL,
  subtext TEXT,
  cues JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, date)
);

-- =====================================================
-- DAILY TASKS (Generated tasks for each day)
-- =====================================================

CREATE TABLE IF NOT EXISTS dynamic_daily_tasks (
  id TEXT PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES dynamic_players(id) ON DELETE CASCADE,
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

-- =====================================================
-- DAILY LOGS (Player tracking)
-- =====================================================

CREATE TABLE IF NOT EXISTS dynamic_daily_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES dynamic_players(id) ON DELETE CASCADE,
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

-- =====================================================
-- SCHEDULE ENTRIES (Games, practices, travel)
-- =====================================================

CREATE TABLE IF NOT EXISTS dynamic_schedule_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES dynamic_players(id) ON DELETE CASCADE,
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

-- =====================================================
-- COACH SETTINGS (Per player)
-- =====================================================

CREATE TABLE IF NOT EXISTS dynamic_coach_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES dynamic_players(id) ON DELETE CASCADE,
  active_themes TEXT[] DEFAULT '{}',
  enabled_modules JSONB DEFAULT '{"shooting": true, "movement": true, "ballHandling": true, "vision": true, "recovery": true, "mental": true, "livePlay": true, "film": true}',
  custom_cues JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id)
);

-- =====================================================
-- GAME REFLECTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS dynamic_game_reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES dynamic_players(id) ON DELETE CASCADE,
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
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE dynamic_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE dynamic_daily_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE dynamic_daily_focus ENABLE ROW LEVEL SECURITY;
ALTER TABLE dynamic_daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE dynamic_daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dynamic_schedule_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE dynamic_coach_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE dynamic_game_reflections ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - Service Role
-- =====================================================

CREATE POLICY "Service role full access to dynamic_players" ON dynamic_players
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to dynamic_daily_context" ON dynamic_daily_context
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to dynamic_daily_focus" ON dynamic_daily_focus
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to dynamic_daily_tasks" ON dynamic_daily_tasks
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to dynamic_daily_logs" ON dynamic_daily_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to dynamic_schedule_entries" ON dynamic_schedule_entries
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to dynamic_coach_settings" ON dynamic_coach_settings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to dynamic_game_reflections" ON dynamic_game_reflections
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- RLS POLICIES - Admin/Coach Access
-- =====================================================

CREATE POLICY "Admins can access all dynamic_players" ON dynamic_players
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'coach')
  );

CREATE POLICY "Admins can access all dynamic_daily_context" ON dynamic_daily_context
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'coach')
  );

CREATE POLICY "Admins can access all dynamic_daily_focus" ON dynamic_daily_focus
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'coach')
  );

CREATE POLICY "Admins can access all dynamic_daily_tasks" ON dynamic_daily_tasks
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'coach')
  );

CREATE POLICY "Admins can access all dynamic_daily_logs" ON dynamic_daily_logs
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'coach')
  );

CREATE POLICY "Admins can access all dynamic_schedule_entries" ON dynamic_schedule_entries
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'coach')
  );

CREATE POLICY "Admins can access all dynamic_coach_settings" ON dynamic_coach_settings
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'coach')
  );

CREATE POLICY "Admins can access all dynamic_game_reflections" ON dynamic_game_reflections
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'coach')
  );

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_dynamic_players_email ON dynamic_players(email);
CREATE INDEX IF NOT EXISTS idx_dynamic_daily_context_player_date ON dynamic_daily_context(player_id, date);
CREATE INDEX IF NOT EXISTS idx_dynamic_daily_focus_player_date ON dynamic_daily_focus(player_id, date);
CREATE INDEX IF NOT EXISTS idx_dynamic_daily_tasks_player_date ON dynamic_daily_tasks(player_id, date);
CREATE INDEX IF NOT EXISTS idx_dynamic_daily_logs_player_date ON dynamic_daily_logs(player_id, date);
CREATE INDEX IF NOT EXISTS idx_dynamic_schedule_entries_player_date ON dynamic_schedule_entries(player_id, date);

-- =====================================================
-- SEED TEST PLAYER
-- =====================================================

INSERT INTO dynamic_players (id, first_name, last_name, email, position, level)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Demo',
  'Player',
  'demo@example.com',
  'Guard',
  'recreational'
) ON CONFLICT (email) DO NOTHING;
