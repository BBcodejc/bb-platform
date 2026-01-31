import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'all';
    const role = searchParams.get('role') || 'all';
    const highTicket = searchParams.get('high_ticket') === 'true';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');

    let query = supabase
      .from('prospects')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (status && status !== 'all') {
      query = query.eq('pipeline_status', status);
    }

    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    if (highTicket) {
      query = query.eq('high_ticket_prospect', true);
    }

    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
    }

    const { data, count, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      prospects: data || [],
      total: count || 0,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil((count || 0) / PAGE_SIZE),
    });
  } catch (error) {
    console.error('Admin prospects error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prospects' },
      { status: 500 }
    );
  }
}
