import type { EmailTemplate, EmailTemplateData } from '@/types/email-templates';
import {
  formatBookingInfoSection,
  formatTime,
  getEmailSignature,
} from '@/utils/email-utils';
import { ADMIN_EMAIL } from '@/constants/email';

export function createCancelledTemplate(
  data: EmailTemplateData
): EmailTemplate {
  const {
    booking,
    reservationTime,
    reservationDate,
    refundAmount: refundAmountInput,
    cancellationType = 'customer', // 기본값: 고객 취소
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

  // 금액 포맷팅 함수 (캐나다 달러 형식)
  const formatCAD = (amount: number): string => {
    return amount.toLocaleString('en-CA', {
      style: 'currency',
      currency: 'CAD',
    });
  };

  // 환불 금액 계산
  const depositAmount = booking.deposit_amount || 0;
  let refundAmount = 0;

  if (cancellationType === 'admin') {
    // 관리자 취소: 항상 실제 입금받은 보증금(deposit_amount) 사용
    refundAmount = depositAmount;
  } else {
    // 고객 취소: 항상 deposit_amount 기준으로 정책에 따라 계산 (입력값 무시)
    if (depositAmount > 0) {
      if (daysUntilEvent >= 14) {
        refundAmount = depositAmount; // 100% 환불
      } else if (daysUntilEvent >= 7) {
        refundAmount = depositAmount * 0.5; // 50% 환불
      } else {
        refundAmount = 0; // 환불 불가
      }
    }
  }

  const bookingInfoSection = formatBookingInfoSection(
    booking,
    reservationTime,
    reservationDate
  );

  // 취소 주체에 따른 인사말 및 취소 문구
  const cancellationIntro =
    cancellationType === 'admin'
      ? `${formattedDate} (${dayName}) ${시간} 예약을 취소하게 되어 깊이 사과드립니다.\n\n저희 사정으로 인해 예약을 진행할 수 없게 되어 예약을 취소하게 되었습니다.`
      : `${formattedDate} (${dayName}) ${시간} 예약 취소 요청을 확인하였습니다.\n\n예약은 공식적으로 취소되었으며, 확인 메일에 명시된 환불 정책에 따라 아래와 같이 진행됩니다.`;

  // 관리자 취소와 고객 취소에 따른 환불 안내 문구
  const refundSection =
    cancellationType === 'admin'
      ? `관리자 사정으로 인한 취소이므로, 입금해주신 보증금 **${formatCAD(
          depositAmount
        )}**을 전액 환불해드리겠습니다.\n\n환불 금액은 고객님께서 보증금을 입금하신 계좌로 **3~5영업일 내** e-Transfer를 통해 처리될 예정입니다.`
      : `취소 및 환불 정책:\n\n행사 2주(14일) 전까지 취소: 보증금 100% 환불\n행사 1주(7일) 전까지 취소: 보증금 50% 환불\n행사 1주 이내 또는 당일 취소: 환불 불가\n\n${
          refundAmount > 0
            ? `환불 금액 **${formatCAD(
                refundAmount
              )}**은 고객님께서 보증금을 입금하신 계좌로 **3~5영업일 내** e-Transfer를 통해 처리될 예정입니다.`
            : `환불 정책에 따라 이번 예약은 환불이 불가능합니다.`
        }`;

  const closingMessage =
    cancellationType === 'admin'
      ? '이번에는 모시지 못해 정말 죄송합니다. 다음 기회에 더 나은 서비스로 보답하겠습니다.'
      : '이번에는 모시지 못해 아쉽지만, 다음 기회에 다시 만나 뵙길 바랍니다.';

  const content = `안녕하세요 ${booking.customer_name}님,

${cancellationIntro}
━━━━━━━━━━━━━━━━━━━━━━━━━━
${bookingInfoSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━
${refundSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━

${closingMessage}

${getEmailSignature()}`;

  const subject = `Washoku Hana 예약 취소 (${formattedDate}) 및 환불 안내`;

  return { subject, content };
}
