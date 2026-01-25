import type { EmailTemplate, EmailTemplateData } from '@/types/email-templates';
import {
  formatBookingInfoSection,
  formatTime,
  getEmailSignature,
  parseBookingDate,
} from '@/utils/email-utils';

export function createDeclinedTemplate(data: EmailTemplateData): EmailTemplate {
  const { booking, reservationTime, reservationDate } = data;

  const bookingDate = parseBookingDate(reservationDate || booking.booking_date);
  const formattedDate = bookingDate.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const bookingInfoSection = formatBookingInfoSection(
    booking,
    reservationTime,
    reservationDate
  );

  // 거절 사유 (입력값이 있으면 사용, 없으면 플레이스홀더)
  const declineReason =
    data.declineReason ||
    '[이유 예시: 일정상 불가능 / 이동 거리 문제 / 준비 시간 부족 등]';

  const content = `Hello ${booking.customer_name},

Thank you for your interest in Washoku Hana.
We apologize, but due to **${declineReason}**, we are unable to proceed with this reservation.
━━━━━━━━━━━━━━━━━━━━━━━━━━
${bookingInfoSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━

We are sorry we cannot join you on this occasion, but we hope to have the opportunity to serve you in the future.

${getEmailSignature()}`;

  const subject = `Washoku Hana Reservation Request Update - ${formattedDate}`;

  return { subject, content };
}
