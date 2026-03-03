-- =====================================================
-- ELITE TRAINING SESSIONS TABLE
-- Track all sessions, pre-game cards, and training plans
-- =====================================================

CREATE TABLE IF NOT EXISTS elite_training_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES elite_players(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('pre-game', 'training', 'film', 'recovery', 'evaluation', 'game')),
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  location TEXT,
  opponent TEXT,
  focus_areas TEXT[] DEFAULT '{}',
  notes TEXT,
  link TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE elite_training_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Service role full access to elite_training_sessions" ON elite_training_sessions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can access all elite_training_sessions" ON elite_training_sessions
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'coach')
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_elite_sessions_player_date ON elite_training_sessions(player_id, date);
CREATE INDEX IF NOT EXISTS idx_elite_sessions_type ON elite_training_sessions(session_type);

-- Seed: Add today's pre-game session for Tobias
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, duration_minutes, focus_areas, link, created_by)
SELECT
  id,
  '2025-02-19',
  'pre-game',
  'Pre-Game Routine — vs Knicks',
  'Knicks',
  45,
  ARRAY['calibration', 'velocity-reset', 'post-fades'],
  '/elite/tobias-harris/pregame',
  'Coach Jake'
FROM elite_players
WHERE slug = 'tobias-harris'
ON CONFLICT DO NOTHING;
