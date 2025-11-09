export type ReservationStatus =
  | 'INQUIRY'
  | 'PENDING_UPDATE'
  | 'AWAITING_DEPOSIT'
  | 'CONFIRMED'
  | 'DECLINED'
  | 'CANCELLED';

export interface ReservationStatusOption {
  value: ReservationStatus;
  label: string;
  bgColor: string; // 배경색
  textColor: string; // 텍스트색
}

export const RESERVATION_STATUSES: ReservationStatusOption[] = [
  {
    value: 'INQUIRY',
    label: '예약 문의',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
  },
  {
    value: 'AWAITING_DEPOSIT',
    label: '예약금 안내',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
  },
  {
    value: 'PENDING_UPDATE',
    label: '예약 조정',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
  },
  {
    value: 'CONFIRMED',
    label: '예약 확정',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
  },
  {
    value: 'DECLINED',
    label: '예약 거절',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
  },
  {
    value: 'CANCELLED',
    label: '예약 취소',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
  },
];

// 상태별 색상 정보 가져오기
export function getStatusColors(status: ReservationStatus) {
  const statusOption = RESERVATION_STATUSES.find((s) => s.value === status);
  return {
    bgColor: statusOption?.bgColor || 'bg-gray-100',
    textColor: statusOption?.textColor || 'text-gray-700',
  };
}

// 상태 레이블 가져오기
export function getStatusLabel(status: ReservationStatus): string {
  const statusOption = RESERVATION_STATUSES.find((s) => s.value === status);
  return statusOption?.label || status;
}
