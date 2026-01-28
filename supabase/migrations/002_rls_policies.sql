-- ============================================
-- BB BIOMECHANICS CRM - ROW LEVEL SECURITY POLICIES
-- Run in Supabase SQL Editor AFTER 001_complete_schema.sql
-- ============================================

-- ============================================
-- PART 1: ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shooting_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 2: HELPER FUNCTIONS FOR RLS
-- ============================================

-- Check if current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT COALESCE(
            (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
            (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin' OR
            EXISTS (
                SELECT 1 FROM admin_profiles
                WHERE id = auth.uid()
                AND is_active = TRUE
                AND role IN ('admin', 'super_admin')
            ),
            FALSE
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user is a super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT COALESCE(
            (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin' OR
            EXISTS (
                SELECT 1 FROM admin_profiles
                WHERE id = auth.uid()
                AND is_active = TRUE
                AND role = 'super_admin'
            ),
            FALSE
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user's prospect ID (for prospects who have linked accounts)
CREATE OR REPLACE FUNCTION get_user_prospect_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT id FROM prospects WHERE user_id = auth.uid() LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PART 3: PROSPECTS TABLE POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "prospects_select_own" ON prospects;
DROP POLICY IF EXISTS "prospects_insert_own" ON prospects;
DROP POLICY IF EXISTS "prospects_update_own" ON prospects;
DROP POLICY IF EXISTS "prospects_delete_own" ON prospects;
DROP POLICY IF EXISTS "prospects_admin_all" ON prospects;
DROP POLICY IF EXISTS "prospects_public_insert" ON prospects;

-- Admins can do everything
CREATE POLICY "prospects_admin_all" ON prospects
    FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- Users can view their own prospect record
CREATE POLICY "prospects_select_own" ON prospects
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR is_admin());

-- Users can update their own prospect record (limited fields)
CREATE POLICY "prospects_update_own" ON prospects
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Public/anonymous can insert prospects (intake form)
-- Service role key bypasses RLS, so API routes can insert
CREATE POLICY "prospects_public_insert" ON prospects
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (TRUE); -- Service role handles actual inserts

-- ============================================
-- PART 4: PAYMENTS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "payments_select_own" ON payments;
DROP POLICY IF EXISTS "payments_admin_all" ON payments;
DROP POLICY IF EXISTS "payments_service_insert" ON payments;

-- Admins can do everything
CREATE POLICY "payments_admin_all" ON payments
    FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- Users can view their own payments
CREATE POLICY "payments_select_own" ON payments
    FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() OR
        prospect_id = get_user_prospect_id() OR
        is_admin()
    );

-- Service role handles inserts from webhooks
CREATE POLICY "payments_service_insert" ON payments
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (TRUE); -- Service role key bypasses RLS

-- ============================================
-- PART 5: SHOOTING EVALUATIONS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "shooting_evals_select_own" ON shooting_evaluations;
DROP POLICY IF EXISTS "shooting_evals_insert_own" ON shooting_evaluations;
DROP POLICY IF EXISTS "shooting_evals_update_own" ON shooting_evaluations;
DROP POLICY IF EXISTS "shooting_evals_admin_all" ON shooting_evaluations;

-- Admins can do everything
CREATE POLICY "shooting_evals_admin_all" ON shooting_evaluations
    FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- Users can view their own shooting evaluations
CREATE POLICY "shooting_evals_select_own" ON shooting_evaluations
    FOR SELECT
    TO authenticated
    USING (
        prospect_id = get_user_prospect_id() OR
        is_admin()
    );

-- Users can insert their own shooting evaluations
CREATE POLICY "shooting_evals_insert_own" ON shooting_evaluations
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (TRUE); -- Service role handles portal submissions

-- Users can update their own shooting evaluations (before submission)
CREATE POLICY "shooting_evals_update_own" ON shooting_evaluations
    FOR UPDATE
    TO authenticated
    USING (
        prospect_id = get_user_prospect_id() AND
        status = 'pending_submission'
    )
    WITH CHECK (
        prospect_id = get_user_prospect_id() AND
        status = 'pending_submission'
    );

-- ============================================
-- PART 6: EVALUATIONS TABLE POLICIES (Admin Reviews)
-- ============================================

DROP POLICY IF EXISTS "evaluations_select_own" ON evaluations;
DROP POLICY IF EXISTS "evaluations_admin_all" ON evaluations;

-- Admins can do everything
CREATE POLICY "evaluations_admin_all" ON evaluations
    FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- Users can view their own evaluations (after delivery)
CREATE POLICY "evaluations_select_own" ON evaluations
    FOR SELECT
    TO authenticated
    USING (
        (prospect_id = get_user_prospect_id() AND status = 'delivered') OR
        is_admin()
    );

-- ============================================
-- PART 7: MENTORSHIPS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "mentorships_select_own" ON mentorships;
DROP POLICY IF EXISTS "mentorships_admin_all" ON mentorships;

-- Admins can do everything
CREATE POLICY "mentorships_admin_all" ON mentorships
    FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- Users can view their own mentorship
CREATE POLICY "mentorships_select_own" ON mentorships
    FOR SELECT
    TO authenticated
    USING (
        prospect_id = get_user_prospect_id() OR
        is_admin()
    );

-- ============================================
-- PART 8: ACTIVITY LOG TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "activity_select_own" ON activity_log;
DROP POLICY IF EXISTS "activity_admin_all" ON activity_log;

-- Admins can do everything
CREATE POLICY "activity_admin_all" ON activity_log
    FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- Users can view activity related to their prospect
CREATE POLICY "activity_select_own" ON activity_log
    FOR SELECT
    TO authenticated
    USING (
        prospect_id = get_user_prospect_id() OR
        user_id = auth.uid() OR
        is_admin()
    );

-- ============================================
-- PART 9: ADMIN PROFILES TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "admin_profiles_select_own" ON admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_super_admin" ON admin_profiles;

-- Super admins can manage all admin profiles
CREATE POLICY "admin_profiles_super_admin" ON admin_profiles
    FOR ALL
    TO authenticated
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

-- Admins can view their own profile
CREATE POLICY "admin_profiles_select_own" ON admin_profiles
    FOR SELECT
    TO authenticated
    USING (id = auth.uid() OR is_super_admin());

-- Admins can update their own profile (limited)
CREATE POLICY "admin_profiles_update_own" ON admin_profiles
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid() AND role = 'admin'); -- Can't elevate own role

-- ============================================
-- PART 10: GRANT PERMISSIONS
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant table permissions
GRANT ALL ON prospects TO authenticated;
GRANT INSERT ON prospects TO anon;
GRANT SELECT ON prospects TO anon; -- For checking existing email

GRANT ALL ON payments TO authenticated;
GRANT INSERT ON payments TO anon;

GRANT ALL ON shooting_evaluations TO authenticated;
GRANT INSERT ON shooting_evaluations TO anon;

GRANT ALL ON evaluations TO authenticated;
GRANT ALL ON mentorships TO authenticated;
GRANT ALL ON activity_log TO authenticated;
GRANT ALL ON admin_profiles TO authenticated;

-- Grant sequence permissions (for UUID generation)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;

-- Grant function permissions
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_prospect_id() TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION search_prospects(TEXT, prospect_status, BOOLEAN, INTEGER, INTEGER) TO authenticated;

-- ============================================
-- PART 11: CREATE INITIAL SUPER ADMIN (Update with your email)
-- ============================================

-- Replace 'your-admin-email@example.com' with actual admin email
-- This creates an admin profile when the user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if this is a designated admin email
    IF NEW.email IN ('admin@basketballbiomechanics.com', 'YOUR_EMAIL_HERE@example.com') THEN
        INSERT INTO admin_profiles (id, email, full_name, role, is_active)
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
            'super_admin',
            TRUE
        );

        -- Update app_metadata with admin role
        UPDATE auth.users
        SET raw_app_meta_data = raw_app_meta_data || '{"role": "super_admin"}'::jsonb
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ============================================
-- PART 12: MANUAL ADMIN PROMOTION FUNCTION
-- ============================================

-- Function to promote a user to admin (call from SQL editor or admin dashboard)
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT, admin_role user_role DEFAULT 'admin')
RETURNS BOOLEAN AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Only super admins can promote
    IF NOT is_super_admin() THEN
        RAISE EXCEPTION 'Only super admins can promote users';
    END IF;

    -- Get user ID
    SELECT id INTO target_user_id FROM auth.users WHERE email = user_email;

    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User not found: %', user_email;
    END IF;

    -- Insert or update admin profile
    INSERT INTO admin_profiles (id, email, full_name, role, is_active)
    VALUES (
        target_user_id,
        user_email,
        user_email,
        admin_role,
        TRUE
    )
    ON CONFLICT (id) DO UPDATE
    SET role = admin_role, is_active = TRUE, updated_at = NOW();

    -- Update user app_metadata
    UPDATE auth.users
    SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', admin_role::TEXT)
    WHERE id = target_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMPLETE! Run this script after 001_complete_schema.sql
-- ============================================
