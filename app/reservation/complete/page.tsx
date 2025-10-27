'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

interface BookingData {
  bookingId: string;
}

export default function ReservationCompletePage() {
  const router = useRouter();

  // 임시 예약 ID를 useState 초기값으로 생성
  const [bookingData] = useState<BookingData>(() => {
    const tempBookingId = `BK${Date.now()}${Math.random()
      .toString(36)
      .substring(2, 5)
      .toUpperCase()}`;
    return { bookingId: tempBookingId };
  });

  // 나중에 활용할 코드들 (주석 처리)
  // const [isValidAccess, setIsValidAccess] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  // useEffect(() => {
  //   const bookingId = sessionStorage.getItem('bookingId');
  //   if (!bookingId) {
  //     router.push('/reservation');
  //     return;
  //   }
  //   setBookingData({ bookingId });
  //   setIsValidAccess(true);
  //   setIsLoading(false);
  //   sessionStorage.removeItem('bookingId');
  // }, [router]);

  return (
    <div className="min-h-screen text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <h1 className="text-4xl md:text-5xl font-light text-center tracking-wider">
            RESERVATION
          </h1>
        </div>
      </section>

      {/* Step Indicator */}
      <section className="pb-8">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm bg-gray-600 text-gray-400">
                1
              </div>
            </div>

            <div className="w-12 h-px bg-gray-600"></div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm bg-gray-600 text-gray-400">
                2
              </div>
            </div>

            <div className="w-12 h-px bg-primary"></div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center font-medium text-sm">
                3
              </div>
            </div>
          </div>
        </div>
      </section>

      <p className="text-center text-gray-400 font-light py-8">
        Thank you for your reservation request!
      </p>

      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        {/* Information Box */}
        <div className="bg-white/5 border border-primary/20 rounded-lg p-8 backdrop-blur-sm space-y-8">
          {/* Email Notice */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl text-white font-light mb-3">
              Please check your email
            </h3>
            <p className="text-gray-300 font-light mb-2">
              A confirmation email has been sent to the address you provided.
            </p>
            <div className="bg-gray-800/50 rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-400 mb-1">Reservation Number</p>
              <p className="text-primary font-mono text-lg">
                {bookingData.bookingId}
              </p>
            </div>
            <p className="text-sm text-gray-400 font-light mt-3">
              It includes the total amount, deposit details, preparation notes,
              and service time.
            </p>
          </div>

          <div className="border-t border-gray-700"></div>

          {/* Important Notices */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <p className="text-gray-300 font-light flex-1">
                If you don&apos;t see the email, please check your{' '}
                <span className="text-white font-medium">spam folder</span>.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <p className="text-gray-300 font-light flex-1">
                This page is displayed only once. We recommend taking a
                screenshot for your records.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <p className="text-gray-300 font-light flex-1">
                Your reservation will be confirmed via email within 24 hours
                after review by our staff.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700"></div>

          {/* Contact Information */}
          <div className="text-center">
            <h3 className="text-lg text-white font-light mb-4">
              Have any questions?
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-2">Instagram</p>
                <a
                  href="https://www.instagram.com/washoku_hana/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors font-light"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-label="Instagram"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>@washoku_hana</span>
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                You can also reach us quickly via Instagram DM.
              </p>
            </div>
          </div>
        </div>

        {/* Home Button */}
        <div className="mt-16 text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-block bg-primary text-black px-8 py-3 hover:bg-primary/90 transition-colors font-light text-white"
          >
            Back to Home
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
