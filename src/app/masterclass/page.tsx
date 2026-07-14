'use client';

import { useEffect, useState } from 'react';

// ─── STICKY BANNER ───────────────────────────────────────────────────────────

function StickyBanner() {
  return (
    <div className="urgency-banner urgency-banner--sticky">
      <p className="urgency-text">
        These protocols work in <span className="urgency-gold">one session.</span>
      </p>
    </div>
  );
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const THINKIFIC_URL = 'https://bbcode.thinkific.com/enroll/3585033';

const REELS = [
  'https://www.instagram.com/reel/DXAZutfkXm_/',
  'https://www.instagram.com/reel/DW8vktWBrPU/',
  'https://www.instagram.com/reel/DVBd9SyEfnU/',
  'https://www.instagram.com/reel/DUBOdZZEXRM/',
];

// ─── ENROLL BUTTON ───────────────────────────────────────────────────────────

function EnrollButton({ label = 'ENROLL NOW' }: { label?: string }) {
  return (
    <a href={THINKIFIC_URL} className="enroll-btn">
      {label}
    </a>
  );
}

// ─── FINALS POPUP ────────────────────────────────────────────────────────────

function FinalsPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('bb-finals-popup')) return;
    const onScroll = () => {
      if (window.scrollY < 200) return;
      window.removeEventListener('scroll', onScroll);
      setOpen(true);
      sessionStorage.setItem('bb-finals-popup', '1');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="popup-overlay" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" aria-label="Close" onClick={() => setOpen(false)}>
          &times;
        </button>
        <p className="popup-kicker">NBA Finals Proof</p>
        <p className="popup-headline">
          OG Anunoby Shot <span className="popup-gold">50% from 3</span> in the Finals on Calibration
        </p>
        <a href={THINKIFIC_URL} className="enroll-btn popup-btn">
          ENROLL NOW
        </a>
      </div>
    </div>
  );
}

// ─── SECTION LABEL ───────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="section-label-wrapper">
      <span className="section-label">{text}</span>
      <div className="gold-divider" />
    </div>
  );
}

// ─── RESULT CARD ─────────────────────────────────────────────────────────────

function ResultCard({ name, result, quote, logo }: { name: string; result: string; quote?: string; logo?: string }) {
  return (
    <div className="result-card">
      <div className="result-card-header">
        {logo && <img src={logo} alt="" className="result-logo" />}
        <p className="result-name">{name}</p>
      </div>
      {result && <p className="result-stat">{result}</p>}
      {quote && <p className="result-quote">&ldquo;{quote}&rdquo;</p>}
    </div>
  );
}

// ─── DAY BLOCK ───────────────────────────────────────────────────────────────

function DayBlock({ days, title, children }: { days: string; title: string; children: React.ReactNode }) {
  return (
    <div className="day-block">
      <p className="day-range">{days}</p>
      <p className="day-title">{title}</p>
      <p className="day-desc">{children}</p>
    </div>
  );
}

