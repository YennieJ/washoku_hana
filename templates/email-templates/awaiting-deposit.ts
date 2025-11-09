import type { EmailTemplate, EmailTemplateData } from '@/types/email-templates';
import { formatBookingInfoSection, formatTime } from '@/utils/email-utils';
import { ADMIN_EMAIL } from '@/constants/email';

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

  // 입금 기한 계산 (24시간 후, 날짜만)
  const now = new Date();
  const depositDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const deadlineDate = depositDeadline.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const 오마카세코스 = courseAmount || '0';
  const 출장비 = travelFee || '0';
  const 추가셰프비 = extraChefFee || '0';
  const 총합계 = totalAmount || '0';
  const 디파짓 = depositAmount || '0';

  const bookingInfoSection = formatBookingInfoSection(
    booking,
    reservationTime,
    reservationDate
  );

  let content = `안녕하세요 ${booking.customer_name}님,

Washoku Hana를 예약해 주셔서 감사합니다. 최고의 오마카세 경험을 제공해드리게 되어 기쁩니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━
${bookingInfoSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━

비용 안내:
오마카세 코스: $${오마카세코스}
출장비: $${출장비}`;

  // 추가 셰프비가 0이 아닐 때만 추가
  const extraChefFeeNum = parseFloat(extraChefFee || '0') || 0;
  if (extraChefFeeNum > 0) {
    content += `\n추가 셰프비: $${추가셰프비}`;
  }

  content += `\n총합계: $${총합계}

※ 금액에는 봉사료가 포함되어 있지 않습니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━

예약 확정을 위해 **$${디파짓}**을 아래 계좌로 e-Transfer 부탁드립니다.

${ADMIN_EMAIL}

입금 기한: ${deadlineDate}까지 (24시간 이내)
※ 기한 내 입금이 완료되지 않을 경우 예약이 자동으로 취소될 수 있습니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━

서비스 예정 장소의 주방 사진을 메일로 보내주시면, 더욱 원활한 서비스 준비에 도움이 됩니다.

감사합니다.

이메일: ${ADMIN_EMAIL}

Chef Minho
Washoku Hana – Private Omakase Experience`;

  const subject = `Washoku Hana 예약 확정을 위한 디파짓 입금 안내 – ${formattedDate} (${dayName}) ${시간}`;

  return { subject, content };
}
