// 사용처: /components/reservation/booking-form.tsx
// 용도: 고객이 새 예약을 생성할 때 사용
// API: /api/bookings (POST) - 일반 서비스용
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface BookingRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  guest_count: number;
  menu: string;
  address: string;
  food_allergy: string;
  special_requests: string | null;
}

interface BookingResponse {
  data: {
    booking_number: string;
    customer_name: string;
    customer_email: string;
  };
  message: string;
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation<BookingResponse, Error, BookingRequest>({
    mutationFn: async (bookingData: BookingRequest) => {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit your booking.');
      }

      return response.json();
    },
    onSuccess: (result) => {
      // sessionStorage에 예약 번호만 저장 (완료 페이지에서 표시용)
      sessionStorage.setItem('bookingNumber', result.data.booking_number);

      // bookings 쿼리 무효화 (대시보드에서 새 예약이 바로 보이도록)
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
