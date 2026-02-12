import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// PATCH - Admin actions for elite profiles
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const { slug } = params;
    const body = await request.json();
    const { action, data, coach } = body;

    // Get player ID
    const { data: player, error: playerError } = await supabase
      .from('elite_players')
      .select('id')
      .eq('slug', slug)
      .single();

    if (playerError || !player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    const playerId = player.id;
    const now = new Date().toISOString();

    switch (action) {
      case 'update_cues': {
        // Delete existing cues and insert new ones
        await supabase.from('elite_pregame_cues').delete().eq('player_id', playerId);

        if (data.cues && data.cues.length > 0) {
          const cuesToInsert = data.cues.map((cue: any, i: number) => ({
            player_id: playerId,
            cue_text: cue.text,
            category: cue.category,
            icon: cue.icon,
            display_order: i,
            is_active: true,
            created_at: now,
            updated_at: now,
          }));
          await supabase.from('elite_pregame_cues').insert(cuesToInsert);
        }
        break;
      }

      case 'update_limiting_factors': {
        // Delete existing and insert new
        await supabase.from('elite_limiting_factors').delete().eq('player_id', playerId);

        if (data.factors && data.factors.length > 0) {
          const factorsToInsert = data.factors.map((factor: any, i: number) => ({
            player_id: playerId,
            name: factor.name,
            short_description: factor.shortDescription,
            awareness_cue: factor.awarenessCue,
            severity: factor.severity || 'medium',
            priority: i + 1,
            notes: factor.notes,
            failure_example: factor.failureVideoUrl ? { url: factor.failureVideoUrl } : null,
            success_example: factor.successVideoUrl ? { url: factor.successVideoUrl } : null,
            is_active: true,
            created_at: now,
            updated_at: now,
          }));
          await supabase.from('elite_limiting_factors').insert(factorsToInsert);
        }
        break;
      }

      case 'add_note': {
        const today = new Date().toISOString().split('T')[0];
        await supabase.from('elite_coach_notes').insert({
          player_id: playerId,
          date: today,
          text: data.text,
          created_by: coach || 'Coach',
          created_at: now,
        });
        break;
      }

      case 'delete_note': {
        await supabase.from('elite_coach_notes').delete().eq('id', data.noteId);
        break;
      }

      case 'update_weekly_review': {
        const weekStart = data.weekStart || new Date().toISOString().split('T')[0];
        const weekEnd = data.weekEnd || new Date().toISOString().split('T')[0];

        await supabase.from('elite_weekly_reviews').upsert({
          player_id: playerId,
          week_start: weekStart,
          week_end: weekEnd,
          summary: data.summary,
          what_changed: data.whatChanged || [],
          priorities: data.priorities || [],
          created_by: coach || 'Coach',
          created_at: now,
          updated_at: now,
        }, {
          onConflict: 'player_id,week_start',
        });
        break;
      }

      case 'update_protocol': {
        await supabase.from('elite_game_protocols').upsert({
          player_id: playerId,
          name: data.name || 'Game Day Protocol',
          duration: data.duration || '15 min',
          spots: data.spots || [],
          shot_type_variety: data.shotTypes || [],
          off_ball_principles: data.principles || [],
          is_active: true,
          created_at: now,
          updated_at: now,
        }, {
          onConflict: 'player_id',
        });
        break;
      }

      case 'update_profile': {
        await supabase.from('elite_players').update({
          name: data.name,
          position: data.position,
          team: data.team,
          photo_url: data.headshotUrl,
          season_status: data.seasonStatus,
          updated_at: now,
        }).eq('id', playerId);
        break;
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Elite admin API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
