'use client';

import { useState } from 'react';

interface BookingCalendarProps {
  onDateSelect: (date: string, dayName: string) => void;
  selectedDate: string;
}

export default function BookingCalendar({
  onDateSelect,
  selectedDate,
}: BookingCalendarProps) {
  // Toronto timezone (America/Toronto) - accurate timezone conversion
  const now = new Date();
  const torontoFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const torontoParts = torontoFormatter.formatToParts(now);
  const torontoDate = new Date(
    parseInt(torontoParts.find((p) => p.type === 'year')!.value),
    parseInt(torontoParts.find((p) => p.type === 'month')!.value) - 1,
    parseInt(torontoParts.find((p) => p.type === 'day')!.value),
    parseInt(torontoParts.find((p) => p.type === 'hour')!.value),
    parseInt(torontoParts.find((p) => p.type === 'minute')!.value),
    parseInt(torontoParts.find((p) => p.type === 'second')!.value)
  );

  const [currentMonth, setCurrentMonth] = useState<Date>(torontoDate);
  const [today] = useState<Date>(torontoDate);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();

  // 이전 달 계산
  const prevMonthDate = new Date(year, month - 1);
  const prevMonthYear = prevMonthDate.getFullYear();
  const prevMonthValue = prevMonthDate.getMonth();

  // 이전 달이 오늘보다 과거면 이동 불가
  const canGoToPreviousMonth = !(
    prevMonthYear < todayYear ||
    (prevMonthYear === todayYear && prevMonthValue < todayMonth)
  );

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Generate calendar days
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const isWeekend = (day: number): boolean => {
    const date = new Date(year, month, day);
    return date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
  };

  const isPastDate = (day: number) => {
    const date = new Date(year, month, day);
    // Reservation available only at least 2 days in advance (for up to 8 guests)
    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(today.getDate() + 2);
    twoDaysFromNow.setHours(0, 0, 0, 0);

    return date < twoDaysFromNow;
  };

  const isSelected = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;
    return selectedDate === dateStr;
  };

  const handleDateClick = (day: number) => {
    if (isPastDate(day) || !isWeekend(day)) return;

    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;

    const date = new Date(year, month, day);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[date.getDay()];

    onDateSelect(dateStr, dayName);
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white/5 border border-primary/20 p-6 backdrop-blur-sm rounded-lg">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentMonth(new Date(year, month - 1))}
          disabled={!canGoToPreviousMonth}
          className={`p-2 transition-colors ${
            !canGoToPreviousMonth
              ? 'text-gray-600 cursor-not-allowed'
              : 'text-primary cursor-pointer hover:text-primary/80'
          }`}
        >
          ←
        </button>
        <h3 className="text-white font-light text-lg tracking-wide">
          {monthNames[month]} {year}
        </h3>
        <button
          onClick={() => setCurrentMonth(new Date(year, month + 1))}
          className="text-primary cursor-pointer hover:text-primary/80 p-2 transition-colors"
        >
          →
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-gray-400 text-sm py-2 font-light"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="h-12"></div>;
          }

          const isWeekendDay = isWeekend(day);
          const isPastDay = isPastDate(day);
          const isSelectedDay = isSelected(day);

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              disabled={isPastDay || !isWeekendDay}
              className={`
                h-12 text-sm border transition-all duration-300 rounded font-light
                ${
                  isPastDay
                    ? 'text-gray-600 cursor-not-allowed bg-black/20 border-gray-800'
                    : isWeekendDay
                    ? 'text-primary border-primary/30 hover:bg-primary hover:text-white cursor-pointer hover:border-primary'
                    : 'text-gray-600 cursor-not-allowed bg-black/20 border-gray-800'
                }
                ${isSelectedDay ? 'bg-primary text-white border-primary' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-6 text-sm text-gray-400 space-y-1 font-light">
        <p>• Weekend reservations (Sat, Sun) at 7 PM only</p>
        <p>
          • For up to 8 guests: reservations accepted at least 2 days in advance
        </p>
        <p>
          • For 8 or more guests: reservations required at least 1 week in
          advance
        </p>
      </div>
    </div>
  );
}
