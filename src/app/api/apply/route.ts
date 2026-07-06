import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Where new-application notifications land:
const TO_EMAIL = 'bbcodejc@gmail.com';
// Verified Resend sender. Friendly name shown to recipients:
const FROM_NOTIFY = 'BB Apply <jake@trainwjc.com>';
const FROM_CONFIRM = 'Basketball Biomechanics <jake@trainwjc.com>';

// Simple in-memory rate limit per IP — prevents form spam.
// Note: resets on each deploy/cold start. The Google Sheet is the durable record.
const submissions = new Map<string, number[]>();
const RATE_LIMIT = 3; // max submissions
const WINDOW_MS = 10 * 60 * 1000; // per 10 min

function rateLimitOK(ip: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return false;
  recent.push(now);
  submissions.set(ip, recent);
  return true;
}

function escape(s: string): string {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .slice(0, 5000);
}

// CORS: the application form is also served from static hosts
// (lens-landing, apply.html), so cross-origin POSTs must be allowed.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// Best-effort insert into BB OS (Supabase bb_leads + bb_activities).
// Creates the lead record in the CRM the moment the application lands.
// Never throws — the Sheet and team email remain the durable backups.
// Fallback connection: the BB Code Remote project + anon key (public by
// design; row policies permit writes). Env vars override when set.
const CRM_URL_DEFAULT = 'https://xtpbpznvvgthhelslrqn.supabase.co';
const CRM_KEY_DEFAULT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0cGJwem52dmd0aGhlbHNscnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgwMzksImV4cCI6MjA5ODE0NDAzOX0.g0KooWgrPbB9xtbDIjcK5UT6w7ZQH-68_9d3Cuv23kM';

async function createCrmLead(row: Record<string, string>): Promise<boolean> {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || CRM_URL_DEFAULT;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || CRM_KEY_DEFAULT;
  if (!url || !key) return false;
  const headers = {
    'Content-Type': 'application/json',
    apikey: key,
    Authorization: `Bearer ${key}`,
    Prefer: 'return=minimal',
    // Team access code enforced by the database's row policies
    // (bb-os/security-pin.sql). Set CRM_PIN in Vercel env vars.
    'x-bb-pin': process.env.CRM_PIN || '',
  };
  const now = new Date().toISOString();
  const id = 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
  const role = (row.role || '').toLowerCase();
  const category = /parent/.test(role) ? 'Parent'
    : /coach/.test(role) ? 'Coach'
    : /staff/.test(role) ? 'Professional'
    : 'Athlete';
  const lead = {
    id,
    created_at: now,
    updated_at: now,
    stage: 'applied',
    status: 'Pending Review',
    owner: 'Jake',
    category,
    source: 'Website',
    name: row.name || '',
    email: row.email || '',
    phone: row.phone || '',
    athlete_name: row.playerName || (category === 'Athlete' ? row.name || '' : ''),
    parent_name: category === 'Parent' ? row.name || '' : '',
    level: row.level || '',
    goals: row.improve || '',
    notes: row.scope ? `Level of play / scope: ${row.scope}` : '',
    stage_history: { applied: now },
  };
  try {
    const res = await fetch(`${url}/rest/v1/bb_leads`, {
      method: 'POST',
      headers,
      body: JSON.stringify(lead),
    });
    if (!res.ok) {
      console.error('[apply] CRM lead insert failed:', res.status, await res.text());
      return false;
    }
    // Activity log entry (best effort on top of best effort).
    await fetch(`${url}/rest/v1/bb_activities`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        id: id + '-a',
        lead_id: id,
        type: 'system',
        body: 'Application submitted on basketballbiomechanics.com',
        actor: 'Website',
        created_at: now,
      }),
    }).catch(() => {});
    return true;
  } catch (err) {
    console.error('[apply] CRM lead insert threw:', err);
    return false;
  }
}

