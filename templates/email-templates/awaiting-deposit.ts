import type { EmailTemplate, EmailTemplateData } from '@/types/email-templates';
import {
  formatBookingInfoSection,
  formatTime,
  getEmailSignature,
  parseBookingDate,
} from '@/utils/email-utils';
import { ADMIN_EMAIL } from '@/constants/email';
import {
  getPricePerPerson,
  calculateCourseAmount,
} from '@/utils/price-calculator';

export function createAwaitingDepositTemplate(
  data: EmailTemplateData
): EmailTemplate {
  const {
    booking,
    courseAmount,
    travelFee,
    extraChefFee,
    totalAmount,
    depositAmount,
    reservationTime,
    reservationDate,
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

  // 입금 기한 계산 (24시간 후, 날짜만)
  const now = new Date();
  const depositDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const deadlineDate = depositDeadline.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 가격 계산 (유틸리티 함수 사용)
  const guestCount = booking.guest_count || 0;
  const pricePerPerson = getPricePerPerson(booking.menu, guestCount);
  const menuPriceDisplay =
    pricePerPerson > 0 ? `$${pricePerPerson} per person` : 'N/A';
  const baseAmount = calculateCourseAmount(booking.menu, guestCount);

  // 금액 포맷팅 함수 (캐나다 달러 형식)
  const formatCAD = (amount: string | number): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
    return num.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });
  };

  // 코스는 기본 금액(인원 × 메뉴 가격)으로 설정
  const course = baseAmount > 0 ? baseAmount : parseFloat(courseAmount || '0');
  const travelFeeAmount = parseFloat(travelFee || '0');
  const extraChefFeeAmount = parseFloat(extraChefFee || '0');
  const total = parseFloat(totalAmount || '0');
  const deposit = parseFloat(depositAmount || '0');

  const bookingInfoSection = formatBookingInfoSection(
    booking,
    reservationTime,
    reservationDate
  );

  let content = `Hello ${booking.customer_name},

Thank you for your reservation with Washoku Hana. We are delighted to provide you with an exceptional omakase experience.
━━━━━━━━━━━━━━━━━━━━━━━━━━
${bookingInfoSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━
Cost Breakdown:
Omakase Course (${guestCount} guests × ${menuPriceDisplay}): ${formatCAD(
    course
  )}
Travel Fee: ${formatCAD(travelFeeAmount)}`;
  // 추가 셰프비가 0이 아닐 때만 추가
  const extraChefFeeNum = parseFloat(extraChefFee || '0') || 0;
  if (extraChefFeeNum > 0) {
    content += `\nExtra Chef Fee: ${formatCAD(extraChefFeeAmount)}`;
  }
  content += `\nTotal: ${formatCAD(total)}

Note: Gratuity is not included in the above amount.

━━━━━━━━━━━━━━━━━━━━━━━━━━
To confirm your reservation, please send an e-Transfer of **${formatCAD(
    deposit
  )}** to:
${ADMIN_EMAIL}
Deposit Deadline: By ${deadlineDate} (within 24 hours)

Note: If the deposit is not received by the deadline, your reservation may be automatically cancelled.
━━━━━━━━━━━━━━━━━━━━━━━━━━

If you could send us photos of the kitchen at your service location by email, it would help us prepare for a smoother service.

${getEmailSignature()}`;

  const subject = `Washoku Hana Deposit Payment Required – ${formattedDate} (${dayName}) ${time}`;

  return { subject, content };
}
