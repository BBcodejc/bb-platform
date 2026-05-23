import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="home">
      <div className="bg-glow" />

      {/* HEADER */}
      <header className="header">
        <div className="logo">BASKETBALL BIOMECHANICS</div>
      </header>

      {/* HERO */}
      <section className="hero">
        <p className="eyebrow">METHODS, NOT DRILLS</p>
        <h1 className="headline">
          The Shooting System<br />
          NBA Players Use to <span className="gold">Calibrate.</span>
        </h1>
        <p className="sub">
          18% to 47% from three. In-season. Without changing mechanics.<br />
          Calibration-based development used by NBA, D1, and HS players worldwide.
        </p>
        <div className="cta-row">
          <Link href="/masterclass" className="btn btn-primary">
            ENROLL IN THE MASTERCLASS
          </Link>
          <Link href="/apply" className="btn btn-secondary">
            APPLY FOR COACHING
          </Link>
        </div>
      </section>

      {/* WHAT THIS IS */}
      <section className="what-section">
        <p className="eyebrow center">WHAT THIS IS</p>
        <h2 className="what-title">
          Your shot isn&rsquo;t broken.<br />
          You&rsquo;ve just never been <span className="gold">calibrated.</span>
        </h2>
        <p className="what-body">
          Basketball Biomechanics is a calibration-based shooting development system built by Coach Tommy Tempesta over 25+ years of research. We don&rsquo;t fix your form. We teach your nervous system to adapt to any shot you&rsquo;ll ever take in a game.
        </p>
        <p className="what-body">
          Trusted by NBA players, D1 programs, and HS players worldwide.
        </p>
      </section>

      {/* CARDS */}
      <section className="cards">
        <Link href="/masterclass" className="card">
          <div className="card-eyebrow">FOR PLAYERS &middot; SELF-PACED</div>
          <div className="card-title">Shooting Calibration Masterclass</div>
          <div className="card-body">
            14 days to calibration. A lifetime of confidence from anywhere on the court. Self-paced video protocols. Lifetime access.
          </div>
          <div className="card-price">$297</div>
          <div className="card-cta">Enroll now &rarr;</div>
        </Link>

        <Link href="/apply" className="card">
          <div className="card-eyebrow">FOR PLAYERS &middot; 1-ON-1</div>
          <div className="card-title">Apply for Coaching</div>
          <div className="card-body">
            Direct work with Coach Tommy and the BB team. Custom assessment, calibration plan, and ongoing development. Limited spots.
          </div>
          <div className="card-price">By application</div>
          <div className="card-cta">Apply now &rarr;</div>
        </Link>

        <Link href="/programs" className="card">
          <div className="card-eyebrow">FOR PROGRAMS &middot; TEAMS</div>
          <div className="card-title">Program Implementation</div>
          <div className="card-body">
            12-week embedded engagement for NBA, NCAA, and HS programs. Assessment-based, system-wide implementation.
          </div>
          <div className="card-price">By application</div>
          <div className="card-cta">Apply now &rarr;</div>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        Basketball Biomechanics &bull; BB Code LLC &bull; Las Vegas, NV
      </footer>

      <style>{`
        :root {
          --gold: #D4A843;
          --dark: #0a0a0a;
          --gray: #aaaaaa;
          --gray-dim: #888888;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body {
          background: var(--dark);
          color: #fff;
        }

        .home {
          min-height: 100vh;
          background: var(--dark);
          color: #fff;
          font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
          position: relative;
          padding: 0 24px 48px;
        }

        .bg-glow {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(ellipse at 50% 20%, rgba(212,168,67,0.08) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .header {
          position: relative;
          z-index: 1;
          padding: 24px 0;
          text-align: center;
        }

        .logo {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 4px;
          color: var(--gold);
        }

        .hero {
          position: relative;
          z-index: 1;
          max-width: 880px;
          margin: 0 auto;
          padding: 60px 0 48px;
          text-align: center;
        }

        .eyebrow {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 4px;
          color: var(--gold);
          margin-bottom: 24px;
        }

        .headline {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: clamp(40px, 7vw, 76px);
          line-height: 1.05;
          text-transform: uppercase;
          letter-spacing: -1px;
          margin-bottom: 24px;
        }

        .gold {
          color: var(--gold);
        }

        .sub {
          font-size: clamp(15px, 2vw, 18px);
          color: var(--gray);
          line-height: 1.6;
          max-width: 640px;
          margin: 0 auto 40px;
        }

        .cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
        }

        .btn {
          display: inline-block;
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: var(--gold);
          color: var(--dark);
        }

        .btn-primary:hover {
          background: #E8C96A;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(212,168,67,0.3);
        }

        .btn-secondary {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(212,168,67,0.4);
        }

        .btn-secondary:hover {
          border-color: var(--gold);
          background: rgba(212,168,67,0.05);
        }

        .cards {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 32px 0 48px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        @media (max-width: 920px) {
          .cards { grid-template-columns: 1fr; max-width: 600px; }
        }

        .card {
          display: block;
          background: #111;
          border: 1px solid rgba(212,168,67,0.15);
          border-radius: 12px;
          padding: 32px 28px;
          text-decoration: none;
          color: #fff;
          transition: all 0.2s ease;
        }

        .card:hover {
          border-color: rgba(212,168,67,0.5);
          transform: translateY(-4px);
        }

        .card-eyebrow {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 600;
          font-size: 11px;
          letter-spacing: 3px;
          color: var(--gold);
          margin-bottom: 12px;
        }

        .card-title {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 24px;
          line-height: 1.15;
          margin-bottom: 12px;
        }

        .card-body {
          color: var(--gray);
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .card-price {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 1px;
          color: #fff;
          margin-bottom: 12px;
        }

        .card-cta {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 2px;
          color: var(--gold);
          text-transform: uppercase;
        }

        .what-section {
          position: relative;
          z-index: 1;
          max-width: 760px;
          margin: 0 auto;
          padding: 64px 0 32px;
          text-align: center;
        }

        .eyebrow.center {
          margin-bottom: 16px;
        }

        .what-title {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: clamp(28px, 4.5vw, 44px);
          line-height: 1.15;
          text-transform: uppercase;
          letter-spacing: -0.5px;
          margin-bottom: 24px;
        }

        .what-body {
          color: var(--gray);
          font-size: 16px;
          line-height: 1.7;
          margin-bottom: 16px;
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
        }

        .footer {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 48px 0 24px;
          font-size: 12px;
          color: var(--gray-dim);
          letter-spacing: 1px;
        }

        @media (max-width: 720px) {
          .cards { grid-template-columns: 1fr; }
          .cta-row { flex-direction: column; align-items: stretch; }
          .btn { text-align: center; }
        }
      `}</style>
    </main>
  );
}
