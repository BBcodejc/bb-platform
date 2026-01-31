import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { createCheckoutSession } from '@/lib/stripe';
import type { IntakeFormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { formData }: { formData: IntakeFormData } = await request.json();
    const supabase = createServerSupabaseClient();

    // Determine if this is a high-ticket prospect
    const isHighTicket =
      formData.investmentLevel === 'premium' ||
      formData.parentInvestmentLevel === 'premium' ||
      formData.playerLookingFor === 'full_game_audit' ||
      formData.parentInterest === 'high_touch_mentorship';

    // Build prospect data with new field structure
    const prospectData: Record<string, unknown> = {
      role: formData.role,
      assessment_type: formData.assessmentType || null,
      email: formData.email,
      phone: formData.phone || null,
      first_name: formData.firstName,
      last_name: formData.lastName,
      pipeline_status: 'payment_pending',
      high_ticket_prospect: isHighTicket,
    };

    // Add player fields if applicable
    if (formData.role === 'player') {
      Object.assign(prospectData, {
        player_level: formData.playerLevel || null,
        player_main_goal: Array.isArray(formData.playerMainGoal)
          ? formData.playerMainGoal.join(', ')
          : formData.playerMainGoal || null,
        game_vs_workout: formData.gameVsWorkout || null,
        three_pt_percentage: formData.threePtPercentage || null,
        player_problem: formData.playerProblem || null,
        workout_style: formData.workoutStyle || null,
        days_per_week: formData.daysPerWeek || null,
        player_looking_for: formData.playerLookingFor || null,
        investment_level: formData.investmentLevel || null,
        player_age: formData.playerAge || null,
        player_location: formData.playerLocation || null,
        player_instagram: formData.playerInstagram || null,
      });
    }

    // Add parent fields if applicable
    if (formData.role === 'parent') {
      Object.assign(prospectData, {
        child_name: formData.childName || null,
        child_age: formData.childAge || null,
        child_level: formData.childLevel || null,
        child_strengths: formData.childStrengths || null,
        parent_issues: formData.parentIssues || null,
        parent_issue_other: formData.parentIssueOther || null,
        child_confidence: formData.childConfidence || null,
        parent_main_goal: formData.parentMainGoal || null,
        weekly_training_hours: formData.weeklyTrainingHours || null,
        previous_trainer_experience: formData.previousTrainerExperience || null,
        parent_interest: formData.parentInterest || null,
        parent_involvement: formData.parentInvolvement || null,
        parent_investment_level: formData.parentInvestmentLevel || null,
      });
    }

    // Check if prospect exists
    const { data: existingProspect } = await supabase
      .from('prospects')
      .select('id')
      .eq('email', formData.email)
      .single();

    let prospectId: string;

    if (existingProspect) {
      await supabase
        .from('prospects')
        .update(prospectData)
        .eq('id', existingProspect.id);
      prospectId = existingProspect.id;
    } else {
      const { data: newProspect, error } = await supabase
        .from('prospects')
        .insert(prospectData)
        .select()
        .single();

      if (error) throw error;
      prospectId = newProspect.id;
    }

    // Determine product type
    const productType = formData.assessmentType === 'complete_game'
      ? 'complete_eval'
      : 'shooting_eval';

    // Get the base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      prospectId,
      prospectEmail: formData.email,
      productType,
      successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/intake`,
    });

    // Store pending payment record
    await supabase.from('payments').insert({
      prospect_id: prospectId,
      stripe_checkout_session_id: session.id,
      amount: formData.assessmentType === 'complete_game' ? 50000 : 25000,
      currency: 'usd',
      status: 'pending',
      product_type: productType,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session', details: errorMessage },
      { status: 500 }
    );
  }
}
