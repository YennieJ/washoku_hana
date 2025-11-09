import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient(cookieStore);
    const { id } = await params;
    const body = await request.json();

    // ID 유효성 검증
    if (!id) {
      return NextResponse.json({ error: 'ID가 필요합니다.' }, { status: 400 });
    }

    // 업데이트할 필드 구성
    const updateData: any = {};

    // is_read 필드가 있으면 업데이트
    if (body.is_read !== undefined) {
      updateData.is_read = body.is_read;
    }

    // admin_memo 필드가 있으면 업데이트
    if (body.admin_memo !== undefined) {
      updateData.admin_memo = body.admin_memo;
    }

    // status 필드가 있으면 업데이트
    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    // 금액 관련 필드들
    if (body.travel_cost !== undefined) {
      updateData.travel_cost = body.travel_cost;
    }

    if (body.deposit_amount !== undefined) {
      updateData.deposit_amount = body.deposit_amount;
    }

    if (body.total_amount !== undefined) {
      updateData.total_amount = body.total_amount;
    }

    if (body.refund_amount !== undefined) {
      updateData.refund_amount = body.refund_amount;
    }

    if (body.chef_additional_cost !== undefined) {
      updateData.chef_additional_cost = body.chef_additional_cost;
    }

    // booking_date 필드가 있으면 업데이트
    if (body.booking_date !== undefined) {
      updateData.booking_date = body.booking_date;
    }

    // 업데이트할 필드가 없으면 에러
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: '업데이트할 필드가 없습니다.' },
        { status: 400 }
      );
    }

    // is_read가 명시적으로 전달되지 않았다면 자동으로 true로 설정
    // (단, admin_memo만 업데이트하는 경우는 제외)
    const isOnlyMemoUpdate =
      Object.keys(updateData).length === 1 &&
      updateData.admin_memo !== undefined;

    if (!isOnlyMemoUpdate && updateData.is_read === undefined) {
      updateData.is_read = true;
    }

    // 예약 정보 업데이트
    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: '예약을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data,
      message: '업데이트되었습니다.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
