import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const TO_EMAIL = 'bbcodejc@gmail.com';
const FROM_EMAIL = 'BB San Diego <noreply@trainwjc.com>';

// Simple per-IP rate limit
const submissions = new Map<string, number[]>();
const RATE_LIMIT = 3;
const WINDOW_MS = 10 * 60 * 1000;

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
    .slice(0, 2000);
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
      goal = '',
      honeypot = '',
    } = body;

    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !role || !level) {
      return NextResponse.json(
        { error: 'Name, email, role, and level are required.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
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
      <h2>San Diego Summer 2026 — New Inquiry</h2>
      <p><strong>Name:</strong> ${escape(name)}</p>
      <p><strong>Email:</strong> ${escape(email)}</p>
      <p><strong>Phone:</strong> ${escape(phone) || '—'}</p>
      <p><strong>Role:</strong> ${escape(role)}</p>
      <p><strong>Level:</strong> ${escape(level)}</p>
      <hr />
      <p><strong>Looking to get out of this:</strong></p>
      <p style="white-space: pre-wrap;">${escape(goal) || '—'}</p>
      <hr />
      <p style="color:#888;font-size:12px;">Submitted from basketballbiomechanics.com/sandiego &middot; IP: ${escape(ip)}</p>
    `;

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `San Diego Inquiry — ${name} (${role})`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send. Please try again or email bbcodejc@gmail.com directly.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('San Diego inquiry error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please email bbcodejc@gmail.com directly.' },
      { status: 500 }
    );
  }
}
