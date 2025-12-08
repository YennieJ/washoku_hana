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

    // 영어 템플릿: "Reservation Date: ..." 형식
    updatedContent = updatedContent.replace(
      /Reservation Date: .+? \(.*?\) \d+:\d+ (AM|PM)/g,
      (match) => {
        const dateAndDay =
          match.match(/Reservation Date: (.+? \(.*?\))/)?.[1] || '';
        return `Reservation Date: ${dateAndDay} ${시간}`;
      }
    );

    // 변경 사유 업데이트
    // reason이 undefined가 아니면 업데이트 (빈 문자열이면 플레이스홀더로 되돌림)
    if (reason !== undefined) {
      const defaultReason = '[사유 예시: 셰프 일정 / 이동 거리 / 준비 시간 등]';
      const finalReason = reason || defaultReason;

      // 영어 템플릿: "Due to **${reason}**" 형식
      if (updatedContent.includes('Due to **')) {
        updatedContent = updatedContent.replace(
          /Due to \*\*[^*]+\*\*/g,
          `Due to **${finalReason}**`
        );
      }
    }

    // 변경 제안 업데이트
    // changeProposal이 undefined가 아니면 업데이트 (빈 문자열이면 플레이스홀더로 되돌림)
    if (changeProposal !== undefined) {
      const defaultChangeProposal =
        '[변경 제안 – 예: 시간 7:30pm으로 조정 / 날짜를 12월 21일로 변경 / 인원 10명으로 조정 등]';
      const finalChangeProposal = changeProposal || defaultChangeProposal;

      // 영어 템플릿: "👉 **${changeProposal}**" 형식
      if (updatedContent.includes('👉 **')) {
        updatedContent = updatedContent.replace(
          /👉 \*\*[^*]+\*\*/g,
          `👉 **${finalChangeProposal}**`
        );
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

      // 영어 템플릿: "due to **${declineReason}**" 형식
      if (updatedContent.includes('due to **')) {
        updatedContent = updatedContent.replace(
          /due to \*\*[^*]+\*\*/g,
          `due to **${finalDeclineReason}**`
        );
      }
    }

    return updatedContent;
  }

  // CONFIRMED 템플릿 업데이트
  if (templateType === 'CONFIRMED') {
    // formatBookingInfoSection 형식에 맞게 날짜 및 시간 업데이트
    const 시간 = formatTime(reservationTime || '19:00');

    // 영어 템플릿: "Reservation Date: ..." 형식
    updatedContent = updatedContent.replace(
      /Reservation Date: .+? \(.*?\) \d+:\d+ (AM|PM)/g,
      (match) => {
        const dateAndDay =
          match.match(/Reservation Date: (.+? \(.*?\))/)?.[1] || '';
        return `Reservation Date: ${dateAndDay} ${시간}`;
      }
    );

    // 금액 포맷팅 함수
    const formatCAD = (amount: string | number | undefined): string => {
      const num =
        typeof amount === 'string'
          ? parseFloat(amount.replace(/[^0-9.]/g, '')) || 0
          : typeof amount === 'number'
          ? amount
          : 0;
      return num.toLocaleString('en-CA', {
        style: 'currency',
        currency: 'CAD',
      });
    };

    // 영어 템플릿: "Total Amount:", "Deposit Received:", "Remaining Balance:" 형식
    updatedContent = updatedContent
      .replace(
        /Total Amount: \$[\d,.]+/g,
        `Total Amount: ${formatCAD(totalAmount || '0')}`
      )
      .replace(
        /Deposit Received: \$[\d,.]+/g,
        `Deposit Received: ${formatCAD(depositAmount || '0')}`
      )
      .replace(
        /Remaining Balance: \$[\d,.]+/g,
        `Remaining Balance: ${formatCAD(remainingAmount || '0')}`
      );

    return updatedContent;
  }

  // CANCELLED 템플릿 업데이트
  if (templateType === 'CANCELLED') {
    // 환불 금액 업데이트
    const refundAmountValue = parseFloat(refundAmount || '0') || 0;

    // 금액 포맷팅 함수
    const formatCAD = (amount: number): string => {
      return amount.toLocaleString('en-CA', {
        style: 'currency',
        currency: 'CAD',
      });
    };

    if (refundAmountValue > 0) {
      // 관리자 취소: "we will provide a full refund of your deposit of **$X**" 형식
      updatedContent = updatedContent.replace(
        /full refund of your deposit of \*\*\$[\d,]+(?:\.[\d]{2})?\*\*/g,
        `full refund of your deposit of **${formatCAD(refundAmountValue)}**`
      );

      // 고객 취소: "Your refund of **$X** will be processed..." 형식
      updatedContent = updatedContent.replace(
        /Your refund of \*\*\$[\d,]+(?:\.[\d]{2})?\*\* will be processed/g,
        `Your refund of **${formatCAD(refundAmountValue)}** will be processed`
      );

      // 환불 불가 메시지가 있으면 제거
      updatedContent = updatedContent.replace(
        /According to our refund policy, this reservation is not eligible for a refund\./g,
        ''
      );
    } else {
      // 환불 금액이 0일 때: "According to our refund policy..." 형식으로 변경
      // 기존 환불 금액 문구를 제거하고 환불 불가 메시지로 교체
      updatedContent = updatedContent.replace(
        /Your refund of \*\*\$[\d,]+(?:\.[\d]{2})?\*\*[\s\S]*?business days\./g,
        'According to our refund policy, this reservation is not eligible for a refund.'
      );

      // 관리자 취소 환불 문구도 제거 (환불 금액이 0이면 관리자 취소가 아님)
      updatedContent = updatedContent.replace(
        /full refund of your deposit of \*\*\$[\d,]+(?:\.[\d]{2})?\*\*[\s\S]*?business days\./g,
        'According to our refund policy, this reservation is not eligible for a refund.'
      );
    }

    return updatedContent;
  }

  // 시간 업데이트 (AM/PM 형식)
  const 시간 = formatTime(reservationTime || '19:00');

  // 영어 템플릿: "Reservation Date: ..." 형식
  updatedContent = updatedContent.replace(
    /Reservation Date: .+? \(.*?\) \d+:\d+ (AM|PM)/g,
    (match) => {
      const dateAndDay =
        match.match(/Reservation Date: (.+? \(.*?\))/)?.[1] || '';
      return `Reservation Date: ${dateAndDay} ${시간}`;
    }
  );

  // 금액 포맷팅 함수 (캐나다 달러 형식)
  const formatCAD = (amount: string | number | undefined): string => {
    const num =
      typeof amount === 'string'
        ? parseFloat(amount.replace(/[^0-9.]/g, '')) || 0
        : typeof amount === 'number'
        ? amount
        : 0;
    return num.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });
  };

  // 각 금액 항목을 정규식으로 찾아서 업데이트 (캐나다 달러 형식 지원)
  // formatCAD는 "$1,195.00" 형식을 생성 (CAD는 포함되지 않음)
  // 영어 템플릿만 지원
  // 오마카세 코스 (인원 × 가격) 형식도 지원
  // 출장비는 추가 셰프비 처리 전에 업데이트 (줄 단위로 정확히 매칭)

  // 영어 템플릿: "Omakase Course (X guests × $Y): $Z" 형식
  updatedContent = updatedContent.replace(
    /Omakase Course \([\d\s]+guests? × [^)]+\): \$[\d,.]+/g,
    (match) => {
      // 인원 수와 메뉴 가격 정보 추출
      const guestMatch = match.match(/(\d+)\s+guests?/);
      const menuMatch = match.match(/×\s+([^)]+)\)/);
      if (guestMatch && menuMatch) {
        return `Omakase Course (${guestMatch[1]} guests × ${
          menuMatch[1]
        }): ${formatCAD(courseAmount || '0')}`;
      }
      return `Omakase Course: ${formatCAD(courseAmount || '0')}`;
    }
  );

  // 출장비는 항상 표시 (Travel Fee: $X 형식)
  // formatCAD는 "$1,195.00" 형식을 반환하므로 정확히 매칭
  updatedContent = updatedContent.replace(
    /^Travel Fee: \$[\d,]+(?:\.[\d]{2})?\s*$/gm,
    `Travel Fee: ${formatCAD(travelFee || '0')}`
  );

  // 추가 셰프비 처리 (값이 있을 때만 표시)
  const extraChefFeeNum = parseFloat(extraChefFee || '0') || 0;
  if (extraChefFeeNum > 0) {
    // Extra Chef Fee 줄이 이미 있으면 업데이트
    if (updatedContent.includes('Extra Chef Fee:')) {
      updatedContent = updatedContent.replace(
        /^Extra Chef Fee: \$[\d,]+(?:\.[\d]{2})?\s*$/gm,
        `Extra Chef Fee: ${formatCAD(extraChefFee)}`
      );
    } else {
      // Extra Chef Fee 줄이 없으면 Travel Fee 다음 줄에 추가
      updatedContent = updatedContent.replace(
        /^(Travel Fee: \$[\d,]+(?:\.[\d]{2})?\s*)$/gm,
        `$1\nExtra Chef Fee: ${formatCAD(extraChefFee)}`
      );
    }
  } else {
    // 추가 셰프비가 0이거나 없으면 해당 줄 제거
    updatedContent = updatedContent.replace(/^Extra Chef Fee: .+$\n?/gm, '');
  }

  // 영어 템플릿: "Total: $X" 형식
  updatedContent = updatedContent.replace(
    /^Total: \$[\d,.]+$/gm,
    `Total: ${formatCAD(totalAmount || '0')}`
  );

  // 디파짓 업데이트 (**$금액** 형식)
  updatedContent = updatedContent.replace(
    /\*\*\$[\d,.]+\*\*/g,
    `**${formatCAD(depositAmount || '0')}**`
  );

  return updatedContent;
}
