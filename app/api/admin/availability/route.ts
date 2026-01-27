import { NextRequest, NextResponse } from 'next/server';
import {
  createSupabaseServerClient,
  createSupabaseAdminClient,
} from '@/lib/supabase';
import { cookies } from 'next/headers';

/**
 * 날짜별 예약 가능 여부 조회
 * GET /api/admin/availability?startDate=2026-01-01&endDate=2026-01-31
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = supabase
      .from('availability')
      .select('*')
      .order('date', { ascending: true });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ availability: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * 복수 날짜 예약 가능 여부 설정 (upsert)
 * PATCH /api/admin/availability
 * Body: { dates: ["2026-02-15", "2026-02-16"], status: "closed" }
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient();

    const body = await request.json();
    const { dates, status } = body;

    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return NextResponse.json(
        { error: 'dates 배열이 필요합니다.' },
        { status: 400 }
      );
    }

    if (!status || !['open', 'closed'].includes(status)) {
      return NextResponse.json(
        { error: "status는 'open' 또는 'closed'여야 합니다." },
        { status: 400 }
      );
    }

    // close 요청 시 활성 예약이 있는 날짜는 차단
    if (status === 'closed') {
      const activeStatuses = ['AWAITING_DEPOSIT', 'PENDING_UPDATE', 'CONFIRMED'];

      const { data: activeBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('booking_date')
        .in('status', activeStatuses);

      if (bookingsError) {
        return NextResponse.json({ error: bookingsError.message }, { status: 500 });
      }

      const activeDates = new Set(
        (activeBookings || []).map((b) => b.booking_date.split('T')[0])
      );

      const blockedDates = dates.filter((d: string) => activeDates.has(d));
      if (blockedDates.length > 0) {
        return NextResponse.json(
          {
            error: '활성 예약이 있는 날짜는 닫을 수 없습니다.',
            blockedDates,
          },
          { status: 409 }
        );
      }
    }

    const rows = dates.map((date: string) => ({
      date,
      status,
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('availability')
      .upsert(rows, { onConflict: 'date' })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      updated: data?.length || 0,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * 복수 날짜 예약 가능 여부 삭제 (휴무 해제)
 * DELETE /api/admin/availability
 * Body: { dates: ["2026-02-15", "2026-02-16"] }
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient();

    const body = await request.json();
    const { dates } = body;

    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return NextResponse.json(
        { error: 'dates 배열이 필요합니다.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('availability')
      .delete()
      .in('date', dates)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      deleted: data?.length || 0,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
