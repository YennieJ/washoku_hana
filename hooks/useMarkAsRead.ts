// 사용처: /app/admin/dashboard/page.tsx
// 용도: 관리자가 예약 클릭 시 읽음 상태로 변경
// API: /api/admin/bookings/[id] (PATCH)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Booking } from '@/lib/supabase';

interface MarkAsReadResponse {
  data: Booking;
  message: string;
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation<MarkAsReadResponse, Error, string>({
    mutationFn: async (bookingId: string) => {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to mark as read.');
      }

      return response.json();
    },
    onSuccess: () => {
      // bookings 쿼리 무효화 (읽음 상태 즉시 반영)
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
