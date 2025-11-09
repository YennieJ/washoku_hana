import type { EmailTemplate, EmailTemplateData } from '@/types/email-templates';
import { formatBookingInfoSection, formatTime } from '@/utils/email-utils';
import { ADMIN_EMAIL } from '@/constants/email';

export function createCancelledTemplate(
  data: EmailTemplateData
): EmailTemplate {
  const {
    booking,
    reservationTime,
    reservationDate,
    refundAmount: refundAmountInput,
  } = data;

  const bookingDate = new Date(reservationDate || booking.booking_date);
  const formattedDate = bookingDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const dayName = bookingDate.toLocaleDateString('ko-KR', {
    weekday: 'long',
  });
  const 시간 = formatTime(reservationTime || '19:00');

  // 오늘 날짜와 예약 날짜의 차이 계산 (일 단위)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const reservation = new Date(bookingDate);
  reservation.setHours(0, 0, 0, 0);
  const daysUntilEvent = Math.floor(
    (reservation.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // 환불 금액 계산 (입력값이 있으면 사용, 없으면 booking.refund_amount, 없으면 deposit_amount 기반으로 계산)
  const depositAmount = booking.deposit_amount || 0;
  let refundAmount = 0;

  if (refundAmountInput) {
    refundAmount = parseFloat(refundAmountInput) || 0;
  } else if (booking.refund_amount) {
    refundAmount = booking.refund_amount;
  } else if (depositAmount > 0) {
    // 정책에 따라 계산
    if (daysUntilEvent >= 7) {
      refundAmount = depositAmount; // 100% 환불
    } else if (daysUntilEvent >= 3) {
      refundAmount = depositAmount * 0.5; // 50% 환불
    } else {
      refundAmount = 0; // 환불 불가
    }
  }

  const bookingInfoSection = formatBookingInfoSection(
    booking,
    reservationTime,
    reservationDate
  );

  const content = `안녕하세요 ${booking.customer_name}님,

${formattedDate} (${dayName}) ${시간} 예약 취소 요청을 확인하였습니다.

예약은 공식적으로 취소되었으며, 확인 메일에 명시된 환불 정책에 따라 아래와 같이 진행됩니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━
${bookingInfoSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━

취소 및 환불 정책:

행사 7일 전까지 취소: 보증금 100% 환불
행사 3일 전까지 취소: 보증금 50% 환불
행사 3일 이내 또는 당일 취소: 환불 불가

${
  refundAmount > 0
    ? `환불 금액 **$${refundAmount.toFixed(
        2
      )}**은 고객님께서 보증금을 입금하신 계좌로 **3~5영업일 내** e-Transfer를 통해 처리될 예정입니다.`
    : `환불 정책에 따라 이번 예약은 환불이 불가능합니다.`
}

━━━━━━━━━━━━━━━━━━━━━━━━━━

이번에는 모시지 못해 아쉽지만, 다음 기회에 다시 만나 뵙길 바랍니다.

감사합니다.

이메일: ${ADMIN_EMAIL}

Chef Minho
Washoku Hana – Private Omakase Experience`;

  const subject = `Washoku Hana 예약 취소 (${formattedDate}) 및 환불 안내`;

  return { subject, content };
}
