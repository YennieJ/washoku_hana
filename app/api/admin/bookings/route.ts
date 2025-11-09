import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    const searchParams = request.nextUrl.searchParams;

    // 검색 파라미터
    const search = searchParams.get('search'); // 고객이름, 예약번호, 이메일 검색
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const period = searchParams.get('period'); // 'prev', 'current', 'next'

    // 날짜 범위 계산
    let dateStart: string | null = null;
    let dateEnd: string | null = null;

    if (period) {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();

      switch (period) {
        case 'prev': // 이전달
          dateStart = new Date(year, month - 1, 1).toISOString();
          dateEnd = new Date(year, month, 0, 23, 59, 59).toISOString();
          break;
        case 'current': // 이번달
          dateStart = new Date(year, month, 1).toISOString();
          dateEnd = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
          break;
        case 'next': // 다음달
          dateStart = new Date(year, month + 1, 1).toISOString();
          dateEnd = new Date(year, month + 2, 0, 23, 59, 59).toISOString();
          break;
        default: // 기본값: 이번달 + 다음달
          dateStart = new Date(year, month, 1).toISOString();
          dateEnd = new Date(year, month + 2, 0, 23, 59, 59).toISOString();
      }
    } else if (startDate && endDate) {
      // 커스텀 기간
      dateStart = new Date(startDate).toISOString();
      dateEnd = new Date(endDate + 'T23:59:59').toISOString();
    } else {
      // 기본값: 이번달 + 다음달
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      dateStart = new Date(year, month, 1).toISOString();
      dateEnd = new Date(year, month + 2, 0, 23, 59, 59).toISOString();
    }

    // 1. 읽지 않은 데이터 (기간 상관없이)
    let unreadQuery = supabase
      .from('bookings')
      .select('*')
      .eq('is_read', false);

    // 검색 필터 적용
    if (search) {
      unreadQuery = unreadQuery.or(
        `customer_name.ilike.%${search}%,booking_number.ilike.%${search}%,customer_email.ilike.%${search}%`
      );
    }

    const { data: unreadData, error: unreadError } = await unreadQuery;

    if (unreadError) {
      return NextResponse.json({ error: unreadError.message }, { status: 500 });
    }

    // 2. 읽은 데이터 (기간 필터 적용)
    let readQuery = supabase
      .from('bookings')
      .select('*')
      .eq('is_read', true)
      .gte('booking_date', dateStart)
      .lte('booking_date', dateEnd);

    // 검색 필터 적용
    if (search) {
      readQuery = readQuery.or(
        `customer_name.ilike.%${search}%,booking_number.ilike.%${search}%,customer_email.ilike.%${search}%`
      );
    }

    const { data: readData, error: readError } = await readQuery;

    if (readError) {
      return NextResponse.json({ error: readError.message }, { status: 500 });
    }

    // 3. 합치고 정렬 (최신순)
    const allData = [...(unreadData || []), ...(readData || [])];
    allData.sort(
      (a, b) =>
        new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime()
    );

    return NextResponse.json({ data: allData });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
