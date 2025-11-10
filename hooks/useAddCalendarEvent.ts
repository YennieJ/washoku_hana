// 사용처: /app/admin/bookings/[id]/send-email/page.tsx
// 용도: 예약 확정 시 Google Calendar에 이벤트 추가
// API: /api/calendar/events
import { useMutation } from '@tanstack/react-query';

interface AddCalendarEventRequest {
  bookingId: string;
}

interface AddCalendarEventResponse {
  success: boolean;
  message: string;
  data?: {
    success: boolean;
    eventId: string;
    eventLink: string;
  };
}

export function useAddCalendarEvent() {
  return useMutation<AddCalendarEventResponse, Error, AddCalendarEventRequest>({
    mutationFn: async ({ bookingId }: AddCalendarEventRequest) => {
      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || '캘린더 이벤트 추가에 실패했습니다.'
        );
      }

      return response.json();
    },
  });
}
