'use client';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({
  isOpen,
  onClose,
}: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-gray-200 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-light text-gray-900">Privacy Policy</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* 내용 */}
        <div className="p-4 space-y-4 text-sm text-gray-700 leading-relaxed overflow-y-auto flex-1">
          <div className="text-xs text-gray-500 mb-4">
            Effective Date: January 1, 2025
          </div>
          <p className="text-xs">
            By using our restaurant reservation service, you agree to this
            Privacy Policy, which complies with Canada's Personal Information
            Protection and Electronic Documents Act (PIPEDA).
          </p>

          <section>
            <h3 className="text-base text-gray-900 mb-2">
              What Information We Collect
            </h3>
            <p className="text-xs mb-2">
              We collect only the minimum information necessary to process your
              reservation:
            </p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li>
                <strong>Name (Required):</strong> Used to verify the sender's
                identity when confirming bank transfer payment (e-Transfer) and
                matching payment amounts. Also used by Restaurant Partners to
                identify your reservation. We do NOT collect bank account
                numbers.
              </li>
              <li>
                <strong>Phone Number (Required):</strong> To contact you
                regarding reservation confirmation or changes.
              </li>
              <li>
                <strong>Email Address (Required):</strong> To send reservation
                confirmations and as the primary identifier for
                sending/receiving payments via Interac e-Transfer.
              </li>
              <li>
                <strong>Reservation Details:</strong> Restaurant name, date,
                time, party size, and special requests.
              </li>
            </ul>
            <p className="text-xs mt-2 italic text-gray-600">
              Important Notice: All information marked as "Required" is
              mandatory for using our reservation service. If you refuse to
              provide this required information, we will not be able to process
              your reservation.
            </p>
          </section>

          <section>
            <h3 className="text-base text-gray-900 mb-2">
              How We Use Your Information
            </h3>
            <p className="text-xs mb-2">
              Your personal information is used solely for:
            </p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li>
                <strong>Processing Reservations:</strong> Confirming and
                managing your restaurant bookings.
              </li>
              <li>
                <strong>Payment Verification:</strong> Matching your name and
                email with transfer records to confirm payment.
              </li>
              <li>
                <strong>Facilitating e-Transfer:</strong> Using your email
                address as the primary channel for sending and receiving funds
                via Interac e-Transfer.
              </li>
              <li>
                <strong>Customer Communication:</strong> Contacting you about
                reservation status, changes, or cancellations.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-base text-gray-900 mb-2">
              Information Sharing
            </h3>
            <p className="text-xs mb-2">We share your information only with:</p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li>
                <strong>Restaurant Partners:</strong> To fulfill your
                reservation (name, party size, date/time, special requests).
              </li>
              <li>
                <strong>Our Bank:</strong> To verify payment transfers (name and
                payment amount only).
              </li>
            </ul>
            <p className="text-xs mt-2">
              We never sell, rent, or share your personal information for
              marketing purposes.
            </p>
          </section>

          <section>
            <h3 className="text-base text-gray-900 mb-2">Your Rights</h3>
            <p className="text-xs mb-2">
              Under Canadian law, you have the right to:
            </p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li>Access your personal information.</li>
              <li>Correct any errors in your information.</li>
              <li>
                Request deletion of your information after your reservation is
                complete.
              </li>
            </ul>
            <p className="text-xs mt-2">
              To exercise these rights, contact us:
            </p>
            <div className="text-xs mt-1 ml-4">
              <p>
                <strong>Privacy Officer:</strong> Minho Lee
              </p>
              <p>
                <strong>Email:</strong> washokuhana.homakase@gmail.com
              </p>
              <p>
                <strong>Phone:</strong> 6477045661
              </p>
            </div>
            <p className="text-xs mt-2">
              We will respond to your request within 30 days.
            </p>
          </section>

          <section>
            <h3 className="text-base text-gray-900 mb-2">Data Retention</h3>
            <p className="text-xs mb-2">
              We keep your personal information for:
            </p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li>
                <strong>Active Reservations:</strong> Until the reservation is
                completed.
              </li>
              <li>
                <strong>Completed Reservations:</strong> 1 year for customer
                service and accounting purposes.
              </li>
              <li>
                <strong>Cancelled Reservations:</strong> 6 months.
              </li>
            </ul>
            <p className="text-xs mt-2">
              After these periods, your information is permanently deleted
              unless required by law (e.g., tax records).
            </p>
          </section>

          <section>
            <h3 className="text-base text-gray-900 mb-2">Cookies</h3>
            <p className="text-xs">
              We do not use cookies or tracking technologies on this website.
              Our service does not require login, and we do not track your
              browsing behavior.
            </p>
            <p className="text-xs mt-2">
              If this changes in the future, we will update this policy and
              notify you.
            </p>
          </section>

          <section>
            <h3 className="text-base text-gray-900 mb-2">Data Security</h3>
            <p className="text-xs mb-2">
              We protect your personal information using:
            </p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li>Secure servers with encryption (SSL/TLS).</li>
              <li>Password-protected databases.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
