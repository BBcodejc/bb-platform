-- =====================================================
-- ELITE POST-GAME SHOT ANALYSIS TABLE
-- Track individual shot profiles for post-game analysis
-- =====================================================

-- First, update the session_type constraint to include 'postgame'
ALTER TABLE elite_training_sessions DROP CONSTRAINT IF EXISTS elite_training_sessions_session_type_check;
ALTER TABLE elite_training_sessions ADD CONSTRAINT elite_training_sessions_session_type_check
  CHECK (session_type IN ('pre-game', 'training', 'film', 'recovery', 'evaluation', 'game', 'postgame'));

-- Create the shot tracking table
CREATE TABLE IF NOT EXISTS elite_postgame_shots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES elite_training_sessions(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES elite_players(id) ON DELETE CASCADE,
  shot_number INTEGER NOT NULL,

  -- Result
  result TEXT NOT NULL CHECK (result IN ('make', 'miss')),

  -- Shot classification
  shot_type TEXT,        -- catch-and-shoot, pull-up, off-screen, post-fade, step-back, floater, other
  miss_type TEXT,        -- left, right, short, long, back-rim, front-rim, air-ball, blocked (null if make)

  -- Biomechanical categories
  time_to_shot TEXT CHECK (time_to_shot IS NULL OR time_to_shot IN ('0.5_or_less', '0.5_to_0.8', '0.8_plus')),
  energy_pattern TEXT CHECK (energy_pattern IS NULL OR energy_pattern IN ('subtle_drift', 'very_little_drift', 'fade')),
  ball_pattern TEXT CHECK (ball_pattern IS NULL OR ball_pattern IN ('dip', 'no_dip', 'large_dip', 'compact_dip')),
  follow_through TEXT CHECK (follow_through IS NULL OR follow_through IN ('no_hold', 'hold')),
  alignment TEXT CHECK (alignment IS NULL OR alignment IN ('square_to_rim', 'bias_angled_left')),

  -- Notes
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE elite_postgame_shots ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Service role full access to elite_postgame_shots" ON elite_postgame_shots
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can access all elite_postgame_shots" ON elite_postgame_shots
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'coach')
  );

-- Allow public read for player-facing report pages
CREATE POLICY "Public read access to elite_postgame_shots" ON elite_postgame_shots
  FOR SELECT USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_postgame_shots_session ON elite_postgame_shots(session_id);
CREATE INDEX IF NOT EXISTS idx_postgame_shots_player ON elite_postgame_shots(player_id);
CREATE INDEX IF NOT EXISTS idx_postgame_shots_result ON elite_postgame_shots(result);