// Best-effort append to a Google Sheet via an Apps Script Web App.
// Never throws — a sheet outage must not lose the applicant (email is the backup).
async function appendToSheet(row: Record<string, string>): Promise<boolean> {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEET_SECRET;
  if (!url) return false;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: secret || '', ...row }),
      redirect: 'follow',
    });
    return res.ok;
  } catch (err) {
    console.error('[apply] Sheet append failed:', err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!rateLimitOK(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429, headers: CORS_HEADERS }
      );
    }

    const body = await request.json();
    const {
      name = '',
      email = '',
      phone = '',
      role = '',
      level = '',
      playerName = '',
      improve = '',
      scope = '',
      honeypot = '',
    } = body;

    // Honeypot — bots fill this, humans don't. Pretend success, store nothing.
    if (honeypot) {
      return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
    }

    // Required field validation
    if (!name || !email || !phone || !role || !level) {
      return NextResponse.json(
        { error: 'Name, email, phone, role, and level are required.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400, headers: CORS_HEADERS });
    }

    const row = { name, email, phone, role, level, playerName, improve, scope, ip };

    // 1) Capture in parallel: BB OS CRM lead (Supabase) + Google Sheet (both best effort).
    const [crmOK, sheetOK] = await Promise.all([createCrmLead(row), appendToSheet(row)]);
    if (crmOK) console.log('[apply] CRM lead created for', email);

    const apiKey = process.env.RESEND_API_KEY;
    let notifyOK = false;

    if (apiKey) {
      const resend = new Resend(apiKey);

      // 2) Notify the team of the new application.
      const notifyHtml = `
        <h2>New Application — Basketball Biomechanics</h2>
        <p><strong>Name:</strong> ${escape(name)}</p>
        <p><strong>Email:</strong> ${escape(email)}</p>
        <p><strong>Phone:</strong> ${escape(phone)}</p>
        <p><strong>Role:</strong> ${escape(role) || '—'}</p>
        <p><strong>Level:</strong> ${escape(level) || '—'}</p>
        <p><strong>Player (if on behalf):</strong> ${escape(playerName) || '—'}</p>
        <p><strong>Level of play / scope:</strong> ${escape(scope) || '—'}</p>
        <hr />
        <p><strong>What they want to improve:</strong></p>
        <p style="white-space: pre-wrap;">${escape(improve) || '—'}</p>
        <hr />
        <p style="color:#888;font-size:12px;">Submitted from basketballbiomechanics.com/apply &middot; IP: ${escape(ip)} &middot; Sheet: ${sheetOK ? 'saved' : 'NOT saved'}</p>
      `;

      try {
        const result = await resend.emails.send({
          from: FROM_NOTIFY,
          to: TO_EMAIL,
          replyTo: email,
          subject: `New Application — ${name}`,
          html: notifyHtml,
        });
        notifyOK = !result.error && !!result.data?.id;
        if (!notifyOK) console.error('[apply] Notify email issue:', result.error || result);
      } catch (err) {
        console.error('[apply] Notify email threw:', err);
      }

      // 3) Applicant confirmation — ONE email, nothing after. "Application received."
      const confirmHtml = `
        <div style="background:#080808;color:#ffffff;font-family:Helvetica,Arial,sans-serif;padding:40px 24px;text-align:center;">
          <p style="font-size:18px;line-height:1.6;max-width:480px;margin:0 auto;">
            Application received. Our Team will coordinate the next steps.
          </p>
        </div>
      `;

      try {
        await resend.emails.send({
          from: FROM_CONFIRM,
          to: email,
          replyTo: TO_EMAIL,
          subject: 'Application received — Basketball Biomechanics',
          html: confirmHtml,
        });
      } catch (err) {
        // Confirmation is best-effort; never fail the submission over it.
        console.error('[apply] Confirmation email failed:', err);
      }
    } else {
      console.error('RESEND_API_KEY not configured');
    }

    // Succeed if the applicant was captured anywhere (CRM, sheet, OR team email).
    if (!crmOK && !sheetOK && !notifyOK) {
      return NextResponse.json(
        { error: 'Could not record your application. Please email bbcodejc@gmail.com directly.' },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
  } catch (err) {
    console.error('Apply route error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please email bbcodejc@gmail.com directly.' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
