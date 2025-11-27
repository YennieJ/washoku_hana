import type { EmailTemplate, EmailTemplateData } from '@/types/email-templates';
import {
  formatBookingInfoSection,
  formatTime,
  getEmailSignature,
} from '@/utils/email-utils';

export function createConfirmedTemplate(
  data: EmailTemplateData
): EmailTemplate {
  const {
    booking,
    totalAmount,
    depositAmount,
    remainingAmount,
    reservationTime,
    reservationDate,
  } = data;

  // 금액 포맷팅 함수 (캐나다 달러 형식)
  const formatCAD = (amount: string | number): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
    return num.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });
  };

  const totalPrice = parseFloat(totalAmount || '0');
  const deposit = parseFloat(depositAmount || '0');
  const remaining = parseFloat(remainingAmount || '0');

  // 8명 이상 여부 확인
  const isLargeGroup = booking.guest_count >= 8;

  // 셰프 도착 시간 계산 (정확한 시간)
  const reservationTimeStr = reservationTime || '19:00';
  const [hours, minutes] = reservationTimeStr.split(':').map(Number);
  const reservationDateTime = new Date();
  reservationDateTime.setHours(hours, minutes, 0, 0);

  // 8인 이상: 1시간 전, 8인 이하: 30분 전
  const arrivalMinutesBefore = isLargeGroup ? 60 : 30;
  const chefArrivalDateTime = new Date(
    reservationDateTime.getTime() - arrivalMinutesBefore * 60 * 1000
  );

  const chefArrivalHours = chefArrivalDateTime.getHours();
  const chefArrivalMins = chefArrivalDateTime.getMinutes();
  const chefArrivalTime = formatTime(
    `${chefArrivalHours}:${chefArrivalMins.toString().padStart(2, '0')}`
  );

  const bookingDate = new Date(reservationDate || booking.booking_date);
  const formattedDate = bookingDate.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const dayName = bookingDate.toLocaleDateString('en-CA', {
    weekday: 'long',
  });
  const time = formatTime(reservationTime || '19:00');

  const bookingInfoSection = formatBookingInfoSection(
    booking,
    reservationTime,
    reservationDate
  );

  const content = `Hello ${booking.customer_name},

Your reservation with Washoku Hana has been confirmed.
Thank you for inviting us to your special occasion. We look forward to providing you with an unforgettable omakase experience.
━━━━━━━━━━━━━━━━━━━━━━━━━━
${bookingInfoSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━
Payment Information:
Total Amount: ${formatCAD(totalPrice)}
Deposit Received: ${formatCAD(deposit)}
Remaining Balance: ${formatCAD(
    remaining
  )} (The remaining balance can be paid on the day of service, after the chef arrives, by **cash or e-Transfer**.)

Chef Arrival Time: ${chefArrivalTime}
━━━━━━━━━━━━━━━━━━━━━━━━━━
Cancellation and Refund Policy:
Cancellation 2 weeks (14 days) or more before the event: 100% deposit refund
Cancellation 1 week (7 days) before the event: 50% deposit refund
Cancellation within 1 week or on the day of the event: No refund
━━━━━━━━━━━━━━━━━━━━━━━━━━
What the Host Should Prepare:
To ensure a smooth service, please have the following items ready in advance.

**[Required Items]**
Dining space and table
Napkins for guests
Beverages (water, tea, alcohol, or any preferred drinks)

**[Optional Items]**
Table setting or dinnerware

All cooking tools and plating equipment required for the omakase service will be prepared by the chef.
━━━━━━━━━━━━━━━━━━━━━━━━━━

We look forward to providing you and your guests with an unforgettable omakase experience.

${getEmailSignature()}`;

  const subject = `Washoku Hana Reservation Confirmed – ${formattedDate} (${dayName}) ${time}`;

  return { subject, content };
}
