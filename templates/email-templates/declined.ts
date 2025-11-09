import type { EmailTemplate, EmailTemplateData } from '@/types/email-templates';
import { formatBookingInfoSection, formatTime } from '@/utils/email-utils';
import { ADMIN_EMAIL } from '@/constants/email';

export function createDeclinedTemplate(data: EmailTemplateData): EmailTemplate {
  const { booking, reservationTime, reservationDate } = data;

  const bookingDate = new Date(reservationDate || booking.booking_date);
  const formattedDate = bookingDate.toLocaleDateString('ko-KR', {
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
  const 거절사유 =
    data.declineReason ||
    '[이유 예시: 일정상 불가능 / 이동 거리 문제 / 준비 시간 부족 등]';

  const content = `안녕하세요 ${booking.customer_name}님,

Washoku Hana에 관심을 가져주셔서 감사합니다.

죄송하지만, **${거절사유}**으로 인해 해당 일정에 진행이 어렵습니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━
${bookingInfoSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━

소중한 자리에 함께하지 못해 아쉽지만, 다음에 더 좋은 기회에 찾아뵐 수 있기를 바랍니다.

감사합니다.

이메일: ${ADMIN_EMAIL}

Chef Minho
Washoku Hana – Private Omakase Experience`;

  const subject = `Washoku Hana 예약 요청에 대한 안내 - ${formattedDate}`;

  return { subject, content };
}
