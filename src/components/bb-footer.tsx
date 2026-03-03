'use client';

import Link from 'next/link';

export function BBFooter() {
  return (
    <footer className="border-t border-site-border/50 bg-site-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-site-dim text-sm tracking-wider font-medium">
            BASKETBALL BIOMECHANICS
          </p>
          <div className="flex items-center gap-6 text-sm text-site-dim">
            <Link href="/gear" className="hover:text-white transition-colors">BB Gear</Link>
            <Link href="/masterclass" className="hover:text-white transition-colors">Masterclass</Link>
            <Link href="/inquiry" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-site-dim/60 text-xs">
            © {new Date().getFullYear()} Basketball Biomechanics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
