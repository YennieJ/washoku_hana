import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ADMIN_EMAIL } from '@/constants/email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, selectedDate, selectedDayName, bookingNumber } = body;

    // 필수 필드 검증
    if (!formData || !formData.email || !formData.name) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    if (!selectedDate || !bookingNumber) {
      return NextResponse.json(
        { error: '예약 날짜 또는 예약 번호가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 고객 이메일 본문 HTML 생성 (단순한 텍스트 기반)
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <h2 style="margin: 0 0 20px 0;">예약 요청 완료</h2>

          <p>안녕하세요 ${formData.name}님,</p>
          
          <p>Washoku Hana를 예약해주셔서 진심으로 감사드립니다.<br>
          귀하께서 요청하신 예약 내용을 확인해드립니다.</p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

          <p><strong>예약 번호:</strong> ${bookingNumber}</p>
          <p><strong>예약 날짜:</strong> ${selectedDate} (${selectedDayName}) 오후 7시</p>
          <p><strong>메뉴:</strong> ${formData.menu}</p>
          <p><strong>게스트 수:</strong> ${formData.guestCount}명</p>
          <p><strong>연락처:</strong> ${formData.phone}</p>
          <p><strong>서비스 주소:</strong> ${formData.address}</p>

          ${
            formData.foodAllergy
              ? `<p><strong>음식 알레르기:</strong> ${formData.foodAllergy}</p>`
              : ''
          }
          ${
            formData.requests
              ? `<p><strong>특별 요청사항:</strong> ${formData.requests}</p>`
              : ''
          }

          <hr style="border: none; border-top: 2px solid #333; margin: 30px 0;">

          <h3 style="margin: 0 0 15px 0; font-size: 18px;">다음 단계 안내</h3>
          
          <p style="margin: 0 0 15px 0; line-height: 1.8;">
            현재 예약은 요청 상태입니다. 담당자가 곧 예약 내용을 확인하고 검토한 후, 예약 확정을 위한 디파짓(deposit) 안내 메일을 보내드리겠습니다.
          </p>
          
          <p style="margin: 0; line-height: 1.8;">
            예약 확정 및 디파짓 안내는 보통 24시간 이내에 발송됩니다. 양해 부탁드립니다.
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

          <p style="margin: 0 0 10px 0; font-size: 13px; color: #666;">
            감사합니다.
          </p>

          <p style="margin: 0 0 10px 0; font-size: 13px; color: #666;">
            이메일: ${ADMIN_EMAIL}
          </p>

          <p style="margin: 10px 0 0 0; font-size: 13px; color: #666;">
            Chef Minho<br>
            Washoku Hana – Private Omakase Experience
          </p>

        </body>
      </html>
    `;

    // Resend로 이메일 전송
    const { data, error } = await resend.emails.send({
      from: 'Washoku Hana <noreply@washokuhana.ca>',
      to: formData.email, // 고객에게 전송
      subject: `${formData.name}님 예약 확인 - ${selectedDate}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: '고객 이메일 전송에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '고객 이메일이 성공적으로 전송되었습니다.',
      data,
    });
  } catch (error: any) {
    console.error('Customer email send error:', error);
    return NextResponse.json(
      { error: error.message || '고객 이메일 전송 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
