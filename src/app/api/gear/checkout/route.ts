import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { getStripe } from '@/lib/stripe';

const PRODUCTS = {
  strobes_bundle: {
    name: 'BB Strobes + Protocol Pack',
    description: 'Senaptec Strobes + BB Quickstart PDF + 3 Protocol Workouts + Start Here Video',
    price: 40000, // $400 in cents
  },
  strobes_only: {
    name: 'BB Strobes (Partner)',
    description: 'Senaptec Strobes with BB setup guidance - Partner pricing',
    price: 25000, // $250 in cents
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product, email, name } = body;

    if (!product || !PRODUCTS[product as keyof typeof PRODUCTS]) {
      return NextResponse.json(
        { success: false, error: 'Invalid product' },
        { status: 400 }
      );
    }

    const productData = PRODUCTS[product as keyof typeof PRODUCTS];
    const stripe = getStripe();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bb-platform-virid.vercel.app';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productData.name,
              description: productData.description,
            },
            unit_amount: productData.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/gear/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/gear`,
      metadata: {
        product_type: product,
        customer_name: name || '',
      },
    });

    // Log the order attempt (table might not exist yet, that's ok)
    try {
      const supabase = createServiceRoleClient();
      await supabase.from('gear_orders').insert({
        stripe_checkout_session_id: session.id,
        product_type: product,
        amount: productData.price,
        status: 'pending',
        customer_email: email || null,
        customer_name: name || null,
      });
    } catch {
      console.log('gear_orders table not found - order logged in Stripe only');
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Gear checkout error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
