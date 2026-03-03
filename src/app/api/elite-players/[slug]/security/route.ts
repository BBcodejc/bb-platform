import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { sendGmailEmail } from '@/lib/gmail';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET - Fetch security data for admin panel
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { slug } = await params;
  const supabase = createServiceRoleClient();

  // Get player
  const { data: player, error: playerError } = await supabase
    .from('elite_players')
    .select('id, email, last_active_at, access_token, is_active')
    .eq('slug', slug)
    .single();

  if (playerError || !player) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 });
  }

  // Get login history (last 20)
  const { data: loginHistory } = await supabase
    .from('elite_login_history')
    .select('*')
    .eq('player_id', player.id)
    .order('login_at', { ascending: false })
    .limit(20);

  // Check for active session (login within last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const hasActiveSession = (loginHistory || []).some(
    (entry: Record<string, string>) => entry.login_at > thirtyDaysAgo
  );

  return NextResponse.json({
    email: player.email,
    lastActiveAt: player.last_active_at,
    accessToken: player.access_token,
    isActive: player.is_active,
    hasActiveSession,
    loginHistory: (loginHistory || []).map((entry: Record<string, string>) => ({
      id: entry.id,
      loginAt: entry.login_at,
      ipAddress: entry.ip_address,
      userAgent: entry.user_agent,
    })),
  });
}

// POST - Security actions
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { slug } = await params;
  const body = await request.json();
  const { action } = body;

  const supabase = createServiceRoleClient();

  // Get player
  const { data: player, error: playerError } = await supabase
    .from('elite_players')
    .select('id, first_name, last_name, access_token, email, slug')
    .eq('slug', slug)
    .single();

  if (playerError || !player) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 });
  }

  switch (action) {
    case 'regenerate_token': {
      const initials = ((player.first_name?.[0] || 'x') + (player.last_name?.[0] || 'x')).toLowerCase();
      const year = new Date().getFullYear();
      const rand = Math.random().toString(36).substring(2, 6);
      const newToken = `${initials}-bb-${year}-${rand}`;

      await supabase
        .from('elite_players')
        .update({ access_token: newToken, updated_at: new Date().toISOString() })
        .eq('id', player.id);

      return NextResponse.json({ success: true, newToken });
    }

    case 'send_invite': {
      const email = body.email || player.email;
      if (!email) {
        return NextResponse.json({ error: 'No email address provided' }, { status: 400 });
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bb-platform-virid.vercel.app';
      const portalUrl = `${appUrl}/elite/${player.slug}?token=${player.access_token}`;
      const loginUrl = `${appUrl}/elite/login`;

      const result = await sendGmailEmail({
        to: email,
        subject: `Your BB Elite Portal Access - ${player.first_name}`,
        text: `Hey ${player.first_name},

Your Basketball Biomechanics Elite Portal is ready.

Access your portal here:
${portalUrl}

Your access code: ${player.access_token}

You can also go to ${loginUrl} and enter your code manually.

This link is private - don't share it with anyone.

Talk soon,
Coach Jake
Basketball Biomechanics`,
        html: `<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #fff; padding: 40px; border-radius: 16px;">
  <h2 style="color: #C9A961; margin-bottom: 24px;">Your BB Elite Portal</h2>
  <p>Hey ${player.first_name},</p>
  <p>Your Basketball Biomechanics Elite Portal is ready.</p>
  <a href="${portalUrl}" style="display: inline-block; background: #C9A961; color: #0A0A0A; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">Open Your Portal</a>
  <p style="color: #888; font-size: 14px; margin-top: 20px;">Your access code: <code style="background: #1A1A1A; padding: 4px 8px; border-radius: 4px; color: #C9A961;">${player.access_token}</code></p>
  <p style="color: #888; font-size: 14px;">You can also go to <a href="${loginUrl}" style="color: #C9A961;">${loginUrl}</a> and enter your code manually.</p>
  <hr style="border: 1px solid #2A2A2A; margin: 24px 0;" />
  <p style="color: #666; font-size: 12px;">This link is private - don't share it with anyone.</p>
  <p style="color: #888; margin-top: 16px;">Talk soon,<br/>Coach Jake<br/>Basketball Biomechanics</p>
</div>`,
      });

      // Save email on player if provided
      if (body.email && body.email !== player.email) {
        await supabase
          .from('elite_players')
          .update({ email: body.email })
          .eq('id', player.id);
      }

      return NextResponse.json(result);
    }

    case 'revoke_access': {
      await supabase
        .from('elite_players')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', player.id);

      return NextResponse.json({ success: true });
    }

    case 'restore_access': {
      await supabase
        .from('elite_players')
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq('id', player.id);

      return NextResponse.json({ success: true });
    }

    case 'update_email': {
      await supabase
        .from('elite_players')
        .update({ email: body.email })
        .eq('id', player.id);

      return NextResponse.json({ success: true });
    }

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}
