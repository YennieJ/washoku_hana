interface BookingConfirmModalProps {
  selectedDate: string;
  selectedDayName: string;
  formData: {
    name: string;
    email: string;
    phone: string;
    guestCount: string;
    guestType: string;
    menu: string;
    address: string;
    foodAllergy: string;
    requests: string;
  };
  setShowConfirmModal: (show: boolean) => void;
  isSubmitting: boolean;
  handleConfirmBooking: () => void;
}

export default function BookingConfirmModal({
  selectedDate,
  selectedDayName,
  formData,
  setShowConfirmModal,
  isSubmitting,
  handleConfirmBooking,
}: BookingConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-primary/30 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 lg:p-8">
          <h3 className="text-2xl font-light text-primary mb-6">
            Review Your Booking Details
          </h3>

          <div className="space-y-2 text-gray-300">
            <div className="flex justify-between">
              <span className="text-gray-400">Date:</span>
              <span className="text-white">
                {selectedDate} ({selectedDayName}) 7:00 PM
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Name:</span>
              <span className="text-white">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Email:</span>
              <span className="text-white">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Phone:</span>
              <span className="text-white">{formData.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Number of Guests:</span>
              <span className="text-white">
                {formData.guestCount} (
                {formData.guestType === 'small'
                  ? 'Up to 8 guests'
                  : 'More than 8 guests'}
                )
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Menu:</span>
              <span className="text-white">{formData.menu}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Location:</span>
              <span className="text-white text-right max-w-xs">
                {formData.address}
              </span>
            </div>
            {formData.foodAllergy && (
              <div className="flex justify-between">
                <span className="text-gray-400">Food Allergies:</span>
                <span className="text-white text-right max-w-xs">
                  {formData.foodAllergy}
                </span>
              </div>
            )}
            {formData.requests && (
              <div className="flex justify-between">
                <span className="text-gray-400">Special Requests:</span>
                <span className="text-white text-right max-w-xs">
                  {formData.requests}
                </span>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="mt-6 p-4 bg-gray-800/50 border border-gray-600 rounded">
            <h4 className="text-sm text-primary font-medium mb-3">
              Additional Information
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                • Additional charges may apply depending on travel distance.
              </li>
              <li>
                • Chef service fees may vary depending on the number of guests.
              </li>
              <li>
                • A detailed quote and preparation guidelines will be sent to
                your email address.
              </li>
            </ul>
          </div>

          <div className="mt-8 flex space-x-4">
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 py-3 bg-gray-700 text-white hover:bg-gray-600 transition-colors font-light cursor-pointer"
              disabled={isSubmitting}
            >
              Go Back
            </button>
            <button
              type="button"
              onClick={handleConfirmBooking}
              className={`flex-1 py-3 transition-colors font-light ${
                isSubmitting
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary/90 cursor-pointer'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Submitting your request...'
                : 'Submit Reservation Inquiry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
