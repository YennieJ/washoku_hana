import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { addCalendarEvent } from '@/lib/calendar';

/**
 * Google Calendar에 이벤트 추가
 * POST /api/calendar/events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId } = body;

    // 필수 필드 검증
    if (!bookingId) {
      return NextResponse.json(
        { error: 'bookingId가 필요합니다.' },
        { status: 400 }
      );
    }

    // 예약 정보 가져오기
    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: '예약을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 예약 확정 상태인지 확인
    if (booking.status !== 'CONFIRMED') {
      return NextResponse.json(
        { error: '예약 확정 상태가 아닙니다.' },
        { status: 400 }
      );
    }

    // 예약 날짜 파싱 (종일 이벤트용)
    // booking_date는 ISO 형식이므로 직접 파싱
    const bookingDate = new Date(booking.booking_date);

    // 벤쿠버 시간대로 날짜 추출
    // 벤쿠버 시간대에서의 연/월/일 추출
    const vancouverDateStr = bookingDate.toLocaleDateString('en-CA', {
      timeZone: 'America/Vancouver',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    // 시작 날짜 (YYYY-MM-DD)
    const startDate = vancouverDateStr;

    // 종료 날짜 (다음 날, 종일 이벤트는 end date가 exclusive)
    const endDateObj = new Date(bookingDate);
    endDateObj.setDate(endDateObj.getDate() + 1);
    const endDate = endDateObj.toLocaleDateString('en-CA', {
      timeZone: 'America/Vancouver',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    // 예약 시간 추출 (벤쿠버 시간대)
    const bookingDateTime = new Date(booking.booking_date);
    const vancouverTime = bookingDateTime.toLocaleTimeString('en-US', {
      timeZone: 'America/Vancouver',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // 남은 금액 계산
    const remainingAmount =
      booking.total_amount && booking.deposit_amount
        ? booking.total_amount - booking.deposit_amount
        : null;

    // 캘린더 이벤트 생성
    const result = await addCalendarEvent({
      summary: `${booking.customer_name}님 예약`,
      description: `인원: ${booking.guest_count}명
시간: ${vancouverTime}
${remainingAmount !== null ? `남은 금액: $${remainingAmount.toFixed(2)}` : ''}

----

메뉴: ${booking.menu}
${booking.food_allergy ? `알레르기: ${booking.food_allergy}` : ''}
${booking.special_requests ? `특별 요청: ${booking.special_requests}` : ''}

----

예약번호: ${booking.booking_number}
전화번호: ${booking.customer_phone}
이메일: ${booking.customer_email}`,
      startDate,
      endDate,
      location: booking.address, // 주소를 location 필드에 추가
    });

    // 예약에 캘린더 이벤트 ID 저장
    await supabase
      .from('bookings')
      .update({ calendar_event_id: result.eventId })
      .eq('id', bookingId);

    return NextResponse.json({
      success: true,
      message: '캘린더 이벤트가 추가되었습니다.',
      data: result,
    });
  } catch (error: any) {
    console.error('Calendar event creation error:', error);
    return NextResponse.json(
      { error: error.message || '캘린더 이벤트 추가 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
