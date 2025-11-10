import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { google } from 'googleapis';

/**
 * Google Calendar에서 예약 관련 이벤트 삭제
 * DELETE /api/calendar/events/[bookingId]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;

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

    // 저장된 캘린더 이벤트 ID가 없으면 성공으로 처리
    if (!booking.calendar_event_id) {
      return NextResponse.json({
        success: true,
        message:
          '캘린더 이벤트 ID가 없습니다. (이미 삭제되었거나 존재하지 않음)',
      });
    }

    // Google Calendar 클라이언트 초기화
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    const calendar = google.calendar({ version: 'v3', auth });

    // 저장된 이벤트 ID로 바로 삭제
    try {
      await calendar.events.delete({
        calendarId: process.env.GOOGLE_CALENDAR_ID!,
        eventId: booking.calendar_event_id,
      });

      // 예약에서 캘린더 이벤트 ID 제거
      await supabase
        .from('bookings')
        .update({ calendar_event_id: null })
        .eq('id', bookingId);
    } catch (error: any) {
      // 404 에러는 이미 삭제된 것으로 간주하고 성공 처리
      if (error.code === 404) {
        // 예약에서 캘린더 이벤트 ID 제거
        await supabase
          .from('bookings')
          .update({ calendar_event_id: null })
          .eq('id', bookingId);

        return NextResponse.json({
          success: true,
          message: '캘린더 이벤트가 이미 삭제되었습니다.',
        });
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: '캘린더 이벤트가 삭제되었습니다.',
    });
  } catch (error: any) {
    console.error('Calendar event deletion error:', error);
    return NextResponse.json(
      { error: error.message || '캘린더 이벤트 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
