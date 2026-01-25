import type { EmailTemplate, EmailTemplateData } from '@/types/email-templates';
import {
  formatBookingInfoSection,
  formatTime,
  getEmailSignature,
  parseBookingDate,
} from '@/utils/email-utils';

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

  const bookingDate = parseBookingDate(reservationDate || booking.booking_date);
  const formattedDate = bookingDate.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const dayName = bookingDate.toLocaleDateString('en-CA', {
    weekday: 'long',
  });
  const time = formatTime(reservationTime || '19:00');

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

  // 환불 금액 계산 (항상 디폴트 값으로 계산)
  const depositAmount = booking.deposit_amount || 0;
  let refundAmount = 0;

  if (cancellationType === 'admin') {
    // 관리자 취소: 항상 실제 입금받은 보증금(deposit_amount) 사용 (전액 환불)
    refundAmount = depositAmount;
  } else if (cancellationType === 'customer_no_deposit') {
    // 입금 전 고객 취소: 환불 금액 없음
    refundAmount = 0;
  } else {
    // 고객 취소 (입금 후): deposit_amount 기준으로 정책에 따라 계산
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
      ? `We sincerely apologize for having to cancel your reservation for ${formattedDate} (${dayName}) ${time}.\n\nDue to circumstances on our end, we are unable to proceed with this reservation and must cancel it.`
      : cancellationType === 'customer_no_deposit'
      ? `We have received your cancellation request for the reservation on ${formattedDate} (${dayName}) ${time}.\n\nYour reservation has been officially cancelled.`
      : `We have received your cancellation request for the reservation on ${formattedDate} (${dayName}) ${time}.\n\nYour reservation has been officially cancelled, and we will proceed according to the refund policy outlined in your confirmation email.`;

  // 관리자 취소와 고객 취소에 따른 환불 안내 문구
  // refundAmount는 이미 계산된 값 (관리자 취소: depositAmount, 고객 취소: 정책에 따라 계산)
  const refundSection =
    cancellationType === 'admin'
      ? `As this cancellation is due to circumstances on our end, we will provide a full refund of your deposit of **${formatCAD(
          refundAmount
        )}**.\n\nThe refund will be processed via e-Transfer to the account from which you sent the deposit within **3-5 business days**.`
      : cancellationType === 'customer_no_deposit'
      ? `Since this cancellation occurred before the deposit was received, no refund is required.`
      : `Cancellation and Refund Policy:\n\nCancellation 2 weeks (14 days) or more before the event: 100% deposit refund\nCancellation 1 week (7 days) before the event: 50% deposit refund\nCancellation within 1 week or on the day of the event: No refund\n\n${
          refundAmount > 0
            ? `Your refund of **${formatCAD(
                refundAmount
              )}** will be processed via e-Transfer to the account from which you sent the deposit within **3-5 business days**.`
            : `According to our refund policy, this reservation is not eligible for a refund.`
        }`;

  const closingMessage =
    cancellationType === 'admin'
      ? 'We sincerely apologize for not being able to serve you this time. We hope to provide you with better service on another occasion.'
      : cancellationType === 'customer_no_deposit'
      ? 'We hope to see you again in the future.'
      : 'We are sorry we could not serve you this time, but we hope to see you again in the future.';

  // 입금 전 취소의 경우 환불 섹션을 별도로 처리
  const content =
    cancellationType === 'customer_no_deposit'
      ? `Hello ${booking.customer_name},

${cancellationIntro}
━━━━━━━━━━━━━━━━━━━━━━━━━━
${bookingInfoSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━

${refundSection}

${closingMessage}

${getEmailSignature()}`
      : `Hello ${booking.customer_name},

${cancellationIntro}
━━━━━━━━━━━━━━━━━━━━━━━━━━
${bookingInfoSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━
${refundSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━

${closingMessage}

${getEmailSignature()}`;

  const subject =
    cancellationType === 'customer_no_deposit'
      ? `Washoku Hana Reservation Cancelled (${formattedDate})`
      : `Washoku Hana Reservation Cancelled (${formattedDate}) and Refund Information`;

  return { subject, content };
}
