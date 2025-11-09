// 사용처: /components/admin/booking-detail-modal.tsx
// 용도: 예약 상세 모달에서 관리자 메모 저장
// API: /api/admin/bookings/[id] (PATCH)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Booking } from '@/lib/supabase';

interface SaveAdminMemoRequest {
  bookingId: string;
  adminMemo: string;
}

interface SaveAdminMemoResponse {
  data: Booking;
  message: string;
}

export function useSaveAdminMemo() {
  const queryClient = useQueryClient();

  return useMutation<SaveAdminMemoResponse, Error, SaveAdminMemoRequest>({
    mutationFn: async ({ bookingId, adminMemo }: SaveAdminMemoRequest) => {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admin_memo: adminMemo }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save admin memo.');
      }

      return response.json();
    },
    onSuccess: () => {
      // bookings 쿼리 무효화 (메모 즉시 반영)
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
