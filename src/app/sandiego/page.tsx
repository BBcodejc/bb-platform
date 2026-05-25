'use client';

import { useState } from 'react';

export default function SanDiegoPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res = await fetch('/api/sandiego', {
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
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <main className="sd">
      <div className="container">
        <img src="/players/bblogolandingpage.png" alt="BB" className="logo" />

        <h1 className="headline">SAN DIEGO. SUMMER 2026.</h1>
        <p className="subline">Limited in-person consultation spots available.</p>

        {submitted ? (
          <div className="confirmation">
            <p className="confirmation-gold">Received. We&rsquo;ll be in touch.</p>
            <p className="confirmation-white">Follow @basketballbiomechanics for updates.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="form">
            {/* Honeypot */}
            <input
              type="text"
              name="honeypot"
              tabIndex={-1}
              autoComplete="off"
              style={{ position: 'absolute', left: '-9999px' }}
            />

            <label className="field">
              <span>Name</span>
              <input name="name" type="text" required maxLength={80} autoComplete="name" />
            </label>

            <label className="field">
              <span>Email</span>
              <input name="email" type="email" required maxLength={120} autoComplete="email" />
            </label>

            <label className="field">
              <span>Phone</span>
              <input name="phone" type="tel" maxLength={30} autoComplete="tel" />
            </label>

            <label className="field">
              <span>I am a</span>
              <select name="role" required defaultValue="">
                <option value="" disabled>Select one</option>
                <option value="Player">Player</option>
                <option value="Coach">Coach</option>
                <option value="Program/Organization">Program / Organization</option>
                <option value="Agent">Agent</option>
                <option value="Parent">Parent</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label className="field">
              <span>Level</span>
              <select name="level" required defaultValue="">
                <option value="" disabled>Select one</option>
                <option value="NBA">NBA</option>
                <option value="G-League/Overseas Pro">G-League / Overseas Pro</option>
                <option value="D1">D1</option>
                <option value="D2/D3/NAIA">D2 / D3 / NAIA</option>
                <option value="JUCO">JUCO</option>
                <option value="High School">High School</option>
                <option value="Middle School">Middle School</option>
                <option value="Youth/AAU">Youth / AAU</option>
              </select>
            </label>

            <label className="field">
              <span>What are you looking to get out of this?</span>
              <textarea name="goal" rows={3} maxLength={500} />
            </label>

            {error && <p className="error">{error}</p>}

            <button type="submit" className="submit" disabled={submitting}>
              {submitting ? 'SENDING...' : 'SUBMIT INQUIRY'}
            </button>

            <p className="footnote">We will follow up within 48 hours.</p>
          </form>
        )}

        <p className="handle">@basketballbiomechanics</p>
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body {
          background: #000000;
          color: #FFFFFF;
        }

        .sd {
          min-height: 100vh;
          background: #000000;
          color: #FFFFFF;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
        }

        .container {
          width: 100%;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .logo {
          height: 44px;
          width: auto;
          margin-bottom: 32px;
          filter: brightness(0) invert(1);
          opacity: 0.95;
        }

        .headline {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: clamp(22px, 5vw, 28px);
          letter-spacing: 2px;
          color: #D4A843;
          margin-bottom: 12px;
        }

        .subline {
          font-size: 14px;
          font-weight: 400;
          color: #FFFFFF;
          margin-bottom: 36px;
          line-height: 1.5;
        }

        .form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }

        .field span {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #D4A843;
        }

        .field input,
        .field select,
        .field textarea {
          width: 100%;
          background: #1A1A1A;
          border: 1px solid #333333;
          border-radius: 4px;
          padding: 12px 14px;
          color: #FFFFFF;
          font-family: inherit;
          font-size: 15px;
          outline: none;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: #D4A843;
        }

        .field select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23D4A843' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }

        .field textarea {
          resize: vertical;
          min-height: 72px;
          max-height: 180px;
          font-family: inherit;
        }

        .submit {
          width: 100%;
          background: #D4A843;
          color: #000000;
          border: none;
          border-radius: 4px;
          padding: 14px 24px;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 8px;
        }

        .submit:hover:not(:disabled) {
          background: #E8C96A;
        }

        .submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .footnote {
          font-size: 12px;
          color: #888888;
          margin-top: 12px;
        }

        .error {
          font-size: 13px;
          color: #ff6b6b;
          padding: 10px 12px;
          background: rgba(255,107,107,0.08);
          border: 1px solid rgba(255,107,107,0.3);
          border-radius: 4px;
          text-align: left;
        }

        .confirmation {
          width: 100%;
          padding: 40px 0;
        }

        .confirmation-gold {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: 20px;
          letter-spacing: 1px;
          color: #D4A843;
          margin-bottom: 12px;
        }

        .confirmation-white {
          font-size: 14px;
          color: #FFFFFF;
        }

        .handle {
          margin-top: 40px;
          font-size: 11px;
          letter-spacing: 1px;
          color: #888888;
        }
      `}</style>
    </main>
  );
}
