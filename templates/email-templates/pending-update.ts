import type { EmailTemplate, EmailTemplateData } from '@/types/email-templates';
import { formatBookingInfoSection } from '@/utils/email-utils';
import { ADMIN_EMAIL } from '@/constants/email';

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
  const 사유 =
    data.reason || '[사유 예시: 셰프 일정 / 이동 거리 / 준비 시간 등]';
  const 변경제안 =
    data.changeProposal ||
    '[변경 제안 – 예: 시간 7:30pm으로 조정 / 날짜를 12월 21일로 변경 / 인원 10명으로 조정 등]';

  const content = `안녕하세요 ${booking.customer_name}님,

Washoku Hana를 예약해 주셔서 다시 한번 감사드립니다.
다가오는 예약과 관련하여, 일정상 소폭 조정이 필요한 부분이 있어 확인차 연락드립니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━
현재 ${bookingInfoSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━

**${사유}**으로 인해 아래와 같이 변경이 가능한지 확인 부탁드립니다.

👉 **${변경제안}**

━━━━━━━━━━━━━━━━━━━━━━━━━━

변경이 가능하신지 24시간 내로 회신 부탁드리며,
어려우시다면 고객님의 일정에 맞는 다른 대안을 함께 찾아보겠습니다.

감사합니다.

이메일: ${ADMIN_EMAIL}

Chef Minho
Washoku Hana – Private Omakase Experience`;

  const subject = `Washoku Hana 예약 조정 확인 요청`;

  return { subject, content };
}
