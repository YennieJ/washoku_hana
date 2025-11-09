import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

// 일반 서비스용: 고객이 새 예약을 생성할 때 사용
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    const body = await request.json();

    // 필수 필드 검증
    const requiredFields = [
      'customer_name',
      'customer_email',
      'customer_phone',
      'booking_date',
      'guest_count',
      'menu',
      'address',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field}는 필수 항목입니다.` },
          { status: 400 }
        );
      }
    }

    // 예약 번호 생성: BK-YYYY-MMDD-XXX
    const bookingDate = new Date(body.booking_date);
    const year = bookingDate.getFullYear();
    const month = String(bookingDate.getMonth() + 1).padStart(2, '0');
    const day = String(bookingDate.getDate()).padStart(2, '0');
    const datePrefix = `BK-${year}-${month}${day}`;

    // 같은 날짜의 예약 중 가장 큰 번호 찾기
    const { data: existingBookings } = await supabase
      .from('bookings')
      .select('booking_number')
      .like('booking_number', `${datePrefix}%`)
      .order('booking_number', { ascending: false })
      .limit(1);

    let sequenceNumber = 1;
    if (existingBookings && existingBookings.length > 0) {
      const lastNumber = existingBookings[0].booking_number;
      const lastSequence = parseInt(lastNumber.split('-').pop() || '0');
      sequenceNumber = lastSequence + 1;
    }

    const bookingNumber = `${datePrefix}-${String(sequenceNumber).padStart(
      3,
      '0'
    )}`;

    // 데이터 삽입
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        booking_number: bookingNumber,
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone,
        booking_date: body.booking_date,
        guest_count: Number(body.guest_count),
        menu: body.menu,
        address: body.address,
        food_allergy: body.food_allergy || '없음',
        special_requests: body.special_requests || null,
        travel_cost: null,
        deposit_amount: null,
        total_amount: null,
        status: 'INQUIRY',
        is_read: false,
        admin_memo: null,
        refund_amount: null,
        chef_additional_cost: null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { data, message: '예약이 성공적으로 등록되었습니다.' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
