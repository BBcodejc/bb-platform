import Stripe from 'stripe';

// Lazy-loaded Stripe client
let _stripe: Stripe | null = null;

// Get Stripe client
export function getStripe(): Stripe {
  if (!_stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable');
    }
    _stripe = new Stripe(secretKey, {
      apiVersion: '2025-12-15.clover',
    });
  }
  return _stripe;
}

// Product IDs and Prices
export const PRODUCTS = {
  SHOOTING_EVAL: {
    name: 'BB Shooting Evaluation',
    price: 25000, // $250.00 in cents
    priceId: process.env.STRIPE_SHOOTING_EVAL_PRICE_ID,
  },
  COMPLETE_EVAL: {
    name: 'BB Complete Game Evaluation',
    price: 50000, // $500.00 in cents
    priceId: process.env.STRIPE_COMPLETE_EVAL_PRICE_ID,
  },
  MENTORSHIP: {
    name: 'BB 3-Month Complete Offensive Blueprint',
    price: 500000, // $5,000.00 in cents
    priceId: process.env.STRIPE_MENTORSHIP_PRICE_ID,
  },
} as const;

// Create checkout session for evaluation
export async function createCheckoutSession({
  prospectId,
  prospectEmail,
  productType,
  successUrl,
  cancelUrl,
}: {
  prospectId: string;
  prospectEmail: string;
  productType: 'shooting_eval' | 'complete_eval' | 'mentorship';
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripe();

  const product =
    productType === 'shooting_eval'
      ? PRODUCTS.SHOOTING_EVAL
      : productType === 'complete_eval'
      ? PRODUCTS.COMPLETE_EVAL
      : PRODUCTS.MENTORSHIP;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: prospectEmail,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description:
              productType === 'mentorship'
                ? '3-month personalized shooting program with equipment, strobes, and weekly check-ins'
                : 'Personalized BB shooting profile with test protocols and recommendations',
          },
          unit_amount: product.price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      prospect_id: prospectId,
      product_type: productType,
    },
  });

  return session;
}

// Verify webhook signature
export function verifyWebhookSignature(
  body: string | Buffer,
  signature: string
): Stripe.Event {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable');
  }
  return stripe.webhooks.constructEvent(body, signature, webhookSecret);
}
