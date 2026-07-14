import type { Metadata } from 'next';
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google';
import './early-access.css';

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
  title: 'BB Movement System | Early Access',
  description:
    'Join the early-access list for the Basketball Biomechanics Movement System.',
  alternates: {
    canonical: 'https://www.basketballbiomechanics.com/movement-early-access',
  },
  openGraph: {
    title: 'BB Movement System | Early Access',
    description:
      'Join the early-access list for the Basketball Biomechanics Movement System.',
    type: 'website',
  },
};

export default function MovementEarlyAccessLayout({
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
