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

  const 총금액 = totalAmount || '0';
  const 보증금 = depositAmount || '0';
  const 잔금 = remainingAmount || '0';

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
  const formattedDate = bookingDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const dayName = bookingDate.toLocaleDateString('ko-KR', {
    weekday: 'long',
  });
  const 시간 = formatTime(reservationTime || '19:00');

  const bookingInfoSection = formatBookingInfoSection(
    booking,
    reservationTime,
    reservationDate
  );

  const content = `안녕하세요 ${booking.customer_name}님,

Washoku Hana의 예약이 확정되었습니다.
소중한 자리에 저희를 초대해 주셔서 감사드리며, 잊지 못할 오마카세 경험을 준비하겠습니다.
━━━━━━━━━━━━━━━━━━━━━━━━━━
${bookingInfoSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━
금액 안내:
총 금액: $${총금액}
보증금 입금 확인: $${보증금}
잔금: $${잔금} (잔금 결제는 서비스 당일, 셰프 도착 후 현장에서 **현금 또는 계좌이체**로 가능합니다.)

셰프 도착 시간: ${chefArrivalTime}
━━━━━━━━━━━━━━━━━━━━━━━━━━
취소 및 환불 정책:
행사 7일 전까지 취소: 보증금 100% 환불
행사 3일 전까지 취소: 보증금 50% 환불
행사 3일 이내 또는 당일 취소: 환불 불가
━━━━━━━━━━━━━━━━━━━━━━━━━━
호스트가 준비하실 것:
원활한 서비스 진행을 위해 아래 항목을 미리 준비해 주세요.

**[필수 항목]**
식사 공간 및 테이블
게스트용 냅킨
음료 (물, 차, 주류 등 원하시는 종류)

**[선택 항목]**
테이블 세팅 또는 식기류

오마카세 진행에 필요한 모든 조리도구 및 플레이팅 장비는 셰프가 직접 준비합니다.
━━━━━━━━━━━━━━━━━━━━━━━━━━

곧 고객님과 게스트분들께 잊지 못할 오마카세 경험을 선사하겠습니다.

${getEmailSignature()}`;

  const subject = `Washoku Hana 예약 확정 안내 – ${formattedDate} (${dayName}) ${시간}`;

  return { subject, content };
}
