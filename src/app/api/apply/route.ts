import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const TO_EMAIL = 'bbcodejc@gmail.com';
const FROM_EMAIL = 'BB Apply <onboarding@resend.dev>';

// Simple in-memory rate limit per IP — prevents form spam
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
      firstName = '',
      lastName = '',
      email = '',
      phone = '',
      role = '',
      level = '',
      location = '',
      instagram = '',
      message = '',
      honeypot = '',
    } = body;

    // Honeypot — bots fill this, humans don't
    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    // Required field validation
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required.' },
        { status: 400 }
      );
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY not configured');
      return NextResponse.json(
        { error: 'Server configuration error. Please email bbcodejc@gmail.com directly.' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const html = `
      <h2>New Application — Basketball Biomechanics</h2>
      <p><strong>Name:</strong> ${escape(firstName)} ${escape(lastName)}</p>
      <p><strong>Email:</strong> ${escape(email)}</p>
      <p><strong>Phone:</strong> ${escape(phone) || '—'}</p>
      <p><strong>Role:</strong> ${escape(role) || '—'}</p>
      <p><strong>Level:</strong> ${escape(level) || '—'}</p>
      <p><strong>Location:</strong> ${escape(location) || '—'}</p>
      <p><strong>Instagram:</strong> ${escape(instagram) || '—'}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${escape(message) || '—'}</p>
      <hr />
      <p style="color:#888;font-size:12px;">Submitted from basketballbiomechanics.com/apply &middot; IP: ${escape(ip)}</p>
    `;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New Application — ${firstName} ${lastName}`,
      html,
    });

    console.log('[apply] Resend result:', JSON.stringify(result));

    if (result.error) {
      console.error('[apply] Resend error:', result.error);
      return NextResponse.json(
        { error: 'Failed to send. Please email bbcodejc@gmail.com directly.' },
        { status: 500 }
      );
    }

    if (!result.data?.id) {
      console.error('[apply] No email ID returned:', result);
      return NextResponse.json(
        { error: 'Email send did not complete. Please email bbcodejc@gmail.com directly.' },
        { status: 500 }
      );
    }

    console.log(`[apply] Email sent successfully — ID: ${result.data.id}`);
    return NextResponse.json({ ok: true, id: result.data.id });
  } catch (err) {
    console.error('Apply route error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please email bbcodejc@gmail.com directly.' },
      { status: 500 }
    );
  }
}
