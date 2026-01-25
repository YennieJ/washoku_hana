import type { Booking } from '@/lib/supabase';
import { ADMIN_EMAIL } from '@/constants/email';

/**
 * 날짜 문자열을 안전하게 Date 객체로 변환
 * YYYY-MM-DD 형식은 UTC로 해석되는 문제를 방지하기 위해 시간을 추가
 * @param dateString - 날짜 문자열 (YYYY-MM-DD 또는 YYYY-MM-DDTHH:mm:ss)
 * @returns Date 객체
 */
export function parseBookingDate(dateString: string): Date {
  // 날짜만 있는 경우 (YYYY-MM-DD), 로컬 시간 정오로 설정하여 타임존 문제 방지
  if (dateString && !dateString.includes('T')) {
    return new Date(`${dateString}T12:00:00`);
  }
  return new Date(dateString);
}

// 이메일 템플릿 공통 서명
export function getEmailSignature(): string {
  return `Warm regards,

Contact Email: ${ADMIN_EMAIL}
Chef Minho
Washoku Hana – Private Omakase Experience`;
}

// 시간을 12시간 형식으로 변환 (19:00 -> 7:00 PM)
export function formatTime(time: string): string {
  if (!time) return '7:00 PM';

  const [hours, minutes] = time.split(':').map(Number);
  const period = hours < 12 ? 'AM' : 'PM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;

  return minutes > 0
    ? `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
    : `${displayHours}:00 ${period}`;
}

// 예약 정보 섹션을 포맷팅 (custom 템플릿을 제외한 모든 템플릿에서 사용)
export function formatBookingInfoSection(
  booking: Booking,
  reservationTime?: string,
  reservationDate?: string
): string {
  // 날짜가 전달되면 사용, 아니면 booking.booking_date 사용
  const bookingDate = parseBookingDate(reservationDate || booking.booking_date);
  const formattedDate = bookingDate.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const dayName = bookingDate.toLocaleDateString('en-CA', {
    weekday: 'long',
  });
  const time = formatTime(reservationTime || '19:00');

  return `Booking Information:
Booking Number: ${booking.booking_number}
Reservation Date: ${formattedDate} (${dayName}) ${time}
Menu: ${booking.menu}
Number of Guests: ${booking.guest_count}
Contact: ${booking.customer_phone}
Service Address: ${booking.address}
Food Allergies: ${booking.food_allergy || 'None'}
Special Requests: ${booking.special_requests || 'None'}`;
}
