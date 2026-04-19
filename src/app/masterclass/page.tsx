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

function EnrollButton({ label = 'ENROLL NOW' }: { label?: string }) {
  return (
    <a href={THINKIFIC_URL} className="enroll-btn">
      {label}
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

  return (
    <main className="page">
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

        <p className="hero-body">
          <strong>Your form isn&rsquo;t the problem.<br />What you explore is.</strong>
        </p>
        <p className="hero-body">
          Most shooting programs try to fix your mechanics.
        </p>
        <p className="hero-body">
          We teach your system to adapt to any shot you&rsquo;ll ever take in a game.
        </p>
        <p className="hero-body hero-proof">
          An NBA Vet went from 18% to 47%. Thousands of players calibrated. Available to you now.
        </p>

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
        <div className="pricing-card">
          <p className="pricing-old">Regular Price: <span className="strikethrough">$299</span></p>
          <p className="pricing-current">Off-Season Price: <span className="pricing-amount">$149</span></p>
          <p className="pricing-urgency">Early access ends April 30th. Join now and lock in the off-season rate forever.</p>
          <EnrollButton />
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
          padding: 4.5rem 1.5rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 680px;
          margin: 0 auto;
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
          margin-bottom: 1.25rem;
          line-height: 1.4;
        }
        .hero-body {
          font-size: 1rem;
          color: #333333;
          line-height: 1.6;
          margin-bottom: 0.75rem;
          max-width: 560px;
        }
        .hero-proof {
          color: #D4A843;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        /* ── VSL Video ───────────────────────────────────────────── */
        .vsl-embed {
          margin-bottom: 1.5rem;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #D4A843;
          background: #000;
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
          padding: 1.75rem 1.5rem;
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

        /* ── Section Subtitle / Intro ────────────────────────────── */
        .section-subtitle {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.15rem;
          color: #000000;
          margin-bottom: 1rem;
        }
        .section-intro {
          color: #333333;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }

        /* ── Day Blocks ──────────────────────────────────────────── */
        .day-blocks {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .day-block {
          border-left: 4px solid #D4A843;
          padding: 1rem 1.25rem;
          background: #FAFAFA;
          border-radius: 0 8px 8px 0;
        }
        .day-range {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          color: #D4A843;
          margin-bottom: 0.25rem;
        }
        .day-title {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          color: #000000;
          margin-bottom: 0.4rem;
        }
        .day-desc {
          color: #444444;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        /* ── After List ──────────────────────────────────────────── */
        .after-list {
          list-style: none;
          margin-bottom: 1.5rem;
        }
        .after-list li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
          color: #000000;
          font-size: 1rem;
          line-height: 1.5;
        }
        .after-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.55em;
          width: 8px;
          height: 8px;
          background: #D4A843;
          border-radius: 50%;
        }

        /* ── Closing Block ───────────────────────────────────────── */
        .closing-block {
          border: 2px solid #D4A843;
          border-radius: 10px;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .closing-bold {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.15rem;
          color: #000000;
          margin-bottom: 0.5rem;
        }
        .closing-text {
          color: #444444;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        /* ── Coach Section ───────────────────────────────────────── */
        .coach-inline {
          text-align: center;
          margin-top: 2rem;
          margin-bottom: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #EEE;
        }
        .coach-photo-wrap {
          width: 240px;
          height: 280px;
          margin: 0 auto 1.25rem;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #D4A843;
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
          font-size: 1.4rem;
          color: #000000;
          margin-bottom: 0.15rem;
        }
        .coach-title {
          color: #D4A843;
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }
        .coach-bio {
          color: #444444;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1.25rem;
          text-align: left;
        }
        .coach-work-label {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          color: #000000;
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
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
          color: #000000;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .coach-work-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.55em;
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
        }
        .reel-embed .instagram-media {
          margin: 0 auto !important;
          width: 100% !important;
          min-width: unset !important;
        }

        /* ── YouTube Embed ───────────────────────────────────────── */
        .youtube-section {
          margin-top: 2rem;
        }
        .youtube-label {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          color: #000000;
          text-align: center;
          margin-bottom: 1rem;
        }
        .youtube-embed {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
          border-radius: 10px;
          border: 2px solid #D4A843;
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
          margin-bottom: 1.25rem;
        }
        .compare-block {
          padding: 1.25rem;
          border-radius: 10px;
        }
        .compare-old {
          background: #F5F5F5;
          border: 1px solid #DDD;
        }
        .compare-new {
          background: #FDF8EE;
          border: 2px solid #D4A843;
        }
        .compare-label {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 0.4rem;
          color: #000000;
        }
        .compare-text {
          color: #444444;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .compare-result {
          color: #D4A843;
          font-weight: 600;
          font-size: 1rem;
          line-height: 1.5;
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
          margin-bottom: 0.75rem;
          color: #000000;
          font-size: 1rem;
          line-height: 1.5;
        }
        .check-list li::before {
          content: '✅';
          position: absolute;
          left: 0;
          top: 0;
          font-size: 1.1rem;
        }

        /* ── Included List ───────────────────────────────────────── */
        .included-list {
          list-style: none;
        }
        .included-list li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.7rem;
          color: #000000;
          font-size: 1rem;
          line-height: 1.5;
        }
        .included-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.55em;
          width: 8px;
          height: 8px;
          background: #D4A843;
          border-radius: 50%;
        }

        /* ── Guarantee ───────────────────────────────────────────── */
        .guarantee-section {
          text-align: center;
        }
        .guarantee-text {
          font-size: 1.1rem;
          color: #000000;
          line-height: 1.6;
        }

        /* ── Pricing ─────────────────────────────────────────────── */
        .pricing-section {
          text-align: center;
        }
        .pricing-card {
          border: 2px solid #D4A843;
          border-radius: 12px;
          padding: 2rem 1.5rem;
          background: #FAFAFA;
        }
        .pricing-old {
          color: #888888;
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }
        .strikethrough {
          text-decoration: line-through;
        }
        .pricing-current {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          color: #000000;
          margin-bottom: 0.75rem;
        }
        .pricing-amount {
          font-size: 2rem;
          color: #D4A843;
        }
        .pricing-urgency {
          color: #555555;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }

        /* ── FAQ ─────────────────────────────────────────────────── */
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .faq-item {
          border-bottom: 1px solid #EEE;
          padding-bottom: 1rem;
        }
        .faq-q {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          color: #000000;
          margin-bottom: 0.4rem;
        }
        .faq-a {
          color: #444444;
          font-size: 0.95rem;
          line-height: 1.5;
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
        .result-card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }
        .result-logo {
          width: 28px;
          height: 28px;
          object-fit: contain;
          flex-shrink: 0;
        }
        .result-name {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          color: #000000;
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
          margin-bottom: 1.25rem;
        }

        /* ── Trust Line ───────────────────────────────────────────── */
        .trust-line {
          color: #555555;
          font-size: 0.85rem;
          text-align: center;
          margin-top: 1rem;
        }

        /* ── Desktop ─────────────────────────────────────────────── */
        @media (min-width: 768px) {
          .section {
            padding: 2.5rem 2rem;
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