// ─── FAQ ITEM ────────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="faq-item">
      <p className="faq-q">{q}</p>
      <p className="faq-a">{a}</p>
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function MasterclassPage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).instgrm) {
      const s = document.createElement('script');
      s.src = '//www.instagram.com/embed.js';
      s.async = true;
      document.body.appendChild(s);
    } else if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
  }, []);

  useEffect(() => {
    const page = document.querySelector('.page');
    const els = document.querySelectorAll('.section');
    if (!page || !('IntersectionObserver' in window)) return;
    page.classList.add('reveal-ready');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -6% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="page">
      <StickyBanner />
      <FinalsPopup />

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="hero">
        <img
          src="/players/bblogolandingpage.png"
          alt="BB"
          className="logo"
        />
        <h1 className="hero-headline">The Only Shooting System That You Will Ever Need</h1>
        <p className="hero-sub">
          14 days to calibration. A lifetime of confidence from anywhere on the court.
        </p>

        <div className="vsl-embed">
          <video
            controls
            playsInline
            preload="metadata"
            className="vsl-video"
          >
            <source src="/vsl.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <EnrollButton />

        <div className="hero-copy-block">
          <p className="hero-body">
            <strong>Your shot isn&rsquo;t broken.<br />You&rsquo;ve just never been calibrated.</strong>
          </p>
          <p className="hero-body">
            Most players are taught to fix their form.
          </p>
          <p className="hero-body">
            That&rsquo;s not how the game works.
          </p>
          <p className="hero-body">
            We teach your system to adapt<br />so you can deliver the ball to the target<br />from any position, under any condition.
          </p>
          <p className="hero-body hero-proof">
            18% &rarr; 47%.
          </p>
          <p className="hero-body hero-proof">
            In-season.
          </p>
          <p className="hero-body hero-proof">
            Without changing mechanics.
          </p>
          <p className="hero-body hero-proof">
            Thousands of players calibrated.
          </p>
          <p className="hero-body hero-proof" style={{ fontSize: '1.15rem' }}>
            <strong>Now it&rsquo;s your turn.</strong>
          </p>
        </div>

        <EnrollButton />
      </section>

      {/* ── PLAYER RESULTS ──────────────────────────────────────────── */}
      <section className="section">
        <SectionLabel text="PLAYER RESULTS" />

        <div className="results-grid">
          <ResultCard
            name="Tobias Harris (Pistons)"
            result="18% to 47% (In less than 100 Days)"
            logo="/players/pistons-logo.svg"
          />
          <ResultCard
            name="Paul Reed (Pistons)"
            result="15% to 40% and 7x'd Amount of Makes"
            quote="My shot feels effortless"
            logo="/players/pistons-logo.svg"
          />
          <ResultCard
            name="Tyler Perkins (Villanova)"
            result="20% to 40% (In-Season)"
            logo="/players/villanova-logo.svg"
          />
          <ResultCard
            name="OG Anunoby (Knicks)"
            result="Career High 3pt % while being consulted by BB"
            logo="/players/knicks-logo.svg"
          />
          <ResultCard
            name="Tyler Burton (Grizzlies)"
            result="29% to 44% In less than 2 weeks"
            quote="My shot never has felt better"
            logo="/players/grizzlies-logo.svg"
          />
          <ResultCard
            name="Trey Drexler (HS PG, D1 Commit)"
            result="47% from 3 this year, 26.5 PPG, 90% FT"
            quote="Calibration changed my game"
          />
          <ResultCard
            name="Dominick Stewart (Penn State)"
            result="32% to 42% This season, In 3 weeks"
            logo="/players/pennstate-logo.svg"
          />
          <ResultCard
            name="Matisse Thybulle (Trail Blazers)"
            result="Finished 2026 Season Shooting 40%"
            logo="/players/blazers-logo.svg"
          />
          <ResultCard
            name="Dylan Cardwell (Kings)"
            result=""
            quote="Applying BB Methods was the best basketball session of my life"
            logo="/players/kings-logo.svg"
          />
          <ResultCard
            name="HS Coach"
            result=""
            quote="Calibration has evolved our program and we shot the best in years on the methods"
          />
        </div>

        <div style={{ marginTop: '1.25rem' }}>
          <EnrollButton />
        </div>
      </section>

      {/* ── THE 14-DAY CALIBRATION JOURNEY ─────────────────────────── */}
      <section className="section">
        <SectionLabel text="THE 14-DAY CALIBRATION JOURNEY" />
        <p className="section-subtitle">What You&rsquo;ll Experience:</p>

        <div className="day-blocks">
          <DayBlock days="Days 1-3" title="Deep Distance Calibration">
            Explore extensively from deep range. By day 3, the three-point line will feel like a free throw. Your system learns distance control.
          </DayBlock>
          <DayBlock days="Days 4-6" title="Movement Integration">
            Shoot off the hop, 1-2 step, and in motion. We open your movement bandwidth so calibration transfers to game conditions.
          </DayBlock>
          <DayBlock days="Days 7-10" title="Precision Targeting from Deep">
            Introduce precision from beyond the arc. You&rsquo;ll be knocking down threes from way outside the line &mdash; effortlessly.
          </DayBlock>
          <DayBlock days="Days 11-14" title="Precision At Its Best">
            Test your new calibration. Score above your average. Guaranteed. Your system has adapted, and the results prove it.
          </DayBlock>
        </div>

        <EnrollButton />
      </section>

      {/* ── AFTER THE 14 DAYS ──────────────────────────────────────── */}
      <section className="section">
        <SectionLabel text="AFTER THE 14 DAYS: YOUR NEW SHOOTING SYSTEM" />
        <p className="section-intro">The modules teach you more than just drills. They teach you how to think.</p>

        <ul className="after-list">
          <li><strong>Understand your miss profile</strong> &mdash; Know exactly what your system needs</li>
          <li><strong>Your system learns what to calibrate</strong> and explore to continue adapting</li>
          <li><strong>Game Days:</strong> Run the pre-game protocols to lock in calibration</li>
          <li><strong>Off-Days:</strong> Run modules 1-4 to maintain and evolve your system</li>
        </ul>

        <div className="closing-block">
          <p className="closing-bold">This is the only shooting course you&rsquo;ll ever need.</p>
          <p className="closing-text">Your form is not the problem. What you explore is. And this prepares you for any shot you will ever take in a game.</p>
        </div>

        <EnrollButton />
      </section>

      {/* ── VISUAL EVIDENCE ─────────────────────────────────────────── */}
      <section className="section">
        <SectionLabel text="VISUAL EVIDENCE" />

        <div className="reels-grid">
          {REELS.map((url) => (
            <div key={url} className="reel-embed">
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={url}
                data-instgrm-version="14"
                style={{
                  background: '#FFF',
                  border: 0,
                  borderRadius: '3px',
                  boxShadow: 'none',
                  margin: '0 auto',
                  maxWidth: '540px',
                  minWidth: '280px',
                  padding: 0,
                  width: '100%',
                }}
              />
            </div>
          ))}
        </div>

        {/* ── MEET THE COACH (inline) ──────────────────────────────── */}
        <div className="coach-inline">
          <SectionLabel text="MEET THE COACH BEHIND CALIBRATION" />

          <div className="coach-photo-wrap">
            <img
              src="/players/tommy-coach.jpg"
              alt="Coach Tommy Tempesta"
              className="coach-photo"
            />
          </div>

          <p className="coach-name">Tommy Tempesta</p>
          <p className="coach-title">NBA Coach &amp; Biomechanics Specialist</p>

          <p className="coach-bio">
            With over 25 years of research and application at the highest levels of basketball, Coach Tommy has developed the shooting calibration system used by NBA players worldwide.
          </p>

          <p className="coach-work-label">His Work Includes:</p>
          <ul className="coach-work-list">
            <li>Coaching NBA players including Tobias Harris, OG Anunoby, Paul Reed, Moses Brown, and Tyler Burton</li>
            <li>Consulting for NBA and NCAA teams like the Mavericks and Auburn University on player development and shooting calibration</li>
            <li>Pioneering the Basketball Biomechanics methodology that revolutionizes how players learn to shoot</li>
          </ul>
        </div>

        <div className="youtube-section">
          <p className="youtube-label">Watch a Full Calibration Session Here:</p>
          <div className="youtube-embed">
            <iframe
              src="https://www.youtube.com/embed/Bpm-jAX8c38"
              title="Full Calibration Session"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div style={{ marginTop: '1.25rem' }}>
          <EnrollButton />
        </div>
      </section>

      {/* ── WHY THIS WORKS ─────────────────────────────────────────── */}
      <section className="section">
        <SectionLabel text="WHY THIS WORKS" />

        <div className="compare-grid">
          <div className="compare-block compare-old">
            <p className="compare-label">Traditional Shooting Coaching</p>
            <p className="compare-text">Fix your form. Repeat the same shot 1,000 times. Hope it translates to games.</p>
          </div>
          <div className="compare-block compare-new">
            <p className="compare-label">Calibration-Based Training</p>
            <p className="compare-text">Your nervous system adapts through strategic exploration. You don&rsquo;t just learn one shot &mdash; you learn to make any shot.</p>
          </div>
        </div>

        <p className="compare-result">
          The result? Confidence from anywhere. Consistency under pressure. Percentages that actually improve in games, not just in the gym.
        </p>
      </section>

      {/* ── WHO THIS IS FOR ────────────────────────────────────────── */}
      <section className="section">
        <SectionLabel text="WHO THIS IS FOR" />

        <ul className="check-list">
          <li>Players who can shoot in practice but struggle in games</li>
          <li>Athletes looking to expand their range beyond the arc</li>
          <li>Coaches who want a system, not just drills</li>
          <li>Anyone tired of &ldquo;fix your form&rdquo; advice that doesn&rsquo;t work</li>
        </ul>
      </section>

      {/* ── WHAT'S INCLUDED ────────────────────────────────────────── */}
      <section className="section">
        <SectionLabel text="WHAT'S INCLUDED" />

        <ul className="included-list">
          <li>14-Day Calibration Protocol (video demonstrations)</li>
          <li>Pre-Game Shooting Protocols</li>
          <li>4 Core Modules for continuous adaptation</li>
          <li>Miss Profile Analysis framework</li>
          <li>Lifetime access to all updates</li>
        </ul>
      </section>

      {/* ── THE GUARANTEE ──────────────────────────────────────────── */}
      <section className="section guarantee-section">
        <SectionLabel text="THE GUARANTEE" />
        <p className="guarantee-text">
          Complete the 14-day protocol as designed. Test out on day 14. <strong>Your Score will be Higher.</strong>
        </p>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────── */}
      <section className="section pricing-section">
        <SectionLabel text="PRICING" />
        <div className="pricing-banner">
          <p className="pricing-banner-text">
            Get the Shooting Calibration Masterclass for <span className="pricing-banner-gold">$297</span>.
          </p>
          <p className="pricing-banner-bold">These protocols work in one session.</p>
          <div style={{ marginTop: '1rem' }}>
            <EnrollButton />
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <section className="section">
        <SectionLabel text="FAQ" />

        <div className="faq-list">
          <FaqItem
            q="Is this just another shooting drill program?"
            a="No. This teaches your nervous system to adapt to any shot through strategic exploration. Drills are the vehicle, calibration is the outcome."
          />
          <FaqItem
            q="Will this work if I'm a beginner?"
            a="Yes. Calibration works at every level because it's based on how your nervous system learns, not your current skill level."
          />
          <FaqItem
            q="How is this different from form-based coaching?"
            a="Form coaching tries to make you shoot the same way every time. Calibration trains your system to adapt to every situation you'll face in a game."
          />
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────── */}
      <section className="section cta-section">
        <h2 className="cta-headline">Stop fixing your form. Start calibrating your system.</h2>
        <EnrollButton label="JOIN THE MASTERCLASS NOW" />
        <p className="trust-line">Trusted by NBA, D1, and high school players worldwide.</p>
      </section>

      {/* ── STYLES ──────────────────────────────────────────────────── */}
      <style jsx global>{`
        /* ── Design tokens (white + gold) ─────────────────────────
           ink #161310 · body #4B463D · muted #948D7F
           gold #D4A843 · gold-deep #A57E2C (small text on white)
           hairline #ECE6D9 · warm #FAF7F1 · panel #0D0B08         */

        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body {
          background: #FFFFFF !important;
        }

        .page {
          background: #FFFFFF;
          color: #161310;
          font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
          line-height: 1.65;
          min-height: 100vh;
        }

        /* ── Urgency Banner ──────────────────────────────────────── */
        .urgency-banner {
          background: #0D0B08;
          text-align: center;
          padding: 0.8rem 1.25rem;
        }
        .urgency-banner--sticky {
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid rgba(212, 168, 67, 0.25);
        }
        .urgency-banner--inline {
          border-radius: 10px;
          margin-bottom: 0.75rem;
          padding: 0.6rem 1rem;
        }
        .urgency-text {
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          line-height: 1.5;
        }
        .urgency-gold {
          color: #D4A843;
          font-family: var(--font-oswald), sans-serif;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .countdown-numbers {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1rem;
          color: #D4A843;
          letter-spacing: 0.05em;
        }
        .countdown-expired {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          color: #D4A843;
        }
        .enroll-wrapper {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        /* ── Hero ────────────────────────────────────────────────── */
        .logo {
          height: 40px;
          width: auto;
          position: absolute;
          top: 1.4rem;
          left: 1.6rem;
        }
        .hero {
          position: relative;
          padding: 5.75rem 1.5rem 3.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 760px;
          margin: 0 auto;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          max-width: 100vw;
          height: 560px;
          background: radial-gradient(ellipse at top, rgba(212, 168, 67, 0.10) 0%, rgba(212, 168, 67, 0) 65%);
          pointer-events: none;
          z-index: 0;
        }
        .hero > *:not(.logo) { position: relative; z-index: 1; }
        .hero-headline {
          font-family: var(--font-oswald), sans-serif;
          font-size: clamp(2.4rem, 7vw, 4rem);
          font-weight: 700;
          text-transform: uppercase;
          line-height: 1.04;
          letter-spacing: 0.01em;
          color: #161310;
          margin-bottom: 1rem;
        }
        .hero-sub {
          font-size: clamp(0.95rem, 2vw, 1.1rem);
          color: #A57E2C;
          font-family: var(--font-oswald), sans-serif;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: 1.9rem;
          line-height: 1.55;
        }
        .hero-body {
          font-size: 1.02rem;
          color: #4B463D;
          line-height: 1.65;
          margin-bottom: 0.8rem;
          max-width: 560px;
        }
        .hero-proof {
          font-family: var(--font-oswald), sans-serif;
          color: #A57E2C;
          font-weight: 600;
          font-size: 1.08rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 0.45rem;
        }
        .hero-copy-block {
          margin-top: 2.25rem;
          margin-bottom: 2rem;
        }

        /* ── VSL Video ───────────────────────────────────────────── */
        .vsl-embed {
          width: 100%;
          margin-bottom: 1.9rem;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid #E4D9BC;
          background: #0D0B08;
          box-shadow: 0 30px 70px -30px rgba(22, 19, 16, 0.45);
        }
        .vsl-video {
          display: block;
          width: 100%;
          height: auto;
        }

        /* ── Enroll Button ───────────────────────────────────────── */
        .enroll-btn {
          display: block;
          background: #D4A843;
          color: #14110B;
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-align: center;
          text-decoration: none;
          padding: 1.2rem 3rem;
          border-radius: 999px;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          box-shadow: 0 16px 38px -14px rgba(212, 168, 67, 0.65);
          transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
        }
        .enroll-btn:hover {
          background: #E0B75A;
          transform: translateY(-2px);
          box-shadow: 0 22px 46px -14px rgba(212, 168, 67, 0.75);
        }
        .enroll-btn:active { transform: translateY(0); }

        /* ── Section ─────────────────────────────────────────────── */
        .section {
          padding: 4.25rem 1.5rem;
          max-width: 680px;
          margin: 0 auto;
          border-top: 1px solid #F1ECE1;
        }
        .page.reveal-ready .section {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .page.reveal-ready .section.in {
          opacity: 1;
          transform: none;
        }

        /* ── Section Label ───────────────────────────────────────── */
        .section-label-wrapper {
          margin-bottom: 1.75rem;
        }
        .section-label {
          font-family: var(--font-oswald), sans-serif;
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #A57E2C;
          display: block;
          margin-bottom: 0.65rem;
        }
        .gold-divider {
          height: 2px;
          width: 44px;
          background: #D4A843;
        }

        /* ── Section Subtitle / Intro ────────────────────────────── */
        .section-subtitle {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.35rem;
          color: #161310;
          margin-bottom: 1rem;
        }
        .section-intro {
          color: #4B463D;
          font-size: 1.05rem;
          line-height: 1.65;
          margin-bottom: 1.5rem;
        }

        /* ── Results Grid ────────────────────────────────────────── */
        .results-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .result-card {
          background: #FFFFFF;
          border: 1px solid #ECE6D9;
          border-radius: 16px;
          padding: 1.4rem 1.5rem;
          box-shadow: 0 1px 2px rgba(22, 19, 16, 0.03);
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .result-card:hover {
          transform: translateY(-3px);
          border-color: #DBC48C;
          box-shadow: 0 18px 44px -22px rgba(22, 19, 16, 0.2);
        }
        .result-card-header {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 0.5rem;
        }
        .result-logo {
          width: 30px;
          height: 30px;
          object-fit: contain;
          flex-shrink: 0;
        }
        .result-name {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 600;
          font-size: 1.02rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #161310;
        }
        .result-stat {
          color: #A57E2C;
          font-weight: 700;
          font-size: 0.96rem;
          line-height: 1.45;
        }
        .result-quote {
          color: #948D7F;
          font-style: italic;
          font-size: 0.9rem;
          margin-top: 0.5rem;
          line-height: 1.5;
        }

        /* ── Day Blocks ──────────────────────────────────────────── */
        .day-blocks {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.75rem;
        }
        .day-block {
          background: #FAF7F1;
          border: 1px solid #EFE8DA;
          border-left: 3px solid #D4A843;
          border-radius: 12px;
          padding: 1.35rem 1.5rem;
        }
        .day-range {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #A57E2C;
        }
        .day-title {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.15rem;
          color: #161310;
          margin: 0.3rem 0 0.4rem;
        }
        .day-desc {
          color: #4B463D;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* ── After List ──────────────────────────────────────────── */
        .after-list {
          list-style: none;
          margin-bottom: 1.75rem;
        }
        .after-list li {
          position: relative;
          padding-left: 1.6rem;
          margin-bottom: 0.8rem;
          color: #161310;
          font-size: 1rem;
          line-height: 1.6;
        }
        .after-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.58em;
          width: 8px;
          height: 8px;
          background: #D4A843;
          border-radius: 50%;
        }

        /* ── Closing Block ───────────────────────────────────────── */
        .closing-block {
          background: #0D0B08;
          border-radius: 16px;
          padding: 2rem 1.75rem;
          margin-bottom: 1.75rem;
          text-align: center;
        }
        .closing-bold {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.3rem;
          color: #FFFFFF;
          margin-bottom: 0.6rem;
        }
        .closing-text {
          color: rgba(255, 255, 255, 0.66);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* ── Coach Section ───────────────────────────────────────── */
        .coach-inline {
          text-align: center;
          margin-top: 2.5rem;
          margin-bottom: 2rem;
          padding-top: 2.5rem;
          border-top: 1px solid #F1ECE1;
        }
        .coach-photo-wrap {
          width: 250px;
          height: 295px;
          margin: 0 auto 1.4rem;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #E4D9BC;
          box-shadow: 0 24px 55px -26px rgba(22, 19, 16, 0.35);
        }
        .coach-photo {
          width: 100%;
          height: 180%;
          object-fit: cover;
          object-position: center 10%;
        }
        .coach-name {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.5rem;
          color: #161310;
          margin-bottom: 0.2rem;
        }
        .coach-title {
          color: #A57E2C;
          font-family: var(--font-oswald), sans-serif;
          font-weight: 600;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          margin-bottom: 1.1rem;
        }
        .coach-bio {
          color: #4B463D;
          font-size: 1rem;
          line-height: 1.65;
          margin-bottom: 1.4rem;
          text-align: left;
        }
        .coach-work-label {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          color: #161310;
          margin-bottom: 0.75rem;
          text-align: left;
        }
        .coach-work-list {
          list-style: none;
          margin-bottom: 1.5rem;
          text-align: left;
        }
        .coach-work-list li {
          position: relative;
          padding-left: 1.6rem;
          margin-bottom: 0.75rem;
          color: #161310;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .coach-work-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.58em;
          width: 8px;
          height: 8px;
          background: #D4A843;
          border-radius: 50%;
        }

        /* ── Reels Grid ──────────────────────────────────────────── */
        .reels-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .reel-embed {
          width: 100%;
          overflow: hidden;
          border-radius: 12px;
        }
        .reel-embed .instagram-media {
          margin: 0 auto !important;
          width: 100% !important;
          min-width: unset !important;
        }

        /* ── YouTube Embed ───────────────────────────────────────── */
        .youtube-section {
          margin-top: 2.25rem;
        }
        .youtube-label {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.15rem;
          color: #161310;
          text-align: center;
          margin-bottom: 1rem;
        }
        .youtube-embed {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
          border-radius: 14px;
          border: 1px solid #E4D9BC;
          box-shadow: 0 24px 55px -28px rgba(22, 19, 16, 0.35);
        }
        .youtube-embed iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }

        /* ── Compare Grid ────────────────────────────────────────── */
        .compare-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.4rem;
        }
        .compare-block {
          padding: 1.5rem 1.6rem;
          border-radius: 14px;
        }
        .compare-old {
          background: #F7F5F0;
          border: 1px solid #E8E3D8;
        }
        .compare-new {
          background: #FBF5E6;
          border: 1px solid #E2CD97;
        }
        .compare-label {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          margin-bottom: 0.45rem;
          color: #161310;
        }
        .compare-text {
          color: #4B463D;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .compare-result {
          color: #A57E2C;
          font-weight: 600;
          font-size: 1.05rem;
          line-height: 1.6;
          text-align: center;
          margin-bottom: 1rem;
        }

        /* ── Check List (Who This Is For) ────────────────────────── */
        .check-list {
          list-style: none;
        }
        .check-list li {
          position: relative;
          padding-left: 2rem;
          margin-bottom: 0.85rem;
          color: #161310;
          font-size: 1rem;
          line-height: 1.6;
        }
        .check-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          top: 0;
          color: #D4A843;
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.15rem;
        }

        /* ── Included List ───────────────────────────────────────── */
        .included-list {
          list-style: none;
        }
        .included-list li {
          position: relative;
          padding-left: 1.6rem;
          margin-bottom: 0.75rem;
          color: #161310;
          font-size: 1rem;
          line-height: 1.6;
        }
        .included-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.58em;
          width: 8px;
          height: 8px;
          background: #D4A843;
          border-radius: 50%;
        }

        /* ── Guarantee ───────────────────────────────────────────── */
        .guarantee-section {
          text-align: center;
        }
        .guarantee-section .section-label-wrapper {
          display: inline-block;
        }
        .guarantee-section .gold-divider {
          margin: 0.65rem auto 0;
        }
        .guarantee-text {
          font-size: 1.15rem;
          color: #161310;
          line-height: 1.7;
          max-width: 46ch;
          margin: 0 auto;
        }
        .guarantee-text strong {
          font-family: var(--font-oswald), sans-serif;
          font-size: 1.2em;
        }

        /* ── Pricing ─────────────────────────────────────────────── */
        .pricing-section {
          text-align: center;
        }
        .pricing-section .section-label-wrapper {
          display: inline-block;
        }
        .pricing-section .gold-divider {
          margin: 0.65rem auto 0;
        }
        .pricing-banner {
          background: #0D0B08;
          border-radius: 20px;
          padding: 2.75rem 2rem;
          text-align: center;
          box-shadow: 0 30px 70px -32px rgba(22, 19, 16, 0.55);
        }
        .pricing-banner-text {
          color: rgba(255, 255, 255, 0.82);
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 0.5rem;
        }
        .pricing-banner-gold {
          display: block;
          color: #D4A843;
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 2.6rem;
          line-height: 1.2;
          margin-top: 0.35rem;
        }
        .pricing-banner-bold {
          color: #D4A843;
          font-family: var(--font-oswald), sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: 0.9rem;
        }

        /* ── FAQ ─────────────────────────────────────────────────── */
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .faq-item {
          border-bottom: 1px solid #EFE9DD;
          padding-bottom: 1.25rem;
        }
        .faq-q {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.08rem;
          color: #161310;
          margin-bottom: 0.45rem;
        }
        .faq-a {
          color: #4B463D;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* ── CTA Section ─────────────────────────────────────────── */
        .cta-section {
          text-align: center;
          padding-bottom: 5.5rem;
        }
        .cta-headline {
          font-family: var(--font-oswald), sans-serif;
          font-size: clamp(1.9rem, 6vw, 2.9rem);
          font-weight: 700;
          text-transform: uppercase;
          color: #161310;
          line-height: 1.1;
          margin-bottom: 1.6rem;
        }
        .trust-line {
          color: #948D7F;
          font-size: 0.74rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          text-align: center;
          margin-top: 1.3rem;
        }

        /* ── Finals Popup ────────────────────────────────────────── */
        .popup-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(13, 11, 8, 0.74);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: popupFade 0.35s ease both;
        }
        .popup-card {
          position: relative;
          background: #0D0B08;
          border: 1px solid rgba(212, 168, 67, 0.75);
          border-radius: 20px;
          box-shadow: 0 30px 90px rgba(212, 168, 67, 0.22);
          max-width: 480px;
          width: 100%;
          padding: 2.75rem 2rem 2.25rem;
          text-align: center;
          animation: popupIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .popup-close {
          position: absolute;
          top: 0.6rem;
          right: 0.9rem;
          background: none;
          border: 0;
          color: rgba(255, 255, 255, 0.55);
          font-size: 1.9rem;
          line-height: 1;
          cursor: pointer;
          padding: 0.25rem;
        }
        .popup-close:hover {
          color: #FFFFFF;
        }
        .popup-kicker {
          color: #D4A843;
          font-family: var(--font-oswald), sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          margin-bottom: 0.9rem;
        }
        .popup-headline {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: clamp(1.5rem, 5.5vw, 2rem);
          line-height: 1.2;
          color: #FFFFFF;
          margin-bottom: 1.5rem;
        }
        .popup-gold {
          color: #D4A843;
        }
        .popup-btn {
          max-width: 300px;
        }
        @keyframes popupFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popupIn {
          from { opacity: 0; transform: translateY(28px) scale(0.94); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Motion preferences ──────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .popup-overlay, .popup-card { animation: none; }
          .page.reveal-ready .section {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }

        /* ── Desktop ─────────────────────────────────────────────── */
        @media (min-width: 768px) {
          .section {
            padding: 5rem 2rem;
          }
          .hero {
            padding: 7rem 2rem 3.5rem;
          }
          .enroll-btn {
            width: auto;
            min-width: 340px;
          }
          .reels-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
          }
          .results-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.1rem;
          }
          .compare-grid {
            flex-direction: row;
          }
          .compare-block {
            flex: 1;
          }
        }
      `}</style>
    </main>
  );
}
