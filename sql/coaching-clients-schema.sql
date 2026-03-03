-- ============================================
-- COACHING CLIENTS & WEEK 0 ASSESSMENT TABLES
-- ============================================

-- Coaching Clients Table
CREATE TABLE IF NOT EXISTS coaching_clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  position TEXT,
  level TEXT NOT NULL DEFAULT 'high-school'
    CHECK (level IN ('youth', 'high-school', 'college', 'pro', 'recreational')),
  team TEXT,
  age INTEGER,
  slug TEXT UNIQUE NOT NULL,

  -- Coaching metadata
  coach_assigned TEXT,
  enrollment_date DATE,
  program_type TEXT DEFAULT 'standard'
    CHECK (program_type IN ('standard', 'elite', 'remote')),
  current_week INTEGER DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT true,
  onboarding_complete BOOLEAN DEFAULT false,

  -- Reference to prospect if they came through intake
  prospect_id UUID REFERENCES prospects(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Week 0 Assessment Table (full onboarding assessment)
CREATE TABLE IF NOT EXISTS week0_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES coaching_clients(id) ON DELETE CASCADE,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'submitted', 'reviewed', 'complete')),
  current_step TEXT DEFAULT 'player_info',

  -- Shooting Calibration Sections (same as shooting eval)
  player_info JSONB DEFAULT '{}',
  fourteen_spot JSONB DEFAULT '{}',
  deep_distance JSONB DEFAULT '{}',
  back_rim JSONB DEFAULT '{}',
  ball_flight JSONB DEFAULT '{}',
  fades JSONB DEFAULT '{}',

  -- New Assessment Sections
  oversize_ball JSONB DEFAULT '{}',
  live_video JSONB DEFAULT '{}',
  vertical_jump JSONB DEFAULT '{}',
  movement_patterns JSONB DEFAULT '{}',

  -- Coach review
  coach_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,

  -- Timestamps
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(client_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_coaching_clients_slug ON coaching_clients(slug);
CREATE INDEX IF NOT EXISTS idx_coaching_clients_email ON coaching_clients(email);
CREATE INDEX IF NOT EXISTS idx_coaching_clients_active ON coaching_clients(is_active);
CREATE INDEX IF NOT EXISTS idx_week0_assessments_client ON week0_assessments(client_id);
CREATE INDEX IF NOT EXISTS idx_week0_assessments_status ON week0_assessments(status);

-- RLS Policies
ALTER TABLE coaching_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE week0_assessments ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access on coaching_clients"
  ON coaching_clients FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access on week0_assessments"
  ON week0_assessments FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('assessment-videos', 'assessment-videos', true)
ON CONFLICT (id) DO NOTHING;
