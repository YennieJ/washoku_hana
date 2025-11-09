// 사용처: /app/admin/bookings/[id]/send-email/page.tsx
// 용도: 예약 정보 업데이트 (금액, 상태 등) - 예약금 안내 발송 시 사용
// API: /api/admin/bookings/[id] (PATCH)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Booking } from '@/lib/supabase';

interface UpdateBookingRequest {
  bookingId: string;
  status?: string;
  travel_cost?: number | null;
  deposit_amount?: number | null;
  total_amount?: number | null;
  refund_amount?: number | null;
  chef_additional_cost?: number | null;
  admin_memo?: string;
  is_read?: boolean;
  booking_date?: string;
}

interface UpdateBookingResponse {
  data: Booking;
  message: string;
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation<UpdateBookingResponse, Error, UpdateBookingRequest>({
    mutationFn: async (updateData: UpdateBookingRequest) => {
      const { bookingId, ...body } = updateData;

      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update booking.');
      }

      return response.json();
    },
    onSuccess: () => {
      // bookings 쿼리 무효화 (업데이트 즉시 반영)
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
