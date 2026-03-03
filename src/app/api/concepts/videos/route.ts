import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('concept_videos')
      .insert({
        concept_id: body.concept_id,
        title: body.title,
        url: body.url,
        video_type: body.video_type || 'demo',
        duration_seconds: body.duration_seconds || null,
        description: body.description || null,
        display_order: body.display_order || 0,
        uploaded_by: body.uploaded_by || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, video: data });
  } catch (error: any) {
    console.error('Error creating concept video:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create video' },
      { status: 500 }
    );
  }
}
