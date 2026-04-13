import type { Metadata } from 'next';
import { Oswald, DM_Sans } from 'next/font/google';

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Shooting Calibration Masterclass | Basketball Biomechanics',
  description:
    'Calibrate your shot in 14 days. The exact protocols used with NBA players. $150 lifetime access.',
  keywords: [
    'shooting calibration',
    'basketball shooting course',
    'BB masterclass',
    'motor learning basketball',
    'back rim calibration',
    'basketball biomechanics course',
  ],
  openGraph: {
    title: 'Calibrate Your Shot In 14 Days | Basketball Biomechanics',
    description:
      'The exact protocols used with NBA players. $150. Lifetime access.',
    type: 'website',
  },
};

export default function MasterclassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${oswald.variable} ${dmSans.variable} font-dm-sans`}>
      {children}
    </div>
  );
}
