import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Events land in Supabase bb_events (same BB Code Remote project as the CRM
// bb_leads tables — see bb-events-schema.sql). The anon key is public by
// design; row policies allow insert/select only on the bb_ tables.
const SUPA_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xtpbpznvvgthhelslrqn.supabase.co';
const SUPA_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0cGJwem52dmd0aGhlbHNscnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgwMzksImV4cCI6MjA5ODE0NDAzOX0.g0KooWgrPbB9xtbDIjcK5UT6w7ZQH-68_9d3Cuv23kM';

// CORS is open so the Thinkific checkout/thank-you snippet can post
// checkout_viewed and purchase_completed from bbcode.thinkific.com.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.slice(0, max) : '';
}

function num(v: unknown): number | null {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return typeof n === 'number' && isFinite(n) ? n : null;
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const event = str(b.event, 60);
    if (!/^[a-z0-9_]{2,60}$/.test(event)) {
      return new NextResponse(null, { status: 400, headers: CORS_HEADERS });
    }
    const row = {
      event,
      page: str(b.page, 200),
      session_id: str(b.session_id, 80),
      visitor_id: str(b.visitor_id, 80),
      product: str(b.product, 120),
      price: num(b.price),
      revenue: num(b.revenue),
      button_text: str(b.button_text, 120),
      destination: str(b.destination, 300),
      video_id: str(b.video_id, 80),
      utm_source: str(b.utm_source, 120),
      utm_medium: str(b.utm_medium, 120),
      utm_campaign: str(b.utm_campaign, 120),
      utm_content: str(b.utm_content, 120),
      traffic_source: str(b.traffic_source, 120),
      referrer: str(b.referrer, 300),
      landing_page: str(b.landing_page, 200),
      user_agent: str(b.user_agent, 200),
    };
    const res = await fetch(`${SUPA_URL}/rest/v1/bb_events`, {
      method: 'POST',
      headers: {
        apikey: SUPA_KEY,
        Authorization: `Bearer ${SUPA_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });
    if (!res.ok && process.env.NODE_ENV !== 'production') {
      console.error('bb_events insert failed', res.status, await res.text());
    }
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
  } catch {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
  }
}
