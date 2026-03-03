'use server';

import { createClient } from '@/lib/supabase/server';
import { evaluationReviewSchema, prospectUpdateSchema } from '@/lib/validations/schemas';
import { revalidatePath } from 'next/cache';

// ============================================
// PROSPECT ACTIONS
// ============================================

export async function updateProspect(prospectId: string, data: unknown) {
  try {
    const validatedData = prospectUpdateSchema.parse(data);
    const supabase = await createClient();

    const { error } = await supabase
      .from('prospects')
      .update({
        pipeline_status: validatedData.pipeline_status,
        internal_notes: validatedData.internal_notes,
        high_ticket_prospect: validatedData.high_ticket_prospect,
        value_estimate: validatedData.value_estimate,
        tags: validatedData.tags,
      })
      .eq('id', prospectId);

    if (error) throw error;

    revalidatePath('/admin/prospects');
    revalidatePath(`/admin/prospects/${prospectId}`);

    return { success: true };
  } catch (error) {
    console.error('Update prospect error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update prospect' };
  }
}

export async function deleteProspect(prospectId: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('prospects')
      .delete()
      .eq('id', prospectId);

    if (error) throw error;

    revalidatePath('/admin/prospects');

    return { success: true };
  } catch (error) {
    console.error('Delete prospect error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete prospect' };
  }
}

export async function updateProspectStatus(prospectId: string, status: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('prospects')
      .update({ pipeline_status: status })
      .eq('id', prospectId);

    if (error) throw error;

    revalidatePath('/admin');
    revalidatePath('/admin/prospects');
    revalidatePath(`/admin/prospects/${prospectId}`);

    return { success: true };
  } catch (error) {
    console.error('Update status error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update status' };
  }
}

// ============================================
// EVALUATION ACTIONS
// ============================================

export async function submitEvaluationReview(
  prospectId: string,
  shootingEvaluationId: string,
  data: unknown,
  reviewerId: string
) {
  try {
    const validatedData = evaluationReviewSchema.parse(data);
    const supabase = await createClient();

    // Create or update evaluation record
    const { data: existingEval } = await supabase
      .from('evaluations')
      .select('id')
      .eq('prospect_id', prospectId)
      .single();

    const evaluationData = {
      prospect_id: prospectId,
      shooting_evaluation_id: shootingEvaluationId,
      current_bb_level: validatedData.current_bb_level,
      miss_profile: validatedData.miss_profile,
      deep_distance_analysis: validatedData.deep_distance_analysis,
      ball_flight_analysis: validatedData.ball_flight_analysis,
      energy_transfer_notes: validatedData.energy_transfer_notes,
      constraints_identified: validatedData.constraints_identified,
      priority_protocols: validatedData.priority_protocols,
      weekly_plan_summary: validatedData.weekly_plan_summary,
      four_week_focus: validatedData.four_week_focus,
      full_assessment: validatedData.full_assessment,
      mentorship_fit_score: validatedData.mentorship_fit_score,
      mentorship_recommendation: validatedData.mentorship_recommendation,
      recommend_mentorship: validatedData.recommend_mentorship,
      status: 'approved',
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    };

    if (existingEval) {
      const { error } = await supabase
        .from('evaluations')
        .update(evaluationData)
        .eq('id', existingEval.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('evaluations')
        .insert(evaluationData);

      if (error) throw error;
    }

    // Update shooting evaluation status
    await supabase
      .from('shooting_evaluations')
      .update({ status: 'approved' })
      .eq('id', shootingEvaluationId);

    // Update prospect pipeline status
    await supabase
      .from('prospects')
      .update({ pipeline_status: 'in_pipeline' })
      .eq('id', prospectId);

    revalidatePath('/admin');
    revalidatePath('/admin/evaluations');
    revalidatePath(`/admin/evaluations/${prospectId}`);

    return { success: true };
  } catch (error) {
    console.error('Submit evaluation review error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to submit review' };
  }
}

export async function markEvaluationDelivered(prospectId: string, evaluationId: string) {
  try {
    const supabase = await createClient();

    // Update evaluation
    const { error: evalError } = await supabase
      .from('evaluations')
      .update({
        status: 'delivered',
        delivered_at: new Date().toISOString(),
      })
      .eq('id', evaluationId);

    if (evalError) throw evalError;

    // Update prospect
    const { error: prospectError } = await supabase
      .from('prospects')
      .update({ pipeline_status: 'profile_delivered' })
      .eq('id', prospectId);

    if (prospectError) throw prospectError;

    revalidatePath('/admin');
    revalidatePath('/admin/evaluations');
    revalidatePath(`/admin/evaluations/${prospectId}`);

    return { success: true };
  } catch (error) {
    console.error('Mark delivered error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to mark as delivered' };
  }
}

export async function rejectEvaluation(prospectId: string, shootingEvaluationId: string, reason: string) {
  try {
    const supabase = await createClient();

    // Update shooting evaluation status
    const { error } = await supabase
      .from('shooting_evaluations')
      .update({
        status: 'rejected',
        additional_notes: reason,
      })
      .eq('id', shootingEvaluationId);

    if (error) throw error;

    revalidatePath('/admin');
    revalidatePath('/admin/evaluations');
    revalidatePath(`/admin/evaluations/${prospectId}`);

    return { success: true };
  } catch (error) {
    console.error('Reject evaluation error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to reject evaluation' };
  }
}

// ============================================
// MENTORSHIP ACTIONS
// ============================================

export async function createMentorship(
  prospectId: string,
  evaluationId: string,
  paymentId: string
) {
  try {
    const supabase = await createClient();

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3);

    const { error } = await supabase.from('mentorships').insert({
      prospect_id: prospectId,
      evaluation_id: evaluationId,
      payment_id: paymentId,
      program_type: '3_month_blueprint',
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      status: 'pending_contract',
      check_in_frequency: 'weekly',
      next_check_in: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    if (error) throw error;

    // Update prospect status
    await supabase
      .from('prospects')
      .update({ pipeline_status: 'enrolled_mentorship' })
      .eq('id', prospectId);

    revalidatePath('/admin');

    return { success: true };
  } catch (error) {
    console.error('Create mentorship error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create mentorship' };
  }
}

export async function updateMentorshipStatus(mentorshipId: string, status: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('mentorships')
      .update({ status })
      .eq('id', mentorshipId);

    if (error) throw error;

    revalidatePath('/admin');

    return { success: true };
  } catch (error) {
    console.error('Update mentorship error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update mentorship' };
  }
}

// ============================================
// ADMIN USER ACTIONS
// ============================================

export async function promoteToAdmin(email: string) {
  try {
    const supabase = await createClient();

    // This calls the database function
    const { error } = await supabase.rpc('promote_to_admin', {
      user_email: email,
      admin_role: 'admin',
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Promote to admin error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to promote user' };
  }
}

// ============================================
// BULK ACTIONS
// ============================================

export async function bulkUpdateStatus(prospectIds: string[], status: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('prospects')
      .update({ pipeline_status: status })
      .in('id', prospectIds);

    if (error) throw error;

    revalidatePath('/admin');
    revalidatePath('/admin/prospects');

    return { success: true, count: prospectIds.length };
  } catch (error) {
    console.error('Bulk update error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to bulk update' };
  }
}

export async function exportProspects(filters?: { status?: string; highTicket?: boolean }) {
  try {
    const supabase = await createClient();

    let query = supabase.from('prospects').select('*');

    if (filters?.status) {
      query = query.eq('pipeline_status', filters.status);
    }

    if (filters?.highTicket) {
      query = query.eq('high_ticket_prospect', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to export' };
  }
}
