import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

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
    const supabase = createServerSupabaseClient();
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const slug = formData.get('slug') as string;
    const title = formData.get('title') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!slug) {
      return NextResponse.json({ error: 'No player slug provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm', 'audio/ogg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Use MP3, M4A, WAV, WebM, or OGG.' },
        { status: 400 }
      );
    }

    // Max 25MB
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 25MB.' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'webm';
    const titleSlug = slugify(title || 'voice-note');
    const fileName = `${Date.now()}-${titleSlug}.${ext}`;
    const filePath = `${slug}/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('voice-notes')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Voice note upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload voice note' }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from('voice-notes')
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: urlData.publicUrl,
    });
  } catch (error) {
    console.error('Voice note upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
