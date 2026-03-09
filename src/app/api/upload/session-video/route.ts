import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const slug = formData.get('slug') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!slug) {
      return NextResponse.json({ error: 'No player slug provided' }, { status: 400 });
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
    const fileName = `${Date.now()}-session.${ext}`;
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
      console.error('Session video upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
    }

    const { data: urlData } = supabase
      .storage
      .from('concept-videos')
      .getPublicUrl(filePath);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error('Session video upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
