'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import PrivacyPolicyModal from '@/components/policy/privacy-policy-modal';
import TermsOfServiceModal from '@/components/policy/terms-of-service-modal';

export default function Footer() {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  useEffect(() => {
    if (isPrivacyModalOpen || isTermsModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPrivacyModalOpen, isTermsModalOpen]);

  return (
    <>
      <footer className="text-gray-500 pb-16 max-w-7xl mx-auto px-6 space-y-28">
        <div className="relative pt-20 lg:pt-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-500/30 to-transparent"></div>
          </div>
        </div>
        <div className="flex justify-center gap-10 text-lg">
          <Link href="/" className="block hover:text-primary transition-colors">
            HOME
          </Link>
          <Link
            href="/menu"
            className="block hover:text-primary transition-colors"
          >
            MENU
          </Link>
          <Link
            href="/reservation"
            className="block hover:text-primary transition-colors"
          >
            RESERVATION
          </Link>
        </div>
        <div className="space-y-4 text-xs">
          <div className="flex justify-center gap-6">
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="block hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-gray-600">|</span>
            <button
              onClick={() => setIsTermsModalOpen(true)}
              className="block hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
          <p className="text-center">
            &copy; 2025 Washoku Hana. All rights reserved.
          </p>
        </div>
      </footer>

      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
      <TermsOfServiceModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </>
  );
}
