import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase';

// 일반 서비스용: 고객이 새 예약을 생성할 때 사용
export async function POST(request: NextRequest) {
  try {
    // RLS를 우회하기 위해 Admin Client 사용
    const supabase = createSupabaseAdminClient();

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
        const fieldName = field.replace(/_/g, ' ');
        return NextResponse.json(
          { error: `${fieldName} is required.` },
          { status: 400 }
        );
      }
    }

    // 예약 번호 생성: BK-타임스탬프-랜덤문자열 (DB 조회 없이 간단하게)
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const bookingNumber = `BK-${timestamp}-${randomStr}`;

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
