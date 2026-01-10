import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createSupabaseAdminClient } from '@/lib/supabase';
import { ADMIN_EMAIL } from '@/constants/email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    const now = new Date();

    // 이번 주 시작 (월요일)과 끝 (일요일)
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() + diffToMonday);
    thisWeekStart.setHours(0, 0, 0, 0);

    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
    thisWeekEnd.setHours(23, 59, 59, 999);

    // 다음 주 시작과 끝
    const nextWeekStart = new Date(thisWeekEnd);
    nextWeekStart.setDate(thisWeekEnd.getDate() + 1);
    nextWeekStart.setHours(0, 0, 0, 0);

    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
    nextWeekEnd.setHours(23, 59, 59, 999);

    // 1. 이번 주 신규 예약 (이번 주에 생성된 예약)
    const { data: newBookings, error: newError } = await supabase
      .from('bookings')
      .select('id')
      .gte('created_at', thisWeekStart.toISOString())
      .lte('created_at', thisWeekEnd.toISOString());

    if (newError) throw newError;

    // 2. 이번 주 확정된 예약 (이번 주 booking_date + CONFIRMED)
    const { data: confirmedBookings, error: confirmedError } = await supabase
      .from('bookings')
      .select('id, total_amount')
      .eq('status', 'CONFIRMED')
      .gte('booking_date', thisWeekStart.toISOString())
      .lte('booking_date', thisWeekEnd.toISOString());

    if (confirmedError) throw confirmedError;

    // 3. 이번 주 취소/거절 예약
    const { data: cancelledBookings, error: cancelledError } = await supabase
      .from('bookings')
      .select('id')
      .in('status', ['CANCELLED', 'DECLINED'])
      .gte('updated_at', thisWeekStart.toISOString())
      .lte('updated_at', thisWeekEnd.toISOString());

    if (cancelledError) throw cancelledError;

    // 4. 처리 대기 중인 예약
    const { data: pendingBookings, error: pendingError } = await supabase
      .from('bookings')
      .select('id')
      .in('status', ['INQUIRY', 'AWAITING_DEPOSIT', 'PENDING_UPDATE']);

    if (pendingError) throw pendingError;

    // 5. 다음 주 확정 매출
    const { data: nextWeekBookings, error: nextWeekError } = await supabase
      .from('bookings')
      .select('id, total_amount')
      .eq('status', 'CONFIRMED')
      .gte('booking_date', nextWeekStart.toISOString())
      .lte('booking_date', nextWeekEnd.toISOString());

    if (nextWeekError) throw nextWeekError;

    // 6. 다음 주 일정 상세
    const { data: upcomingSchedule, error: scheduleError } = await supabase
      .from('bookings')
      .select(
        'id, booking_number, customer_name, booking_date, guest_count, menu'
      )
      .eq('status', 'CONFIRMED')
      .gte('booking_date', nextWeekStart.toISOString())
      .lte('booking_date', nextWeekEnd.toISOString())
      .order('booking_date', { ascending: true });

    if (scheduleError) throw scheduleError;

    // 매출 계산
    const thisWeekRevenue =
      confirmedBookings?.reduce(
        (sum, b) => sum + (Number(b.total_amount) || 0),
        0
      ) || 0;
    const nextWeekRevenue =
      nextWeekBookings?.reduce(
        (sum, b) => sum + (Number(b.total_amount) || 0),
        0
      ) || 0;

    // 날짜 포맷 함수
    const formatDate = (date: Date) => {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}/${day}`;
    };

    const formatBookingDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayName = days[date.getDay()];
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${month}/${day} (${dayName}) ${hours}:${minutes}`;
    };

    // 통계 데이터
    const stats = {
      newBookings: newBookings?.length || 0,
      confirmedBookings: confirmedBookings?.length || 0,
      cancelledBookings: cancelledBookings?.length || 0,
      pendingBookings: pendingBookings?.length || 0,
      thisWeekRevenue,
      nextWeekRevenue,
    };

    // 이메일 HTML 생성
    const scheduleRows =
      upcomingSchedule && upcomingSchedule.length > 0
        ? upcomingSchedule
            .map(
              (booking) => `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${formatBookingDate(booking.booking_date)}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${booking.customer_name}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${booking.guest_count}명</td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${booking.menu}</td>
          </tr>
        `
            )
            .join('')
        : `<tr><td colspan="4" style="padding: 20px; text-align: center; color: #718096;">다음 주 예정된 일정이 없습니다.</td></tr>`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f7fafc; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { background-color: #2d3748; color: #fff; padding: 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 20px; }
            .header p { margin: 8px 0 0 0; opacity: 0.8; font-size: 14px; }
            .content { padding: 24px; }
            .section { margin-bottom: 24px; }
            .section-title { font-size: 16px; font-weight: bold; color: #2d3748; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; }
            .stats-grid { display: table; width: 100%; }
            .stats-row { display: table-row; }
            .stat-item { display: table-cell; padding: 12px; text-align: center; border: 1px solid #e2e8f0; }
            .stat-value { font-size: 24px; font-weight: bold; color: #2d3748; }
            .stat-label { font-size: 12px; color: #718096; margin-top: 4px; }
            .stat-warning { color: #ed8936; }
            .revenue-box { background-color: #f7fafc; padding: 16px; border-radius: 6px; }
            .revenue-item { display: flex; justify-content: space-between; padding: 8px 0; }
            .revenue-label { color: #4a5568; }
            .revenue-value { font-weight: bold; color: #2d3748; }
            table { width: 100%; border-collapse: collapse; }
            th { background-color: #f7fafc; padding: 12px; text-align: left; font-size: 12px; color: #4a5568; text-transform: uppercase; }
            .footer { background-color: #f7fafc; padding: 16px; text-align: center; font-size: 12px; color: #718096; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Washoku Hana Weekly Report</h1>
              <p>${formatDate(thisWeekStart)} (Mon) ~ ${formatDate(thisWeekEnd)} (Sun)</p>
            </div>

            <div class="content">
              <!-- 이번 주 요약 -->
              <div class="section">
                <div class="section-title">This Week Summary</div>
                <table>
                  <tr>
                    <td style="padding: 12px; text-align: center; border: 1px solid #e2e8f0; width: 25%;">
                      <div style="font-size: 24px; font-weight: bold; color: #2d3748;">${stats.newBookings}</div>
                      <div style="font-size: 12px; color: #718096;">New</div>
                    </td>
                    <td style="padding: 12px; text-align: center; border: 1px solid #e2e8f0; width: 25%;">
                      <div style="font-size: 24px; font-weight: bold; color: #3182ce;">${stats.confirmedBookings}</div>
                      <div style="font-size: 12px; color: #718096;">Confirmed</div>
                    </td>
                    <td style="padding: 12px; text-align: center; border: 1px solid #e2e8f0; width: 25%;">
                      <div style="font-size: 24px; font-weight: bold; color: #e53e3e;">${stats.cancelledBookings}</div>
                      <div style="font-size: 12px; color: #718096;">Cancelled</div>
                    </td>
                    <td style="padding: 12px; text-align: center; border: 1px solid #e2e8f0; width: 25%;">
                      <div style="font-size: 24px; font-weight: bold; ${stats.pendingBookings > 0 ? 'color: #ed8936;' : 'color: #2d3748;'}">${stats.pendingBookings}${stats.pendingBookings > 0 ? ' ⚠️' : ''}</div>
                      <div style="font-size: 12px; color: #718096;">Pending</div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- 매출 -->
              <div class="section">
                <div class="section-title">Revenue</div>
                <div class="revenue-box">
                  <table style="width: 100%;">
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568;">This Week</td>
                      <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #2d3748;">$${thisWeekRevenue.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568;">Next Week (Expected)</td>
                      <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #2d3748;">$${nextWeekRevenue.toLocaleString()}</td>
                    </tr>
                  </table>
                </div>
              </div>

              <!-- 다음 주 일정 -->
              <div class="section">
                <div class="section-title">Next Week Schedule (${upcomingSchedule?.length || 0})</div>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Guests</th>
                      <th>Menu</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${scheduleRows}
                  </tbody>
                </table>
              </div>
            </div>

            <div class="footer">
              <p>This email was automatically sent from Washoku Hana reservation system.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Resend로 이메일 전송
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Washoku Hana <noreply@washokuhana.ca>',
      to: ADMIN_EMAIL,
      subject: `[Weekly Report] ${formatDate(thisWeekStart)} ~ ${formatDate(thisWeekEnd)}`,
      html: emailHtml,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Weekly report sent successfully.',
      data: {
        emailId: emailData?.id,
        stats,
        scheduleCount: upcomingSchedule?.length || 0,
      },
    });
  } catch (error: unknown) {
    console.error('Weekly report error:', error);
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
