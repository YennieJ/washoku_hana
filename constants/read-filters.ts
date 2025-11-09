// 읽음 상태 필터 타입 정의
export type ReadType = 'all' | 'read' | 'unread';

// 읽음 상태 필터 옵션
export interface ReadFilterOption {
  value: ReadType;
  label: string;
}

export const READ_FILTERS: ReadFilterOption[] = [
  { value: 'all', label: '전체' },
  { value: 'unread', label: '안읽음' },
  { value: 'read', label: '읽음' },
];

// 기본 읽음 필터
export const DEFAULT_READ_FILTER: ReadType = 'all';
