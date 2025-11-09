// 사용처: /app/admin/bookings/[id]/send-email/page.tsx
// 용도: 관리자가 직접 작성한 커스텀 이메일을 고객에게 전송
// API: /api/email/send-customer (제목, 내용을 직접 전달)
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface SendEmailRequest {
  bookingId: string;
  subject: string;
  htmlContent: string;
  to: string;
}

interface SendEmailResponse {
  success: boolean;
  message: string;
  data?: any;
}

export function useSendEmail() {
  const queryClient = useQueryClient();

  return useMutation<SendEmailResponse, Error, SendEmailRequest>({
    mutationFn: async ({
      bookingId,
      subject,
      htmlContent,
      to,
    }: SendEmailRequest) => {
      const response = await fetch('/api/email/send-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          subject,
          htmlContent,
          to,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '이메일 전송에 실패했습니다.');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // 예약 조회 쿼리 무효화 (읽음 상태 업데이트 등)
      queryClient.invalidateQueries({
        queryKey: ['booking', variables.bookingId],
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
