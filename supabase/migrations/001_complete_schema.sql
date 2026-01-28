-- ============================================
-- BB BIOMECHANICS CRM - COMPLETE DATABASE SCHEMA
-- Run in Supabase SQL Editor
-- ============================================

-- ============================================
-- PART 1: ENUM TYPES
-- ============================================

-- Drop existing enums if they exist (for clean slate)
DO $$ BEGIN
    DROP TYPE IF EXISTS prospect_status CASCADE;
    DROP TYPE IF EXISTS payment_status CASCADE;
    DROP TYPE IF EXISTS evaluation_status CASCADE;
    DROP TYPE IF EXISTS mentorship_status CASCADE;
    DROP TYPE IF EXISTS user_role CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Prospect pipeline status
CREATE TYPE prospect_status AS ENUM (
    'new',
    'intake_completed',
    'payment_pending',
    'paid',
    'evaluation_submitted',
    'tests_submitted',
    'review_in_progress',
    'profile_delivered',
    'enrolled_mentorship',
    'in_pipeline',
    'closed_won',
    'closed_lost'
);

-- Payment status
CREATE TYPE payment_status AS ENUM (
    'pending',
    'completed',
    'failed',
    'refunded',
    'expired'
);

-- Evaluation status
CREATE TYPE evaluation_status AS ENUM (
    'pending_submission',
    'pending_review',
    'review_in_progress',
    'approved',
    'rejected',
    'delivered'
);

-- Mentorship status
CREATE TYPE mentorship_status AS ENUM (
    'pending_contract',
    'active',
    'paused',
    'completed',
    'cancelled'
);

-- User role for RLS
CREATE TYPE user_role AS ENUM (
    'prospect',
    'admin',
    'super_admin'
);

-- ============================================
-- PART 2: TABLES
-- ============================================

-- ----------------------------------------
-- PROSPECTS TABLE (main CRM records)
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS prospects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Contact Info
    email TEXT NOT NULL,
    phone TEXT,
    first_name TEXT,
    last_name TEXT,

    -- Role
    role TEXT CHECK (role IN ('player', 'parent', 'coach', 'organization')),

    -- Player Fields
    player_level TEXT,
    player_main_goal TEXT,
    game_vs_workout TEXT,
    three_pt_percentage TEXT,
    player_problem TEXT,
    workout_style TEXT,
    days_per_week TEXT,
    player_looking_for TEXT,
    investment_level TEXT,
    player_age TEXT,
    player_location TEXT,
    player_instagram TEXT,

    -- Parent Fields
    child_name TEXT,
    child_age TEXT,
    child_level TEXT,
    child_strengths TEXT,
    parent_issues TEXT[],
    parent_issue_other TEXT,
    child_confidence TEXT,
    parent_main_goal TEXT,
    weekly_training_hours TEXT,
    previous_trainer_experience TEXT,
    parent_interest TEXT,
    parent_involvement TEXT,
    parent_investment_level TEXT,

    -- Coach Fields
    coach_level TEXT,
    coach_role TEXT,
    coach_issues TEXT[],
    coach_issue_other TEXT,
    coach_shooting_style TEXT,
    motor_learning_familiarity TEXT,
    coach_looking_for TEXT,
    coach_player_count TEXT,
    coach_constraints TEXT,
    coach_open_to_coaching TEXT,
    coach_next_step TEXT,
    coach_certification_wants TEXT,

    -- Organization Fields
    org_type TEXT,
    org_name TEXT,
    team_count TEXT,
    org_problems TEXT[],
    current_dev_model TEXT,
    org_win TEXT,
    org_support TEXT,
    org_readiness TEXT,
    org_timeline TEXT,
    org_decision_makers TEXT,
    org_budget TEXT,

    -- Pipeline & Status
    pipeline_status prospect_status DEFAULT 'new',
    high_ticket_prospect BOOLEAN DEFAULT FALSE,
    value_estimate NUMERIC(10,2) DEFAULT 0,
    routing_recommendation TEXT,

    -- Admin Notes
    notes TEXT,
    internal_notes TEXT,
    tags TEXT[],

    -- Metadata
    source TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add unique constraint on email
ALTER TABLE prospects ADD CONSTRAINT prospects_email_unique UNIQUE (email);

