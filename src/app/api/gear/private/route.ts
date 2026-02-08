import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

// This endpoint creates a private checkout link for partner pricing ($250 strobes only)
// Access via: /api/gear/private?email=customer@email.com&name=Customer%20Name

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const name = searchParams.get('name');

    const stripe = getStripe();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bb-platform-virid.vercel.app';

    // Create Stripe checkout session for partner pricing
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'BB Strobes (Partner)',
              description: 'Senaptec Strobes with BB setup guidance and protocols - Partner pricing',
            },
            unit_amount: 25000, // $250 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/gear/success?session_id={CHECKOUT_SESSION_ID}&partner=true`,
      cancel_url: `${baseUrl}/gear`,
      metadata: {
        product_type: 'strobes_partner',
        customer_name: name || '',
        partner_link: 'true',
      },
    });

    // Redirect to checkout
    if (session.url) {
      return NextResponse.redirect(session.url);
    }

    return NextResponse.json({
      success: true,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Private checkout error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// Also support POST for programmatic access
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    const stripe = getStripe();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bb-platform-virid.vercel.app';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'BB Strobes (Partner)',
              description: 'Senaptec Strobes with BB setup guidance and protocols - Partner pricing',
            },
            unit_amount: 25000, // $250 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/gear/success?session_id={CHECKOUT_SESSION_ID}&partner=true`,
      cancel_url: `${baseUrl}/gear`,
      metadata: {
        product_type: 'strobes_partner',
        customer_name: name || '',
        partner_link: 'true',
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Private checkout error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
