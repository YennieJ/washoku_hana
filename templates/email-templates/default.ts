import type { EmailTemplate, EmailTemplateData } from '@/types/email-templates';

export function createDefaultTemplate(data: EmailTemplateData): EmailTemplate {
  const { booking } = data;

  const bookingDate = new Date(booking.booking_date);
  const formattedDate = bookingDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subject = `${booking.customer_name}님 예약 - ${formattedDate}`;
  const content = '';

  return { subject, content };
}
