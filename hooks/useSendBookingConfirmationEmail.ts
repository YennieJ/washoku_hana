// 사용처: /components/reservation/booking-form.tsx
// 용도: 고객 예약 요청 시 고정 템플릿으로 자동 생성되는 "예약 요청 완료" 확인 이메일 전송
// API: /api/email/customer-booking-confirmation (formData를 템플릿에 자동 삽입)
import { useMutation } from '@tanstack/react-query';

interface SendBookingConfirmationEmailRequest {
  formData: {
    name: string;
    email: string;
    phone: string;
    guestCount: string;
    menu: string;
    address: string;
    foodAllergy: string;
    requests: string;
  };
  selectedDate: string;
  selectedDayName: string;
  bookingNumber: string;
}

interface SendBookingConfirmationEmailResponse {
  success: boolean;
  message: string;
  data: any;
}

export function useSendBookingConfirmationEmail() {
  return useMutation<
    SendBookingConfirmationEmailResponse,
    Error,
    SendBookingConfirmationEmailRequest
  >({
    mutationFn: async (request: SendBookingConfirmationEmailRequest) => {
      const response = await fetch('/api/email/customer-booking-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '고객 이메일 전송에 실패했습니다.');
      }

      return response.json();
    },
  });
}
