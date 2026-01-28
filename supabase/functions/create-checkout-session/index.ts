// Supabase Edge Function: Create Stripe Checkout Session
// Deploy with: supabase functions deploy create-checkout-session

import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { getSupabaseAdmin } from '../_shared/supabase.ts';

// Product configurations
const PRODUCTS = {
  shooting_eval: {
    name: 'BB Shooting Evaluation',
    description: 'Personalized BB Profile with shooting analysis and protocols',
    price: 25000, // $250 in cents
    mode: 'payment' as const,
  },
  complete_eval: {
    name: 'BB Complete Evaluation',
    description: 'Full shooting evaluation with video breakdown and 4-week plan',
    price: 50000, // $500 in cents
    mode: 'payment' as const,
  },
  mentorship: {
    name: 'BB 3-Month Mentorship',
    description: 'High-touch mentorship with weekly calls, equipment, and personalized protocols',
    price: 500000, // $5,000 in cents
    mode: 'payment' as const,
  },
  mentorship_subscription: {
    name: 'BB Mentorship Monthly',
    description: 'Monthly mentorship subscription',
    price: 199900, // $1,999/month in cents
    mode: 'subscription' as const,
    interval: 'month',
  },
};

interface CheckoutRequest {
  productType: keyof typeof PRODUCTS;
  prospectId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  successUrl?: string;
  cancelUrl?: string;
  customAmount?: number; // For custom pricing
  metadata?: Record<string, string>;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Only allow POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const body: CheckoutRequest = await req.json();
    const {
      productType,
      prospectId,
      email,
      firstName,
      lastName,
      successUrl,
      cancelUrl,
      customAmount,
      metadata = {},
    } = body;

    // Validate required fields
    if (!productType || !prospectId || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: productType, prospectId, email' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get product config
    const product = PRODUCTS[productType];
    if (!product) {
      return new Response(
        JSON.stringify({ error: `Invalid product type: ${productType}` }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Initialize Supabase
    const supabase = getSupabaseAdmin();

    // Determine price
    const price = customAmount ?? product.price;

    // Determine if this is high-ticket
    const isHighTicket = price >= 100000; // $1000+

    // Build base URL for redirects
    const baseUrl = Deno.env.get('PUBLIC_SITE_URL') ?? 'http://localhost:3000';

    // Create or retrieve Stripe customer
    let customerId: string | undefined;

    // Check if customer exists
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email,
        name: firstName && lastName ? `${firstName} ${lastName}` : undefined,
        metadata: {
          prospect_id: prospectId,
        },
      });
      customerId = customer.id;
    }

    // Build checkout session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_email: customerId ? undefined : email,
      mode: product.mode,
      success_url: successUrl ?? `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl ?? `${baseUrl}/intake?cancelled=true`,
      metadata: {
        prospect_id: prospectId,
        product_type: productType,
        high_ticket: isHighTicket ? 'true' : 'false',
        ...metadata,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    };

    // Add line items based on mode
    if (product.mode === 'payment') {
      sessionParams.line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ];
      sessionParams.payment_intent_data = {
        metadata: {
          prospect_id: prospectId,
          product_type: productType,
        },
      };
    } else if (product.mode === 'subscription') {
      // For subscriptions, create a price first or use price_data
      sessionParams.line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: price,
            recurring: {
              interval: (product as any).interval ?? 'month',
            },
          },
          quantity: 1,
        },
      ];
      sessionParams.subscription_data = {
        metadata: {
          prospect_id: prospectId,
          product_type: productType,
        },
      };
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create(sessionParams);

    // Create payment record in database
    const { error: dbError } = await supabase.from('payments').insert({
      prospect_id: prospectId,
      stripe_checkout_session_id: session.id,
      stripe_customer_id: customerId,
      amount: price,
      currency: 'usd',
      status: 'pending',
      product_type: productType,
      is_subscription: product.mode === 'subscription',
      subscription_interval: product.mode === 'subscription' ? (product as any).interval : null,
      metadata: { session_url: session.url },
    });

    if (dbError) {
      console.error('Database error:', dbError);
      // Don't fail - Stripe session is already created
    }

    // Update prospect status
    await supabase
      .from('prospects')
      .update({
        pipeline_status: 'payment_pending',
        value_estimate: price / 100,
        high_ticket_prospect: isHighTicket,
      })
      .eq('id', prospectId);

    // Return session info
    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
        customerId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Checkout error:', error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to create checkout session',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
