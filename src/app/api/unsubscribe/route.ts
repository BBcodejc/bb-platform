import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return new NextResponse(renderPage('Invalid unsubscribe link.', false), {
      headers: { 'Content-Type': 'text/html' },
      status: 400,
    });
  }

  const supabase = createServerSupabaseClient();

  const { data: sequence, error } = await supabase
    .from('email_sequences')
    .select('id, email, status, prospect_id')
    .eq('unsubscribe_token', token)
    .single();

  if (error || !sequence) {
    return new NextResponse(renderPage('This unsubscribe link is invalid or has expired.', false), {
      headers: { 'Content-Type': 'text/html' },
      status: 404,
    });
  }

  if (sequence.status === 'unsubscribed') {
    return new NextResponse(renderPage('You have already been unsubscribed.', true), {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  // Update sequence status
  await supabase
    .from('email_sequences')
    .update({
      status: 'unsubscribed',
      unsubscribed_at: new Date().toISOString(),
    })
    .eq('id', sequence.id);

  // Log activity
  try {
    await supabase.from('activity_log').insert({
      prospect_id: sequence.prospect_id,
      action: 'email_unsubscribed',
      entity_type: 'email_sequence',
      entity_id: sequence.id,
      description: `Prospect unsubscribed from email sequence`,
    });
  } catch (e) {
    // Don't fail unsubscribe on logging error
  }

  return new NextResponse(
    renderPage("You've been unsubscribed. You won't receive any more automated emails from us.", true),
    { headers: { 'Content-Type': 'text/html' } }
  );
}

function renderPage(message: string, success: boolean): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribe - Basketball Biomechanics</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0a0a0a;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
    }
    .card {
      max-width: 420px;
      text-align: center;
      padding: 48px 32px;
    }
    .icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      font-size: 28px;
      background: ${success ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'};
      border: 1px solid ${success ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'};
    }
    h1 {
      font-size: 22px;
      margin-bottom: 12px;
      color: ${success ? '#22c55e' : '#ef4444'};
    }
    p {
      color: #9ca3af;
      line-height: 1.7;
      font-size: 15px;
    }
    a {
      color: #C9A961;
      text-decoration: none;
    }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${success ? '&#10003;' : '&#10007;'}</div>
    <h1>${success ? 'Unsubscribed' : 'Error'}</h1>
    <p>${message}</p>
    <p style="margin-top: 32px;"><a href="/">Back to Basketball Biomechanics</a></p>
  </div>
</body>
</html>`;
}
