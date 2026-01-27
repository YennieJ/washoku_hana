import { READ_FILTERS } from '@/constants/read-filters';
import { type ReadType } from '@/constants/read-filters';

interface ReadFilterProps {
  readFilter: ReadType;
  setReadFilter: (readFilter: ReadType) => void;
  totalCount: number;
  unreadCount: number;
}

export default function ReadFilter({
  readFilter,
  setReadFilter,
  totalCount,
  unreadCount,
}: ReadFilterProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-1 w-full lg:w-auto">
      <div className="flex items-center gap-1 flex-wrap">
        {READ_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setReadFilter(filter.value)}
            className={`px-2 lg:px-3 py-1.5 rounded-md text-xs border ${
              readFilter === filter.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-200'
            }`}
          >
            {filter.label}
            {filter.value === 'all' && ` (${totalCount})`}
            {filter.value === 'unread' && unreadCount > 0 && (
              <span className="ml-1 text-[10px] text-red-600">
                ({unreadCount})
              </span>
            )}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 lg:ml-2">
        안읽은 예약은 기간에 상관 없이 노출됩니다.
      </p>
    </div>
  );
}
