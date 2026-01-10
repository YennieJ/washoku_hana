import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BookingConfirmModal from './booking-confirm-modal';
import { menuItems } from '@/constants/menu-items';
import { useCreateBooking } from '@/hooks/useCreateBooking';
import { useSendBookingConfirmationEmail } from '@/hooks/useSendBookingConfirmationEmail';
import { useSendAdminEmail } from '@/hooks/useSendAdminEmail';

interface BookingFormProps {
  selectedDate: string;
  selectedDayName: string;
  initialMenu?: string;
}

export default function BookingForm({
  selectedDate,
  selectedDayName,
  initialMenu = '',
}: BookingFormProps) {
  const router = useRouter();
  const bookingMutation = useCreateBooking();
  const customerEmailMutation = useSendBookingConfirmationEmail();
  const adminEmailMutation = useSendAdminEmail();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guestCount: '',
    menu: initialMenu,
    address: '',
    foodAllergy: '',
    requests: '',
  });

  // initialMenu가 변경되면 formData 업데이트
  useEffect(() => {
    if (initialMenu) {
      setFormData((prev) => ({ ...prev, menu: initialMenu }));
    }
  }, [initialMenu]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate menu selection
    if (!formData.menu) {
      alert('Please select a menu first.');
      return;
    }

    const selectedMenu = menuItems.find((m) => m.title === formData.menu);
    if (!selectedMenu) {
      alert('Please select a valid menu.');
      return;
    }

    // Validate guest count - check minimum
    const guestCount = Number(formData.guestCount);
    if (!guestCount || guestCount < selectedMenu.minGuests) {
      alert(
        `Minimum ${selectedMenu.minGuests} guests required for ${selectedMenu.title}.`
      );
      return;
    }

    // Kaiseki Kappo Cuisine만 최대 인원 검증
    if (
      selectedMenu.title === 'Kaiseki Kappo Cuisine' &&
      guestCount > selectedMenu.maxGuests
    ) {
      alert(
        `Maximum ${selectedMenu.maxGuests} guests allowed for ${selectedMenu.title}.`
      );
      return;
    }

    // inquiryRequired가 있는 경우 검증 (Kaiseki 제외)
    if (
      selectedMenu.title !== 'Kaiseki Kappo Cuisine' &&
      selectedMenu.inquiryRequired &&
      guestCount >= selectedMenu.inquiryRequired
    ) {
      alert(
        `For ${selectedMenu.title}, ${selectedMenu.inquiryRequired} or more guests require email inquiry. Please contact us directly.`
      );
      return;
    }

    // Validate date - all reservations require at least 8 days from today
    const bookingDate = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysDiff = Math.ceil(
      (bookingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff < 8) {
      alert(
        'All reservations must be made at least 8 days from today.\nPlease choose another date.'
      );
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    const bookingDateTime = `${selectedDate}T19:00:00`;

    try {
      // 예약 DB 저장
      const result = await bookingMutation.mutateAsync({
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        booking_date: bookingDateTime,
        guest_count: Number(formData.guestCount),
        menu: formData.menu,
        address: formData.address,
        food_allergy: formData.foodAllergy || 'None',
        special_requests: formData.requests || null,
      });

      // sessionStorage에 예약 번호 저장 (예약 성공 직후 1회만)
      sessionStorage.setItem('bookingNumber', result.data.booking_number);

      const errors: string[] = [];

      // 예약 성공 후 관리자에게 이메일 전송
      try {
        await adminEmailMutation.mutateAsync({
          formData,
          selectedDate,
          selectedDayName,
        });
      } catch (adminError) {
        const adminErrorMessage =
          adminError instanceof Error ? adminError.message : String(adminError);
        errors.push(`Admin email: ${adminErrorMessage}`);
      }

      // 고객에게 이메일 전송
      try {
        await customerEmailMutation.mutateAsync({
          formData,
          selectedDate,
          selectedDayName,
          bookingNumber: result.data.booking_number,
        });
      } catch (customerError) {
        const customerErrorMessage =
          customerError instanceof Error
            ? customerError.message
            : String(customerError);
        errors.push(`Customer email: ${customerErrorMessage}`);
      }

      // 이메일 전송 결과 확인
      if (errors.length > 0) {
        alert(
          'Your reservation was successfully completed, but some emails failed to send.\n\n' +
            'Failed emails:\n' +
            errors.join('\n') +
            '\n\nBooking Number: ' +
            result.data.booking_number +
            '\n\nPlease contact customer service.'
        );
      }

      // 완료 페이지로 이동
      router.push('/reservation/complete');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      alert(
        errorMessage ||
          'An error occurred while submitting your booking. Please try again.'
      );
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
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
          isSubmitting={isSubmitting}
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
                  <div className="flex items-center gap-3 w-full">
                    <input
                      type="radio"
                      name="menu"
                      value={menu.title}
                      checked={formData.menu === menu.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          menu: e.target.value,
                          guestCount: '', // 메뉴 변경 시 인원 수 초기화
                        })
                      }
                      className="w-4 h-4 accent-primary cursor-pointer flex-shrink-0"
                      required
                    />
                    <div className="flex-1 flex justify-between items-center flex-shrink-0">
                      <span className="text-white font-light">
                        {menu.title}
                        <p className="text-xs text-gray-400 mt-0.5">
                          {menu.minGuests}-{menu.maxGuests} guests
                          {menu.title === 'Kaiseki Kappo Cuisine' && (
                            <span> (Less than 4 guests $289)</span>
                          )}
                          {menu.inquiryRequired && (
                            <span> (Over max: email)</span>
                          )}
                        </p>
                      </span>
                      <span className="text-primary font-light ml-4">
                        {menu.price}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-primary mb-2 font-light">
              Guests *
            </label>
            {(() => {
              const selectedMenu = menuItems.find(
                (m) => m.title === formData.menu
              );

              if (!selectedMenu) {
                return (
                  <div className="p-4 bg-gray-800/50 border border-gray-700 rounded">
                    <p className="text-sm text-gray-400">
                      Please select a menu first to enter the number of guests.
                    </p>
                  </div>
                );
              }

              return (
                <>
                  <input
                    type="number"
                    min={selectedMenu.minGuests}
                    max={
                      selectedMenu.title === 'Kaiseki Kappo Cuisine'
                        ? selectedMenu.maxGuests
                        : undefined
                    }
                    value={formData.guestCount}
                    onChange={(e) =>
                      setFormData({ ...formData, guestCount: e.target.value })
                    }
                    className="w-full bg-black/30 border border-gray-700 px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                    placeholder={`Minimum ${selectedMenu.minGuests}`}
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    {selectedMenu.minGuests}-{selectedMenu.maxGuests} guests
                    {selectedMenu.title === 'Kaiseki Kappo Cuisine' && (
                      <span> (Less than 4 guests $289)</span>
                    )}
                    {selectedMenu.inquiryRequired && (
                      <span> (Over max: email)</span>
                    )}
                  </p>
                </>
              );
            })()}
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
