import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import Stripe from 'stripe';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();

    // Get total prospects count
    const { count: totalProspects } = await supabase
      .from('prospects')
      .select('*', { count: 'exact', head: true });

    // Get pending evaluations from shooting_evaluations table
    const { count: pendingReviews } = await supabase
      .from('shooting_evaluations')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending_review', 'review_in_progress']);

    // Get high-ticket prospects (in active pipeline statuses)
    const { count: highTicketProspects } = await supabase
      .from('prospects')
      .select('*', { count: 'exact', head: true })
      .eq('high_ticket_prospect', true)
      .in('pipeline_status', ['paid', 'evaluation_submitted', 'tests_submitted', 'in_pipeline', 'review_in_progress']);

    // Get this month's revenue from Stripe
    let thisMonthRevenue = 0;

    try {
      // Get start of current month timestamp
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const startOfMonthTimestamp = Math.floor(startOfMonth.getTime() / 1000);

      // Fetch only this month's successful payments from Stripe
      const charges = await stripe.charges.list({
        limit: 100,
        created: { gte: startOfMonthTimestamp },
      });

      // Calculate this month's total from successful charges
      for (const charge of charges.data) {
        if (charge.status === 'succeeded' && !charge.refunded) {
          thisMonthRevenue += charge.amount;
        }
      }
    } catch (stripeError) {
      console.error('Stripe fetch error:', stripeError);
    }

    // Calculate conversion rate
    const { count: paidProspects } = await supabase
      .from('prospects')
      .select('*', { count: 'exact', head: true })
      .in('pipeline_status', ['paid', 'in_pipeline', 'profile_delivered', 'enrolled_mentorship', 'closed_won']);

    const conversionRate = totalProspects && totalProspects > 0
      ? Math.round(((paidProspects || 0) / totalProspects) * 100)
      : 0;

    // Get pending evaluations list with prospect info
    const { data: pendingEvaluations } = await supabase
      .from('shooting_evaluations')
      .select(`
        id,
        prospect_id,
        status,
        player_full_name,
        player_level,
        created_at,
        prospects (
          first_name,
          last_name,
          high_ticket_prospect
        )
      `)
      .in('status', ['pending_review', 'review_in_progress'])
      .order('created_at', { ascending: false })
      .limit(10);

    // Get recent prospects
    const { data: recentProspects } = await supabase
      .from('prospects')
      .select('id, first_name, last_name, email, role, player_level, pipeline_status, high_ticket_prospect, value_estimate, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(10);

    // Get recent activity from activity_log
    const { data: recentActivity } = await supabase
      .from('activity_log')
      .select('id, action, description, created_at, prospect_id')
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      stats: {
        totalProspects: totalProspects || 0,
        pendingReviews: pendingReviews || 0,
        highTicketProspects: highTicketProspects || 0,
        totalRevenue: thisMonthRevenue / 100, // Monthly revenue in dollars
        thisMonthRevenue: thisMonthRevenue / 100,
        conversionRate,
      },
      pendingEvaluations: pendingEvaluations || [],
      recentProspects: recentProspects || [],
      recentActivity: recentActivity || [],
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
