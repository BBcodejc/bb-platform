'use client';

// Relaunch waitlist for the Shooting Calibration Masterclass.
// The full sales page is preserved in git history (git log src/app/masterclass).
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { bbTrack } from '../../lib/analytics';

// ─── Scroll reveal (same behavior as the sales page) ─────────────────────────

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) el.classList.add('mc-reveal');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add('is-in');
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

function Kicker({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return <p className={`mc-kicker${center ? ' mc-kicker--center' : ''}`}>{children}</p>;
}

function TopBar() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`mc-topbar${solid ? ' is-solid' : ''}`}>
      <a href="#hero" className="mc-wordmark">
        <img src="/bb-logo-registered.png" alt="Basketball Biomechanics" />
      </a>
      <a href="#waitlist" className="mc-topbar-cta" data-bb-cta="hero">
        Join The Waitlist
      </a>
    </header>
  );
}

// ─── Waitlist form ───────────────────────────────────────────────────────────

function WaitlistForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    bbTrack('calibration_waitlist_submit', { product: 'Shooting Calibration Masterclass' });
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      if (!res.ok) throw new Error(`waitlist responded ${res.status}`);
      bbTrack('calibration_waitlist_success', { product: 'Shooting Calibration Masterclass' });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="mc-wl-success" role="status">
        <span className="mc-tick" aria-hidden="true">
          ✓
        </span>
        <h3 className="mc-h3">You are on the list.</h3>
        <p>
          You will be the first to know when the Calibration Protocols reopen. Until then, keep
          getting to the court.
        </p>
      </div>
    );
  }

  return (
    <form className="mc-wl-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="First name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="given-name"
        aria-label="First name"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        aria-label="Email"
      />
      <button className="mc-cta" type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Joining...' : 'Join The Waitlist'}
      </button>
      {status === 'error' && (
        <p className="mc-wl-error" role="alert">
          Something went wrong. Please try again, or email trainwjc@gmail.com and we will add
          you.
        </p>
      )}
      <p className="mc-microcopy">First access at relaunch. No spam, ever.</p>
    </form>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MasterclassWaitlistPage() {
  useEffect(() => {
    bbTrack('calibration_waitlist_view', { product: 'Shooting Calibration Masterclass' });
  }, []);

  return (
    <main className="mc-page">
      <TopBar />

      {/* ── Hero ── */}
      <section id="hero" className="mc-hero mc-bg-warm mc-first" data-bb-hero>
        <div className="mc-container">
          <Reveal>
            <Kicker center>The Shooting Calibration Masterclass</Kicker>
            <h1 className="mc-h1">The Calibration Protocols are relaunching soon.</h1>
            <p className="mc-hero-sub">
              The masterclass is closed while we rebuild it for relaunch. Join the waitlist and
              you will be first through the door when it reopens.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <a href="#waitlist" className="mc-cta mc-cta--large" data-bb-cta="hero">
              Join The Waitlist
            </a>
            <p className="mc-microcopy">First access at relaunch. No spam, ever.</p>
            <p className="mc-proof-strip">
              <span>OG Anunoby, 2026 NBA Champion</span>
              <span className="tick">·</span>
              <span>Tobias Harris 18% to 47%</span>
              <span className="tick">·</span>
              <span>Paul Reed 15% to 40%</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── VSL ── */}
      <section id="watch" className="mc-section mc-bg-white mc-center">
        <div className="mc-container">
          <Reveal>
            <Kicker center>While You Wait</Kicker>
            <h2 className="mc-h2">Why More Reps Alone Will Not Fix Inconsistent Shooting.</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="mc-video-frame">
              <video controls playsInline preload="metadata" src="/vsl.mp4" data-bb-video="calibration-vsl" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Proof ── */}
      <section id="proof" className="mc-section mc-bg-warm">
        <div className="mc-container">
          <Reveal>
            <Kicker>Proven At The Highest Level</Kicker>
            <div className="mc-proof-statements">
              <p>
                OG Anunoby shot over 50% from three in the NBA Finals while running Calibration
                Protocols.
              </p>
              <p>
                Tobias Harris used Calibration Protocols throughout one of the best shooting
                stretches of his playoff career.
              </p>
              <p className="mc-proof-avail">
                The exact same system is reopening soon, for players everywhere.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Waitlist ── */}
      <section id="waitlist" className="mc-section mc-bg-white mc-center">
        <div className="mc-container">
          <Reveal>
            <Kicker center>Join The Waitlist</Kicker>
            <h2 className="mc-h2">Be first through the door at relaunch.</h2>
            <p className="mc-hero-sub">
              Waitlist members get first access when the Calibration Protocols reopen.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <WaitlistForm />
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <section className="mc-final" style={{ padding: 0 }}>
        <footer className="mc-footer" style={{ marginTop: 0 }}>
          Basketball Biomechanics · Coach Tommy Tempesta · Trusted by NBA, D1, and high school
          players worldwide.
        </footer>
      </section>
    </main>
  );
}