-- ----------------------------------------
-- PAYMENTS TABLE
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Stripe Info
    stripe_payment_intent_id TEXT,
    stripe_checkout_session_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,

    -- Payment Details
    amount INTEGER NOT NULL, -- in cents
    currency TEXT DEFAULT 'usd',
    status payment_status DEFAULT 'pending',
    product_type TEXT,

    -- Subscription fields
    is_subscription BOOLEAN DEFAULT FALSE,
    subscription_interval TEXT, -- 'month', 'year'
    subscription_status TEXT,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,

    -- Metadata
    metadata JSONB DEFAULT '{}',
    failure_reason TEXT,
    refund_reason TEXT,
    refunded_at TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- ----------------------------------------
-- SHOOTING EVALUATIONS TABLE (Player Submissions)
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS shooting_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE NOT NULL,

    -- Submission Info
    submission_timestamp TIMESTAMPTZ DEFAULT NOW(),
    status evaluation_status DEFAULT 'pending_review',

    -- Player Info
    player_full_name TEXT,
    player_age INTEGER,
    player_level TEXT,
    player_position TEXT,
    player_dominant_hand TEXT,

    -- 14-Spot Baseline (3 rounds)
    fourteen_spot_round_1_score INTEGER,
    fourteen_spot_round_1_miss_profile TEXT,
    fourteen_spot_round_2_score INTEGER,
    fourteen_spot_round_2_miss_profile TEXT,
    fourteen_spot_round_3_score INTEGER,
    fourteen_spot_round_3_miss_profile TEXT,
    fourteen_spot_video_url TEXT,

    -- Deep Distance Test
    deep_distance_steps_behind INTEGER,
    deep_distance_rim_hits INTEGER,
    deep_distance_total_shots INTEGER,
    contrast_steps_forward INTEGER,
    contrast_rim_hits INTEGER,
    contrast_total_shots INTEGER,
    deep_distance_video_url TEXT,

    -- Back-Rim Challenge
    back_rim_level_1_shots INTEGER,
    back_rim_level_1_time INTEGER,
    back_rim_level_2_shots INTEGER,
    back_rim_level_2_time INTEGER,
    back_rim_level_3_shots INTEGER,
    back_rim_level_3_time INTEGER,
    back_rim_video_url TEXT,

    -- Ball Flight Spectrum
    ball_flight_flat_makes INTEGER,
    ball_flight_flat_miss_profile TEXT,
    ball_flight_normal_makes INTEGER,
    ball_flight_normal_miss_profile TEXT,
    ball_flight_high_makes INTEGER,
    ball_flight_high_miss_profile TEXT,
    ball_flight_video_url TEXT,

    -- Fades
    fade_right_makes INTEGER,
    fade_right_miss_profile TEXT,
    fade_left_makes INTEGER,
    fade_left_miss_profile TEXT,
    fades_video_url TEXT,

    -- Final Notes
    additional_notes TEXT,

    -- Calculated Scores
    total_fourteen_spot_average NUMERIC(5,2),
    bb_level_calculated INTEGER,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------
-- EVALUATIONS TABLE (Admin Reviews)
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE NOT NULL,
    shooting_evaluation_id UUID REFERENCES shooting_evaluations(id) ON DELETE SET NULL,

    -- BB Level Assessment
    current_bb_level INTEGER CHECK (current_bb_level >= 0 AND current_bb_level <= 4),
    miss_profile JSONB, -- { primary: 'short', secondary: 'left' }

    -- Analysis
    deep_distance_analysis TEXT,
    ball_flight_analysis TEXT,
    energy_transfer_notes TEXT,

    -- Constraints & Protocols
    constraints_identified TEXT[],
    priority_protocols TEXT[],

    -- Planning
    weekly_plan_summary TEXT,
    four_week_focus TEXT,
    full_assessment TEXT,

    -- Deliverables
    profile_pdf_url TEXT,
    video_breakdown_url TEXT,

    -- Mentorship Recommendation
    mentorship_fit_score INTEGER CHECK (mentorship_fit_score >= 1 AND mentorship_fit_score <= 10),
    mentorship_recommendation TEXT,
    recommend_mentorship BOOLEAN DEFAULT FALSE,

    -- Status & Workflow
    status evaluation_status DEFAULT 'pending_review',
    reviewed_by UUID REFERENCES auth.users(id),
    reviewer_name TEXT,

    -- Timestamps
    reviewed_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------
