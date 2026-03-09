import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createServiceRoleClient } from '@/lib/supabase';
import { mapBBMetricsRow } from '@/types/elite-player';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();

    // Look up player by slug
    const { data: player, error: playerError } = await supabase
      .from('elite_players')
      .select('id')
      .eq('slug', slug)
      .single();

    if (playerError || !player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Fetch metric history
    const { data, error } = await supabase
      .from('elite_bb_metrics')
      .select('*')
      .eq('player_id', player.id)
      .order('metric_date', { ascending: false })
      .limit(20);

    if (error) {
      console.error('BB metrics fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch BB metrics' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      (data || []).map(mapBBMetricsRow),
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('BB metrics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { error: authError } = await requireAdmin(request);
    if (authError) return authError;

    const supabase = createServiceRoleClient();

    // Look up player by slug
    const { data: player, error: playerError } = await supabase
      .from('elite_players')
      .select('id')
      .eq('slug', slug)
      .single();

    if (playerError || !player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      metricDate,
      backRimRate,
      movementBandwidth,
      strobeLevel,
      deepDistanceAccuracy,
      catchShootSpeed,
      offDribbleCalibration,
      energyTransferScore,
      fourteenSpotScore,
      fourteenSpotTotal,
      notes,
      createdBy,
    } = body;

    if (!metricDate) {
      return NextResponse.json(
        { error: 'Metric date is required' },
        { status: 400 }
      );
    }

    const row = {
      player_id: player.id,
      metric_date: metricDate,
      back_rim_rate: backRimRate ?? null,
      movement_bandwidth: movementBandwidth ?? null,
      strobe_level: strobeLevel ?? null,
      deep_distance_accuracy: deepDistanceAccuracy ?? null,
      catch_shoot_speed: catchShootSpeed ?? null,
      off_dribble_calibration: offDribbleCalibration ?? null,
      energy_transfer_score: energyTransferScore ?? null,
      fourteen_spot_score: fourteenSpotScore ?? null,
      fourteen_spot_total: fourteenSpotTotal ?? 14,
      notes: notes ?? null,
      created_by: createdBy ?? null,
    };

    const { data, error } = await supabase
      .from('elite_bb_metrics')
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error('BB metrics insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save BB metrics' },
        { status: 500 }
      );
    }

    return NextResponse.json(mapBBMetricsRow(data), { status: 201 });
  } catch (error) {
    console.error('BB metrics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
