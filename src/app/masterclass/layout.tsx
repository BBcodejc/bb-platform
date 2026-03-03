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
    'The same shooting calibration system used by Tobias Harris, Jabari Smith, and OG Anunoby. 14 chapters. 51 lessons. $150 lifetime access. Transform your shot in 14 days.',
  keywords: [
    'shooting calibration',
    'basketball shooting course',
    'BB masterclass',
    'motor learning basketball',
    'back rim calibration',
    'deep distance shooting',
    'basketball biomechanics course',
  ],
  openGraph: {
    title: 'Shooting Calibration Masterclass | Basketball Biomechanics',
    description:
      'Tobias Harris went from 33% to 47% from three. Mid-season. The Masterclass gives you the exact same protocols.',
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
