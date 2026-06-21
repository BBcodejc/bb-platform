'use client';

/* ============================================================
   BB LANDING PAGE — Basketball Biomechanics (BB Code LLC)
   Live /apply page. Reconfigure into variations (shooting, ball
   handling, defense, offense, movement, off-season, in-season)
   by editing ONLY the marked SWAP blocks. Structure stays identical.
   Submissions POST to /api/apply (email + Google Sheet capture).
   ============================================================ */

import { useState } from 'react';

export default function ApplyPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    setError(null);
    setSubmitting(true);

    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
      window.scrollTo({ top: document.getElementById('apply')?.offsetTop || 0, behavior: 'smooth' });
    } catch {
      setError('Network error. Please email bbcodejc@gmail.com directly.');
      setSubmitting(false);
    }
  }

  return (
    <main className="bb">

      {/* ============================================================
          1. HERO  —  SWAP: headline + stacked impact lines.
          ============================================================ */}
      <header className="hero">
        <div className="wrap">
          {/* ===== BB LOGO ===== */}
          <div className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo-img" src="/bb-logo-registered.png" alt="Basketball Biomechanics" />
          </div>

          {/* ===== SWAP: HEADLINE ===== */}
          <h1>We find exactly what is limiting your game. Then we address it.</h1>

          {/* ===== SWAP: STACKED IMPACT LINES ===== */}
          <div className="hero-stack">
            <span>Not in years.</span>
            <span>Not in months.</span>
            <span>In days.</span>
          </div>

          <p className="hero-support">
            We provide solutions based on 25+ years of research with thousands of
            NBA, NCAA, and high school athletes.
          </p>

          <a href="#apply" className="cta">Apply Now</a>
        </div>
      </header>

      {/* ============================================================
          APPLICATION FORM  —  moved high on the page. No prices, no tiers shown.
          ============================================================ */}
      <section id="apply">
        <div className="wrap">
          <div className="eyebrow">Apply</div>
          <h2>Put your film through the lens.</h2>
          <p className="apply-intro">
            For consultation, apply here and our team will evaluate timing and fit.
            Then you will get a response on advised next steps.
          </p>

          {submitted ? (
            /* ===== THANK-YOU STATE ===== */
            <div className="thanks">
              <p>Application received. Our Team will coordinate the next steps.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Honeypot — hidden from users, bots fill it */}
              <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} />

              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" required maxLength={80} autoComplete="name" />
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required maxLength={120} autoComplete="email" />
              </div>

              <div className="field">
                <label htmlFor="role">Are you a player, parent, coach, or staff?</label>
                <select id="role" name="role" required defaultValue="">
                  <option value="" disabled>Select one</option>
                  <option>Player</option>
                  <option>Parent</option>
                  <option>Coach</option>
                  <option>Staff</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="level">Level</label>
                <select id="level" name="level" required defaultValue="">
                  <option value="" disabled>Select one</option>
                  <option>Youth</option>
                  <option>High School</option>
                  <option>College</option>
                  <option>Professional</option>
                  <option>NBA</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="playerName">If applying on behalf of a player, player name (optional)</label>
                <input id="playerName" name="playerName" type="text" maxLength={80} />
              </div>

              <div className="field">
                <label htmlFor="improve">What are you trying to improve?</label>
                <input id="improve" name="improve" type="text" required maxLength={300} />
              </div>

              <div className="field">
                <label htmlFor="scope">Level of play or scope</label>
                <select id="scope" name="scope" required defaultValue="">
                  <option value="" disabled>Select one</option>
                  <option>Youth</option>
                  <option>High School</option>
                  <option>College</option>
                  <option>Professional (Overseas)</option>
                  <option>NBA</option>
                  <option>Organization</option>
                  <option>Coach</option>
                </select>
              </div>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="cta" disabled={submitting}>
                {submitting ? 'Sending...' : 'Apply'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ============================================================
          2. TESTIMONIALS  —  SWAP / rotate quotes. Role descriptors only.
          VSL NOTE: no video yet. A VSL block may be added here later.
          ============================================================ */}
      <section>
        <div className="wrap">
          <div className="eyebrow">What They Say</div>
          <div className="quotes">
            {/* ===== TESTIMONIAL ===== */}
            <div className="quote">
              <p>&ldquo;Nobody has ever broken down film like this before.&rdquo;</p>
              <cite>Kyle Lowry, NBA champion</cite>
            </div>
            {/* ===== TESTIMONIAL ===== */}
            <div className="quote">
              <p>&ldquo;My shot feels effortless now.&rdquo;</p>
              <cite>Paul Reed, Detroit Pistons</cite>
            </div>
            {/* ===== TESTIMONIAL ===== */}
            <div className="quote">
              <p>&ldquo;Coach Tommy&rsquo;s brain is like AI.&rdquo;</p>
              <cite>Tobias Harris</cite>
            </div>
          </div>
          {/* ===== SWAP: TESTIMONIALS CLOSING TAGLINE ===== */}
          <p className="quotes-tag">In a way, it is.</p>
        </div>
      </section>

      {/* ============================================================
          3. WHAT WE DO  —  SWAP: framing of these blocks.
          ============================================================ */}
      <section>
        <div className="wrap">
          <div className="eyebrow">What We Do</div>
          <div className="blocks">
            <div className="block">
              <h3>We assess before we train anything</h3>
              <p>Nothing changes until we measure. The assessment comes first, always.</p>
            </div>
            <div className="block">
              <h3>We find the real limiting factor</h3>
              <p>Not the symptom you feel. The root factor holding the whole system back.</p>
            </div>
            <div className="block">
              <h3>We calibrate the system for game conditions</h3>
              <p>Calibration that holds up live, under fatigue, under pressure, at real game speed.</p>
            </div>
            <div className="block">
              <h3>We maximize any player at any level</h3>
              <p>Youth to NBA. The method scales because it starts from what is true for you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          4. WHAT YOU GET
          ============================================================ */}
      <section>
        <div className="wrap">
          <div className="eyebrow">What You Get</div>
          <h2>From an assessment</h2>
          <ul className="getlist">
            <li>A personal film breakdown video narrated by our coaches</li>
            <li>Your full BB Lens Report of every limiting factor</li>
            <li>Your Calibration Test results</li>
            <li>Starting protocols</li>
            <li>A live walkthrough call</li>
            <li className="note">It applies in full to the engagement.</li>
          </ul>
        </div>
      </section>

      {/* ============================================================
          5. THE PROOF  —  SWAP tiles. Role descriptors only.
          ============================================================ */}
      <section>
        <div className="wrap">
          <div className="eyebrow">The Proof</div>
          <div className="proof">
            <div className="tile">
              <div className="role">An NBA wing</div>
              <div className="stat"><span className="gold">18% to 47%</span> from three, in season.</div>
            </div>
            <div className="tile">
              <div className="role">An NBA champion</div>
              <div className="stat">A good shooter to <span className="gold">one of the best alive</span>, entirely remote.</div>
            </div>
            <div className="tile">
              <div className="role">An NBA big</div>
              <div className="stat"><span className="gold">15% to 40%</span> in four months.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          8. FOOTER
          ============================================================ */}
      <footer>
        <div className="wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo-img" src="/bb-logo-registered.png" alt="Basketball Biomechanics" />
          <div className="closer">Researched and Tested</div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .bb {
          --bg:#080808;
          --gold:#D4A843;
          --gold-bright:#e3bd5f;
          --white:#ffffff;
          --muted:rgba(255,255,255,0.60);
          --line:rgba(255,255,255,0.08);
          --gold-line:rgba(212,168,67,0.20);
          --card:#0e0e0e;
          --maxw:760px;
          background:var(--bg);
          color:var(--white);
          min-height:100vh;
          line-height:1.6;
          overflow-x:hidden;
        }
        .bb *{box-sizing:border-box;margin:0;padding:0}
        .bb .wrap{max-width:var(--maxw);margin:0 auto;padding:0 24px}
        .bb section{padding:80px 0;border-bottom:1px solid var(--line)}

        .bb .eyebrow{color:var(--gold);font-size:12px;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:24px;font-weight:600}
        .bb h2{font-size:clamp(26px,5vw,34px);font-weight:700;letter-spacing:-0.02em;line-height:1.2;margin-bottom:36px}
        .bb #apply h2{margin-bottom:18px}
        .bb .apply-intro{color:var(--muted);font-size:clamp(15px,2.4vw,17px);max-width:560px;line-height:1.6;margin-bottom:34px}
        .bb .gold{color:var(--gold)}

        .bb .cta{
          display:inline-block;background:var(--gold);color:#080808;font-weight:800;
          letter-spacing:0.04em;text-transform:uppercase;font-size:14px;padding:18px 46px;
          border:none;border-radius:3px;cursor:pointer;text-decoration:none;
          transition:transform .15s ease, background .15s ease;
        }
        .bb .cta:hover{background:var(--gold-bright);transform:translateY(-1px)}
        .bb .cta:disabled{opacity:0.6;cursor:not-allowed;transform:none}

        /* boxed BB logo (white art on its own black panel) sits directly on the page */
        .bb .logo{display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center}
        .bb .logo-img{height:170px;width:auto;display:block}

        .bb .hero{text-align:center;padding:64px 0 84px;border-bottom:1px solid var(--line)}
        .bb .hero .logo{margin-bottom:52px}
        .bb .hero h1{font-size:clamp(34px,7vw,54px);line-height:1.12;font-weight:700;letter-spacing:-0.025em;max-width:620px;margin:0 auto 34px}
        .bb .hero-stack{margin:0 auto 34px;display:flex;flex-direction:column;gap:2px}
        .bb .hero-stack span{font-size:clamp(24px,5vw,32px);font-weight:800;letter-spacing:-0.01em}
        .bb .hero-stack span:last-child{color:var(--gold)}
        .bb .hero-support{color:var(--muted);max-width:540px;margin:0 auto 42px;font-size:clamp(15px,2.4vw,17px)}

        .bb .quotes{display:flex;flex-direction:column;gap:24px}
        .bb .quote{background:var(--card);border:1px solid var(--gold-line);border-left:3px solid var(--gold);padding:28px 30px;border-radius:3px}
        .bb .quote p{font-size:clamp(16px,2.6vw,19px);font-style:italic;line-height:1.5;margin-bottom:16px}
        .bb .quote cite{color:var(--gold);font-style:normal;font-size:13px;letter-spacing:0.06em;text-transform:uppercase}
        .bb .quotes-tag{text-align:center;color:var(--gold);font-style:italic;font-size:clamp(16px,2.6vw,18px);margin-top:30px;letter-spacing:0.02em}

        .bb .blocks{display:flex;flex-direction:column;gap:26px}
        .bb .block h3{font-size:18px;font-weight:700;margin-bottom:6px;display:flex;align-items:center;gap:12px}
        .bb .block h3::before{content:"";flex:0 0 auto;width:18px;height:2px;background:var(--gold)}
        .bb .block p{color:var(--muted);font-size:16px;padding-left:30px}

        .bb .getlist{list-style:none;display:flex;flex-direction:column;gap:18px}
        .bb .getlist li{padding-left:30px;position:relative;font-size:clamp(16px,2.6vw,18px)}
        .bb .getlist li::before{content:"";position:absolute;left:0;top:11px;width:8px;height:8px;background:var(--gold);border-radius:50%}
        .bb .getlist .note{color:var(--muted);font-style:italic;font-size:15px;padding-left:0}
        .bb .getlist .note::before{display:none}

        .bb .proof{display:grid;grid-template-columns:1fr;gap:18px}
        .bb .tile{background:var(--card);border:1px solid var(--gold-line);border-radius:3px;padding:28px;text-align:center}
        .bb .tile .role{color:var(--muted);font-size:13px;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px}
        .bb .tile .stat{font-size:19px;font-weight:700;line-height:1.4}

        .bb form{display:flex;flex-direction:column;gap:22px}
        .bb .field{display:flex;flex-direction:column;gap:8px}
        .bb .field label{font-size:13px;letter-spacing:0.06em;text-transform:uppercase;color:var(--muted)}
        .bb .field input,.bb .field select{
          background:#0b0b0b;border:1px solid rgba(255,255,255,0.12);color:var(--white);
          padding:15px 16px;font-size:16px;border-radius:3px;font-family:inherit;width:100%;
        }
        .bb .field input:focus,.bb .field select:focus{outline:none;border-color:var(--gold)}
        .bb .field select{appearance:none;cursor:pointer;
          background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='%23D4A843' d='M6 8L0 0h12z'/></svg>");
          background-repeat:no-repeat;background-position:right 16px center;padding-right:42px}
        .bb form .cta{margin-top:8px;width:100%;text-align:center}
        .bb .form-error{color:#ff6b6b;font-size:14px;padding:12px 16px;background:rgba(255,107,107,0.08);border:1px solid rgba(255,107,107,0.3);border-radius:6px}

        .bb .thanks{text-align:center;padding:24px 0}
        .bb .thanks p{font-size:clamp(17px,3vw,20px);margin-bottom:22px;line-height:1.5}
        .bb .thanks .closer{color:var(--gold);text-transform:uppercase;letter-spacing:0.18em;font-size:14px;font-weight:700}

        .bb footer{text-align:center;padding:60px 0;border-bottom:none}
        .bb footer .logo-img{height:96px;width:auto;margin:0 auto 18px}
        .bb footer .closer{color:var(--gold);text-transform:uppercase;letter-spacing:0.2em;font-size:13px;font-weight:700}

        @media (min-width:640px){
          .bb .proof{grid-template-columns:repeat(3,1fr)}
        }
      ` }} />
    </main>
  );
}
