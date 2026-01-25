// 기간 필터 타입 정의
export type PeriodType =
  | 'year' // 이번 연도 (기본값)
  | 'prev' // 지난달
  | 'current' // 이번달
  | 'next' // 다음달
  | 'custom'; // 커스텀 날짜 설정

// 기간 필터 옵션
export interface PeriodFilterOption {
  value: PeriodType;
  label: string;
}

export const PERIOD_FILTERS: PeriodFilterOption[] = [
  { value: 'year', label: '이번 연도' },
  { value: 'prev', label: '지난달' },
  { value: 'current', label: '이번달' },
  { value: 'next', label: '다음달' },
  { value: 'custom', label: '날짜 설정' },
];

// 기본 기간 필터
export const DEFAULT_PERIOD: PeriodType = 'year';

// 기간 필터 레이블 가져오기
export function getPeriodFilterLabel(
  period: PeriodType,
  customDateRange?: { startDate: string; endDate: string }
): string {
  if (period === 'custom' && customDateRange) {
    const formatDateShort = (dateString: string) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    };
    return `${formatDateShort(customDateRange.startDate)} ~ ${formatDateShort(
      customDateRange.endDate
    )}`;
  }

  const option = PERIOD_FILTERS.find((opt) => opt.value === period);
  return option?.label || '기간 선택';
}
