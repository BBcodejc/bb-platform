import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const clientSlug = formData.get('clientSlug') as string;
    const courtPosition = formData.get('courtPosition') as string;
    const tag = formData.get('tag') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!clientSlug) {
      return NextResponse.json({ error: 'No client slug provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo',
      'video/x-matroska', 'video/3gpp', 'video/mpeg',
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Use MP4, MOV, WebM, or AVI.' },
        { status: 400 }
      );
    }

    // Max 100MB
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 100MB.' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
    const posSlug = slugify(courtPosition || 'clip');
    const fileName = `${Date.now()}-${posSlug}.${ext}`;
    const filePath = `${clientSlug}/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('assessment-videos')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Assessment video upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from('assessment-videos')
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: urlData.publicUrl,
      courtPosition: courtPosition || null,
      tag: tag || null,
    });
  } catch (error) {
    console.error('Assessment video upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
