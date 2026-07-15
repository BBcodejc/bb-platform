'use client';

// Site-wide event tracker. Mounted once in the root layout — do not mount
// per-page (that would double-fire events). Behavior is driven by the URL
// and by data attributes in page markup:
//   data-bb-hero            → hero_view when 40% visible
//   data-bb-video="name"    → per-video start/quartile/complete events
//   data-bb-cta="hero|midpage|bottom" on <a> → positioned CTA click events
// Links to Thinkific fire checkout_started and carry attribution params
// across to the checkout domain.
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  bbTrack,
  bbTrackOnce,
  captureAttribution,
  getAttribution,
  sessionId,
  visitorId,
  type EventProps,
} from '../lib/analytics';

const PAGE_ALIAS: Record<string, 'calibration' | 'movement_waitlist'> = {
  '/masterclass': 'calibration',
  '/movement-early-access': 'movement_waitlist',
};

const PAGE_PRODUCT: Record<string, { product: string; price: number }> = {
  '/masterclass': { product: 'Shooting Calibration Masterclass', price: 297 },
};

export default function BBTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    captureAttribution();
    const alias = PAGE_ALIAS[pathname];
    const prod = PAGE_PRODUCT[pathname];
    const base: EventProps = prod ? { product: prod.product, price: prod.price } : {};

    bbTrack('page_view', base);
    if (alias === 'calibration') bbTrack('calibration_page_view', base);
    if (alias === 'movement_waitlist') bbTrack('movement_waitlist_view');

    // ── hero_view ──
    let heroIO: IntersectionObserver | undefined;
    const hero = document.querySelector('[data-bb-hero]');
    if (hero && 'IntersectionObserver' in window) {
      heroIO = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            bbTrackOnce(`hero_view:${pathname}`, 'hero_view', base);
            heroIO?.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      heroIO.observe(hero);
    }

    // ── scroll depth ──
    const marks = [25, 50, 75, 100];
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 100;
      for (const m of marks) {
        if (pct >= m) bbTrackOnce(`scroll_${m}:${pathname}`, `scroll_${m}`, base);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── video milestones (per video id) ──
    const videoCleanups: Array<() => void> = [];
    const wireVideos = () => {
      document.querySelectorAll<HTMLVideoElement>('video').forEach((v) => {
        if (v.dataset.bbWired) return;
        v.dataset.bbWired = '1';
        const src = v.currentSrc || v.src || 'video';
        const vid =
          v.dataset.bbVideo || (src.split('/').pop() || 'video').replace(/\.[a-z0-9]+$/i, '');
        const vp: EventProps = { ...base, video_id: vid };
        const onPlay = () => bbTrackOnce(`vstart:${vid}`, 'video_started', vp);
        const onTime = () => {
          if (!v.duration) return;
          const p = (v.currentTime / v.duration) * 100;
          if (p >= 25) bbTrackOnce(`v25:${vid}`, 'video_25_percent', vp);
          if (p >= 50) bbTrackOnce(`v50:${vid}`, 'video_50_percent', vp);
          if (p >= 75) bbTrackOnce(`v75:${vid}`, 'video_75_percent', vp);
        };
        const onEnded = () => bbTrackOnce(`vend:${vid}`, 'video_completed', vp);
        v.addEventListener('play', onPlay);
        v.addEventListener('timeupdate', onTime);
        v.addEventListener('ended', onEnded);
        videoCleanups.push(() => {
          v.removeEventListener('play', onPlay);
          v.removeEventListener('timeupdate', onTime);
          v.removeEventListener('ended', onEnded);
          delete v.dataset.bbWired;
        });
      });
    };
    wireVideos();
    const rewireTimer = window.setTimeout(wireVideos, 1500);

    // ── CTA + checkout clicks (capture phase so it runs before navigation) ──
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const a = target?.closest?.('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      const text = (a.textContent || '').trim().slice(0, 80);
      const pos = a.getAttribute('data-bb-cta');
      const cp: EventProps = { ...base, button_text: text, destination: href.slice(0, 250) };

      if (pos === 'hero' || pos === 'midpage' || pos === 'bottom') {
        bbTrack(`${pos}_cta_clicked`, cp);
        if (alias === 'calibration') bbTrack('calibration_cta_click', cp);
      }

      if (href.includes('thinkific.com')) {
        bbTrack('checkout_started', cp);
        if (alias === 'calibration') bbTrack('calibration_checkout_start', cp);
        try {
          const url = new URL(href);
          const attr = getAttribution();
          url.searchParams.set('bb_sid', sessionId());
          url.searchParams.set('bb_vid', visitorId());
          if (attr.utm_source) url.searchParams.set('utm_source', attr.utm_source);
          if (attr.utm_medium) url.searchParams.set('utm_medium', attr.utm_medium);
          if (attr.utm_campaign) url.searchParams.set('utm_campaign', attr.utm_campaign);
          if (attr.utm_content) url.searchParams.set('utm_content', attr.utm_content);
          a.setAttribute('href', url.toString());
        } catch {
          /* leave the link untouched */
        }
      }
    };
    document.addEventListener('click', onClick, true);

    return () => {
      heroIO?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(rewireTimer);
      document.removeEventListener('click', onClick, true);
      videoCleanups.forEach((fn) => fn());
    };
  }, [pathname]);

  return null;
}
