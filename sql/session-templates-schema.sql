-- =====================================================
-- SESSION TEMPLATES
-- Pre-built session templates the coach can select
-- and drop onto a player's calendar
-- =====================================================

CREATE TABLE IF NOT EXISTS session_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Template identity
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,

  -- Session defaults (auto-fill when selected)
  session_type TEXT NOT NULL DEFAULT 'training'
    CHECK (session_type IN ('pre-game', 'training', 'film', 'recovery', 'evaluation', 'game', 'postgame')),
  default_title TEXT NOT NULL,
  default_description TEXT,
  default_duration_minutes INTEGER,
  default_focus_areas TEXT[] DEFAULT '{}',
  default_notes TEXT,             -- session outline (the big text body)
  default_coaching_notes TEXT,

  -- Categorisation & filtering
  category TEXT NOT NULL DEFAULT 'shooting'
    CHECK (category IN (
      'shooting', 'movement', 'ball-handling', 'vision',
      'recovery', 'mental', 'live-play', 'film', 'assessment', 'strength', 'pregame', 'cognitive'
    )),

  -- BB Method metadata
  session_code TEXT,               -- e.g. S-01, M-02, BM-01, CL-01, LP-01, E-01, R-01
  constraint_level TEXT,           -- e.g. '1-2', '3', '4-5', '5-6'
  phase TEXT,                      -- e.g. '1', '2-3', '4', 'Any', 'Entry'
  progression_notes TEXT,          -- when to advance to next session
  regression_notes TEXT,           -- when to step back

  -- Equipment / environment requirements
  required_equipment TEXT[] DEFAULT '{}',
  environment TEXT[] DEFAULT '{court}',

  -- Display
  icon TEXT,                       -- lucide icon name
  color TEXT,                      -- tailwind color class
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_by TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_session_templates_category ON session_templates(category);
CREATE INDEX IF NOT EXISTS idx_session_templates_type ON session_templates(session_type);
CREATE INDEX IF NOT EXISTS idx_session_templates_active ON session_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_session_templates_order ON session_templates(display_order);

-- RLS
ALTER TABLE session_templates ENABLE ROW LEVEL SECURITY;

-- Service role full access
DROP POLICY IF EXISTS "Service role full access to session_templates" ON session_templates;
CREATE POLICY "Service role full access to session_templates" ON session_templates
  FOR ALL USING (auth.role() = 'service_role');

-- Authenticated users can read
DROP POLICY IF EXISTS "Authenticated users can read session_templates" ON session_templates;
CREATE POLICY "Authenticated users can read session_templates" ON session_templates
  FOR SELECT USING (auth.role() = 'authenticated');
