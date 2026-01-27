import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase';

// 예약 불가능한 날짜 목록 조회 (예약금 확인, 예약금 조정, 예약 확정 상태)
export async function GET(request: NextRequest) {
  try {
    // 공개 API이므로 Admin Client 사용 (RLS 우회)
    const supabase = createSupabaseAdminClient();

    // 예약 불가능한 상태 목록
    const unavailableStatuses = [
      'AWAITING_DEPOSIT',
      'PENDING_UPDATE',
      'CONFIRMED',
    ];

    // 해당 상태의 예약들 조회
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('booking_date')
      .in('status', unavailableStatuses);

    if (bookingsError) {
      return NextResponse.json({ error: bookingsError.message }, { status: 500 });
    }

    // availability 테이블에서 closed 날짜 조회
    const { data: closedDates, error: availabilityError } = await supabase
      .from('availability')
      .select('date')
      .eq('status', 'closed');

    if (availabilityError) {
      return NextResponse.json({ error: availabilityError.message }, { status: 500 });
    }

    // 날짜만 추출 (YYYY-MM-DD 형식)
    // booking_date는 밴쿠버 시간으로 저장되어 있으므로 문자열에서 직접 추출
    const unavailableDates = new Set<string>();

    if (bookings) {
      bookings.forEach((booking) => {
        // 타임존 변환 없이 문자열에서 직접 날짜 추출
        const dateStr = booking.booking_date.split('T')[0];
        unavailableDates.add(dateStr);
      });
    }

    // availability 테이블에서 closed 날짜 추가
    if (closedDates) {
      closedDates.forEach((row) => {
        unavailableDates.add(row.date);
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
