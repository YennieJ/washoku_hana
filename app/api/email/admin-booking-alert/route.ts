import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ADMIN_EMAIL } from '@/constants/email';
import { menuItems } from '@/constants/menu-items';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, selectedDate, selectedDayName } = body;

    // 필수 필드 검증
    if (!formData) {
      return NextResponse.json(
        { error: 'formData is missing.' },
        { status: 400 }
      );
    }

    // 관리자 페이지 URL 생성
    const origin = request.headers.get('origin') || request.headers.get('host');
    const baseUrl = origin
      ? origin.startsWith('http')
        ? origin
        : `https://${origin}`
      : 'https://localhost:3000';
    const adminUrl = `${baseUrl}/admin/dashboard`;

    // 선택된 메뉴의 가격 정보 가져오기
    const selectedMenu = menuItems.find((m) => m.title === formData.menu);
    const menuPrice = selectedMenu ? selectedMenu.price : 'N/A';

    // 이메일 본문 HTML 생성
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px; text-align: center; }
            .header h2 { margin: 0; color: #333; }
            .priority-section { margin-bottom: 25px; padding: 20px; background-color: #fff; border-left: 4px solid #4a5568; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .priority-item { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e2e8f0; }
            .priority-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
            .priority-label { font-weight: bold; color: #2d3748; font-size: 14px; margin-bottom: 5px; }
            .priority-value { color: #1a202c; font-size: 16px; }
            .secondary-section { margin-bottom: 20px; padding: 15px; background-color: #f7fafc; border-radius: 5px; }
            .secondary-label { font-weight: bold; color: #4a5568; margin-bottom: 8px; font-size: 14px; }
            .secondary-value { color: #2d3748; font-size: 15px; line-height: 1.5; }
            .contact-info { margin-top: 25px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
            .contact-item { margin-bottom: 8px; color: #718096; font-size: 13px; }
            .admin-button-container { margin-top: 30px; text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0; }
            .admin-button { display: inline-block; padding: 12px 30px; border: 1px solid #4a5568; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px; transition: background-color 0.3s; }
            .admin-button:hover { border-color: #4a5568; background-color:rgb(199, 218, 251); }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📋 새로운 예약 요청</h2>
            </div>
            
            <!-- 가장 중요한 정보 -->
            <div class="priority-section">
              <div class="priority-item">
                <div class="priority-label">📅 예약 날짜</div>
                <div class="priority-value">${selectedDate} (${selectedDayName})</div>
              </div>
              
              <div class="priority-item">
                <div class="priority-label">🍱 메뉴</div>
                <div class="priority-value">${
                  formData.menu
                } - ${menuPrice}</div>
              </div>
              
              <div class="priority-item">
                <div class="priority-label">👥 게스트 수</div>
                <div class="priority-value">${formData.guestCount}명</div>
              </div>
              
              <div class="priority-item">
                <div class="priority-label">📍 주소</div>
                <div class="priority-value">${formData.address}</div>
              </div>
            </div>
            
            <!-- 음식 알레르기 또는 특별 요청사항 -->
            ${
              formData.foodAllergy || formData.requests
                ? `
            <div class="secondary-section">
              ${
                formData.foodAllergy
                  ? `
              <div class="secondary-label">⚠️ 음식 알레르기</div>
              <div class="secondary-value">${formData.foodAllergy}</div>
              ${formData.requests ? '<br><br>' : ''}
              `
                  : ''
              }
              ${
                formData.requests
                  ? `
              <div class="secondary-label">💬 특별 요청사항</div>
              <div class="secondary-value">${formData.requests}</div>
              `
                  : ''
              }
            </div>
            `
                : ''
            }
            
            <!-- 고객 연락처 정보 -->
            <div class="contact-info">
              <div class="contact-item"><strong>이름:</strong> ${
                formData.name
              }</div>
              <div class="contact-item"><strong>이메일:</strong> ${
                formData.email
              }</div>
              <div class="contact-item"><strong>전화번호:</strong> ${
                formData.phone
              }</div>
            </div>
            
            <!-- 관리자 페이지 버튼 -->
            <div class="admin-button-container">
              <a href="${adminUrl}" class="admin-button">관리자 페이지로 이동</a>
            </div>
            
            <div class="footer">
              <p>이 이메일은 예약 시스템에서 자동으로 발송되었습니다.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Resend로 이메일 전송
    const { data, error } = await resend.emails.send({
      from: 'Washoku Hana <noreply@washokuhana.ca>',
      to: ADMIN_EMAIL,
      subject: `[예약 요청] ${formData.name}님 - ${selectedDate}`,
      html: emailHtml,
      replyTo: formData.email, // 답장 주소 추가 (고객 이메일로)
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully.',
      data,
    });
  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while sending email.' },
      { status: 500 }
    );
  }
}
