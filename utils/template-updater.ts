import type {
  EmailTemplateType,
  EmailTemplateData,
} from '@/types/email-templates';
import { formatTime } from './email-utils';

export function updateTemplateContent(
  templateType: EmailTemplateType,
  content: string,
  data: EmailTemplateData
): string {
  // 예약금 안내, 예약 확정, 예약 취소, 예약 변경, 또는 예약 거절 템플릿일 때만 자동 업데이트
  if (
    (templateType !== 'AWAITING_DEPOSIT' &&
      templateType !== 'CONFIRMED' &&
      templateType !== 'CANCELLED' &&
      templateType !== 'PENDING_UPDATE' &&
      templateType !== 'DECLINED') ||
    !content
  ) {
    return content;
  }

  const {
    courseAmount,
    travelFee,
    extraChefFee,
    totalAmount,
    depositAmount,
    remainingAmount,
    refundAmount,
    reservationTime,
    reason,
    changeProposal,
    declineReason,
  } = data;

  let updatedContent = content;

  // PENDING_UPDATE 템플릿 업데이트
  if (templateType === 'PENDING_UPDATE') {
    // 시간 업데이트
    const 시간 = formatTime(reservationTime || '19:00');
    updatedContent = updatedContent.replace(
      /📅 날짜 및 시간: .+? \(.*?\) \d+:\d+ (AM|PM)/g,
      (match) => {
        const dateAndDay =
          match.match(/📅 날짜 및 시간: (.+? \(.*?\))/)?.[1] || '';
        return `📅 날짜 및 시간: ${dateAndDay} ${시간}`;
      }
    );

    // 변경 사유 업데이트
    // reason이 undefined가 아니면 업데이트 (빈 문자열이면 플레이스홀더로 되돌림)
    if (reason !== undefined) {
      const defaultReason = '[사유 예시: 셰프 일정 / 이동 거리 / 준비 시간 등]';
      const finalReason = reason || defaultReason;

      // 플레이스홀더 형식: [사유 예시: ...]
      if (updatedContent.includes('[사유 예시:')) {
        updatedContent = updatedContent.replace(
          /\[사유 예시: .+?\]/g,
          finalReason
        );
      } else {
        // 이미 값이 들어간 경우: "사유내용으로 인해 아래와 같이..." 형식에서 사유 부분만 교체
        // "으로 인해 아래와 같이 변경이 가능한지 확인 부탁드립니다." 앞의 모든 내용을 사유로 간주
        const lines = updatedContent.split('\n');
        const updatedLines = lines.map((line) => {
          if (
            line.includes(
              '으로 인해 아래와 같이 변경이 가능한지 확인 부탁드립니다.'
            )
          ) {
            return `${finalReason}으로 인해 아래와 같이 변경이 가능한지 확인 부탁드립니다.`;
          }
          return line;
        });
        updatedContent = updatedLines.join('\n');
      }
    }

    // 변경 제안 업데이트
    // changeProposal이 undefined가 아니면 업데이트 (빈 문자열이면 플레이스홀더로 되돌림)
    if (changeProposal !== undefined) {
      const defaultChangeProposal =
        '[변경 제안 – 예: 시간 7:30pm으로 조정 / 날짜를 12월 21일로 변경 / 인원 10명으로 조정 등]';
      const finalChangeProposal = changeProposal || defaultChangeProposal;

      // 플레이스홀더 형식: 👉 [변경 제안 ...]
      if (updatedContent.includes('[변경 제안')) {
        updatedContent = updatedContent.replace(
          /👉 \[변경 제안[^\]]+\]/g,
          `👉 ${finalChangeProposal}`
        );
      } else {
        // 이미 값이 들어간 경우: "👉 변경제안내용" 형식에서 변경제안 부분만 교체
        // "👉 "로 시작하는 줄 전체를 찾아서 교체
        const lines = updatedContent.split('\n');
        const updatedLines = lines.map((line) => {
          if (line.trim().startsWith('👉')) {
            return `👉 ${finalChangeProposal}`;
          }
          return line;
        });
        updatedContent = updatedLines.join('\n');
      }
    }

    return updatedContent;
  }

  // DECLINED 템플릿 업데이트
  if (templateType === 'DECLINED') {
    // 거절 사유 업데이트
    // declineReason이 undefined가 아니면 업데이트 (빈 문자열이면 플레이스홀더로 되돌림)
    if (declineReason !== undefined) {
      const defaultDeclineReason =
        '[이유 예시: 일정상 불가능 / 이동 거리 문제 / 준비 시간 부족 등]';
      const finalDeclineReason = declineReason || defaultDeclineReason;

      // 플레이스홀더 형식: [이유 예시: ...]
      if (updatedContent.includes('[이유 예시:')) {
        updatedContent = updatedContent.replace(
          /\[이유 예시: .+?\]/g,
          finalDeclineReason
        );
      } else {
        // 이미 값이 들어간 경우: "죄송하지만, 이유내용 진행이 어렵습니다." 형식에서 이유 부분만 교체
        const lines = updatedContent.split('\n');
        const updatedLines = lines.map((line) => {
          if (
            line.includes('죄송하지만,') &&
            line.includes('진행이 어렵습니다.')
          ) {
            return `죄송하지만, ${finalDeclineReason} 진행이 어렵습니다.`;
          }
          return line;
        });
        updatedContent = updatedLines.join('\n');
      }
    }

    return updatedContent;
  }

  // CONFIRMED 템플릿 업데이트
  if (templateType === 'CONFIRMED') {
    // formatBookingInfoSection 형식에 맞게 날짜 및 시간 업데이트
    const 시간 = formatTime(reservationTime || '19:00');
    updatedContent = updatedContent.replace(
      /예약 날짜: .+? \(.*?\) \d+:\d+ (AM|PM)/g,
      (match) => {
        // 날짜와 요일 부분은 유지하고 시간만 변경
        const dateAndDay = match.match(/예약 날짜: (.+? \(.*?\))/)?.[1] || '';
        return `예약 날짜: ${dateAndDay} ${시간}`;
      }
    );

    // 금액 업데이트
    updatedContent = updatedContent
      .replace(/총 금액: \$[\d.]+/g, `총 금액: $${totalAmount || '0'}`)
      .replace(
        /보증금 입금 확인: \$[\d.]+/g,
        `보증금 입금 확인: $${depositAmount || '0'}`
      )
      .replace(/잔금: \$[\d.]+/g, `잔금: $${remainingAmount || '0'}`);

    return updatedContent;
  }

  // CANCELLED 템플릿 업데이트
  if (templateType === 'CANCELLED') {
    // 환불 금액 업데이트
    const refundAmountValue = parseFloat(refundAmount || '0') || 0;

    if (refundAmountValue > 0) {
      // 환불 금액이 있을 때: "환불 금액 **$금액**은 3~5영업일 내..." 형식
      updatedContent = updatedContent.replace(
        /환불 금액 \*\*\$[\d.]+\*\*[\s\S]*?은/g,
        `환불 금액 **$${refundAmountValue.toFixed(2)}**은`
      );
      // 환불 불가 메시지가 있으면 제거
      updatedContent = updatedContent.replace(
        /환불 정책에 따라 이번 예약은 환불이 불가능합니다\./g,
        ''
      );
    } else {
      // 환불 금액이 0일 때: "환불 정책에 따라 이번 예약은 환불이 불가능합니다." 형식
      updatedContent = updatedContent.replace(
        /환불 금액 \*\*\$[\d.]+\*\*[\s\S]*?처리됩니다\./g,
        '환불 정책에 따라 이번 예약은 환불이 불가능합니다.'
      );
    }

    return updatedContent;
  }

  // 시간 업데이트 (AM/PM 형식)
  const 시간 = formatTime(reservationTime || '19:00');
  updatedContent = updatedContent.replace(
    /예약 날짜: .+? \(.*?\) \d+:\d+ (AM|PM)/g,
    (match) => {
      // 날짜와 요일 부분은 유지하고 시간만 변경
      const dateAndDay = match.match(/예약 날짜: (.+? \(.*?\))/)?.[1] || '';
      return `예약 날짜: ${dateAndDay} ${시간}`;
    }
  );

  // 각 금액 항목을 정규식으로 찾아서 업데이트
  updatedContent = updatedContent
    .replace(
      /오마카세 코스: \$[\d.]+/g,
      `오마카세 코스: $${courseAmount || '0'}`
    )
    .replace(/출장비: \$[\d.]+/g, `출장비: $${travelFee || '0'}`)
    .replace(/총합계: \$[\d.]+/g, `총합계: $${totalAmount || '0'}`)
    // 디파짓 금액 업데이트 (두 곳: **$금액** 형식과 보증금: $금액 형식)
    .replace(/\*\*\$[\d.]+\*\*/g, `**$${depositAmount || '0'}**`)
    .replace(/보증금: \$[\d.]+/g, `보증금: $${depositAmount || '0'}`)
    .replace(/잔금: \$[\d.]+/g, `잔금: $${remainingAmount || '0'}`);

  // 추가 셰프비 처리
  const extraChefFeeNum = parseFloat(extraChefFee || '0') || 0;
  if (extraChefFeeNum > 0) {
    // 추가 셰프비 줄이 이미 있으면 업데이트
    if (updatedContent.includes('추가 셰프비:')) {
      updatedContent = updatedContent.replace(
        /추가 셰프비: \$[\d.]+/g,
        `추가 셰프비: $${extraChefFee}`
      );
    } else {
      // 추가 셰프비 줄이 없으면 출장비 다음에 추가
      updatedContent = updatedContent.replace(
        /(출장비: \$[\d.]+)/,
        `$1\n추가 셰프비: $${extraChefFee}`
      );
    }
  } else {
    // 추가 셰프비가 0이면 해당 줄 제거
    updatedContent = updatedContent.replace(/추가 셰프비: \$[\d.]+\n?/g, '');
  }

  return updatedContent;
}
