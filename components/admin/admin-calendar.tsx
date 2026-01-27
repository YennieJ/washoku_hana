"use client";

import { useState, useMemo, useEffect } from "react";
import type { Booking } from "@/lib/supabase";
import { parseBookingDate } from "@/utils/email-utils";
import StatusBadge from "./status-badge";

interface AvailabilityItem {
  date: string;
  status: "open" | "closed";
}

interface AdminCalendarProps {
  onBookingClick: (booking: Booking) => void;
  formatDate: (dateString: string) => string;
}

export default function AdmniCalendar({
  onBookingClick,
  formatDate,
}: AdminCalendarProps) {
  // 캐나다 벤쿠버 시간대 기준 현재 날짜
  const getVancouverDate = () => {
    const now = new Date();
    const vancouverFormatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Vancouver",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const vancouverParts = vancouverFormatter.formatToParts(now);
    return new Date(
      parseInt(vancouverParts.find((p) => p.type === "year")!.value),
      parseInt(vancouverParts.find((p) => p.type === "month")!.value) - 1,
      parseInt(vancouverParts.find((p) => p.type === "day")!.value),
      parseInt(vancouverParts.find((p) => p.type === "hour")!.value),
      parseInt(vancouverParts.find((p) => p.type === "minute")!.value),
      parseInt(vancouverParts.find((p) => p.type === "second")!.value),
    );
  };

  const [currentMonth, setCurrentMonth] = useState<Date>(getVancouverDate());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [closedDates, setClosedDates] = useState<Set<string>>(new Set()); // 예약 불가 날짜 (availability)
  const [confirmedBookingsByDate, setConfirmedBookingsByDate] = useState<
    Record<string, number>
  >({}); // 날짜별 confirmed 예약 개수
  const [confirmedBookingsList, setConfirmedBookingsList] = useState<
    Booking[]
  >([]); // confirmed 예약 전체 리스트
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // 날짜 선택 모드: 'none' = 비활성, 'close' = 휴무 설정, 'open' = 휴무 해제
  const [selectMode, setSelectMode] = useState<'none' | 'close' | 'open'>('none');
  const [tempSelectedDates, setTempSelectedDates] = useState<Set<string>>(new Set());

  // 현재 월의 시작일과 종료일 계산 (벤쿠버 시간대 기준)
  const getMonthDateRange = (date: Date) => {
    // 벤쿠버 시간대에서의 연/월 추출
    const vancouverYear = parseInt(
      date.toLocaleString("en-CA", {
        timeZone: "America/Vancouver",
        year: "numeric",
      }),
    );
    const vancouverMonth = parseInt(
      date.toLocaleString("en-CA", {
        timeZone: "America/Vancouver",
        month: "2-digit",
      }),
    );

    // 첫날: 항상 해당 월의 1일 (벤쿠버 시간대 기준)
    const startDateStr = `${vancouverYear}-${String(vancouverMonth).padStart(2, "0")}-01`;
    
    // 마지막날: 벤쿠버 시간대에서 다음 달 1일의 전날을 계산
    // 벤쿠버 시간대의 다음 달 1일 00:00:00을 UTC로 변환 (UTC-8 기준)
    const nextMonth = vancouverMonth === 12 ? 1 : vancouverMonth + 1;
    const nextMonthYear = vancouverMonth === 12 ? vancouverYear + 1 : vancouverYear;
    
    // 벤쿠버 시간대의 다음 달 1일 00:00:00 PST = UTC 08:00:00
    const nextMonthFirstDayUTC = Date.UTC(nextMonthYear, nextMonth - 1, 1, 8, 0, 0);
    
    // 하루 전 = 이번 달 마지막날 (벤쿠버 시간대)
    const lastDayUTC = nextMonthFirstDayUTC - 24 * 60 * 60 * 1000; // 1일 전
    
    // UTC 날짜를 벤쿠버 시간대로 변환하여 날짜 문자열 추출
    const lastDayDate = new Date(lastDayUTC);
    const lastDayYear = lastDayDate.toLocaleString("en-CA", {
      timeZone: "America/Vancouver",
      year: "numeric",
    });
    const lastDayMonth = lastDayDate.toLocaleString("en-CA", {
      timeZone: "America/Vancouver",
      month: "2-digit",
    });
    const lastDayDay = lastDayDate.toLocaleString("en-CA", {
      timeZone: "America/Vancouver",
      day: "2-digit",
    });
    const endDateStr = `${lastDayYear}-${lastDayMonth}-${lastDayDay}`;

    return {
      startDate: startDateStr,
      endDate: endDateStr,
    };
  };

  // 예약 불가 날짜 가져오기 (GET)
  const fetchAvailability = async (startDate: string, endDate: string) => {
    setLoadingAvailability(true);
    try {
      const response = await fetch(
        `/api/admin/availability?startDate=${startDate}&endDate=${endDate}`,
      );
      if (!response.ok) {
        throw new Error("예약 가능 여부를 가져오는데 실패했습니다.");
      }
      const data = await response.json();
      const closedSet = new Set<string>();
      (data.availability || []).forEach((item: AvailabilityItem) => {
        if (item.status === "closed") {
          closedSet.add(item.date);
        }
      });
      setClosedDates(closedSet);
    } catch (error) {
      console.error("Availability fetch error:", error);
    } finally {
      setLoadingAvailability(false);
    }
  };

  // Confirmed 예약 가져오기 (GET)
  const fetchConfirmedBookings = async (startDate: string, endDate: string) => {
    try {
      const response = await fetch(
        `/api/admin/bookings/confirmed?startDate=${startDate}&endDate=${endDate}`,
      );
      if (!response.ok) {
        throw new Error("확정 예약을 가져오는데 실패했습니다.");
      }
      const data = await response.json();
      const confirmedBookings: Booking[] = data.data || [];
      const bookingsByDate: Record<string, number> = {};

      confirmedBookings.forEach((booking: Booking) => {
        const date = parseBookingDate(booking.booking_date);
        const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD
        bookingsByDate[dateKey] = (bookingsByDate[dateKey] || 0) + 1;
      });

      setConfirmedBookingsByDate(bookingsByDate);
      setConfirmedBookingsList(confirmedBookings);
    } catch (error) {
      console.error("Confirmed bookings fetch error:", error);
    }
  };

  // 월이 변경될 때마다 예약 불가 날짜와 confirmed 예약 가져오기
  useEffect(() => {
    const { startDate, endDate } = getMonthDateRange(currentMonth);
    fetchAvailability(startDate, endDate);
    fetchConfirmedBookings(startDate, endDate);
  }, [currentMonth]);

  // 날짜별로 confirmed 예약 그룹화
  const confirmedBookingsByDateGrouped = useMemo(() => {
    const grouped: Record<string, Booking[]> = {};

    confirmedBookingsList.forEach((booking) => {
      const date = parseBookingDate(booking.booking_date);
      const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(booking);
    });

    return grouped;
  }, [confirmedBookingsList]);

  // 벤쿠버 시간대 기준으로 연/월 추출
  const year = parseInt(
    currentMonth.toLocaleString("en-CA", {
      timeZone: "America/Vancouver",
      year: "numeric",
    }),
  );
  const month = parseInt(
    currentMonth.toLocaleString("en-CA", {
      timeZone: "America/Vancouver",
      month: "2-digit",
    }),
  ) - 1; // month는 0-based

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

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDateKey = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const isSelected = (day: number) => {
    const dateStr = getDateKey(day);
    return selectedDate === dateStr;
  };

  const handleDateClick = (day: number) => {
    const dateStr = getDateKey(day);
    if (selectMode !== 'none') {
      // 휴무 해제 모드에서는 closed 날짜만 선택 가능
      if (selectMode === 'open' && !closedDates.has(dateStr)) return;
      setTempSelectedDates((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(dateStr)) {
          newSet.delete(dateStr);
        } else {
          newSet.add(dateStr);
        }
        return newSet;
      });
    } else {
      // 일반 모드일 때는 예약 목록 표시용
      setSelectedDate(selectedDate === dateStr ? null : dateStr);
    }
  };

  const handleConfirmDate = async () => {
    if (tempSelectedDates.size === 0) return;

    try {
      const selectedDatesArray = Array.from(tempSelectedDates);

      if (selectMode === 'close') {
        const res = await fetch("/api/admin/availability", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dates: selectedDatesArray, status: "closed" }),
        });
        if (!res.ok) {
          const errorData = await res.json();
          if (res.status === 409) {
            alert(
              `활성 예약이 있는 날짜는 닫을 수 없습니다: ${errorData.blockedDates?.join(", ")}`,
            );
            return;
          }
          throw new Error(errorData.error || "휴무 설정에 실패했습니다.");
        }
      } else if (selectMode === 'open') {
        const res = await fetch("/api/admin/availability", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dates: selectedDatesArray }),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "휴무 해제에 실패했습니다.");
        }
      }

      // 성공 후 데이터 다시 가져오기
      const { startDate, endDate } = getMonthDateRange(currentMonth);
      await Promise.all([
        fetchAvailability(startDate, endDate),
        fetchConfirmedBookings(startDate, endDate),
      ]);

      setTempSelectedDates(new Set());
      setSelectMode('none');
    } catch (error) {
      console.error("Failed to update availability:", error);
      alert("날짜 상태 변경에 실패했습니다.");
    }
  };

  const handleCancelSelect = () => {
    setTempSelectedDates(new Set());
    setSelectMode('none');
  };

  const selectedDateBookings = selectedDate
    ? confirmedBookingsByDateGrouped[selectedDate] || []
    : [];

  return (
    <div className="p-4 lg:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 달력 */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">

            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const prevMonth = new Date(currentMonth);
                    prevMonth.setMonth(prevMonth.getMonth() - 1);
                    setCurrentMonth(prevMonth);
                  }}
                  className="p-2 transition-colors text-gray-600 cursor-pointer hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  ←
                </button>
                <h3 className="text-lg font-semibold text-gray-900 min-w-[160px] text-center">
                  {monthNames[month]} {year}
                </h3>
                <button
                  onClick={() => {
                    const nextMonth = new Date(currentMonth);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    setCurrentMonth(nextMonth);
                  }}
                  className="p-2 transition-colors text-gray-600 cursor-pointer hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  →
                </button>
              </div>

              <div className="flex items-center gap-2">
                {selectMode === 'none' ? (
                  <>
                    <button
                      onClick={() => setSelectMode('close')}
                      className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      휴무 선택
                    </button>
                    <button
                      onClick={() => setSelectMode('open')}
                      className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      휴무 해제
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-xs text-gray-500">
                      {selectMode === 'close' ? '날짜를 선택하여 휴무 설정' : '휴무 날짜를 선택하여 해제'}
                    </span>
                    <button
                      onClick={handleConfirmDate}
                      disabled={tempSelectedDates.size === 0}
                      className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-900 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
                    >
                      확인 ({tempSelectedDates.size}개)
                    </button>
                    <button
                      onClick={handleCancelSelect}
                      className="px-3 py-1.5 border border-gray-200 rounded-md text-sm bg-white text-gray-900 hover:bg-gray-50 cursor-pointer"
                    >
                      취소
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-gray-600 text-sm py-2 font-medium"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={index} className="h-20"></div>;
                }

                const dateKey = getDateKey(day);
                const isSelectedDay = isSelected(day);
                // 캐나다 벤쿠버 시간대 기준 오늘 날짜
                const todayVancouver = getVancouverDate()
                  .toISOString()
                  .split("T")[0];
                const isToday = dateKey === todayVancouver;
                const isClosed = closedDates.has(dateKey); // availability에서 closed인 날짜
                const hasConfirmedBooking = confirmedBookingsByDate[dateKey] > 0; // confirmed 예약이 있는 날짜
                const confirmedCount = confirmedBookingsByDate[dateKey] || 0;
                const isTempSelected =
                  selectMode !== 'none' && tempSelectedDates.has(dateKey);

                // availability closed만 빨간색, confirmed 예약은 다른 스타일
                const getCellStyle = () => {
                  if (isTempSelected) {
                    return "bg-yellow-100 border-yellow-400 text-gray-900 ring-2 ring-yellow-400";
                  } else if (isClosed && !hasConfirmedBooking) {
                    return "bg-red-100 border-red-500 text-red-900";
                  } else if (hasConfirmedBooking) {
                    return "bg-green-50 border-green-300 text-gray-900";
                  } else if (isSelectedDay) {
                    return "bg-blue-100 border-blue-600 text-gray-900";
                  } else {
                    return "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900";
                  }
                };

                return (
                  <div key={index} className="relative group">
                    <button
                      onClick={() => handleDateClick(day)}
                      className={`
                        h-20 w-full text-sm border transition-all duration-300 rounded font-light relative
                        ${getCellStyle()}
                      `}
                    >
                      <span
                        className={isToday ? "text-blue-600 font-semibold" : ""}
                      >
                        {day}
                      </span>
                      {hasConfirmedBooking && (
                        <span className="absolute bottom-1 right-1 text-xs font-medium text-green-700 bg-green-200 px-1.5 py-0.5 rounded">
                          {confirmedCount}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 선택된 날짜의 예약 목록 */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            {selectedDate ? (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {formatDate(`${selectedDate}T00:00:00`)}
                </h3>
                {selectedDateBookings.length === 0 ? (
                  <p className="text-sm text-gray-500">예약이 없습니다.</p>
                ) : (
                  <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {selectedDateBookings.map((booking) => {
                      const isUnread = !booking.is_read;
                      const bookingDateTime = parseBookingDate(
                        booking.booking_date,
                      );
                      const time = bookingDateTime.toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <div
                          key={booking.id}
                          onClick={() => onBookingClick(booking)}
                          className={`p-3 border rounded-md cursor-pointer transition-colors ${
                            isUnread
                              ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {time}
                            </span>
                            <StatusBadge status={booking.status} />
                            {isUnread && (
                              <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">
                                새
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-sm text-gray-900 ${
                              isUnread ? "font-bold" : "font-normal"
                            }`}
                          >
                            {booking.customer_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.menu} · {booking.guest_count}명
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">
                날짜를 선택하면 예약 목록을 볼 수 있습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
