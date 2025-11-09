'use client';
import { useState, useEffect } from 'react';
import { useBookings } from '@/hooks/useBookings';
import { useMarkAsRead } from '@/hooks/useMarkAsRead';
import type { Booking } from '@/lib/supabase';
import { type PeriodType, DEFAULT_PERIOD } from '@/constants/period-filters';
import { type ReadType, DEFAULT_READ_FILTER } from '@/constants/read-filters';
import {
  type StatusFilterType,
  DEFAULT_STATUS_FILTER,
} from '@/constants/status-filters';
import { type ReservationStatus } from '@/constants/reservation-statuses';
import PeriodFilter from '@/components/admin/period-filter';
import ReadFilter from '@/components/admin/read-filter';
import StatusFilter from '@/components/admin/status-filter';
import SearchInput from '@/components/admin/search-input';
import BookingTable from '@/components/admin/booking-table';
import BookingDetailModal from '@/components/admin/booking-detail-modal';

export default function AdminDashboard() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [readFilter, setReadFilter] = useState<ReadType>(DEFAULT_READ_FILTER);
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>(
    DEFAULT_STATUS_FILTER
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const markAsReadMutation = useMarkAsRead();

  // 검색어 debounce (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 기간 필터
  const [period, setPeriod] = useState<PeriodType>(DEFAULT_PERIOD);
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [periodSearchActive, setPeriodSearchActive] = useState<boolean>(true); // 초기 로드 시 기본 데이터 표시

  // React Query로 예약 데이터 가져오기
  const {
    data: bookings = [],
    isLoading: loading,
    error,
  } = useBookings({
    period,
    customStartDate,
    customEndDate,
    periodSearchActive,
    debouncedSearch,
  });

  // 상태별 카운트 계산
  const statusCounts = bookings.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {} as Record<ReservationStatus, number>);

  // 클라이언트 사이드 필터링: 읽음/안읽음 + 상태 필터 (검색/기간은 API에서 처리됨)
  const filteredBookings = bookings.filter((booking) => {
    // 읽음 필터 체크
    const readMatch =
      readFilter === 'all' ||
      (readFilter === 'read' && booking.is_read) ||
      (readFilter === 'unread' && !booking.is_read);

    // 상태 필터 체크
    const statusMatch =
      statusFilter === 'all' || booking.status === statusFilter;

    return readMatch && statusMatch;
  });

  const totalCount = bookings.length;
  const unreadCount = bookings.filter((b) => !b.is_read).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRowClick = (booking: Booking) => {
    // 읽지 않은 예약이면 읽음 처리
    if (!booking.is_read) {
      markAsReadMutation.mutate(booking.id);
    }
    // 모달 오픈
    setSelectedBooking(booking);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Washoku Hana - 예약 관리
          </h1>

          {/* 필터 영역 (컴팩트) */}
          <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* 왼쪽: 기간 + 읽음 상태 + 상태 필터 */}
            <div className="flex items-center gap-3 flex-wrap">
              <PeriodFilter
                period={period}
                setPeriod={setPeriod}
                customStartDate={customStartDate}
                setCustomStartDate={setCustomStartDate}
                customEndDate={customEndDate}
                setCustomEndDate={setCustomEndDate}
                periodSearchActive={periodSearchActive}
                setPeriodSearchActive={setPeriodSearchActive}
              />

              {/* 읽음 상태 */}
              <ReadFilter
                readFilter={readFilter}
                setReadFilter={setReadFilter}
                totalCount={totalCount}
                unreadCount={unreadCount}
              />

              {/* 상태 필터 */}
              <StatusFilter
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
            </div>

            {/* 오른쪽: 검색 */}
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>
      </div>

      {/* Main Content - Table */}
      <main className="flex-1 min-h-0 overflow-y-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px]">
          {error ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="text-center">
                <p className="text-red-600 mb-2">
                  ⚠️ 데이터를 불러오는 중 오류가 발생했습니다.
                </p>
                <p className="text-gray-500 text-sm">
                  {(error as Error).message}
                </p>
              </div>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">데이터 로딩 중...</p>
              </div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex items-center justify-center h-[600px]">
              <p className="text-gray-500">예약 데이터가 없습니다.</p>
            </div>
          ) : (
            <BookingTable
              bookings={filteredBookings}
              onRowClick={handleRowClick}
              formatDate={formatDate}
            />
          )}
        </div>
      </main>

      {/* 상세 모달 */}
      {selectedBooking && (
        <BookingDetailModal
          selectedBooking={selectedBooking}
          setSelectedBooking={setSelectedBooking}
        />
      )}
    </div>
  );
}
