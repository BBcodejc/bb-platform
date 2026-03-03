import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { createCheckoutSession } from '@/lib/stripe';
import type { IntakeFormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const formData: IntakeFormData = body.formData;

    // Debug logging
    console.log('Checkout request body:', JSON.stringify(body, null, 2));

    if (!formData) {
      return NextResponse.json(
        { success: false, error: 'Missing formData in request body' },
        { status: 400 }
      );
    }

    if (!formData.email || !formData.firstName || !formData.lastName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: email, firstName, or lastName' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Determine if this is a high-ticket prospect (safely handle undefined values)
    const isHighTicket =
      formData?.investmentLevel === 'premium' ||
      formData?.parentInvestmentLevel === 'premium' ||
      formData?.playerLookingFor === 'full_game_audit' ||
      formData?.parentInterest === 'high_touch_mentorship' ||
      false;

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

    // Add player level if provided (basic field that exists in DB)
    if (formData.playerLevel) {
      prospectData.player_level = formData.playerLevel;
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
    const { error: paymentError } = await supabase.from('payments').insert({
      prospect_id: prospectId,
      stripe_checkout_session_id: session.id,
      amount: formData.assessmentType === 'complete_game' ? 50000 : 25000,
      currency: 'usd',
      status: 'pending',
      product_type: productType,
    });

    if (paymentError) {
      console.error('Payment record insert error:', paymentError);
      // Don't throw - the Stripe session was created successfully, we can proceed
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    console.error('Error type:', typeof error);
    console.error('Error stringified:', JSON.stringify(error, Object.getOwnPropertyNames(error || {})));
    const errorMessage = error?.message || error?.toString?.() || JSON.stringify(error) || 'Unknown error';
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session', details: errorMessage },
      { status: 500 }
    );
  }
}
