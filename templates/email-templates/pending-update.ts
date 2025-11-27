import type { EmailTemplate, EmailTemplateData } from '@/types/email-templates';
import {
  formatBookingInfoSection,
  getEmailSignature,
} from '@/utils/email-utils';

export function createPendingUpdateTemplate(
  data: EmailTemplateData
): EmailTemplate {
  const { booking, reservationTime, reservationDate } = data;

  const bookingInfoSection = formatBookingInfoSection(
    booking,
    reservationTime,
    reservationDate
  );

  // 사유와 변경제안 (입력값이 있으면 사용, 없으면 플레이스홀더)
  const reason =
    data.reason || '[이유 예시: 셰프 일정 / 이동 거리 / 준비 시간 등]';
  const changeProposal =
    data.changeProposal ||
    '[변경 제안 – 예: 시간 7:30pm으로 조정 / 날짜를 12월 21일로 변경 / 인원 10명으로 조정 등]';

  const content = `Hello ${booking.customer_name},

Thank you again for your reservation with Washoku Hana.
Regarding your upcoming reservation, we need to make a slight schedule adjustment and would like to confirm with you.
━━━━━━━━━━━━━━━━━━━━━━━━━━
Current ${bookingInfoSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━
Due to **${reason}**, we would like to confirm if the following change is possible:

👉 **${changeProposal}**
━━━━━━━━━━━━━━━━━━━━━━━━━━

Please let us know within 24 hours if this change works for you.
If this is not possible, we can work together to find an alternative that fits your schedule.

${getEmailSignature()}`;

  const subject = `Washoku Hana Reservation Adjustment Request`;

  return { subject, content };
}
