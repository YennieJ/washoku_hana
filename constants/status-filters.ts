import { type ReservationStatus, RESERVATION_STATUSES } from './reservation-statuses';

// 상태 필터 타입 정의 (전체 + 각 상태)
export type StatusFilterType = 'all' | ReservationStatus;

// 상태 필터 옵션
export interface StatusFilterOption {
  value: StatusFilterType;
  label: string;
}

// 상태 필터 옵션 생성 (전체 + 각 상태)
export const STATUS_FILTERS: StatusFilterOption[] = [
  { value: 'all', label: '전체' },
  ...RESERVATION_STATUSES.map((status) => ({
    value: status.value,
    label: status.label,
  })),
];

// 기본 상태 필터
export const DEFAULT_STATUS_FILTER: StatusFilterType = 'all';

