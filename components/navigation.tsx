'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-xl font-bold tracking-wider font-playfair text-primary"
          >
            Washoku Hana
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-sm uppercase tracking-widest hover:text-primary transition-colors"
            >
              HOME
            </Link>
            <Link
              href="/menu"
              className="text-sm uppercase tracking-widest hover:text-primary transition-colors"
            >
              MENU
            </Link>
            <Link
              href="/reservation"
              className="text-sm uppercase tracking-widest hover:text-primary transition-colors"
            >
              RESERVATION
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span
                className={`block h-0.5 w-6 bg-white transition-transform ${
                  isOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              ></span>
              <span
                className={`block h-0.5 w-6 bg-white transition-opacity ${
                  isOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span
                className={`block h-0.5 w-6 bg-white transition-transform ${
                  isOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-sm uppercase tracking-widest hover:text-primary transition-colors"
              >
                HOME
              </Link>
              <Link
                href="/menu"
                className="text-sm uppercase tracking-widest hover:text-primary transition-colors"
              >
                MENU
              </Link>
              <Link
                href="/reservation"
                className="text-sm uppercase tracking-widest hover:text-primary transition-colors"
              >
                RESERVATION
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
