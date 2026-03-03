-- =====================================================
-- ELITE LOGIN HISTORY + PLAYER AUTH COLUMNS
-- =====================================================

-- Add email and last_active_at columns to elite_players
ALTER TABLE elite_players ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE elite_players ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;

-- Index for fast token lookups during auth
CREATE INDEX IF NOT EXISTS idx_elite_players_access_token ON elite_players(access_token);

-- Login history table
CREATE TABLE IF NOT EXISTS elite_login_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES elite_players(id) ON DELETE CASCADE,
  login_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE elite_login_history ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access to elite_login_history" ON elite_login_history
  FOR ALL USING (auth.role() = 'service_role');

-- Admin/Coach read access
CREATE POLICY "Admins can read elite_login_history" ON elite_login_history
  FOR SELECT USING (
    auth.role() = 'authenticated' AND
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'coach')
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_elite_login_history_player_id ON elite_login_history(player_id);
CREATE INDEX IF NOT EXISTS idx_elite_login_history_login_at ON elite_login_history(player_id, login_at DESC);
