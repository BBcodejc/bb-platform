import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import type { IntakeFormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: IntakeFormData = await request.json();
    const supabase = createServiceRoleClient();

    // Determine if this is a high-ticket prospect
    const isHighTicket =
      body.investmentLevel === 'premium' ||
      body.parentInvestmentLevel === 'premium' ||
      body.playerLookingFor === 'full_game_audit' ||
      body.parentInterest === 'high_touch_mentorship';

    // Build extra details for the notes field (for data that may not have its own column)
    const extraDetails: string[] = [];
    if (body.routingRecommendation) extraDetails.push(`Routing: ${body.routingRecommendation}`);
    if (body.investmentLevel) extraDetails.push(`Investment Level: ${body.investmentLevel}`);
    if (body.playerLookingFor) extraDetails.push(`Looking For: ${body.playerLookingFor}`);
    if (body.playerProblem) extraDetails.push(`Problem: ${body.playerProblem}`);
    if (body.workoutStyle) extraDetails.push(`Workout Style: ${body.workoutStyle}`);
    if (body.gameVsWorkout) extraDetails.push(`Details: ${body.gameVsWorkout}`);
    if (body.daysPerWeek) extraDetails.push(`Days/Week: ${body.daysPerWeek}`);
    if (body.playerLocation) extraDetails.push(`Location: ${body.playerLocation}`);
    if (body.playerInstagram) extraDetails.push(`Instagram: ${body.playerInstagram}`);
    if (body.playerMainGoal) extraDetails.push(`Main Goal: ${body.playerMainGoal}`);

    // Transform form data to database format — use only columns that exist in the DB
    const prospectData: Record<string, unknown> = {
      role: body.role,
      email: body.email,
      phone: body.phone || null,
      first_name: body.firstName,
      last_name: body.lastName,
      pipeline_status: 'intake_completed',
      high_ticket_prospect: isHighTicket,
      notes: extraDetails.length > 0 ? extraDetails.join('\n') : null,
    };

    // Add role-specific fields (only columns that exist in the DB schema)
    if (body.role === 'player') {
      Object.assign(prospectData, {
        player_level: body.playerLevel || null,
        player_age: body.playerAge ? Number(body.playerAge) : null,
        three_pt_percentage: body.threePtPercentage ? Number(body.threePtPercentage) : null,
        goals: body.playerMainGoal || body.playerProblem || null,
        commitment_level: body.investmentLevel || null,
      });
    }

    if (body.role === 'parent') {
      Object.assign(prospectData, {
        parent_child_age: body.childAge ? Number(body.childAge) : null,
        parent_child_level: body.childLevel || null,
        parent_goals: body.parentMainGoal || null,
      });
    }

    if (body.role === 'coach') {
      Object.assign(prospectData, {
        coaching_level: body.coachLevel || null,
        team_organization: body.coachRole || null,
        certification_interest: body.coachCertificationWants === 'yes' || false,
      });
    }

    if (body.role === 'organization') {
      Object.assign(prospectData, {
        org_name: body.orgName || null,
        org_player_count: body.teamCount ? Number(body.teamCount) : null,
        org_goals: body.orgWin || null,
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
  } catch (error: any) {
    console.error('Intake error:', error);
    const details = error?.message || error?.details || error?.hint || JSON.stringify(error);
    return NextResponse.json(
      { success: false, error: 'Failed to save intake data', details },
      { status: 500 }
    );
  }
}
