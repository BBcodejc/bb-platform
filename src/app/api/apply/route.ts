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
        { status: 429 }
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
      return NextResponse.json({ ok: true });
    }

    // Required field validation
    if (!name || !email || !phone || !role || !level) {
      return NextResponse.json(
        { error: 'Name, email, phone, role, and level are required.' },
        { status: 400 }
      );
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // 1) Durable capture: append to the Google Sheet (best effort).
    const sheetOK = await appendToSheet({
      name,
      email,
      phone,
      role,
      level,
      playerName,
      improve,
      scope,
      ip,
    });

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

    // Succeed if the applicant was captured anywhere (sheet OR team email).
    if (!sheetOK && !notifyOK) {
      return NextResponse.json(
        { error: 'Could not record your application. Please email bbcodejc@gmail.com directly.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Apply route error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please email bbcodejc@gmail.com directly.' },
      { status: 500 }
    );
  }
}
