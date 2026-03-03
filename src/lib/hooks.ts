'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
// Triggers visibility state when element enters viewport. Fires once.

export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// ─── COUNTER ANIMATION ───────────────────────────────────────────────────────
// Animates a number from 0 to `end` using requestAnimationFrame with ease-out.

export function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const start = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setCount(Math.round(eased * end * 10) / 10);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [end, duration, hasStarted]);

  return { count, start };
}

// ─── STICKY CTA BAR ─────────────────────────────────────────────────────────
// Monitors hero section visibility. Returns true when hero scrolls out of view.

export function useStickyCTA(heroId = 'site-hero') {
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowBar(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroId]);

  return showBar;
}
