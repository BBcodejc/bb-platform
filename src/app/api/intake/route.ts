import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import type { IntakeFormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: IntakeFormData = await request.json();
    const supabase = createServerSupabaseClient();

    // Determine if this is a high-ticket prospect
    const isHighTicket =
      body.investmentLevel === 'premium' ||
      body.parentInvestmentLevel === 'premium' ||
      body.playerLookingFor === 'full_game_audit' ||
      body.parentInterest === 'high_touch_mentorship';

    // Transform form data to database format
    const prospectData: Record<string, unknown> = {
      role: body.role,
      email: body.email,
      phone: body.phone || null,
      first_name: body.firstName,
      last_name: body.lastName,

      // Pipeline status
      pipeline_status: 'intake_completed',
      high_ticket_prospect: isHighTicket,
      routing_recommendation: body.routingRecommendation || null,
    };

    // Add role-specific fields
    if (body.role === 'player') {
      Object.assign(prospectData, {
        player_level: body.playerLevel || null,
        player_main_goal: body.playerMainGoal || null,
        game_vs_workout: body.gameVsWorkout || null,
        three_pt_percentage: body.threePtPercentage || null,
        player_problem: body.playerProblem || null,
        workout_style: body.workoutStyle || null,
        days_per_week: body.daysPerWeek || null,
        player_looking_for: body.playerLookingFor || null,
        investment_level: body.investmentLevel || null,
        player_age: body.playerAge || null,
        player_location: body.playerLocation || null,
        player_instagram: body.playerInstagram || null,
      });
    }

    if (body.role === 'parent') {
      Object.assign(prospectData, {
        child_name: body.childName || null,
        child_age: body.childAge || null,
        child_level: body.childLevel || null,
        child_strengths: body.childStrengths || null,
        parent_issues: body.parentIssues || null,
        parent_issue_other: body.parentIssueOther || null,
        child_confidence: body.childConfidence || null,
        parent_main_goal: body.parentMainGoal || null,
        weekly_training_hours: body.weeklyTrainingHours || null,
        previous_trainer_experience: body.previousTrainerExperience || null,
        parent_interest: body.parentInterest || null,
        parent_involvement: body.parentInvolvement || null,
        parent_investment_level: body.parentInvestmentLevel || null,
      });
    }

    if (body.role === 'coach') {
      Object.assign(prospectData, {
        coach_level: body.coachLevel || null,
        coach_role: body.coachRole || null,
        coach_issues: body.coachIssues || null,
        coach_issue_other: body.coachIssueOther || null,
        coach_shooting_style: body.coachShootingStyle || null,
        motor_learning_familiarity: body.motorLearningFamiliarity || null,
        coach_looking_for: body.coachLookingFor || null,
        coach_player_count: body.coachPlayerCount || null,
        coach_constraints: body.coachConstraints || null,
        coach_open_to_coaching: body.coachOpenToCoaching || null,
        coach_next_step: body.coachNextStep || null,
        coach_certification_wants: body.coachCertificationWants || null,
      });
    }

    if (body.role === 'organization') {
      Object.assign(prospectData, {
        org_type: body.orgType || null,
        org_name: body.orgName || null,
        team_count: body.teamCount || null,
        org_problems: body.orgProblems || null,
        current_dev_model: body.currentDevModel || null,
        org_win: body.orgWin || null,
        org_support: body.orgSupport || null,
        org_readiness: body.orgReadiness || null,
        org_timeline: body.orgTimeline || null,
        org_decision_makers: body.orgDecisionMakers || null,
        org_budget: body.orgBudget || null,
      });
    }

    // Check if prospect already exists
    const { data: existingProspect } = await supabase
      .from('prospects')
      .select('id')
      .eq('email', body.email)
      .single();

    let prospect;

    if (existingProspect) {
      // Update existing prospect
      const { data, error } = await supabase
        .from('prospects')
        .update(prospectData)
        .eq('id', existingProspect.id)
        .select()
        .single();

      if (error) throw error;
      prospect = data;
    } else {
      // Create new prospect
      const { data, error } = await supabase
        .from('prospects')
        .insert(prospectData)
        .select()
        .single();

      if (error) throw error;
      prospect = data;
    }

    return NextResponse.json({
      success: true,
      prospectId: prospect.id,
    });
  } catch (error) {
    console.error('Intake error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save intake data' },
      { status: 500 }
    );
  }
}
