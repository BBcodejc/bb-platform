-- =====================================================
-- ELITE DAILY COACHING NOTES TABLE
-- Day-level coaching notes, independent of sessions
-- One note per player per day
-- =====================================================
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS elite_daily_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES elite_players(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  note TEXT NOT NULL,
  visible_to_player BOOLEAN DEFAULT false,
  created_by TEXT DEFAULT 'Coach',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, date)
);

-- Enable RLS
ALTER TABLE elite_daily_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Service role full access to elite_daily_notes" ON elite_daily_notes
  FOR ALL USING (auth.role() = 'service_role');

-- Index for fast lookups by player + date range
CREATE INDEX IF NOT EXISTS idx_elite_daily_notes_player_date ON elite_daily_notes(player_id, date);
