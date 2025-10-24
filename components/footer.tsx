import Link from 'next/link';

export default function Footer() {
  return (
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
        <div className="flex justify-center gap-4">
          <Link
            href="/privacy"
            className="block hover:text-primary transition-colors"
          >
            개인정보보호정책
          </Link>
          <Link
            href="/privacy"
            className="block hover:text-primary transition-colors"
          >
            개인정보보호정책
          </Link>
          <Link
            href="/privacy"
            className="block hover:text-primary transition-colors"
          >
            개인정보보호정책
          </Link>
        </div>
        <p className="text-center">
          &copy; 2025 Washoku Hana. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
