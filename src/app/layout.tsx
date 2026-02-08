import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Google Analytics Measurement ID - you'll need to create this in Google Analytics
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
      <head>
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${inter.className} bg-bb-black text-white antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
