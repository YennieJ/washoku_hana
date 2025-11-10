import {
  type ReservationStatus,
  getStatusColors,
  getStatusLabel,
} from '@/constants/reservation-statuses';

interface StatusBadgeProps {
  status: ReservationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { bgColor, textColor } = getStatusColors(status);
  const label = getStatusLabel(status);
  const mobileLabel = label.replace('예약 ', '');

  return (
    <span
      className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor} whitespace-nowrap`}
    >
      <span className="hidden lg:inline">{label}</span>
      <span className="lg:hidden">{mobileLabel}</span>
    </span>
  );
}
