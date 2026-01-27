"use client";

import { useState } from "react";
import { useMarkAsRead } from "@/hooks/useMarkAsRead";
import type { Booking } from "@/lib/supabase";
import { parseBookingDate } from "@/utils/email-utils";
import AdminCalendar from "@/components/admin/admin-calendar";
import BookingDetailModal from "@/components/admin/booking-detail-modal";
import SidebarNav from "@/components/admin/sidebar-nav";

export default function AdminCalendarPage() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const markAsReadMutation = useMarkAsRead();

  const formatDate = (dateString: string) => {
    const date = parseBookingDate(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleRowClick = (booking: Booking) => {
    // 읽지 않은 예약이면 읽음 처리
    if (!booking.is_read) {
      markAsReadMutation.mutate(booking.id);
    }
    // 모달 오픈
    setSelectedBooking(booking);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* 왼쪽 네비게이션 바 */}
      <SidebarNav />

      {/* 메인 컨텐츠 영역 (네비게이션 바 공간 확보) */}
      <div className="ml-16 flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-3 lg:px-6 py-3 lg:py-4">
            <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Washoku Hana - 예약 달력
            </h1>
          </div>
        </div>

        {/* Main Content - Calendar */}
        <main className="flex-1 min-h-0 overflow-y-auto p-3 lg:p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px]">
          <AdminCalendar
            onBookingClick={handleRowClick}
            formatDate={formatDate}
          />
        </div>
        </main>

        {/* 상세 모달 */}
        {selectedBooking && (
          <BookingDetailModal
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
          />
        )}
      </div>
    </div>
  );
}

