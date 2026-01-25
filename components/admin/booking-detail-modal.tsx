'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Booking } from '@/lib/supabase';
import { useSaveAdminMemo } from '@/hooks/useSaveAdminMemo';

interface BookingDetailModalProps {
  selectedBooking: Booking;
  setSelectedBooking: (booking: Booking | null) => void;
}

export default function BookingDetailModal({
  selectedBooking,
  setSelectedBooking,
}: BookingDetailModalProps) {
  const router = useRouter();
  const initialMemo = selectedBooking.admin_memo || '';
  const [adminMemo, setAdminMemo] = useState(initialMemo);
  const saveAdminMemoMutation = useSaveAdminMemo();

  // selectedBooking이 변경되거나 admin_memo가 업데이트되면 adminMemo 동기화
  useEffect(() => {
    setAdminMemo(selectedBooking.admin_memo || '');
  }, [selectedBooking.id, selectedBooking.admin_memo]);

  // 변경 사항이 있는지 확인
  const hasChanges = useMemo(() => {
    return adminMemo !== initialMemo;
  }, [adminMemo, initialMemo]);

  const handleSaveMemo = () => {
    saveAdminMemoMutation.mutate(
      {
        bookingId: selectedBooking.id,
        adminMemo: adminMemo,
      },
      {
        onSuccess: () => {
          alert('메모가 저장되었습니다.');
          // 저장 성공 후 초기값 업데이트 (추후 데이터 갱신 시 초기값도 업데이트됨)
        },
        onError: (error) => {
          alert(`메모 저장 실패: ${error.message}`);
        },
      }
    );
  };

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
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setSelectedBooking(null)}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedBooking.booking_number}
          </h2>
          <button
            onClick={() => setSelectedBooking(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 space-y-4 text-gray-900 overflow-y-auto flex-1">
          <div className="space-y-2">
            <p>
              <strong>이름:</strong> {selectedBooking.customer_name}
            </p>
            <p>
              <strong>이메일:</strong> {selectedBooking.customer_email}
            </p>
            <p>
              <strong>전화번호:</strong> {selectedBooking.customer_phone}
            </p>
          </div>

          <hr className="border-gray-200" />

          <div className="space-y-2">
            <p>
              <strong>예약 일시:</strong>{' '}
              {formatDate(selectedBooking.booking_date)}{' '}
              {formatTime(selectedBooking.booking_date)}
            </p>
            <p>
              <strong>인원:</strong> {selectedBooking.guest_count}명
            </p>
            <p>
              <strong>메뉴:</strong> {selectedBooking.menu}
            </p>
            <p>
              <strong>주소:</strong> {selectedBooking.address}
            </p>
          </div>

          {(selectedBooking.food_allergy ||
            selectedBooking.special_requests) && (
            <>
              <hr className="border-gray-200" />
              <div className="space-y-2">
                {selectedBooking.food_allergy && (
                  <p>
                    <strong>알레르기:</strong> {selectedBooking.food_allergy}
                  </p>
                )}
                {selectedBooking.special_requests && (
                  <p>
                    <strong>특별 요청:</strong>{' '}
                    {selectedBooking.special_requests}
                  </p>
                )}
              </div>
            </>
          )}

          {(selectedBooking.travel_cost ||
            selectedBooking.deposit_amount ||
            selectedBooking.total_amount) && (
            <>
              <hr className="border-gray-200" />
              <div className="space-y-2">
                {selectedBooking.travel_cost && (
                  <p>
                    <strong>이동 비용:</strong>{' '}
                    {selectedBooking.travel_cost.toLocaleString()}달러
                  </p>
                )}
                {selectedBooking.deposit_amount && (
                  <p>
                    <strong>예약금:</strong>{' '}
                    {selectedBooking.deposit_amount.toLocaleString()}달러
                  </p>
                )}
                {selectedBooking.total_amount && (
                  <p>
                    <strong>총 금액:</strong>{' '}
                    {selectedBooking.total_amount.toLocaleString()}달러
                  </p>
                )}
              </div>
            </>
          )}

          <hr className="border-gray-200" />
          <div>
            <div className="flex justify-between items-center mb-2">
              <label>
                <strong>관리자 메모:</strong>
              </label>
              <button
                onClick={handleSaveMemo}
                disabled={!hasChanges || saveAdminMemoMutation.isPending}
                className={`py-1.5 px-4 rounded text-sm transition-colors ${
                  !hasChanges || saveAdminMemoMutation.isPending
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {saveAdminMemoMutation.isPending ? '저장 중...' : '메모 저장'}
              </button>
            </div>
            <textarea
              value={adminMemo}
              onChange={(e) => setAdminMemo(e.target.value)}
              placeholder="관리자 메모는 고객한테 노출되지 않습니다."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[100px] text-gray-900"
              rows={4}
            />
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="border-t border-gray-200 px-6 py-4 flex-shrink-0">
          <button
            onClick={() => {
              router.push(`/admin/bookings/${selectedBooking.id}/send-email`);
              setSelectedBooking(null);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            메일 보내기 페이지로
          </button>
        </div>
      </div>
    </div>
  );
}
