'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useSendEmail } from '@/hooks/useSendEmail';
import { useUpdateBooking } from '@/hooks/useUpdateBooking';
import { useAddCalendarEvent } from '@/hooks/useAddCalendarEvent';
import { useDeleteCalendarEvent } from '@/hooks/useDeleteCalendarEvent';
import type { Booking } from '@/lib/supabase';
import {
  RESERVATION_STATUSES,
  getStatusLabel,
  type ReservationStatus,
} from '@/constants/reservation-statuses';
import { useState, useEffect, useRef, useMemo } from 'react';
import { getEmailTemplate } from '@/templates/email-templates';
import { updateTemplateContent } from '@/utils/template-updater';
import type { EmailTemplateType } from '@/types/email-templates';
import { ADMIN_EMAIL } from '@/constants/email';
import { getEditCard } from '@/components/admin/send-email';
import { menuItems } from '@/constants/menu-items';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SendEmailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const sendEmailMutation = useSendEmail();
  const updateBookingMutation = useUpdateBooking();
  const addCalendarEventMutation = useAddCalendarEvent();
  const deleteCalendarEventMutation = useDeleteCalendarEvent();

  // React Query 캐시에서 예약 정보 가져오기
  const booking = useMemo(() => {
    const bookingsCache = queryClient.getQueriesData<Booking[]>({
      queryKey: ['bookings'],
    });

    for (const [, bookings] of bookingsCache) {
      if (bookings) {
        const found = bookings.find((b) => b.id === id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }, [id, queryClient]);

  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isMailTypeOpen, setIsMailTypeOpen] = useState(false);
  const [selectedMailType, setSelectedMailType] = useState<
    ReservationStatus | 'CUSTOM'
  >('AWAITING_DEPOSIT');
  const mailTypeDropdownRef = useRef<HTMLDivElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // 금액 입력 필드 상태
  const [courseAmount, setCourseAmount] = useState('');
  const [travelFee, setTravelFee] = useState('');
  const [extraChefFee, setExtraChefFee] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [refundAmount, setRefundAmount] = useState('');

  // 시간 입력 필드 상태 (기본값: 19:00)
  const [reservationTime, setReservationTime] = useState('19:00');

  // 날짜 입력 필드 상태 (기본값: booking의 날짜)
  const [reservationDate, setReservationDate] = useState('');

  // PENDING_UPDATE용 입력 필드 상태
  const [reason, setReason] = useState('');
  const [changeProposal, setChangeProposal] = useState('');

  // DECLINED용 입력 필드 상태
  const [declineReason, setDeclineReason] = useState('');

  // CANCELLED용 취소 타입 상태 (기본값: 고객 취소)
  const [cancellationType, setCancellationType] = useState<
    'admin' | 'customer'
  >('customer');

  // booking 로드 시 날짜 및 환불 금액 초기화
  useEffect(() => {
    if (booking) {
      if (!reservationDate) {
        // YYYY-MM-DD 형식으로 변환
        const date = new Date(booking.booking_date);
        const formatted = date.toISOString().split('T')[0];
        setReservationDate(formatted);
      }
      // 환불 금액 초기화 (booking에 있으면 사용)
      if (booking.refund_amount && !refundAmount) {
        setRefundAmount(booking.refund_amount.toString());
      }
      // 오마카세 코스 기본 가격 계산 (AWAITING_DEPOSIT이고 비어있을 때만)
      if (
        selectedMailType === 'AWAITING_DEPOSIT' &&
        !courseAmount &&
        booking.menu &&
        booking.guest_count
      ) {
        const selectedMenu = menuItems.find((m) => m.title === booking.menu);
        if (selectedMenu) {
          const priceMatch = selectedMenu.price.match(/\$?(\d+)/);
          const pricePerPerson = priceMatch ? parseFloat(priceMatch[1]) : 0;
          const baseAmount = pricePerPerson * booking.guest_count;
          if (baseAmount > 0) {
            setCourseAmount(baseAmount.toString());
          }
        }
      }
    }
  }, [booking, reservationDate, refundAmount, selectedMailType, courseAmount]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mailTypeDropdownRef.current &&
        !mailTypeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMailTypeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 예약 문의를 제외한 메일 종류 옵션
  const mailTypeOptions = RESERVATION_STATUSES.filter(
    (status) => status.value !== 'INQUIRY'
  );

  // 일반 메일을 최상단에 배치
  const allMailTypeOptions = [
    {
      value: 'CUSTOM' as const,
      label: '일반 메일',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
    },
    ...mailTypeOptions,
  ];

  // 총합계 계산
  const totalAmount = useMemo(() => {
    const course = parseFloat(courseAmount) || 0;
    const travel = parseFloat(travelFee) || 0;
    const chef = parseFloat(extraChefFee) || 0;
    return (course + travel + chef).toFixed(2);
  }, [courseAmount, travelFee, extraChefFee]);

  // 잔금 계산
  const remainingAmount = useMemo(() => {
    const total = parseFloat(totalAmount) || 0;
    const deposit = parseFloat(depositAmount) || 0;
    return (total - deposit).toFixed(2);
  }, [totalAmount, depositAmount]);

  // 메일 종류 또는 날짜 변경 시 템플릿 로드 (초기 렌더링 포함)
  useEffect(() => {
    if (!booking || !reservationDate) return;

    // CANCELLED 선택 시 환불 금액 자동 계산
    if (
      selectedMailType === 'CANCELLED' &&
      !refundAmount &&
      booking.deposit_amount
    ) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const reservation = new Date(reservationDate);
      reservation.setHours(0, 0, 0, 0);
      const daysUntilEvent = Math.floor(
        (reservation.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      let calculatedRefund = 0;
      if (daysUntilEvent >= 14) {
        calculatedRefund = booking.deposit_amount; // 100% 환불
      } else if (daysUntilEvent >= 7) {
        calculatedRefund = booking.deposit_amount * 0.5; // 50% 환불
      } else {
        calculatedRefund = 0; // 환불 불가
      }

      if (calculatedRefund > 0 || booking.refund_amount) {
        setRefundAmount((booking.refund_amount || calculatedRefund).toString());
      }
    }

    // 예약 확정 템플릿의 경우, booking 객체의 값만 사용 (입력 필드 사용 안 함)
    const templateData = {
      booking,
      courseAmount: courseAmount || '',
      travelFee: travelFee || '',
      extraChefFee: extraChefFee || '',
      totalAmount:
        selectedMailType === 'CONFIRMED'
          ? booking.total_amount?.toString() || '0'
          : totalAmount || '0.00',
      depositAmount:
        selectedMailType === 'CONFIRMED'
          ? booking.deposit_amount?.toString() || '0'
          : depositAmount || '',
      remainingAmount:
        selectedMailType === 'CONFIRMED' &&
        booking.total_amount &&
        booking.deposit_amount
          ? (booking.total_amount - booking.deposit_amount).toFixed(2)
          : remainingAmount || '0.00',
      refundAmount: refundAmount || '',
      reservationTime: reservationTime || '19:00',
      reservationDate: reservationDate || '',
      reason: reason || '',
      changeProposal: changeProposal || '',
      declineReason: declineReason || '',
      cancellationType:
        selectedMailType === 'CANCELLED' ? cancellationType : undefined,
    };

    const template = getEmailTemplate(
      selectedMailType as EmailTemplateType,
      templateData
    );

    setSubject(template.subject);
    setContent(template.content);
  }, [
    selectedMailType,
    booking,
    booking?.total_amount,
    booking?.deposit_amount,
    reservationDate,
    cancellationType,
  ]);

  // 금액과 시간이 변경될 때 content 자동 업데이트 (예약금 안내, 예약 확정, 예약 취소, 예약 변경, 또는 예약 거절 템플릿일 때만)
  // 날짜는 첫 번째 useEffect에서 처리 (전체 템플릿 다시 로드)
  useEffect(() => {
    if (
      !booking ||
      (selectedMailType !== 'AWAITING_DEPOSIT' &&
        selectedMailType !== 'CONFIRMED' &&
        selectedMailType !== 'CANCELLED' &&
        selectedMailType !== 'PENDING_UPDATE' &&
        selectedMailType !== 'DECLINED')
    )
      return;

    // 예약 확정 템플릿의 경우, booking 객체의 값만 사용 (입력 필드 사용 안 함)
    const templateData = {
      booking,
      courseAmount,
      travelFee,
      extraChefFee,
      totalAmount:
        selectedMailType === 'CONFIRMED'
          ? booking.total_amount?.toString() || '0'
          : totalAmount,
      depositAmount:
        selectedMailType === 'CONFIRMED'
          ? booking.deposit_amount?.toString() || '0'
          : depositAmount,
      remainingAmount:
        selectedMailType === 'CONFIRMED' &&
        booking.total_amount &&
        booking.deposit_amount
          ? (booking.total_amount - booking.deposit_amount).toFixed(2)
          : remainingAmount,
      refundAmount,
      reservationTime,
      reservationDate,
      reason,
      changeProposal,
      declineReason,
      cancellationType:
        selectedMailType === 'CANCELLED' ? cancellationType : undefined,
    };

    // functional update로 최신 content를 기반으로 업데이트
    setContent((prevContent) => {
      if (!prevContent) return prevContent;

      return updateTemplateContent(
        selectedMailType as EmailTemplateType,
        prevContent,
        templateData
      );
    });
  }, [
    reservationTime,
    courseAmount,
    travelFee,
    extraChefFee,
    totalAmount,
    depositAmount,
    remainingAmount,
    refundAmount,
    selectedMailType,
    booking,
    reservationDate,
    reason,
    changeProposal,
    declineReason,
    cancellationType,
  ]);

  // 취소 타입 변경 시 메일 편집 영역 스크롤을 최상단으로 이동
  useEffect(() => {
    if (selectedMailType === 'CANCELLED' && contentTextareaRef.current) {
      contentTextareaRef.current.scrollTop = 0;
    }
  }, [cancellationType, selectedMailType]);

  // 텍스트를 HTML로 변환하는 함수
  const convertToHtml = (text: string): string => {
    const lines = text.split('\n');
    let html = '';
    let isContactSection = false; // 연락처/서명 섹션 여부

    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();

      // 연락처 섹션 시작 감지
      if (
        trimmed.includes('예약 관련 문의사항') ||
        trimmed.includes(ADMIN_EMAIL)
      ) {
        isContactSection = true;
      }

      if (!trimmed) {
        html += '<br>';
        continue;
      }

      if (trimmed.startsWith('━━')) {
        html += `<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">`;
        continue;
      }

      if (trimmed.includes(':')) {
        const [label, ...valueParts] = trimmed.split(':');
        const value = valueParts.join(':').trim();
        const style = isContactSection
          ? 'margin: 0 0 10px 0; font-size: 13px; color: #666;'
          : '';
        html += `<p style="${style}"><strong>${label}:</strong> ${value}</p>`;
        continue;
      }

      if (trimmed.match(/^[가-힣\s]+안내$/)) {
        html += `<h3 style="margin: 0 0 15px 0; font-size: 18px;">${trimmed}</h3>`;
        continue;
      }

      // 서명 부분 (Chef Minho, Washoku Hana 등)
      if (trimmed.includes('Chef Minho') || trimmed.includes('Washoku Hana')) {
        isContactSection = true;
        const style = 'margin: 10px 0 0 0; font-size: 13px; color: #666;';
        html += `<p style="${style}">${trimmed}</p>`;
        continue;
      }

      // 일반 텍스트
      const style = isContactSection
        ? 'margin: 0 0 10px 0; font-size: 13px; color: #666; line-height: 1.8;'
        : 'margin: 0 0 15px 0; line-height: 1.8;';
      html += `<p style="${style}">${trimmed}</p>`;
    }

    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    ${html}
  </body>
</html>`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSendEmail = () => {
    if (!booking || !subject.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    // 예약금 안내일 때는 먼저 금액 정보 업데이트
    if (selectedMailType === 'AWAITING_DEPOSIT') {
      // 금액 검증
      if (
        !courseAmount ||
        !travelFee ||
        !depositAmount ||
        parseFloat(courseAmount) <= 0 ||
        parseFloat(depositAmount) <= 0
      ) {
        alert('오마카세 코스, 출장비, 디파짓 금액을 입력해주세요.');
        return;
      }

      // 1단계: 금액 정보 및 날짜/시간 업데이트
      const updateData: any = {
        bookingId: booking.id,
        status: 'AWAITING_DEPOSIT',
        travel_cost: parseFloat(travelFee) || null,
        deposit_amount: parseFloat(depositAmount) || null,
        total_amount: parseFloat(totalAmount) || null,
        chef_additional_cost: extraChefFee ? parseFloat(extraChefFee) : null,
      };

      // 날짜/시간 업데이트
      if (reservationDate && reservationTime) {
        const dateTimeString = `${reservationDate}T${reservationTime}:00`;
        updateData.booking_date = dateTimeString;
      }

      updateBookingMutation.mutate(updateData, {
        onSuccess: () => {
          // 2단계: 금액 정보 업데이트 성공 후 이메일 전송
          const htmlContent = convertToHtml(content);

          sendEmailMutation.mutate(
            {
              bookingId: booking.id,
              subject: subject,
              htmlContent: htmlContent,
              to: booking.customer_email,
            },
            {
              onSuccess: () => {
                alert('금액 정보가 업데이트되고 이메일이 전송되었습니다.');
                router.push('/admin/dashboard');
              },
              onError: (error) => {
                alert(
                  `금액은 업데이트되었으나 이메일 전송 실패: ${error.message}`
                );
                router.push('/admin/dashboard');
              },
            }
          );
        },
        onError: (error) => {
          alert(`금액 정보 업데이트 실패: ${error.message}`);
        },
      });
    } else if (selectedMailType === 'CUSTOM') {
      // 일반 메일은 상태 업데이트 없이 이메일만 전송
      // 공통 서명 및 연락처 정보 추가
      const contentWithSignature = content.trim()
        ? `${content.trim()}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n감사합니다.\n\n이메일: ${ADMIN_EMAIL}\n\nChef Minho\nWashoku Hana – Private Omakase Experience`
        : content;
      const htmlContent = convertToHtml(contentWithSignature);

      sendEmailMutation.mutate(
        {
          bookingId: booking.id,
          subject: subject,
          htmlContent: htmlContent,
          to: booking.customer_email,
        },
        {
          onSuccess: () => {
            alert('이메일이 성공적으로 전송되었습니다.');
            router.push('/admin/dashboard');
          },
          onError: (error) => {
            alert(`이메일 전송 실패: ${error.message}`);
          },
        }
      );
    } else {
      // 다른 메일 타입 (CONFIRMED, CANCELLED, PENDING_UPDATE, DECLINED 등)은 상태 업데이트 후 이메일 전송
      const updateData: any = {
        bookingId: booking.id,
        status: selectedMailType as ReservationStatus,
        ...(selectedMailType === 'CANCELLED' && refundAmount
          ? { refund_amount: parseFloat(refundAmount) || null }
          : {}),
      };

      // 예약 변경 요청일 때 날짜/시간 업데이트
      if (
        selectedMailType === 'PENDING_UPDATE' &&
        reservationDate &&
        reservationTime
      ) {
        // 날짜와 시간을 합쳐서 ISO 형식으로 변환
        const dateTimeString = `${reservationDate}T${reservationTime}:00`;
        updateData.booking_date = dateTimeString;
      }

      // 1단계: 상태 업데이트
      updateBookingMutation.mutate(updateData, {
        onSuccess: () => {
          // 2단계: 상태 업데이트 성공 후 이메일 전송
          const htmlContent = convertToHtml(content);

          sendEmailMutation.mutate(
            {
              bookingId: booking.id,
              subject: subject,
              htmlContent: htmlContent,
              to: booking.customer_email,
            },
            {
              onSuccess: () => {
                // 3단계: 예약 확정 상태인 경우 캘린더 이벤트 추가
                if (selectedMailType === 'CONFIRMED') {
                  addCalendarEventMutation.mutate(
                    { bookingId: booking.id },
                    {
                      onSuccess: () => {
                        // 성공 시 알림 없이 바로 이동
                        router.push('/admin/dashboard');
                      },
                      onError: (error) => {
                        // 캘린더 추가 실패는 경고만 표시하고 계속 진행
                        alert(
                          `상태 업데이트 및 이메일 전송 완료. 캘린더 추가 실패: ${error.message}`
                        );
                        router.push('/admin/dashboard');
                      },
                    }
                  );
                } else if (selectedMailType === 'CANCELLED') {
                  // 예약 취소 상태인 경우 캘린더 이벤트 삭제
                  deleteCalendarEventMutation.mutate(
                    { bookingId: booking.id },
                    {
                      onSuccess: () => {
                        // 성공 시 알림 없이 바로 이동
                        router.push('/admin/dashboard');
                      },
                      onError: (error) => {
                        // 캘린더 삭제 실패는 경고만 표시하고 계속 진행
                        alert(
                          `상태 업데이트 및 이메일 전송 완료. 캘린더 삭제 실패: ${error.message}`
                        );
                        router.push('/admin/dashboard');
                      },
                    }
                  );
                } else {
                  // 다른 상태인 경우 알림 없이 바로 이동
                  router.push('/admin/dashboard');
                }
              },
              onError: (error) => {
                alert(
                  `상태는 업데이트되었으나 이메일 전송 실패: ${error.message}`
                );
                router.push('/admin/dashboard');
              },
            }
          );
        },
        onError: (error) => {
          alert(`상태 업데이트 실패: ${error.message}`);
        },
      });
    }
  };

  useEffect(() => {
    if (!booking) {
      router.push('/admin/dashboard');
    }
  }, [booking, router]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col mx-auto w-full px-4 lg:px-6 py-4 lg:py-6 overflow-hidden min-h-0">
        {/* 헤더 */}
        <div className="mb-3 lg:mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-shrink-0">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
            메일 전송
          </h1>
          <div className="flex gap-2 lg:gap-3 w-full sm:w-auto">
            <button
              onClick={() => router.back()}
              className="flex-1 sm:flex-none px-4 lg:px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 text-sm lg:text-base"
            >
              취소
            </button>
            <button
              onClick={handleSendEmail}
              disabled={
                sendEmailMutation.isPending ||
                updateBookingMutation.isPending ||
                addCalendarEventMutation.isPending ||
                deleteCalendarEventMutation.isPending ||
                !subject.trim() ||
                !content.trim()
              }
              className={`flex-1 sm:flex-none px-4 lg:px-6 py-2 rounded text-white text-sm lg:text-base ${
                sendEmailMutation.isPending ||
                updateBookingMutation.isPending ||
                addCalendarEventMutation.isPending ||
                deleteCalendarEventMutation.isPending ||
                !subject.trim() ||
                !content.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {updateBookingMutation.isPending
                ? '업데이트 중...'
                : sendEmailMutation.isPending
                ? '전송 중...'
                : addCalendarEventMutation.isPending
                ? '캘린더 추가 중...'
                : deleteCalendarEventMutation.isPending
                ? '캘린더 삭제 중...'
                : '이메일 전송'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 lg:gap-4 flex-1 overflow-hidden min-h-0">
          {/* 좌측: 메일 종류 & 예약 정보 & 금액 정보 */}
          <div className="space-y-3 lg:col-span-2 flex flex-col overflow-y-auto lg:overflow-y-hidden min-h-0 max-h-[calc(100vh-200px)] lg:max-h-none pb-2 lg:pb-0">
            {/* 메일 종류 */}
            <div className="bg-white rounded-lg shadow-md p-3 lg:p-4 flex-shrink-0">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                메일 종류
              </label>
              <div className="relative" ref={mailTypeDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsMailTypeOpen(!isMailTypeOpen)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white text-left flex justify-between items-center text-sm lg:text-base"
                >
                  <span>
                    {selectedMailType === 'CUSTOM'
                      ? '일반 메일'
                      : getStatusLabel(selectedMailType)}
                  </span>
                  <span className="text-gray-400">
                    {isMailTypeOpen ? '▲' : '▼'}
                  </span>
                </button>

                {isMailTypeOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-[300px] overflow-y-auto">
                    {allMailTypeOptions.map((status) => (
                      <button
                        key={status.value}
                        type="button"
                        onClick={() => {
                          setSelectedMailType(
                            status.value as ReservationStatus | 'CUSTOM'
                          );
                          setIsMailTypeOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left hover:bg-gray-100 text-sm lg:text-base ${
                          selectedMailType === status.value
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-900'
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {selectedMailType === 'CUSTOM' && (
              <div className="bg-white rounded-lg shadow-md p-3 lg:p-4 flex-1 overflow-y-auto">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3 lg:mb-4">
                  예약 정보
                </h2>
                <div className="space-y-3 lg:space-y-4 text-gray-900 text-sm">
                  <div className="space-y-2">
                    <p>
                      <strong>예약 번호:</strong> {booking.booking_number}
                    </p>
                    <p>
                      <strong>이름:</strong> {booking.customer_name}
                    </p>
                    <p>
                      <strong>이메일:</strong> {booking.customer_email}
                    </p>
                    <p>
                      <strong>전화번호:</strong> {booking.customer_phone}
                    </p>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="space-y-2">
                    <p>
                      <strong>예약 일시:</strong>{' '}
                      {formatDate(booking.booking_date)}{' '}
                      {formatTime(booking.booking_date)}
                    </p>
                    <p>
                      <strong>인원:</strong> {booking.guest_count}명
                    </p>
                    <p>
                      <strong>메뉴:</strong> {booking.menu}
                    </p>
                    <p>
                      <strong>주소:</strong> {booking.address}
                    </p>
                  </div>

                  {(booking.food_allergy || booking.special_requests) && (
                    <>
                      <hr className="border-gray-200" />
                      <div className="space-y-2">
                        {booking.food_allergy &&
                          booking.food_allergy !== '없음' && (
                            <p>
                              <strong>알레르기:</strong> {booking.food_allergy}
                            </p>
                          )}
                        {booking.special_requests && (
                          <p>
                            <strong>특별 요청:</strong>{' '}
                            {booking.special_requests}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* 메일 수정 정보 카드 */}
            {getEditCard(selectedMailType, {
              reservationDate,
              reservationTime,
              courseAmount,
              travelFee,
              extraChefFee,
              depositAmount,
              totalAmount,
              remainingAmount,
              onReservationDateChange: setReservationDate,
              onReservationTimeChange: setReservationTime,
              onCourseAmountChange: setCourseAmount,
              onTravelFeeChange: setTravelFee,
              onExtraChefFeeChange: setExtraChefFee,
              onDepositAmountChange: setDepositAmount,
              formatTime,
              refundAmount,
              onRefundAmountChange: setRefundAmount,
              cancellationType,
              onCancellationTypeChange: setCancellationType,
              reason,
              changeProposal,
              onReasonChange: setReason,
              onChangeProposalChange: setChangeProposal,
              declineReason,
              onDeclineReasonChange: setDeclineReason,
            })}
          </div>

          {/* 우측: 이메일 편집 */}
          <div className="lg:col-span-4 flex flex-col overflow-hidden min-h-[500px] lg:min-h-0">
            {/* 이메일 편집 */}
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="flex flex-col flex-1 space-y-3 lg:space-y-4 overflow-hidden min-h-0">
                <div className="flex-shrink-0">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm lg:text-base"
                    placeholder="제목을 입력하세요"
                  />
                </div>

                <div className="flex flex-col flex-1 overflow-hidden min-h-0">
                  <label className="block text-sm font-medium text-gray-900 mb-2 flex-shrink-0">
                    내용
                    <span className="ml-2 text-xs text-gray-500 hidden sm:inline">
                      (메일 수정 정보 입력 시 자동으로 업데이트되며, 직접 수정도
                      가능합니다)
                    </span>
                  </label>
                  <textarea
                    ref={contentTextareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none font-mono text-xs lg:text-sm overflow-y-auto min-h-[300px] lg:min-h-0"
                    placeholder="내용을 입력하세요"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
