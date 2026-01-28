import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Basketball Biomechanics | Method-Based Shooting Development',
  description:
    'Get your personalized BB Shooting Profile. We assess miss profiles, energy patterns, and deep distance calibration to build custom protocols that actually work.',
  keywords: [
    'basketball shooting',
    'shooting coach',
    'basketball training',
    'shooting form',
    'basketball biomechanics',
    'shooting development',
  ],
  openGraph: {
    title: 'Basketball Biomechanics | Method-Based Shooting Development',
    description:
      'Get your personalized BB Shooting Profile with custom protocols based on your miss profile and energy patterns.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-bb-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
