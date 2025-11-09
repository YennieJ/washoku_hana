import type { Booking } from '@/lib/supabase';
import StatusBadge from './status-badge';
import { useRouter } from 'next/navigation';

interface BookingTableProps {
  bookings: Booking[];
  onRowClick: (booking: Booking) => void;
  formatDate: (dateString: string) => string;
}

export default function BookingTable({
  bookings,
  onRowClick,
  formatDate,
}: BookingTableProps) {
  const router = useRouter();
  return (
    <table className="w-full table-fixed">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 w-32">
            예약 번호
          </th>
          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 w-24">
            고객명
          </th>
          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 w-36">
            이메일
          </th>
          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 w-28">
            메뉴
          </th>
          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 w-16">
            인원
          </th>
          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 w-24">
            상태
          </th>
          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 w-32">
            예약 일자
          </th>
          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 w-16">
            액션
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {bookings.map((booking) => {
          const isUnread = !booking.is_read;
          const textStyle = isUnread ? 'font-bold' : 'font-normal';

          return (
            <tr
              key={booking.id}
              className={`cursor-pointer transition-colors ${
                booking.is_read
                  ? 'hover:bg-gray-50'
                  : 'bg-blue-50/50 hover:bg-blue-100/50'
              }`}
              onClick={() => onRowClick(booking)}
            >
              <td className="px-3 py-3">
                <span className={`text-xs text-gray-900 ${textStyle}`}>
                  {booking.booking_number}
                </span>
              </td>
              <td className="px-3 py-3">
                <span className={`text-xs text-gray-900 ${textStyle}`}>
                  {booking.customer_name}
                </span>
              </td>
              <td className="px-3 py-3">
                <span
                  className={`text-xs text-gray-500 truncate block ${textStyle}`}
                  title={booking.customer_email}
                >
                  {booking.customer_email}
                </span>
              </td>
              <td className="px-3 py-3">
                <span
                  className={`text-xs text-gray-900 truncate block ${textStyle}`}
                  title={booking.menu}
                >
                  {booking.menu}
                </span>
              </td>
              <td className="px-3 py-3">
                <span className={`text-xs text-gray-900 ${textStyle}`}>
                  {booking.guest_count}명
                </span>
              </td>
              <td className="px-3 py-3">
                <StatusBadge status={booking.status} />
              </td>
              <td className="px-3 py-3">
                <div className={`text-xs text-gray-900 ${textStyle}`}>
                  {formatDate(booking.booking_date)}
                </div>
              </td>
              <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => {
                    router.push(`/admin/bookings/${booking.id}/send-email`);
                  }}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  title="메일 보내기"
                >
                  <span>📨</span>
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
