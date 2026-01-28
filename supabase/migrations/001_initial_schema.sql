-- BB Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROSPECTS TABLE
-- Stores all intake form submissions
-- ============================================
CREATE TABLE prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Role & Assessment
  role TEXT NOT NULL CHECK (role IN ('player', 'parent', 'coach', 'organization')),
  assessment_type TEXT CHECK (assessment_type IN ('shooting_eval', 'complete_eval')),

  -- Contact Info
  email TEXT NOT NULL,
  phone TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,

  -- Player Details (for player role)
  player_age INTEGER,
  player_level TEXT,
  player_height TEXT,
  player_position TEXT,
  three_pt_percentage INTEGER,
  ft_percentage INTEGER,
  shot_volume TEXT,

  -- Struggles & Goals
  primary_struggle TEXT[],
  deep_distance_breakdown TEXT,
  previous_coaching BOOLEAN DEFAULT FALSE,
  previous_coaching_details TEXT,
  goals TEXT,
  commitment_level TEXT,

  -- Parent Details (for parent role)
  parent_child_age INTEGER,
  parent_child_level TEXT,
  parent_goals TEXT,

  -- Coach Details (for coach role)
  coaching_level TEXT,
  team_organization TEXT,
  certification_interest BOOLEAN DEFAULT FALSE,

  -- Organization Details (for org role)
  org_name TEXT,
  org_player_count INTEGER,
  org_goals TEXT,

  -- Pipeline Status
  pipeline_status TEXT NOT NULL DEFAULT 'intake_started' CHECK (pipeline_status IN (
    'intake_started',
    'intake_completed',
    'payment_pending',
    'paid',
    'tests_pending',
    'tests_submitted',
    'review_in_progress',
    'profile_delivered',
    'high_ticket_invited',
    'enrolled_mentorship'
  )),
  high_ticket_prospect BOOLEAN DEFAULT FALSE,
  notes TEXT
);

-- ============================================
-- PAYMENTS TABLE
-- Tracks all Stripe payments
-- ============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  product_type TEXT NOT NULL CHECK (product_type IN ('shooting_eval', 'complete_eval', 'mentorship'))
);

-- ============================================
-- TEST RESULTS TABLE
-- Stores results from all test protocols
-- ============================================
CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),

  test_type TEXT NOT NULL CHECK (test_type IN ('fourteen_spot', 'deep_distance', 'back_rim', 'flat_flight', 'oversized', 'speed_threshold', 'spectrum')),

  -- Generic stats
  total_attempts INTEGER,
  makes INTEGER,

  -- 14-Spot specific
  spot_data JSONB, -- Stores per-spot results

  -- Deep Distance specific
  deep_distance_feet INTEGER,
  rim_contacts INTEGER,
  short_misses INTEGER,

  -- Back Rim specific
  consecutive_back_rim INTEGER,

  -- Flat Flight specific
  target_arc TEXT,
  good_reps INTEGER,

  -- Oversized specific
  oversized_score INTEGER,

  -- Speed Threshold specific
  release_time_avg DECIMAL(4,2),

  -- BB Level
  bb_level_achieved INTEGER CHECK (bb_level_achieved BETWEEN 0 AND 4),

  notes TEXT,
  video_links TEXT[]
);

-- ============================================
-- VIDEO UPLOADS TABLE
-- Tracks video submissions via Google Drive
-- ============================================
CREATE TABLE video_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),

  google_drive_folder_id TEXT,
  google_drive_folder_url TEXT,
  video_type TEXT NOT NULL CHECK (video_type IN ('game_makes', 'game_misses', 'test_footage')),
  file_count INTEGER DEFAULT 0
);

-- ============================================
-- EVALUATIONS TABLE
-- Stores BB assessments and profiles
-- ============================================
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Assessment
  current_bb_level INTEGER CHECK (current_bb_level BETWEEN 0 AND 4),
  miss_profile JSONB, -- { primary: 'short', secondary: 'left', patterns: [...] }

  -- Analysis
  deep_distance_analysis TEXT,
  ball_flight_analysis TEXT,
  energy_transfer_notes TEXT,
  constraints_identified TEXT[],

  -- Recommendations
  priority_protocols TEXT[],
  weekly_plan_summary TEXT,
  four_week_focus TEXT,
  full_assessment TEXT,

  -- Profile Delivery
  profile_pdf_url TEXT,

  -- High-Ticket Pipeline
  mentorship_fit_score INTEGER CHECK (mentorship_fit_score BETWEEN 1 AND 10),
  mentorship_recommendation TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delivered')),
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- ============================================
-- MENTORSHIPS TABLE
-- Tracks high-ticket enrollments
-- ============================================
CREATE TABLE mentorships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  evaluation_id UUID REFERENCES evaluations(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Program Details
  program_type TEXT NOT NULL DEFAULT '3_month' CHECK (program_type IN ('3_month', '6_month', 'custom')),
  price INTEGER NOT NULL, -- in cents

  -- Timeline
  start_date DATE,
  end_date DATE,

  -- Equipment
  equipment_shipped BOOLEAN DEFAULT FALSE,
  equipment_tracking TEXT,
  equipment_items TEXT[],

  -- Check-ins
  check_in_frequency TEXT DEFAULT 'weekly',
  next_check_in DATE,

  -- Contract
  signwell_document_id TEXT,
  contract_signed BOOLEAN DEFAULT FALSE,
  contract_signed_at TIMESTAMPTZ,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contract_sent', 'active', 'completed', 'cancelled'))
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_prospects_email ON prospects(email);
CREATE INDEX idx_prospects_status ON prospects(pipeline_status);
CREATE INDEX idx_prospects_high_ticket ON prospects(high_ticket_prospect) WHERE high_ticket_prospect = TRUE;
CREATE INDEX idx_payments_prospect ON payments(prospect_id);
CREATE INDEX idx_test_results_prospect ON test_results(prospect_id);
CREATE INDEX idx_evaluations_prospect ON evaluations(prospect_id);
CREATE INDEX idx_evaluations_status ON evaluations(status);
CREATE INDEX idx_mentorships_prospect ON mentorships(prospect_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_prospects_updated_at
  BEFORE UPDATE ON prospects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorships ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for API routes)
CREATE POLICY "Service role has full access to prospects" ON prospects
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to payments" ON payments
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to test_results" ON test_results
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to video_uploads" ON video_uploads
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to evaluations" ON evaluations
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to mentorships" ON mentorships
  FOR ALL USING (true);

-- Grant usage to service role
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
