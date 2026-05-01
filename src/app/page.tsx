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
          <Link href="/programs" className="btn btn-secondary">
            FOR PROGRAMS &amp; ORGANIZATIONS
          </Link>
        </div>
      </section>

      {/* CARDS */}
      <section className="cards">
        <Link href="/masterclass" className="card">
          <div className="card-eyebrow">FOR PLAYERS</div>
          <div className="card-title">Shooting Calibration Masterclass</div>
          <div className="card-body">
            14 days to calibration. A lifetime of confidence from anywhere on the court. Self-paced video protocols. Lifetime access.
          </div>
          <div className="card-cta">Learn more &rarr;</div>
        </Link>

        <Link href="/programs" className="card">
          <div className="card-eyebrow">FOR PROGRAMS</div>
          <div className="card-title">Program Implementation</div>
          <div className="card-body">
            12-week embedded engagement for NBA, NCAA, and HS programs. Assessment-based, system-wide implementation.
          </div>
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
          max-width: 1000px;
          margin: 0 auto;
          padding: 48px 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
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

        .card-cta {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 2px;
          color: var(--gold);
          text-transform: uppercase;
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
