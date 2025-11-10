// 사용처: /app/admin/bookings/[id]/send-email/page.tsx
// 용도: 예약 취소 시 Google Calendar에서 이벤트 삭제
// API: /api/calendar/events/[bookingId]
import { useMutation } from '@tanstack/react-query';

interface DeleteCalendarEventRequest {
  bookingId: string;
}

interface DeleteCalendarEventResponse {
  success: boolean;
  message: string;
}

export function useDeleteCalendarEvent() {
  return useMutation<
    DeleteCalendarEventResponse,
    Error,
    DeleteCalendarEventRequest
  >({
    mutationFn: async ({ bookingId }: DeleteCalendarEventRequest) => {
      const response = await fetch(`/api/calendar/events/${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || '캘린더 이벤트 삭제에 실패했습니다.'
        );
      }

      return response.json();
    },
  });
}
