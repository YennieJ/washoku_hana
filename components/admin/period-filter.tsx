import { useState } from 'react';

import {
  PERIOD_FILTERS,
  type PeriodType,
  getPeriodFilterLabel,
} from '@/constants/period-filters';

interface PeriodFilterProps {
  period: PeriodType;
  setPeriod: (period: PeriodType) => void;
  customStartDate: string;
  setCustomStartDate: (startDate: string) => void;
  customEndDate: string;
  setCustomEndDate: (endDate: string) => void;
  periodSearchActive: boolean;
  setPeriodSearchActive: (active: boolean) => void;
}

export default function PeriodFilter({
  period,
  setPeriod,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  periodSearchActive,
  setPeriodSearchActive,
}: PeriodFilterProps) {
  const [isPeriodOpen, setIsPeriodOpen] = useState<boolean>(false);
  const [showCustomDateInput, setShowCustomDateInput] =
    useState<boolean>(false);

  // 기간 필터 레이블 가져오기
  const getPeriodLabel = () => {
    // period가 custom일 때만 날짜 표시
    if (period === 'custom' && customStartDate && customEndDate) {
      return getPeriodFilterLabel(period, {
        startDate: customStartDate,
        endDate: customEndDate,
      });
    }
    return getPeriodFilterLabel(period);
  };

  // 기간 선택 핸들러 (default, prev, current, next)
  const handlePeriodChange = (newPeriod: PeriodType) => {
    if (newPeriod === 'custom') {
      // 날짜 설정 버튼: 날짜 입력 필드만 토글
      setShowCustomDateInput(true);
      return;
    }
    // 다른 기간 버튼: 바로 period 변경하고 조회
    setPeriod(newPeriod);
    setPeriodSearchActive(true);
    setShowCustomDateInput(false);
    setIsPeriodOpen(false);
  };

  return (
    <div className="relative">
      <label className="sr-only">기간</label>
      <button
        type="button"
        onClick={() => setIsPeriodOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md text-sm bg-white text-gray-900 hover:bg-gray-50"
      >
        <span className="text-gray-700">기간:</span>
        <span className="font-medium">{getPeriodLabel()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isPeriodOpen ? 'rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isPeriodOpen && (
        <div className="absolute z-10 mt-2 w-[320px] rounded-md border border-gray-200 bg-white shadow-lg p-2">
          <div className="grid grid-cols-2 gap-2">
            {PERIOD_FILTERS.filter((filter) => filter.value !== 'custom').map(
              (filter) => {
                // 날짜 입력 필드가 열렸을 때는 파란색 표시 안 함
                const isSelected =
                  !showCustomDateInput &&
                  period === filter.value &&
                  periodSearchActive;

                return (
                  <button
                    key={filter.value}
                    className={`text-left px-3 py-2 rounded hover:bg-gray-50 text-sm ${
                      isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-800'
                    }`}
                    onClick={() => handlePeriodChange(filter.value)}
                  >
                    {filter.label}
                  </button>
                );
              }
            )}
          </div>

          <div className="mt-2 border-t border-gray-200 pt-2">
            {PERIOD_FILTERS.filter((filter) => filter.value === 'custom').map(
              (filter) => (
                <button
                  key={filter.value}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-sm ${
                    showCustomDateInput || period === 'custom'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-800'
                  }`}
                  onClick={() => handlePeriodChange('custom')}
                >
                  {filter.label}
                </button>
              )
            )}

            {(showCustomDateInput || period === 'custom') && (
              <>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="px-2 py-1.5 border border-gray-200 rounded-md text-sm bg-white text-gray-900 w-[140px]"
                  />
                  <span className="text-gray-500 text-sm">~</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="px-2 py-1.5 border border-gray-200 rounded-md text-sm bg-white text-gray-900 w-[140px]"
                  />
                </div>

                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!customStartDate || !customEndDate) {
                        return;
                      }
                      // 기간 검색 버튼을 눌렀을 때만 period를 custom으로 변경하고 조회
                      setPeriod('custom');
                      setPeriodSearchActive(true);
                      setShowCustomDateInput(false);
                      setIsPeriodOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-md text-xs bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    disabled={!customStartDate || !customEndDate}
                  >
                    기간 검색
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
