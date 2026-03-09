-- =====================================================
-- SESSION DAY TEMPLATES
-- Pre-built day plans — ordered collections of blocks
-- e.g. "System Day", "Manipulation Day", "Stress Test"
-- Named session_day_templates to avoid collision with
-- the existing session_templates table
-- =====================================================

CREATE TABLE IF NOT EXISTS session_day_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Template identity
  template_id TEXT NOT NULL UNIQUE,           -- 'system-day', 'manipulation-day', 'game-day'
  name TEXT NOT NULL,                         -- 'System Day'

  -- Timing & phase
  total_duration_display TEXT,                -- '60-70 min'
  min_phase INTEGER DEFAULT 1,               -- minimum phase for this template

  -- Block composition
  block_ids TEXT[] NOT NULL,                  -- ordered array of block_ids
  block_notes JSONB DEFAULT '{}',            -- per-block notes e.g. {"EV-01": "Goal: higher score"}

  -- Scheduling
  days_used TEXT,                             -- 'Mon/Wed/Fri'
  description TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE session_day_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to session_day_templates" ON session_day_templates;
CREATE POLICY "Service role full access to session_day_templates" ON session_day_templates
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Authenticated users can read session_day_templates" ON session_day_templates;
CREATE POLICY "Authenticated users can read session_day_templates" ON session_day_templates
  FOR SELECT USING (auth.role() = 'authenticated');
