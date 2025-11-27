import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ADMIN_EMAIL } from '@/constants/email';
import { menuItems } from '@/constants/menu-items';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, selectedDate, selectedDayName, bookingNumber } = body;

    // 필수 필드 검증
    if (!formData || !formData.email || !formData.name) {
      return NextResponse.json(
        { error: 'Required fields are missing.' },
        { status: 400 }
      );
    }

    if (!selectedDate || !bookingNumber) {
      return NextResponse.json(
        { error: 'Booking date or booking number is missing.' },
        { status: 400 }
      );
    }

    // 선택된 메뉴의 가격 정보 가져오기 및 총액 계산
    const selectedMenu = menuItems.find((m) => m.title === formData.menu);
    const menuPrice = selectedMenu ? selectedMenu.price : 'N/A';

    // 고객 이메일 본문 HTML 생성 (단순한 텍스트 기반)
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <h2 style="margin: 0 0 20px 0;">Reservation Request Received</h2>

          <p>Hello ${formData.name},</p>
          
          <p>Thank you for your reservation request with Washoku Hana.<br>
          We have received your booking details as follows:</p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

          <p><strong>Booking Number:</strong> ${bookingNumber}</p>
          <p><strong>Reservation Date:</strong> ${selectedDate} (${selectedDayName}) 7:00 PM</p>
          <p><strong>Menu:</strong> ${formData.menu} - ${menuPrice}</p>
          <p><strong>Number of Guests:</strong> ${formData.guestCount}</p>
          <p><strong>Contact:</strong> ${formData.phone}</p>
          <p><strong>Service Address:</strong> ${formData.address}</p>

          ${
            formData.foodAllergy
              ? `<p><strong>Food Allergies:</strong> ${formData.foodAllergy}</p>`
              : ''
          }
          ${
            formData.requests
              ? `<p><strong>Special Requests:</strong> ${formData.requests}</p>`
              : ''
          }

          <hr style="border: none; border-top: 2px solid #333; margin: 30px 0;">

          <h3 style="margin: 0 0 15px 0; font-size: 18px;">Next Steps</h3>
          
          <p style="margin: 0 0 15px 0; line-height: 1.8;">
            Your reservation is currently pending. Our team will review your booking details and send you a deposit payment email to confirm your reservation.
          </p>
          
          <p style="margin: 0; line-height: 1.8;">
            You can expect to receive the confirmation and deposit information email within 24 hours. Thank you for your patience.
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

          <p style="margin: 0 0 10px 0; font-size: 13px; color: #666;">
            Warm regards,
          </p>

          <p style="margin: 0 0 10px 0; font-size: 13px; color: #666;">
            Email: ${ADMIN_EMAIL}
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
      subject: `[Washoku Hana] Reservation Confirmation for ${formData.name} – ${selectedDate}`,
      html: emailHtml,
      replyTo: ADMIN_EMAIL, // 답장 주소 추가 (스팸 점수 감소)
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send customer email.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Customer email sent successfully.',
      data,
    });
  } catch (error: any) {
    console.error('Customer email send error:', error);
    return NextResponse.json(
      {
        error:
          error.message || 'An error occurred while sending customer email.',
      },
      { status: 500 }
    );
  }
}
