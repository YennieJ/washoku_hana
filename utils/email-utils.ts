import type { Booking } from '@/lib/supabase';

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
  const bookingDate = new Date(reservationDate || booking.booking_date);
  const formattedDate = bookingDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const dayName = bookingDate.toLocaleDateString('ko-KR', {
    weekday: 'long',
  });
  const 시간 = formatTime(reservationTime || '19:00');

  return `예약 정보:
예약 번호: ${booking.booking_number}
예약 날짜: ${formattedDate} (${dayName}) ${시간}
메뉴: ${booking.menu}
게스트 수: ${booking.guest_count}명
연락처: ${booking.customer_phone}
서비스 주소: ${booking.address}
식품 알레르기: ${booking.food_allergy}
특별 요청: ${booking.special_requests}`;
}
