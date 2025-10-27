import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Washoku Hana | Private Omakase & Catering',
  description:
    'Premium Japanese omakase and kaiseki cuisine delivered to your home in the GTA. Authentic Kyoto-style sushi and seasonal dishes crafted by our master chef.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Washoku Hana | Private Omakase & Catering',
    description:
      'Premium Japanese omakase and kaiseki cuisine delivered to your home in the GTA. Authentic Kyoto-style sushi and seasonal dishes crafted by our master chef.',
    type: 'website',
    locale: 'en_CA',
    images: [
      {
        url: '/favicon.ico',
        width: 512,
        height: 512,
        alt: 'Washoku Hana',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/favicon.ico'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
