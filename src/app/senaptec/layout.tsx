import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Basketball Biomechanics × Senaptec | Train Your Visual System',
  description:
    'Train the visual system behind your game. Senaptec Strobes + BB Protocol: see less, process more, stay calm under chaos. Exclusive partnership with Basketball Biomechanics.',
  keywords: [
    'senaptec strobes',
    'visual training basketball',
    'strobe glasses basketball',
    'basketball biomechanics',
    'visual stress training',
    'basketball perception training',
    'shooting training',
  ],
  openGraph: {
    title: 'Basketball Biomechanics × Senaptec | Train Your Visual System',
    description:
      'Train the visual system behind your game. Most players train their handle and jumper — almost nobody trains their eyes, perception, and calm under chaos.',
    type: 'website',
  },
};

export default function SenaptecLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
