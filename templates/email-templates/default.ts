import type { EmailTemplate, EmailTemplateData } from '@/types/email-templates';
import { parseBookingDate } from '@/utils/email-utils';

export function createDefaultTemplate(data: EmailTemplateData): EmailTemplate {
  const { booking } = data;

  const bookingDate = parseBookingDate(booking.booking_date);
  const formattedDate = bookingDate.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subject = `Reservation for ${booking.customer_name} – ${formattedDate}`;
  const content = '';

  return { subject, content };
}
