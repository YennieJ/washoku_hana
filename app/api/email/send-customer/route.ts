import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ADMIN_EMAIL } from '@/constants/email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, subject, htmlContent, to } = body;

    // 필수 필드 검증
    if (!bookingId || !subject || !htmlContent || !to) {
      return NextResponse.json(
        { error: 'Required fields are missing.' },
        { status: 400 }
      );
    }

    // Resend로 이메일 전송
    // 관리자가 직접 보내는 이메일
    const { data, error } = await resend.emails.send({
      from: 'Washoku Hana <info@washokuhana.ca>',
      to: to,
      subject: subject,
      html: htmlContent,
      replyTo: ADMIN_EMAIL, // 답장은 관리자 Gmail로
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
