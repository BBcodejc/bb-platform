import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { verifyEliteRequest } from '@/lib/elite-auth';

export const dynamic = 'force-dynamic';

// POST - Client uploads a video to their session (elite token auth)
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string; sessionId: string } }
) {
  try {
    const { slug, sessionId } = params;
    const { player } = await verifyEliteRequest(request, slug);

    if (!player) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();

    // Verify session belongs to this player
    const { data: session, error: sessionError } = await supabase
      .from('elite_training_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('player_id', player.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type — MP4 and MOV only
    const allowedTypes = ['video/mp4', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Use MP4 or MOV.' },
        { status: 400 }
      );
    }

    // Max 200MB
    if (file.size > 200 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 200MB.' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
    const fileName = `${Date.now()}-client.${ext}`;
    const filePath = `${slug}/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase
      .storage
      .from('concept-videos')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Client video upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
    }

    const { data: urlData } = supabase
      .storage
      .from('concept-videos')
      .getPublicUrl(filePath);

    // Save to session record as client video
    await supabase
      .from('elite_training_sessions')
      .update({
        video_url_client: urlData.publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .eq('player_id', player.id);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error('Client video upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
