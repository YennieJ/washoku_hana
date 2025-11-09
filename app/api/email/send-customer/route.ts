import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ADMIN_EMAIL } from '@/constants/email';

const resend = new Resend(process.env.RESEND_API_KEY);

// 고객 이메일을 관리자로 리다이렉트할지 여부 (환경 변수로 제어)
// true: 모든 고객 이메일이 관리자에게 전송됨 (테스트 모드)
// false: 고객에게 직접 전송 (프로덕션 모드)
// 기본값: true (환경 변수가 설정되지 않으면 관리자에게 전송)
const REDIRECT_CUSTOMER_EMAIL_TO_ADMIN =
  process.env.REDIRECT_CUSTOMER_EMAIL_TO_ADMIN !== 'false';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, subject, htmlContent, to } = body;

    // 필수 필드 검증
    if (!bookingId || !subject || !htmlContent || !to) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 고객 이메일 주소 결정 (리다이렉트 설정에 따라)
    const recipientEmail = REDIRECT_CUSTOMER_EMAIL_TO_ADMIN ? ADMIN_EMAIL : to;

    // 제목에 리다이렉트 여부 표시
    const finalSubject = REDIRECT_CUSTOMER_EMAIL_TO_ADMIN
      ? `[관리자 확인용 - 원래 수신자: ${to}] ${subject}`
      : subject;

    // Resend로 이메일 전송
    const { data, error } = await resend.emails.send({
      from: 'Washoku Hana <noreply@resend.dev>',
      to: recipientEmail,
      subject: finalSubject,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: '이메일 전송에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '이메일이 성공적으로 전송되었습니다.',
      data,
    });
  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: error.message || '이메일 전송 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
