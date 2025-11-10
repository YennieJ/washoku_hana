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

  // 모바일용 짧은 날짜 포맷 (12/25)
  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-semibold text-gray-600 hidden md:table-cell">
              예약번호
            </th>
            <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-semibold text-gray-600">
              고객명
            </th>
            <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-semibold text-gray-600 hidden lg:table-cell">
              이메일
            </th>
            <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-semibold text-gray-600 hidden lg:table-cell">
              메뉴
            </th>
            <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-semibold text-gray-600 hidden md:table-cell">
              인원
            </th>
            <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-semibold text-gray-600">
              상태
            </th>
            <th className="px-2 lg:px-3 py-2 lg:py-3 text-left text-xs font-semibold text-gray-600">
              <span className="hidden md:inline">예약일자</span>
              <span className="md:hidden">날짜</span>
            </th>
            <th className="px-2 lg:px-3 py-2 lg:py-3 text-center text-xs font-semibold text-gray-600">
              <span className="hidden md:inline">액션</span>
              <span className="md:hidden">📨</span>
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
                {/* 예약번호 - 태블릿 이상에서만 */}
                <td className="px-2 lg:px-3 py-2 lg:py-3 hidden md:table-cell">
                  <span className={`text-xs text-gray-900 ${textStyle}`}>
                    {booking.booking_number}
                  </span>
                </td>

                {/* 고객명 - 항상 표시 */}
                <td className="px-2 lg:px-3 py-2 lg:py-3">
                  <div className="flex flex-col gap-1">
                    <span className={`text-xs text-gray-900 ${textStyle}`}>
                      {booking.customer_name}
                    </span>
                    {/* 모바일에서는 예약번호를 고객명 아래에 작게 표시 */}
                    <span className="text-[10px] text-gray-500 md:hidden">
                      {booking.booking_number}
                    </span>
                  </div>
                </td>

                {/* 이메일 - 데스크톱만 */}
                <td className="px-2 lg:px-3 py-2 lg:py-3 hidden lg:table-cell">
                  <span
                    className={`text-xs text-gray-500 truncate block ${textStyle}`}
                    title={booking.customer_email}
                  >
                    {booking.customer_email}
                  </span>
                </td>

                {/* 메뉴 - 데스크톱만 */}
                <td className="px-2 lg:px-3 py-2 lg:py-3 hidden lg:table-cell">
                  <span
                    className={`text-xs text-gray-900 truncate block ${textStyle}`}
                    title={booking.menu}
                  >
                    {booking.menu}
                  </span>
                </td>

                {/* 인원 - 태블릿 이상 */}
                <td className="px-2 lg:px-3 py-2 lg:py-3 hidden md:table-cell">
                  <span className={`text-xs text-gray-900 ${textStyle}`}>
                    {booking.guest_count}명
                  </span>
                </td>

                {/* 상태 - 항상 표시 */}
                <td className="px-2 lg:px-3 py-2 lg:py-3">
                  <StatusBadge status={booking.status} />
                </td>

                {/* 예약일자 - 항상 표시 */}
                <td className="px-2 lg:px-3 py-2 lg:py-3">
                  <div className={`text-xs text-gray-900 ${textStyle}`}>
                    <span className="hidden md:inline">{formatDate(booking.booking_date)}</span>
                    <span className="md:hidden">{formatDateShort(booking.booking_date)}</span>
                  </div>
                </td>

                {/* 액션 - 항상 표시 */}
                <td className="px-2 lg:px-3 py-2 lg:py-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      router.push(`/admin/bookings/${booking.id}/send-email`);
                    }}
                    className="inline-flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
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
    </div>
  );
}
