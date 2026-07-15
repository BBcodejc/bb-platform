'use client';

// First-party analytics for basketballbiomechanics.com.
// Events POST to /api/track (stored in Supabase bb_events) and mirror to
// Vercel Analytics custom events. All calls are best-effort and never throw.
import { track as vercelTrack } from '@vercel/analytics';

export type EventProps = Record<string, string | number | undefined | null>;

const isBrowser = typeof window !== 'undefined';

function safeGet(store: Storage, key: string): string {
  try {
    return store.getItem(key) || '';
  } catch {
    return '';
  }
}

function safeSet(store: Storage, key: string, val: string) {
  try {
    store.setItem(key, val);
  } catch {
    /* storage unavailable (private mode) */
  }
}

function randomId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function visitorId(): string {
  if (!isBrowser) return '';
  let v = safeGet(localStorage, 'bb_vid');
  if (!v) {
    v = randomId();
    safeSet(localStorage, 'bb_vid', v);
  }
  return v;
}

export function sessionId(): string {
  if (!isBrowser) return '';
  let s = safeGet(sessionStorage, 'bb_sid');
  if (!s) {
    s = randomId();
    safeSet(sessionStorage, 'bb_sid', s);
  }
  return s;
}

export interface Attribution {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  traffic_source: string;
  referrer: string;
  landing_page: string;
}

function detectTrafficSource(utmSource: string, referrer: string): string {
  const s = utmSource.toLowerCase();
  if (s) {
    if (s.includes('instagram') || s === 'ig') return 'Instagram';
    if (s.includes('facebook') || s === 'fb' || s.includes('meta')) return 'Facebook';
    if (s.includes('tiktok') || s === 'tt') return 'TikTok';
    if (s.includes('youtube') || s === 'yt') return 'YouTube';
    if (s.includes('twitter') || s === 'x') return 'Twitter/X';
    return utmSource;
  }
  if (!referrer) return 'Direct';
  let host = '';
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return 'Direct';
  }
  if (host === window.location.hostname) return '';
  if (host.includes('instagram')) return 'Instagram';
  if (host.includes('facebook') || host === 'fb.com' || host === 'm.facebook.com') return 'Facebook';
  if (host.includes('tiktok')) return 'TikTok';
  if (host.includes('youtube') || host === 'youtu.be') return 'YouTube';
  if (host.includes('twitter') || host === 'x.com' || host === 't.co') return 'Twitter/X';
  if (
    host.includes('google') ||
    host.includes('bing') ||
    host.includes('duckduckgo') ||
    host.includes('yahoo')
  ) {
    return 'Organic Search';
  }
  return host;
}

/** Capture UTM params + referrer on page load. Last non-direct click wins;
    a fresh utm_source always overwrites the stored attribution. */
export function captureAttribution(): Attribution {
  const empty: Attribution = {
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    traffic_source: '',
    referrer: '',
    landing_page: '',
  };
  if (!isBrowser) return empty;

  let stored: Attribution | null = null;
  try {
    stored = JSON.parse(safeGet(localStorage, 'bb_attr') || 'null');
  } catch {
    stored = null;
  }

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source') || '';
  const referrer = document.referrer || '';
  const externalReferrer =
    referrer && !referrer.includes(window.location.hostname) ? referrer : '';

  if (utmSource || !stored) {
    const attr: Attribution = {
      utm_source: utmSource,
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_content: params.get('utm_content') || '',
      traffic_source: detectTrafficSource(utmSource, externalReferrer) || 'Direct',
      referrer: externalReferrer.slice(0, 300),
      landing_page: window.location.pathname,
    };
    safeSet(localStorage, 'bb_attr', JSON.stringify(attr));
    return attr;
  }
  return stored;
}

export function getAttribution(): Attribution {
  return captureAttribution();
}

export function bbTrack(event: string, props: EventProps = {}) {
  if (!isBrowser) return;
  const attr = getAttribution();
  const payload: Record<string, unknown> = {
    event,
    page: window.location.pathname,
    session_id: sessionId(),
    visitor_id: visitorId(),
    user_agent: navigator.userAgent.slice(0, 180),
    ...attr,
  };
  for (const [k, v] of Object.entries(props)) {
    if (v !== undefined && v !== null) payload[k] = v;
  }
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
    } else {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* never block the page on analytics */
  }
  try {
    vercelTrack(event, {
      page: window.location.pathname,
      source: attr.traffic_source || 'Direct',
    });
  } catch {
    /* vercel analytics unavailable */
  }
}

/** Fire an event at most once per session for the given key. */
export function bbTrackOnce(key: string, event: string, props: EventProps = {}) {
  if (!isBrowser) return;
  const storageKey = `bb_once:${key}`;
  if (safeGet(sessionStorage, storageKey)) return;
  safeSet(sessionStorage, storageKey, '1');
  bbTrack(event, props);
}
