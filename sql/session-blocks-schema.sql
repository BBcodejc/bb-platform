-- =====================================================
-- SESSION BLOCKS
-- Modular workout blocks from the BB Session Library
-- 37 blocks: SH-01 through EV-03
-- =====================================================

CREATE TABLE IF NOT EXISTS session_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Block identity
  block_id TEXT NOT NULL UNIQUE,              -- 'SH-01', 'MV-02', 'BM-01', 'LP-01', 'EV-01'
  name TEXT NOT NULL,                         -- 'Close Range Warm-Up'
  category TEXT NOT NULL CHECK (category IN (
    'shooting', 'movement', 'ball_manipulation', 'live_play', 'evaluation'
  )),

  -- Timing
  duration_minutes INTEGER NOT NULL,          -- max of range (e.g. "15-20 min" → 20)
  duration_display TEXT NOT NULL,             -- "15-20 min" (display string)

  -- Phase & constraint level
  min_phase INTEGER NOT NULL DEFAULT 1        -- "Phase: 3+" → 3, "Any" → 1
    CHECK (min_phase BETWEEN 1 AND 5),
  constraint_level_min INTEGER,               -- nullable for N/A blocks
  constraint_level_max INTEGER,

  -- Equipment
  equipment TEXT[] DEFAULT '{}',              -- e.g. {'Regulation ball', 'Strobes', 'Tracking sheet'}

  -- Content
  description TEXT NOT NULL,                  -- Full block content with cues and progressions
  external_cues TEXT[] DEFAULT '{}',          -- Extracted external cue strings

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_session_blocks_block_id ON session_blocks(block_id);
CREATE INDEX IF NOT EXISTS idx_session_blocks_category ON session_blocks(category);
CREATE INDEX IF NOT EXISTS idx_session_blocks_phase ON session_blocks(min_phase);

-- RLS
ALTER TABLE session_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to session_blocks" ON session_blocks;
CREATE POLICY "Service role full access to session_blocks" ON session_blocks
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Authenticated users can read session_blocks" ON session_blocks;
CREATE POLICY "Authenticated users can read session_blocks" ON session_blocks
  FOR SELECT USING (auth.role() = 'authenticated');
