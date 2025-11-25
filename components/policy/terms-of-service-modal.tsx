'use client';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsOfServiceModal({
  isOpen,
  onClose,
}: TermsOfServiceModalProps) {
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
          <h2 className="text-lg font-light text-gray-900">Terms of Service</h2>
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
            Last Updated: November 2025
          </div>

          <section>
            <h3 className="text-base text-gray-900 mb-2">
              1. Service Use and Governing Law
            </h3>
            <p className="text-xs mb-2">
              <strong>Agreement to Terms:</strong> By using Washoku Hana's
              reservation service, you agree to these Terms of Service. Please
              ensure that all information provided during the reservation
              process is accurate and complete.
            </p>
            <p className="text-xs">
              <strong>Governing Law & Jurisdiction:</strong> These Terms and all
              disputes arising out of or in connection with the service shall be
              governed by the laws of the Province of British Columbia, and any
              legal proceedings shall be subject to the exclusive jurisdiction
              of the courts located in Vancouver, BC.
            </p>
          </section>

          <section>
            <h3 className="text-base text-gray-900 mb-2">
              2. Reservation and Confirmation Process
            </h3>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li>
                All reservations are subject to administrative approval. Once
                approved, a confirmation email will be sent to you.
              </li>
              <li>
                The deposit payment must be completed within 24 hours of
                receiving the confirmation email. Failure to make the payment
                within this timeframe will result in automatic cancellation of
                the reservation.
              </li>
              <li>
                A reservation is deemed valid only after the confirmation email
                has been sent and the deposit payment has been received.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-base text-gray-900 mb-2">3. Payment Methods</h3>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li>
                <strong>Deposit:</strong> 30–50% of the total amount. The exact
                amount will be specified in your confirmation email.
              </li>
              <li>
                <strong>Remaining Balance:</strong> The remaining balance must
                be paid on the day of service, after the chef's arrival.
              </li>
              <li>
                <strong>Accepted Payment Methods:</strong> The remaining balance
                can be paid by cash or e-Transfer only. Credit card payments are
                not accepted. This payment policy will be clearly communicated
                at the time of booking.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-base text-gray-900 mb-2">
              4. Reservation Changes and Cancellations (Liquidated Damages)
            </h3>
            <p className="text-xs mb-2">
              If a cancellation is made due to reasons attributable to the
              customer, Washoku Hana will apply the following refund policy,
              based on reasonable pre-estimated damages incurred due to service
              preparation and ingredient procurement.
            </p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li>
                <strong>14 days or more before the event:</strong> 100% refund
              </li>
              <li>
                <strong>Up to 7 days before the event:</strong> 50% refund
              </li>
              <li>
                <strong>Within 7 days or on the day of the event:</strong> No
                refund (0%)
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-base text-gray-900 mb-2">
              5. On-site Service Failure and Reservation Restrictions (Customer
              Fault)
            </h3>
            <p className="text-xs mb-2">
              If the chef arrives at the agreed location and time but is unable
              to provide the service due to any of the following
              customer-related reasons, the deposit will not be refunded and
              future reservations may be restricted.
            </p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li>
                On-site cancellation request by the customer or loss of contact
              </li>
              <li>Denial of access to the agreed service location</li>
              <li>
                Inadequate service conditions (kitchen or dining area) that
                violate Section 6 and make service provision unfeasible
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-base text-gray-900 mb-2">
              6. Service Execution and Customer Responsibilities
            </h3>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li>
                <strong>Allergy Disclosure:</strong> Any severe allergies or
                dietary restrictions of guests must be disclosed at the time of
                booking. Washoku Hana will not be liable for any issues
                resulting from failure to disclose this information.
              </li>
              <li>
                <strong>Menu Changes:</strong> Due to ingredient sourcing and
                advance preparation, menu or course changes are not possible
                once a reservation has been confirmed.
              </li>
              <li>
                <strong>Venue Preparation:</strong> Customers must ensure that a
                clean and safe kitchen and dining area are prepared prior to the
                service and available for the chef's use for approximately 2–3
                hours.
              </li>
            </ul>
            <p className="text-xs mt-2 italic text-gray-600">
              * As this is an in-home catering service, standard restaurant
              policies do not apply.
            </p>
          </section>

          <section>
            <h3 className="text-base text-gray-900 mb-2">
              7. Limitation of Liability and Force Majeure
            </h3>
            <p className="text-xs">
              Washoku Hana shall not be held liable for failure to provide
              services due to events beyond its reasonable control, including
              natural disasters, government orders, or other force majeure
              events. In such cases, the deposit will be refunded in full.
            </p>
          </section>

          <section>
            <h3 className="text-base text-gray-900 mb-2">
              8. Privacy and Terms Updates
            </h3>
            <p className="text-xs mb-2">
              <strong>Privacy:</strong> Customer information is managed in
              accordance with our Privacy Policy. Please refer to our Privacy
              Policy for details.
            </p>
            <p className="text-xs">
              <strong>Updates to Terms:</strong> These Terms may be updated as
              necessary. Any changes will be announced on our website, and the
              revised Terms will take effect 7 days after the announcement.
            </p>
          </section>

          <section>
            <h3 className="text-base text-gray-900 mb-2">9. Contact</h3>
            <p className="text-xs mb-2">
              For questions regarding these Terms of Service, please contact us:
            </p>
            <div className="text-xs ml-4">
              <p>
                <strong>Email:</strong> washokuhana.homakase@gmail.com
              </p>
              <p>
                <strong>Phone:</strong> 6477045661
              </p>
            </div>
          </section>

          <div className="text-xs text-gray-500 text-center mt-6">
            © 2025 Washoku Hana. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
