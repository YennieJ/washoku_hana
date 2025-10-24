import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BookingConfirmModal from './booking-confirm-modal';

interface BookingFormProps {
  selectedDate: string;
  selectedDayName: string;
}

export default function BookingForm({
  selectedDate,
  selectedDayName,
}: BookingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);

    try {
      // API call - 현재 사용하지 않음
      // const response = await fetch('/api/create-booking', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     ...formData,
      //     selectedDate,
      //     selectedDayName,
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to submit your booking.');
      // }

      // const result = await response.json();

      // sessionStorage에 예약 ID만 저장
      // sessionStorage.setItem('bookingId', result.bookingId);

      // 완료 페이지로 이동
      router.push('/reservation/complete');
    } catch (error) {
      console.error('Booking error:', error);
      alert(
        'An error occurred while submitting your booking. Please try again.'
      );
      setShowConfirmModal(false);
    } finally {
      setIsSubmitting(false);
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
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full bg-black/30 border border-gray-700 px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
              placeholder="Enter your contact number"
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
              {[
                { value: 'Premium Omakase', price: '$180 per guest' },
                { value: 'Classic Sushi Set', price: '$120 per guest' },
                { value: 'Special Sashimi', price: '$150 per guest' },
              ].map((menu) => (
                <label
                  key={menu.value}
                  className={`block p-4 border cursor-pointer transition-all ${
                    formData.menu === menu.value
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-700 bg-black/20 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="menu"
                        value={menu.value}
                        checked={formData.menu === menu.value}
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
                        {menu.value}
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
              isSubmitting || !privacyConsent
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90 cursor-pointer'
            }`}
            disabled={isSubmitting || !privacyConsent}
          >
            Next
          </button>
        </form>
      </div>
    </>
  );
}
