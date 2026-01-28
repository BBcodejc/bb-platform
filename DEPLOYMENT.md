# BB Biomechanics Platform - Deployment Guide

## Environment Variables

### Required Environment Variables

Add these to your `.env.local` for development and to Vercel for production:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-side only, never expose!

# Stripe
STRIPE_SECRET_KEY=sk_live_...  # or sk_test_... for testing
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  # or pk_test_...

# App URLs
NEXT_PUBLIC_SITE_URL=https://your-domain.com  # or http://localhost:3000 for dev
```

### Vercel Environment Setup

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add each variable above
4. Ensure `SUPABASE_SERVICE_ROLE_KEY` is only available in "Production" and "Preview" (not exposed to client)

---

## Database Setup (Supabase)

### 1. Run Migrations

Open the Supabase SQL Editor and run these scripts in order:

1. **Schema Migration** (`supabase/migrations/001_complete_schema.sql`)
   - Creates all tables: prospects, payments, shooting_evaluations, evaluations, mentorships, activity_log, admin_profiles
   - Sets up enum types for statuses
   - Creates indexes for performance
   - Sets up triggers for updated_at, high_ticket detection, and payment/evaluation status changes
   - Enables Realtime on all tables

2. **RLS Policies** (`supabase/migrations/002_rls_policies.sql`)
   - Enables Row Level Security on all tables
   - Creates admin helper functions (is_admin(), is_super_admin())
   - Sets up ownership-based access for prospects
   - Grants admin full access
   - Sets up the admin user trigger

### 2. Configure Realtime

In Supabase Dashboard:
1. Go to Database → Replication
2. Ensure these tables are enabled for Realtime:
   - prospects
   - payments
   - shooting_evaluations
   - evaluations
   - mentorships
   - activity_log

### 3. Set Up First Admin

Option A: Update the trigger in `002_rls_policies.sql` with your email before running:
```sql
IF NEW.email IN ('admin@basketballbiomechanics.com', 'YOUR_EMAIL@example.com') THEN
```

Option B: After creating your account, run in SQL Editor:
```sql
-- Replace with your actual user ID (found in Authentication → Users)
INSERT INTO admin_profiles (id, email, full_name, role, is_active)
VALUES (
  'your-user-id-uuid',
  'your@email.com',
  'Your Name',
  'super_admin',
  true
);

-- Update auth metadata
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "super_admin"}'::jsonb
WHERE id = 'your-user-id-uuid';
```

---

## Stripe Setup

### 1. Create Products (Optional - Dynamic Pricing Used)

The app uses dynamic pricing, but you can create products in Stripe Dashboard for reference:
- **BB Shooting Evaluation**: $250
- **BB Complete Evaluation**: $500
- **BB 3-Month Mentorship**: $5,000

### 2. Configure Webhook

**For Local Development:**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

**For Production (Vercel):**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhook/stripe`
3. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `charge.refunded`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

---

## Supabase Edge Functions (Optional)

If you prefer Edge Functions over API routes for Stripe:

### Deploy Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook

# Set secrets
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

### Update Webhook URL

For Edge Functions, update Stripe webhook to:
`https://your-project.supabase.co/functions/v1/stripe-webhook`

---

## Vercel Deployment

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Select the `bb-platform` directory as root

### 2. Configure Build Settings

- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 3. Deploy

1. Add all environment variables
2. Click Deploy
3. Wait for build to complete

### 4. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS as instructed

---

## Post-Deployment Checklist

- [ ] Run database migrations in Supabase SQL Editor
- [ ] Enable Realtime on required tables
- [ ] Create first admin user
- [ ] Configure Stripe webhook endpoint
- [ ] Test intake form submission
- [ ] Test Stripe checkout flow
- [ ] Test admin dashboard data loading
- [ ] Verify Realtime updates in admin

---

## Troubleshooting

### "Failed to fetch admin stats"
- Check Supabase connection (URL and keys)
- Verify tables exist in database
- Check browser console for specific errors

### "Webhook signature verification failed"
- Ensure `STRIPE_WEBHOOK_SECRET` matches the endpoint
- For local dev, use the CLI-provided secret
- For production, use the Dashboard-provided secret

### "RLS policy error"
- Ensure migrations ran in correct order
- Check if user has correct role in admin_profiles
- Verify auth.uid() is being passed correctly

### Realtime not working
- Check if Realtime is enabled on the table
- Verify anon key has correct permissions
- Check browser console for WebSocket errors

---

## Security Notes

1. **Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client**
   - Only use in server components and API routes
   - In Vercel, mark as server-only

2. **Validate all inputs**
   - Use Zod schemas in `src/lib/validations/schemas.ts`
   - Always validate on the server side

3. **RLS is your friend**
   - Even with service role, prefer RLS-safe queries
   - Test as non-admin user to verify policies

4. **Audit logging**
   - All sensitive actions are logged to activity_log
   - Review periodically for suspicious activity
