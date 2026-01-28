import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

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

    // Get total revenue from payments
    const { data: payments } = await supabase
      .from('payments')
      .select('amount, completed_at')
      .eq('status', 'completed');

    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    // Calculate this month's revenue
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thisMonthRevenue = payments
      ?.filter((p) => p.completed_at && new Date(p.completed_at) >= startOfMonth)
      .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

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
        totalRevenue: totalRevenue / 100, // Convert cents to dollars
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
