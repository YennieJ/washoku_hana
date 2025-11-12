import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BookingConfirmModal from './booking-confirm-modal';
import { menuItems } from '@/constants/menu-items';
import { useCreateBooking } from '@/hooks/useCreateBooking';
import { useSendBookingConfirmationEmail } from '@/hooks/useSendBookingConfirmationEmail';
import { useSendAdminEmail } from '@/hooks/useSendAdminEmail';

interface BookingFormProps {
  selectedDate: string;
  selectedDayName: string;
}

export default function BookingForm({
  selectedDate,
  selectedDayName,
}: BookingFormProps) {
  const router = useRouter();
  const bookingMutation = useCreateBooking();
  const customerEmailMutation = useSendBookingConfirmationEmail();
  const adminEmailMutation = useSendAdminEmail();
  const [isGuestTypeOpen, setIsGuestTypeOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guestType: '',
    guestCount: '',
    menu: '',
    address: '',
    foodAllergy: '',
    requests: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate date and guest count
    const bookingDate = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysDiff = Math.ceil(
      (bookingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (formData.guestType === 'small' && daysDiff < 2) {
      alert(
        'Reservations for up to 8 guests must be made at least 2 days in advance.\nPlease choose another date.'
      );
      return;
    }

    if (formData.guestType === 'large' && daysDiff < 7) {
      alert(
        'Reservations for 9 or more guests must be made at least 1 week in advance.\nPlease choose another date.'
      );
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmBooking = async () => {
    // TODO: 예약 API 호출 주석처리 (테스트용)
    // const bookingDateTime = `${selectedDate}T19:00:00`;

    // bookingMutation.mutate(
    //   {
    //     customer_name: formData.name,
    //     customer_email: formData.email,
    //     customer_phone: formData.phone,
    //     booking_date: bookingDateTime,
    //     guest_count: Number(formData.guestCount),
    //     menu: formData.menu,
    //     address: formData.address,
    //     food_allergy: formData.foodAllergy || '없음',
    //     special_requests: formData.requests || null,
    //   },
    //   {
    //     onSuccess: async (result) => {
    //       // sessionStorage에 예약 번호 저장 (예약 성공 직후 1회만)
    //       sessionStorage.setItem('bookingNumber', result.data.booking_number);

    //       const errors: string[] = [];

    //       try {
    //         // TODO: 관리자 이메일 전송 주석처리 (테스트용)
    //         // 예약 성공 후 관리자에게 이메일 전송
    //         // try {
    //         //   await adminEmailMutation.mutateAsync({
    //         //     formData,
    //         //     selectedDate,
    //         //     selectedDayName,
    //         //   });
    //         // } catch (adminError) {
    //         //   const adminErrorMessage =
    //         //     adminError instanceof Error
    //         //       ? adminError.message
    //         //       : String(adminError);
    //         //   errors.push(`관리자 이메일: ${adminErrorMessage}`);
    //         // }

    //         // 고객에게 이메일 전송
    //         try {
    //           await customerEmailMutation.mutateAsync({
    //             formData,
    //             selectedDate,
    //             selectedDayName,
    //             bookingNumber: result.data.booking_number,
    //           });
    //         } catch (customerError) {
    //           const customerErrorMessage =
    //             customerError instanceof Error
    //               ? customerError.message
    //               : String(customerError);
    //           errors.push(`고객 이메일: ${customerErrorMessage}`);
    //         }

    //         // 이메일 전송 결과 확인
    //         if (errors.length > 0) {
    //           alert(
    //             '예약은 성공적으로 완료되었으나, 일부 이메일 전송에 실패했습니다.\n\n' +
    //               '실패한 이메일:\n' +
    //               errors.join('\n') +
    //               '\n\n예약 번호: ' +
    //               result.data.booking_number +
    //               '\n\n고객센터로 문의해주세요.'
    //           );
    //         }

    //         // 완료 페이지로 이동
    //         router.push('/reservation/complete');
    //       } catch (error) {
    //         const errorMessage =
    //           error instanceof Error ? error.message : String(error);

    //         alert(
    //           '예약은 성공적으로 완료되었으나, 이메일 전송 중 오류가 발생했습니다.\n\n' +
    //             '오류: ' +
    //             errorMessage +
    //             '\n\n예약 번호: ' +
    //             result.data.booking_number +
    //             '\n\n고객센터로 문의해주세요.'
    //         );
    //         // 완료 페이지로 이동
    //         router.push('/reservation/complete');
    //       }
    //     },
    //     onError: (error) => {
    //       alert(
    //         error instanceof Error
    //           ? error.message
    //           : 'An error occurred while submitting your booking. Please try again.'
    //       );
    //       setShowConfirmModal(false);
    //     },
    //   }
    // );

    // 테스트용: 가짜 예약 번호 생성 후 고객 이메일 전송
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const mockBookingNumber = `BK-${timestamp}-${randomStr}`;

    sessionStorage.setItem('bookingNumber', mockBookingNumber);

    // 고객에게 이메일 전송
    try {
      await customerEmailMutation.mutateAsync({
        formData,
        selectedDate,
        selectedDayName,
        bookingNumber: mockBookingNumber,
      });
    } catch (customerError) {
      const customerErrorMessage =
        customerError instanceof Error
          ? customerError.message
          : String(customerError);
      alert(`고객 이메일 전송 실패: ${customerErrorMessage}`);
    }

    // 완료 페이지로 이동
    router.push('/reservation/complete');
  };

  return (
    <>
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <BookingConfirmModal
          selectedDate={selectedDate}
          selectedDayName={selectedDayName}
          formData={formData}
          setShowConfirmModal={setShowConfirmModal}
          isSubmitting={bookingMutation.isPending}
          handleConfirmBooking={handleConfirmBooking}
        />
      )}

      <div className="bg-white/5 border border-primary/20 rounded-lg p-6 lg:p-10 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-primary mb-2 font-light">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-black/30 border border-gray-700 px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
              placeholder="Please enter your name"
              required
            />
            <p className="text-sm text-gray-400 mt-1.5 italic">
              If your e-Transfer name is different from your booking name,
              please note it in the request section.
            </p>
          </div>

          <div>
            <label className="block text-primary mb-2 font-light">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-black/30 border border-gray-700 px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-primary mb-2 font-light">
              Phone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                // 숫자만 허용
                const numericValue = e.target.value.replace(/\D/g, '');
                setFormData({ ...formData, phone: numericValue });
              }}
              className="w-full bg-black/30 border border-gray-700 px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
              placeholder="Enter numbers only (e.g., 4161234567)"
              required
            />
          </div>

          <div>
            <label className="block text-primary mb-2 font-light">
              Guests *
            </label>
            <div className="flex space-x-3">
              {/* Custom Dropdown */}
              <div className="relative w-32">
                <button
                  type="button"
                  onClick={() => setIsGuestTypeOpen(!isGuestTypeOpen)}
                  className="w-full bg-black/30 border border-gray-700 px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors text-left flex justify-between items-center"
                >
                  <span
                    className={
                      formData.guestType ? 'text-white' : 'text-gray-400'
                    }
                  >
                    {formData.guestType === 'small'
                      ? 'Up to 8 guests'
                      : formData.guestType === 'large'
                      ? '9 or more guests'
                      : 'Select'}
                  </span>
                  <span className="text-gray-400">▼</span>
                </button>

                {isGuestTypeOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-black/90 border border-gray-700 rounded z-10">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          guestType: 'small',
                          guestCount: '',
                        });
                        setIsGuestTypeOpen(false);
                      }}
                      className="w-full px-4 py-3 text-white hover:bg-primary/20 text-left transition-colors"
                    >
                      Up to 8 guests
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          guestType: 'large',
                          guestCount: '',
                        });
                        setIsGuestTypeOpen(false);
                      }}
                      className="w-full px-4 py-3 text-white hover:bg-primary/20 text-left transition-colors"
                    >
                      9 or more guests
                    </button>
                  </div>
                )}
              </div>

              <input
                type="number"
                min="1"
                max={formData.guestType === 'small' ? '8' : '20'}
                value={formData.guestCount}
                onChange={(e) =>
                  setFormData({ ...formData, guestCount: e.target.value })
                }
                className="flex-1 bg-black/30 border border-gray-700 px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                placeholder={
                  formData.guestType === 'small'
                    ? '1–8 people'
                    : formData.guestType === 'large'
                    ? '9–20 people'
                    : 'Select guest count'
                }
                required
                disabled={!formData.guestType}
              />
            </div>
            {formData.guestType === 'large' &&
              (() => {
                const bookingDate = new Date(selectedDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const daysDiff = Math.ceil(
                  (bookingDate.getTime() - today.getTime()) /
                    (1000 * 60 * 60 * 24)
                );

                if (daysDiff < 7) {
                  return (
                    <div className="mt-3 p-3 bg-red-900/30 border border-red-500/50 rounded">
                      <p className="text-sm text-red-300 font-light">
                        ⚠️ Groups of 9 or more require at least one week advance
                        notice.
                        <br />
                        Please choose a date at least one week in advance.
                      </p>
                    </div>
                  );
                }
                return null;
              })()}
          </div>

          <div>
            <label className="block text-primary mb-4 font-light">
              Menu Selection *
            </label>
            <div className="space-y-3">
              {menuItems.map((menu) => (
                <label
                  key={menu.id}
                  className={`block p-4 border cursor-pointer transition-all ${
                    formData.menu === menu.title
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-700 bg-black/20 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="menu"
                        value={menu.title}
                        checked={formData.menu === menu.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            menu: e.target.value,
                          })
                        }
                        className="w-4 h-4 accent-primary cursor-pointer"
                        required
                      />
                      <span className="text-white font-light">
                        {menu.title}
                      </span>
                    </div>
                    <span className="text-primary font-light">
                      {menu.price}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-primary mb-2 font-light">
              Address *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full bg-black/30 border border-gray-700 px-4 py-3 text-white focus:border-primary focus:outline-none h-24 transition-colors"
              placeholder="Enter the full address for the service"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-primary mb-2 font-light">
              Food Allergy
            </label>
            <textarea
              value={formData.foodAllergy}
              onChange={(e) =>
                setFormData({ ...formData, foodAllergy: e.target.value })
              }
              className="w-full bg-black/30 border border-gray-700 px-4 py-3 text-white focus:border-primary focus:outline-none h-24 transition-colors"
              placeholder="Please let us know if you have any food allergies"
            ></textarea>
          </div>

          <div>
            <label className="block text-primary mb-2 font-light">
              Special Requests
            </label>
            <textarea
              value={formData.requests}
              onChange={(e) =>
                setFormData({ ...formData, requests: e.target.value })
              }
              className="w-full bg-black/30 border border-gray-700 px-4 py-3 text-white focus:border-primary focus:outline-none h-24 transition-colors"
              placeholder="Any special requests or notes for the chef"
            ></textarea>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="privacy-consent"
              checked={privacyConsent}
              onChange={(e) => setPrivacyConsent(e.target.checked)}
              className="mt-1 w-4 h-4 accent-primary  cursor-pointer"
              required
            />
            <label
              htmlFor="privacy-consent"
              className="text-sm text-gray-300 font-light cursor-pointer"
            >
              I agree to the Privacy Policy.
            </label>
          </div>

          <button
            type="submit"
            className={`w-full py-4 transition-colors font-light text-lg tracking-wide ${
              bookingMutation.isPending || !privacyConsent
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90 cursor-pointer'
            }`}
            disabled={bookingMutation.isPending || !privacyConsent}
          >
            Next
          </button>
        </form>
      </div>
    </>
  );
}
