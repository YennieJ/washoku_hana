import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

/**
 * 예약 확정된 리스트 조회
 * GET /api/admin/bookings/confirmed?startDate=2026-01-01&endDate=2026-12-31
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = supabase
      .from('bookings')
      .select('*')
      .eq('status', 'CONFIRMED')
      .order('booking_date', { ascending: true });

    if (startDate) {
      query = query.gte('booking_date', `${startDate}T00:00:00`);
    }
    if (endDate) {
      query = query.lte('booking_date', `${endDate}T23:59:59`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
