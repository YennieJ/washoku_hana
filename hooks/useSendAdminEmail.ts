// 사용처: /components/reservation/booking-form.tsx
// 용도: 고객 예약 시 관리자에게 알림 이메일 자동 전송
// API: /api/email/admin-booking-alert
import { useMutation } from '@tanstack/react-query';

interface SendAdminEmailRequest {
  formData: {
    name: string;
    email: string;
    phone: string;
    guestType: string;
    guestCount: string;
    menu: string;
    address: string;
    foodAllergy: string;
    requests: string;
  };
  selectedDate: string;
  selectedDayName: string;
}

interface SendAdminEmailResponse {
  success: boolean;
  message: string;
  data: any;
}

export function useSendAdminEmail() {
  return useMutation<SendAdminEmailResponse, Error, SendAdminEmailRequest>({
    mutationFn: async (request: SendAdminEmailRequest) => {
      const response = await fetch('/api/email/admin-booking-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || '관리자 이메일 전송에 실패했습니다.'
        );
      }

      return response.json();
    },
  });
}
