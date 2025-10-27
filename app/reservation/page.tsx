'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/navigation';
import BookingCalendar from '@/components/reservation/booking-calendar';
import BookingForm from '@/components/reservation/booking-form';
import Footer from '@/components/footer';

export default function ReservationPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDayName, setSelectedDayName] = useState('');
  const isClient = true; // 클라이언트 컴포넌트에서는 항상 true

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (selectedDate) {
        e.preventDefault();
        e.returnValue =
          'Your reservation details will be lost. Are you sure you want to leave this page?';
        return e.returnValue;
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (selectedDate) {
        const confirmLeave = window.confirm(
          'Your reservation details will be lost. Are you sure you want to leave this page?'
        );
        if (!confirmLeave) {
          e.preventDefault();
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Add history entry to prevent going back
    if (selectedDate) {
      window.history.pushState(null, '', window.location.href);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedDate]);

  const handleDateSelect = (date: string, dayName: string) => {
    setSelectedDate(date);
    setSelectedDayName(dayName);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-primary">Loading page...</div>
      </div>
    );
  }

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
      <div className="pb-8">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-center space-x-6">
            {/* Step 1 */}
            <div className="flex items-center space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                  !selectedDate
                    ? 'bg-primary text-black'
                    : 'bg-gray-600 text-gray-400'
                }`}
              >
                1
              </div>
            </div>

            {/* Connector 1 */}
            <div
              className={`w-12 h-px ${
                selectedDate ? 'bg-primary' : 'bg-gray-600'
              }`}
            ></div>

            {/* Step 2 */}
            <div className="flex items-center space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                  selectedDate
                    ? 'bg-primary text-black'
                    : 'bg-gray-600 text-gray-400'
                }`}
              >
                2
              </div>
            </div>

            {/* Connector 2 */}
            <div className="w-12 h-px bg-gray-600"></div>

            {/* Step 3 */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-gray-600 text-gray-400 flex items-center justify-center font-medium text-sm">
                3
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 pb-16 lg:pb-24">
        {/* 1. Reservation Calendar */}
        <section
          className={`relative pt-8 ${
            selectedDate ? 'pb-16 lg:pb-24' : 'pb-8'
          }`}
        >
          <div className="max-w-md mx-auto">
            <BookingCalendar
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
          </div>
        </section>

        {/* 2. Reservation Form */}
        {selectedDate ? (
          <section className="relative pt-8  lg:pb-24">
            <div className="max-w-2xl mx-auto">
              <BookingForm
                selectedDate={selectedDate}
                selectedDayName={selectedDayName}
              />
            </div>
          </section>
        ) : (
          <p className="text-primary text-center">
            Please select a date to continue.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}
