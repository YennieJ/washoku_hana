import type { EmailTemplate, EmailTemplateData } from '@/types/email-templates';

export function createDefaultTemplate(data: EmailTemplateData): EmailTemplate {
  const { booking } = data;

  const bookingDate = new Date(booking.booking_date);
  const formattedDate = bookingDate.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subject = `Reservation for ${booking.customer_name} – ${formattedDate}`;
  const content = '';

  return { subject, content };
}
