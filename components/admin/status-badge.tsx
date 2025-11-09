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

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}
    >
      {label}
    </span>
  );
}
