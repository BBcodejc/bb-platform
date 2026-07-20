import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Calibration relaunch waitlist. Signups land in BB OS (Supabase bb_leads)
// with source "Calibration Relaunch Waitlist" so they are visible in the CRM
// alongside applications. Same connection pattern as /api/apply.
const CRM_URL_DEFAULT = 'https://xtpbpznvvgthhelslrqn.supabase.co';
const CRM_KEY_DEFAULT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0cGJwem52dmd0aGhlbHNscnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgwMzksImV4cCI6MjA5ODE0NDAzOX0.g0KooWgrPbB9xtbDIjcK5UT6w7ZQH-68_9d3Cuv23kM';

// In-memory rate limit per IP (resets on deploy; CRM is the durable record).
const submissions = new Map<string, number[]>();
const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function rateLimitOK(ip: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return false;
  recent.push(now);
  submissions.set(ip, recent);
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!rateLimitOK(ip)) {
      return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
    }
    const b = await req.json();
    const name = String(b.name || '').slice(0, 120).trim();
    const email = String(b.email || '').slice(0, 200).trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
    }
    const which = b.source === 'community' ? 'community' : 'calibration';
    const sourceName =
      which === 'community' ? 'BB Community Waitlist' : 'Calibration Relaunch Waitlist';
    const noteText =
      which === 'community'
        ? 'Joined the BB Community waitlist on basketballbiomechanics.com'
        : 'Joined the Shooting Calibration Masterclass relaunch waitlist.';

    const url =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || CRM_URL_DEFAULT;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || CRM_KEY_DEFAULT;
    const headers = {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: 'return=minimal',
      'x-bb-pin': process.env.CRM_PIN || '',
    };
    const now = new Date().toISOString();
    const id = 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
    const lead = {
      id,
      created_at: now,
      updated_at: now,
      stage: 'new_lead',
      status: 'Waitlist',
      owner: 'Jake',
      category: 'Athlete',
      source: sourceName,
      name,
      email,
      notes: noteText,
      stage_history: { new_lead: now },
    };
    const res = await fetch(`${url}/rest/v1/bb_leads`, {
      method: 'POST',
      headers,
      body: JSON.stringify(lead),
    });
    if (!res.ok) {
      console.error('[waitlist] CRM insert failed:', res.status, await res.text());
      return NextResponse.json({ ok: false, error: 'store_failed' }, { status: 502 });
    }
    await fetch(`${url}/rest/v1/bb_activities`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        id: id + '-a',
        lead_id: id,
        type: 'system',
        body: noteText,
        actor: 'Website',
        created_at: now,
      }),
    }).catch(() => {});
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }
}