-- MENTORSHIPS TABLE
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS mentorships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE NOT NULL,
    evaluation_id UUID REFERENCES evaluations(id) ON DELETE SET NULL,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,

    -- Program Details
    program_type TEXT DEFAULT '3_month_blueprint',
    price INTEGER, -- in cents

    -- Timeline
    start_date DATE,
    end_date DATE,

    -- Equipment
    equipment_shipped BOOLEAN DEFAULT FALSE,
    equipment_tracking TEXT,
    equipment_items TEXT[],
    equipment_shipped_at TIMESTAMPTZ,

    -- Check-ins
    check_in_frequency TEXT DEFAULT 'weekly',
    next_check_in DATE,
    total_check_ins INTEGER DEFAULT 0,
    check_in_notes JSONB DEFAULT '[]',

    -- Contract
    signwell_document_id TEXT,
    contract_signed BOOLEAN DEFAULT FALSE,
    contract_signed_at TIMESTAMPTZ,

    -- Status
    status mentorship_status DEFAULT 'pending_contract',
    cancellation_reason TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------
-- ACTIVITY LOG TABLE (Audit Trail)
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Activity Details
    action TEXT NOT NULL, -- 'created', 'updated', 'status_changed', 'payment_completed', etc.
    entity_type TEXT NOT NULL, -- 'prospect', 'payment', 'evaluation', 'mentorship'
    entity_id UUID,

    -- Change Data
    old_value JSONB,
    new_value JSONB,
    description TEXT,

    -- Metadata
    ip_address INET,
    user_agent TEXT,

    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------
-- ADMIN USERS TABLE (Extended auth.users)
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'admin',
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PART 3: INDEXES
-- ============================================

