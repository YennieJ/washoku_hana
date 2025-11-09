import {
  STATUS_FILTERS,
  type StatusFilterType,
} from '@/constants/status-filters';
import {
  type ReservationStatus,
  getStatusColors,
} from '@/constants/reservation-statuses';

interface StatusFilterProps {
  statusFilter: StatusFilterType;
  setStatusFilter: (statusFilter: StatusFilterType) => void;
}

export default function StatusFilter({
  statusFilter,
  setStatusFilter,
}: StatusFilterProps) {
  return (
    <div className="flex items-center gap-1 ml-2">
      {STATUS_FILTERS.map((filter) => {
        const isSelected = statusFilter === filter.value;

        // 상태별 색상 가져오기 (전체는 기본 색상)
        const colors =
          filter.value === 'all'
            ? { bgColor: '', textColor: '' }
            : getStatusColors(filter.value as ReservationStatus);

        return (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`px-3 py-1.5 rounded-md text-xs border transition-colors ${
              isSelected
                ? filter.value === 'all'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : `${colors.bgColor} ${colors.textColor} border-current font-semibold`
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
