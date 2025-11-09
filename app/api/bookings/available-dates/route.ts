import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

// 예약 불가능한 날짜 목록 조회 (예약금 확인, 예약금 조정, 예약 확정 상태)
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    // 예약 불가능한 상태 목록
    const unavailableStatuses = [
      'AWAITING_DEPOSIT',
      'PENDING_UPDATE',
      'CONFIRMED',
    ];

    // 해당 상태의 예약들 조회
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('booking_date')
      .in('status', unavailableStatuses);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 날짜만 추출 (YYYY-MM-DD 형식)
    const unavailableDates = new Set<string>();

    if (bookings) {
      bookings.forEach((booking) => {
        const date = new Date(booking.booking_date);
        const dateStr = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        unavailableDates.add(dateStr);
      });
    }

    return NextResponse.json({
      unavailableDates: Array.from(unavailableDates),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
