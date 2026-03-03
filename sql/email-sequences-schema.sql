-- ============================================
-- EMAIL SEQUENCES TABLE
-- Tracks automated email sequence state per prospect
-- Run in Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS email_sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE NOT NULL,

    -- Prospect snapshot (denormalized for cron query efficiency)
    email TEXT NOT NULL,
    first_name TEXT,

    -- Application context
    application_type TEXT NOT NULL,

    -- Sequence state
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'completed', 'unsubscribed', 'failed', 'cancelled')),

    -- Email tracking (NULL = not yet sent)
    email_1_sent_at TIMESTAMPTZ,
    email_1_error TEXT,
    email_2_scheduled_for TIMESTAMPTZ,
    email_2_sent_at TIMESTAMPTZ,
    email_2_error TEXT,
    email_3_scheduled_for TIMESTAMPTZ,
    email_3_sent_at TIMESTAMPTZ,
    email_3_error TEXT,

    -- Retry tracking
    retry_count INTEGER DEFAULT 0,
    last_retry_at TIMESTAMPTZ,

    -- Unsubscribe
    unsubscribed_at TIMESTAMPTZ,
    unsubscribe_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for cron job efficiency
CREATE INDEX IF NOT EXISTS idx_email_seq_status ON email_sequences(status);
CREATE INDEX IF NOT EXISTS idx_email_seq_email ON email_sequences(email);
CREATE INDEX IF NOT EXISTS idx_email_seq_email_2_schedule ON email_sequences(email_2_scheduled_for)
    WHERE email_2_sent_at IS NULL AND status = 'active';
CREATE INDEX IF NOT EXISTS idx_email_seq_email_3_schedule ON email_sequences(email_3_scheduled_for)
    WHERE email_3_sent_at IS NULL AND status = 'active';
CREATE INDEX IF NOT EXISTS idx_email_seq_prospect ON email_sequences(prospect_id);

-- RLS
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to email_sequences"
ON email_sequences FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "Admins can view email_sequences"
ON email_sequences FOR SELECT
USING (
    auth.role() = 'authenticated'
    AND (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'coach')
);
