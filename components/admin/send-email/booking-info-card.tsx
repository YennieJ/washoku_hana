import type { Booking } from '@/lib/supabase';

interface BookingInfoCardProps {
  booking: Booking;
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
}

export default function BookingInfoCard({
  booking,
  formatDate,
  formatTime,
}: BookingInfoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">예약 정보</h2>
      <div className="space-y-4 text-gray-900 text-sm">
        <div className="space-y-2">
          <p>
            <strong>예약 번호:</strong> {booking.booking_number}
          </p>
          <p>
            <strong>이름:</strong> {booking.customer_name}
          </p>
          <p>
            <strong>이메일:</strong> {booking.customer_email}
          </p>
          <p>
            <strong>전화번호:</strong> {booking.customer_phone}
          </p>
        </div>

        <hr className="border-gray-200" />

        <div className="space-y-2">
          <p>
            <strong>예약 일시:</strong> {formatDate(booking.booking_date)}{' '}
            {formatTime(booking.booking_date)}
          </p>
          <p>
            <strong>인원:</strong> {booking.guest_count}명
          </p>
          <p>
            <strong>메뉴:</strong> {booking.menu}
          </p>
          <p>
            <strong>주소:</strong> {booking.address}
          </p>
        </div>

        {(booking.food_allergy || booking.special_requests) && (
          <>
            <hr className="border-gray-200" />
            <div className="space-y-2">
              {booking.food_allergy && booking.food_allergy !== '없음' && (
                <p>
                  <strong>알레르기:</strong> {booking.food_allergy}
                </p>
              )}
              {booking.special_requests && (
                <p>
                  <strong>특별 요청:</strong> {booking.special_requests}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
