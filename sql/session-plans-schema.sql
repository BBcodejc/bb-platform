-- =====================================================
-- SESSION PLANS
-- Links blocks to a player on a specific date
-- Created by admin via Session Builder
-- Also creates a linked elite_training_sessions record
-- so the plan shows on the player's calendar
-- =====================================================

DROP TABLE IF EXISTS session_plans CASCADE;

CREATE TABLE session_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Player + date
  player_id UUID NOT NULL REFERENCES elite_players(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,

  -- Template reference (optional)
  template_id TEXT,                           -- ref to session_day_templates.template_id
  template_name TEXT,                         -- display name e.g. 'System Day'

  -- Block composition
  block_ids TEXT[] NOT NULL,                  -- ordered array of block_ids
  block_notes JSONB DEFAULT '{}',            -- per-block coaching notes

  -- Coach notes
  coaching_notes TEXT,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'assigned'
    CHECK (status IN ('assigned', 'in_progress', 'completed', 'skipped')),
  completed_blocks TEXT[] DEFAULT '{}',       -- block_ids the player has checked off
  player_notes TEXT,                          -- player's own notes ("what felt difficult")

  -- Computed
  total_duration_minutes INTEGER,

  -- Metadata
  created_by TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_session_plans_player_date ON session_plans(player_id, session_date);
CREATE INDEX IF NOT EXISTS idx_session_plans_status ON session_plans(status);

-- RLS
ALTER TABLE session_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to session_plans" ON session_plans;
CREATE POLICY "Service role full access to session_plans" ON session_plans
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- LINK: Add session_plan_id to elite_training_sessions
-- This connects the calendar entry to the block-based plan
-- =====================================================

ALTER TABLE elite_training_sessions
  ADD COLUMN IF NOT EXISTS session_plan_id UUID REFERENCES session_plans(id);

CREATE INDEX IF NOT EXISTS idx_elite_sessions_plan ON elite_training_sessions(session_plan_id);
