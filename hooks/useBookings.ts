// 사용처: /app/admin/dashboard/page.tsx
// 용도: 관리자 대시보드에서 예약 목록 조회 (기간 필터, 검색 기능 포함)
// API: /api/admin/bookings (GET)
import { useQuery } from '@tanstack/react-query';
import { Booking } from '@/lib/supabase';
import { type PeriodType } from '@/constants/period-filters';

interface BookingsFilters {
  period: PeriodType;
  customStartDate?: string;
  customEndDate?: string;
  periodSearchActive?: boolean;
  debouncedSearch?: string;
}

async function fetchBookings(filters: BookingsFilters): Promise<Booking[]> {
  // API 쿼리 파라미터 구성
  const params = new URLSearchParams();

  // 검색어
  if (filters.debouncedSearch?.trim()) {
    params.append('search', filters.debouncedSearch.trim());
  }

  // 기간 필터 - periodSearchActive가 true일 때만 적용
  if (filters.periodSearchActive) {
    if (filters.period === 'custom') {
      // 커스텀 기간
      if (filters.customStartDate && filters.customEndDate) {
        params.append('startDate', filters.customStartDate);
        params.append('endDate', filters.customEndDate);
      }
    } else if (filters.period !== 'default') {
      // API와 동일한 값 사용 (current, prev, next)
      params.append('period', filters.period);
    }
  }

  const queryString = params.toString();
  const url = queryString
    ? `/api/admin/bookings?${queryString}`
    : '/api/admin/bookings';

  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Failed to fetch bookings: ${res.status}`);
  }

  const json = await res.json();

  return json.data || [];
}

export function useBookings(filters: BookingsFilters) {
  // periodSearchActive가 true일 때만 쿼리 실행
  // - 다른 기간 버튼: period 변경 시 periodSearchActive가 바로 true가 되어 자동 조회
  // - custom 기간: 기간 검색 버튼을 눌러야 periodSearchActive가 true가 되어 조회
  const enabled = filters.periodSearchActive === true;

  // queryKey: periodSearchActive가 true일 때만 period와 날짜 포함
  // period가 변경되거나 (custom이 아닌 경우) 기간 검색 버튼을 누르면 쿼리 키가 변경되어 자동 조회
  const queryKey = [
    'bookings',
    filters.periodSearchActive ? filters.period : 'none',
    filters.periodSearchActive && filters.period === 'custom'
      ? `${filters.customStartDate || ''}-${filters.customEndDate || ''}`
      : 'none',
    filters.periodSearchActive,
    filters.debouncedSearch || '',
  ];

  return useQuery({
    queryKey,
    queryFn: () => fetchBookings(filters),
    enabled,
    staleTime: 30 * 1000, // 30초간 fresh (예약 데이터는 실시간성 중요)
  });
}