-- Prospects indexes
CREATE INDEX IF NOT EXISTS idx_prospects_email ON prospects(email);
CREATE INDEX IF NOT EXISTS idx_prospects_user_id ON prospects(user_id);
CREATE INDEX IF NOT EXISTS idx_prospects_pipeline_status ON prospects(pipeline_status);
CREATE INDEX IF NOT EXISTS idx_prospects_high_ticket ON prospects(high_ticket_prospect) WHERE high_ticket_prospect = TRUE;
CREATE INDEX IF NOT EXISTS idx_prospects_created_at ON prospects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prospects_updated_at ON prospects(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_prospects_role ON prospects(role);
CREATE INDEX IF NOT EXISTS idx_prospects_value_estimate ON prospects(value_estimate DESC);

-- Payments indexes
CREATE INDEX IF NOT EXISTS idx_payments_prospect_id ON payments(prospect_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session ON payments(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_completed ON payments(status, completed_at) WHERE status = 'completed';

-- Shooting evaluations indexes
CREATE INDEX IF NOT EXISTS idx_shooting_evals_prospect_id ON shooting_evaluations(prospect_id);
CREATE INDEX IF NOT EXISTS idx_shooting_evals_status ON shooting_evaluations(status);
CREATE INDEX IF NOT EXISTS idx_shooting_evals_created_at ON shooting_evaluations(created_at DESC);

-- Evaluations indexes
CREATE INDEX IF NOT EXISTS idx_evaluations_prospect_id ON evaluations(prospect_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_status ON evaluations(status);
CREATE INDEX IF NOT EXISTS idx_evaluations_reviewed_by ON evaluations(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_evaluations_created_at ON evaluations(created_at DESC);

-- Mentorships indexes
CREATE INDEX IF NOT EXISTS idx_mentorships_prospect_id ON mentorships(prospect_id);
CREATE INDEX IF NOT EXISTS idx_mentorships_status ON mentorships(status);
CREATE INDEX IF NOT EXISTS idx_mentorships_next_check_in ON mentorships(next_check_in);

-- Activity log indexes
CREATE INDEX IF NOT EXISTS idx_activity_prospect_id ON activity_log(prospect_id);
CREATE INDEX IF NOT EXISTS idx_activity_entity ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON activity_log(created_at DESC);

-- ============================================
-- PART 4: FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
DROP TRIGGER IF EXISTS update_prospects_updated_at ON prospects;
CREATE TRIGGER update_prospects_updated_at
    BEFORE UPDATE ON prospects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shooting_evals_updated_at ON shooting_evaluations;
CREATE TRIGGER update_shooting_evals_updated_at
    BEFORE UPDATE ON shooting_evaluations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_evaluations_updated_at ON evaluations;
CREATE TRIGGER update_evaluations_updated_at
    BEFORE UPDATE ON evaluations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mentorships_updated_at ON mentorships;
CREATE TRIGGER update_mentorships_updated_at
    BEFORE UPDATE ON mentorships
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-set high_ticket based on value_estimate
CREATE OR REPLACE FUNCTION check_high_ticket_prospect()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.value_estimate > 1000 THEN
        NEW.high_ticket_prospect = TRUE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_high_ticket ON prospects;
CREATE TRIGGER check_high_ticket
    BEFORE INSERT OR UPDATE OF value_estimate ON prospects
    FOR EACH ROW
    EXECUTE FUNCTION check_high_ticket_prospect();

-- Function to update prospect status on payment completion
CREATE OR REPLACE FUNCTION update_prospect_on_payment()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        -- Update prospect pipeline status
        UPDATE prospects
        SET pipeline_status = 'paid',
            last_activity_at = NOW()
        WHERE id = NEW.prospect_id;

        -- Set high_ticket if payment > $1000
        IF NEW.amount > 100000 THEN -- 100000 cents = $1000
            UPDATE prospects
            SET high_ticket_prospect = TRUE,
                value_estimate = GREATEST(value_estimate, NEW.amount / 100.0)
            WHERE id = NEW.prospect_id;
        END IF;

        -- Log activity
        INSERT INTO activity_log (prospect_id, action, entity_type, entity_id, new_value, description)
        VALUES (
            NEW.prospect_id,
            'payment_completed',
            'payment',
            NEW.id,
            jsonb_build_object('amount', NEW.amount, 'product_type', NEW.product_type),
            'Payment of $' || (NEW.amount / 100.0)::TEXT || ' completed'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS payment_completed_trigger ON payments;
CREATE TRIGGER payment_completed_trigger
    AFTER INSERT OR UPDATE OF status ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_prospect_on_payment();

-- Function to update prospect on evaluation status change
CREATE OR REPLACE FUNCTION update_prospect_on_evaluation()
RETURNS TRIGGER AS $$
BEGIN
    -- Update prospect status based on evaluation status
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
        UPDATE prospects
        SET pipeline_status = 'in_pipeline',
            last_activity_at = NOW()
        WHERE id = NEW.prospect_id;

        -- Log activity
        INSERT INTO activity_log (prospect_id, user_id, action, entity_type, entity_id, description)
        VALUES (
            NEW.prospect_id,
            NEW.reviewed_by,
            'evaluation_approved',
            'evaluation',
            NEW.id,
            'Evaluation approved by reviewer'
        );
    ELSIF NEW.status = 'delivered' AND (OLD.status IS NULL OR OLD.status != 'delivered') THEN
        UPDATE prospects
        SET pipeline_status = 'profile_delivered',
            last_activity_at = NOW()
        WHERE id = NEW.prospect_id;

        -- Log activity
        INSERT INTO activity_log (prospect_id, user_id, action, entity_type, entity_id, description)
        VALUES (
            NEW.prospect_id,
            NEW.reviewed_by,
            'evaluation_delivered',
            'evaluation',
            NEW.id,
            'BB Profile delivered to player'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS evaluation_status_trigger ON evaluations;
CREATE TRIGGER evaluation_status_trigger
    AFTER INSERT OR UPDATE OF status ON evaluations
    FOR EACH ROW
    EXECUTE FUNCTION update_prospect_on_evaluation();

-- Function to calculate 14-spot average
CREATE OR REPLACE FUNCTION calculate_fourteen_spot_average()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.fourteen_spot_round_1_score IS NOT NULL
       AND NEW.fourteen_spot_round_2_score IS NOT NULL
       AND NEW.fourteen_spot_round_3_score IS NOT NULL THEN
        NEW.total_fourteen_spot_average = (
            NEW.fourteen_spot_round_1_score +
            NEW.fourteen_spot_round_2_score +
            NEW.fourteen_spot_round_3_score
        )::NUMERIC / 3.0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS calc_fourteen_spot_avg ON shooting_evaluations;
CREATE TRIGGER calc_fourteen_spot_avg
    BEFORE INSERT OR UPDATE ON shooting_evaluations
    FOR EACH ROW
    EXECUTE FUNCTION calculate_fourteen_spot_average();

-- Function to log prospect changes
CREATE OR REPLACE FUNCTION log_prospect_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.pipeline_status IS DISTINCT FROM NEW.pipeline_status THEN
        INSERT INTO activity_log (prospect_id, action, entity_type, entity_id, old_value, new_value, description)
        VALUES (
            NEW.id,
            'status_changed',
            'prospect',
            NEW.id,
            jsonb_build_object('status', OLD.pipeline_status),
            jsonb_build_object('status', NEW.pipeline_status),
            'Pipeline status changed from ' || COALESCE(OLD.pipeline_status::TEXT, 'null') || ' to ' || NEW.pipeline_status::TEXT
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS log_prospect_status_changes ON prospects;
CREATE TRIGGER log_prospect_status_changes
    AFTER UPDATE ON prospects
    FOR EACH ROW
    EXECUTE FUNCTION log_prospect_changes();

-- ============================================
-- PART 5: ENABLE REALTIME
-- ============================================

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE prospects;
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
ALTER PUBLICATION supabase_realtime ADD TABLE shooting_evaluations;
ALTER PUBLICATION supabase_realtime ADD TABLE evaluations;
ALTER PUBLICATION supabase_realtime ADD TABLE mentorships;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_log;

-- ============================================
-- PART 6: HELPER FUNCTIONS
-- ============================================

-- Function to get dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_prospects', (SELECT COUNT(*) FROM prospects),
        'pending_reviews', (SELECT COUNT(*) FROM shooting_evaluations WHERE status IN ('pending_review', 'review_in_progress')),
        'high_ticket_prospects', (SELECT COUNT(*) FROM prospects WHERE high_ticket_prospect = TRUE AND pipeline_status IN ('paid', 'in_pipeline', 'evaluation_submitted', 'tests_submitted')),
        'total_revenue', COALESCE((SELECT SUM(amount) FROM payments WHERE status = 'completed'), 0),
        'this_month_revenue', COALESCE((
            SELECT SUM(amount) FROM payments
            WHERE status = 'completed'
            AND completed_at >= DATE_TRUNC('month', NOW())
        ), 0),
        'conversion_rate', (
            SELECT ROUND(
                (COUNT(*) FILTER (WHERE pipeline_status IN ('paid', 'in_pipeline', 'profile_delivered', 'enrolled_mentorship', 'closed_won'))::NUMERIC /
                NULLIF(COUNT(*), 0)) * 100, 2
            )
            FROM prospects
        )
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search prospects
CREATE OR REPLACE FUNCTION search_prospects(
    search_term TEXT DEFAULT NULL,
    status_filter prospect_status DEFAULT NULL,
    high_ticket_only BOOLEAN DEFAULT FALSE,
    page_num INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    role TEXT,
    pipeline_status prospect_status,
    high_ticket_prospect BOOLEAN,
    value_estimate NUMERIC,
    created_at TIMESTAMPTZ,
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH filtered AS (
        SELECT
            p.*,
            COUNT(*) OVER() AS total_count
        FROM prospects p
        WHERE
            (search_term IS NULL OR (
                p.email ILIKE '%' || search_term || '%' OR
                p.first_name ILIKE '%' || search_term || '%' OR
                p.last_name ILIKE '%' || search_term || '%' OR
                p.phone ILIKE '%' || search_term || '%'
            ))
            AND (status_filter IS NULL OR p.pipeline_status = status_filter)
            AND (NOT high_ticket_only OR p.high_ticket_prospect = TRUE)
        ORDER BY p.created_at DESC
        LIMIT page_size
        OFFSET (page_num - 1) * page_size
    )
    SELECT
        f.id,
        f.email,
        f.first_name,
        f.last_name,
        f.role,
        f.pipeline_status,
        f.high_ticket_prospect,
        f.value_estimate,
        f.created_at,
        f.total_count
    FROM filtered f;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMPLETE! Run this script in Supabase SQL Editor
-- ============================================
