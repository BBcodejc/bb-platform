import type { Metadata } from 'next';
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google';
import './masterclass.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Shooting Calibration Masterclass | Relaunching Soon',
  description:
    'The Calibration Protocols used in season with NBA players are relaunching soon. Join the waitlist for first access.',
  keywords: [
    'shooting calibration',
    'basketball shooting course',
    'BB masterclass',
    'motor learning basketball',
    'basketball biomechanics course',
  ],
  openGraph: {
    title: 'The Calibration System Behind Real NBA Results',
    description:
      'The calibration protocols used in season with NBA players. Recalibrate how you shoot. $297, lifetime access, Day 14 guarantee.',
    type: 'website',
  },
};

export default function MasterclassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable}`}>
      {children}
    </div>
  );
}
