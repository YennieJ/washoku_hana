import { NextRequest, NextResponse } from 'next/server';
import {
  createSupabaseServerClient,
  createSupabaseAdminClient,
} from '@/lib/supabase';
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

    // 업데이트 전 기존 예약 정보 조회 (날짜/상태 변경 시 availability 동기화용)
    let oldBookingDate: string | null = null;
    let oldStatus: string | null = null;

    if (body.booking_date || body.status) {
      const { data: existingBooking } = await supabase
        .from('bookings')
        .select('booking_date, status')
        .eq('id', id)
        .single();

      if (existingBooking) {
        oldBookingDate = existingBooking.booking_date;
        oldStatus = existingBooking.status;
      }
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

    // availability 테이블 자동 동기화
    if ((body.status || body.booking_date) && data.booking_date) {
      const adminClient = createSupabaseAdminClient();
      const activeStatuses = ['AWAITING_DEPOSIT', 'PENDING_UPDATE', 'CONFIRMED'];
      const newDateStr = data.booking_date.split('T')[0];
      const oldDateStr = oldBookingDate?.split('T')[0];
      const wasConfirmed = oldStatus === 'CONFIRMED';
      const isNowConfirmed = data.status === 'CONFIRMED';
      const dateChanged = oldDateStr && newDateStr && oldDateStr !== newDateStr;

      // 현재 CONFIRMED → 새 날짜를 closed로
      if (isNowConfirmed) {
        await adminClient
          .from('availability')
          .upsert(
            { date: newDateStr, status: 'closed', updated_at: new Date().toISOString() },
            { onConflict: 'date' }
          );
      }

      // 이전에 CONFIRMED였고 (취소되었거나 날짜가 변경된 경우) → 이전 날짜 정리
      if (wasConfirmed && oldDateStr && (!isNowConfirmed || dateChanged)) {
        const { data: otherBookings } = await adminClient
          .from('bookings')
          .select('id')
          .gte('booking_date', `${oldDateStr}T00:00:00`)
          .lte('booking_date', `${oldDateStr}T23:59:59`)
          .in('status', activeStatuses)
          .neq('id', id);

        if (!otherBookings || otherBookings.length === 0) {
          await adminClient
            .from('availability')
            .delete()
            .eq('date', oldDateStr);
        }
      }
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
