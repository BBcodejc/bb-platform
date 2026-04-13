'use client';

import { useEffect } from 'react';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const THINKIFIC_URL = 'https://bbcode.thinkific.com/enroll/3585033';

const REELS = [
  'https://www.instagram.com/reel/DXAZutfkXm_/',
  'https://www.instagram.com/reel/DW8vktWBrPU/',
  'https://www.instagram.com/reel/DVBd9SyEfnU/',
  'https://www.instagram.com/reel/DUBOdZZEXRM/',
];

// ─── ENROLL BUTTON ───────────────────────────────────────────────────────────

function EnrollButton() {
  return (
    <a
      href={THINKIFIC_URL}
      className="enroll-btn"
    >
      ENROLL NOW
    </a>
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

function ResultCard({ name, result, quote }: { name: string; result: string; quote?: string }) {
  return (
    <div className="result-card">
      <p className="result-name">{name}</p>
      {result && <p className="result-stat">{result}</p>}
      {quote && <p className="result-quote">&ldquo;{quote}&rdquo;</p>}
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

  return (
    <main className="page">
      {/* ── SECTION 1: HERO ─────────────────────────────────────────── */}
      <section className="hero">
        <img
          src="/players/bblogolandingpage.png"
          alt="BB"
          className="logo"
        />
        <h1 className="hero-headline">Calibrate Your Shot In 14 Days.</h1>
        <p className="hero-sub">
          The exact protocols used with NBA players. $150. Lifetime access.
        </p>
        <EnrollButton />
      </section>

      {/* ── SECTION 2: PROOF ────────────────────────────────────────── */}
      <section className="section">
        <SectionLabel text="RESULTS" />

        <div className="proof-blocks">
          <div className="proof-block">
            <p className="proof-player">NBA Vet</p>
            <p className="proof-result">18% to 47% from three. In-season. Under 100 days.</p>
          </div>
          <div className="proof-block">
            <p className="proof-player">NBA Big Man</p>
            <p className="proof-result">15% to 40% from three. In-season. 4 months.</p>
          </div>
          <div className="proof-block">
            <p className="proof-player">D1 Guard</p>
            <p className="proof-result">29% to 44% from three. In-season. 2 weeks.</p>
          </div>
        </div>

        <p className="calibration-only">Zero form corrections. Calibration only.</p>
        <EnrollButton />
      </section>

      {/* ── SECTION 3: VISUAL EVIDENCE ──────────────────────────────── */}
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

        <div style={{ marginTop: '1.5rem' }}>
          <EnrollButton />
        </div>
      </section>

      {/* ── SECTION 4: WHAT YOU GET ─────────────────────────────────── */}
      <section className="section">
        <SectionLabel text="WHAT IS INSIDE" />

        <ul className="feature-list">
          <li>Full Protocols to RUN AFTER THE 14 DAYS</li>
          <li>Back rim calibration protocol</li>
          <li>Deep distance calibration protocol</li>
          <li>Ball flight exploration methods</li>
          <li>Pre-game calibration routine</li>
          <li>Exit speed and precision protocols</li>
          <li>The exact system used with NBA players</li>
        </ul>

        <p className="feature-desc">
          Everything you need to calibrate your shot for what the game actually demands.
        </p>
        <EnrollButton />
      </section>

      {/* ── SECTION 5: CREDIBILITY ──────────────────────────────────── */}
      <section className="section">
        <SectionLabel text="THE METHOD" />
        <p className="method-text">
          Founded by Coach Tommy Tempesta. 25+ years of research in motor learning and biomechanics out of Columbia University. Every protocol is backed by visual evidence and tested at the highest level.
        </p>
      </section>

      {/* ── SECTION 6: FINAL CTA ────────────────────────────────────── */}
      <section className="section cta-section">
        <h2 className="cta-headline">Stop Guessing. Start Calibrating.</h2>
        <p className="cta-sub">$150. Lifetime access. Start today.</p>
        <EnrollButton />
        <p className="cta-note">Instant access after purchase.</p>
      </section>

      {/* ── SECTION 7: DETAILED RESULTS ─────────────────────────────── */}
      <section className="section">
        <SectionLabel text="PLAYER RESULTS" />

        <div className="results-grid">
          <ResultCard
            name="Tobias Harris (Pistons)"
            result="18% to 47% (In less than 100 Days)"
          />
          <ResultCard
            name="Paul Reed (Pistons)"
            result="15% to 40% and 7x'd Amount of Makes"
            quote="My shot feels effortless"
          />
          <ResultCard
            name="Tyler Perkins (Villanova)"
            result="20% to 40% (In-Season)"
          />
          <ResultCard
            name="OG Anunoby"
            result="Career High 3pt % while being consulted by BB"
          />
          <ResultCard
            name="Tyler Burton (Grizzlies)"
            result="29% to 44% In less than 2 weeks"
            quote="My shot never has felt better"
          />
          <ResultCard
            name="Trey Drexler (D1 HS Commit)"
            result="47% from 3 this year, 26.5 PPG, 90% FT"
            quote="Calibration changed my game"
          />
          <ResultCard
            name="Dominick Stewart (Penn State)"
            result="32% to 42% This season, In 3 weeks"
          />
          <ResultCard
            name="Matisse Thybulle (Trail Blazers)"
            result="Finished 2026 Season Shooting 40%"
          />
          <ResultCard
            name="Dylan Cardwell (Kings)"
            result=""
            quote="Applying BB Methods was the best basketball session of my life"
          />
          <ResultCard
            name="HS Coach"
            result=""
            quote="Calibration has evolved our program and we shot the best in years on the methods"
          />
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <EnrollButton />
        </div>
      </section>

      {/* ── STYLES ──────────────────────────────────────────────────── */}
      <style jsx global>{`
        /* ── Reset & Base ─────────────────────────────────────────── */
        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body {
          background: #FFFFFF !important;
        }

        .page {
          background: #FFFFFF;
          color: #000000;
          font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }

        /* ── Hero ────────────────────────────────────────────────── */
        .logo {
          height: 36px;
          width: auto;
          position: absolute;
          top: 1rem;
          left: 1.5rem;
        }
        .hero {
          position: relative;
          padding: 5rem 1.5rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .hero-headline {
          font-family: var(--font-oswald), sans-serif;
          font-size: 2.4rem;
          font-weight: 700;
          line-height: 1.1;
          color: #000000;
          margin-bottom: 0.75rem;
        }
        .hero-sub {
          font-size: clamp(0.95rem, 3.5vw, 1.2rem);
          color: #D4A843;
          font-weight: 600;
          margin-bottom: 1.5rem;
          line-height: 1.4;
        }

        /* ── Enroll Button ───────────────────────────────────────── */
        .enroll-btn {
          display: block;
          background: #D4A843;
          color: #000000;
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.15rem;
          letter-spacing: 0.08em;
          text-align: center;
          text-decoration: none;
          padding: 1rem 2.5rem;
          border-radius: 8px;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          transition: opacity 0.2s;
        }
        .enroll-btn:hover {
          opacity: 0.88;
        }

        /* ── Section ─────────────────────────────────────────────── */
        .section {
          padding: 2.25rem 1.5rem;
          max-width: 680px;
          margin: 0 auto;
        }

        /* ── Section Label ───────────────────────────────────────── */
        .section-label-wrapper {
          margin-bottom: 1.25rem;
        }
        .section-label {
          font-family: var(--font-oswald), sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: #D4A843;
          display: block;
          margin-bottom: 0.5rem;
        }
        .gold-divider {
          height: 2px;
          width: 60px;
          background: #D4A843;
        }

        /* ── Proof Blocks ────────────────────────────────────────── */
        .proof-blocks {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .proof-block {
          padding-left: 1rem;
          border-left: 3px solid #D4A843;
        }
        .proof-player {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          color: #000000;
          margin-bottom: 0.25rem;
        }
        .proof-result {
          color: #D4A843;
          font-weight: 600;
          font-size: 0.95rem;
          line-height: 1.4;
        }
        .calibration-only {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.15rem;
          color: #000000;
          text-align: center;
          margin-bottom: 1.5rem;
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
        }
        .reel-embed .instagram-media {
          margin: 0 auto !important;
          width: 100% !important;
          min-width: unset !important;
        }

        /* ── Feature List ────────────────────────────────────────── */
        .feature-list {
          list-style: none;
          margin-bottom: 1.25rem;
        }
        .feature-list li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.7rem;
          color: #000000;
          font-size: 1rem;
          line-height: 1.5;
        }
        .feature-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.55em;
          width: 8px;
          height: 8px;
          background: #D4A843;
          border-radius: 50%;
        }
        .feature-list li:first-child {
          font-weight: 700;
          font-size: 1.05rem;
          margin-bottom: 1rem;
        }
        .feature-desc {
          color: #555555;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        /* ── Method / Credibility ────────────────────────────────── */
        .method-text {
          color: #555555;
          font-size: 1rem;
          line-height: 1.6;
        }

        /* ── CTA Section ─────────────────────────────────────────── */
        .cta-section {
          text-align: center;
        }
        .cta-headline {
          font-family: var(--font-oswald), sans-serif;
          font-size: clamp(1.8rem, 6vw, 2.8rem);
          font-weight: 700;
          color: #000000;
          line-height: 1.15;
          margin-bottom: 0.75rem;
        }
        .cta-sub {
          color: #D4A843;
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }
        .cta-note {
          color: #555555;
          font-size: 0.85rem;
          margin-top: 0.75rem;
        }

        /* ── Results Grid ────────────────────────────────────────── */
        .results-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .result-card {
          border: 2px solid #D4A843;
          border-radius: 10px;
          padding: 1rem 1.25rem;
          background: #FFFFFF;
        }
        .result-name {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          color: #000000;
          margin-bottom: 0.25rem;
        }
        .result-stat {
          color: #D4A843;
          font-weight: 600;
          font-size: 0.95rem;
          line-height: 1.4;
        }
        .result-quote {
          color: #555555;
          font-style: italic;
          font-size: 0.9rem;
          margin-top: 0.4rem;
          line-height: 1.4;
        }

        /* ── Desktop ─────────────────────────────────────────────── */
        @media (min-width: 768px) {
          .section {
            padding: 3rem 2rem;
          }
          .hero {
            padding: 5rem 2rem 2.5rem;
          }
          .hero-headline {
            font-size: 3.5rem;
          }
          .enroll-btn {
            width: auto;
            min-width: 320px;
          }
          .reels-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
          }
          .results-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </main>
  );
}
