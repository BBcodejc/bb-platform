'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ApplyPage() {
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
    } catch (err) {
      setError('Network error. Please email bbcodejc@gmail.com directly.');
      setSubmitting(false);
    }
  }

  return (
    <main className="apply">
      <div className="bg-glow" />

      <header className="header">
        <Link href="/" className="logo">BASKETBALL BIOMECHANICS</Link>
      </header>

      <section className="hero">
        <p className="eyebrow">APPLY</p>
        <h1 className="headline">Tell us about you.</h1>
        <p className="sub">
          We work with a limited number of players, programs, and organizations at a time. Fill this out and we&rsquo;ll be in touch within 48 hours.
        </p>
      </section>

      {submitted ? (
        <section className="success">
          <h2>Application received.</h2>
          <p>We&rsquo;ll be in touch within 48 hours at the email you provided.</p>
          <Link href="/" className="btn btn-secondary">Back to home</Link>
        </section>
      ) : (
        <form className="form" onSubmit={handleSubmit} noValidate>
          {/* Honeypot — hidden from users, bots fill it */}
          <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} />

          <div className="row">
            <label className="field">
              <span>First Name *</span>
              <input name="firstName" type="text" required maxLength={50} autoComplete="given-name" />
            </label>
            <label className="field">
              <span>Last Name *</span>
              <input name="lastName" type="text" required maxLength={50} autoComplete="family-name" />
            </label>
          </div>

          <div className="row">
            <label className="field">
              <span>Email *</span>
              <input name="email" type="email" required maxLength={120} autoComplete="email" />
            </label>
            <label className="field">
              <span>Phone</span>
              <input name="phone" type="tel" maxLength={30} autoComplete="tel" />
            </label>
          </div>

          <div className="row">
            <label className="field">
              <span>I am a... *</span>
              <select name="role" required defaultValue="">
                <option value="" disabled>Select one</option>
                <option value="player">Player</option>
                <option value="parent">Parent</option>
                <option value="coach">Coach</option>
                <option value="program">Program / Organization</option>
              </select>
            </label>
            <label className="field">
              <span>Level</span>
              <select name="level" defaultValue="">
                <option value="">Select one</option>
                <option value="HS">High School</option>
                <option value="College">College / D1</option>
                <option value="Pro">Pro / NBA / Overseas</option>
                <option value="Youth">Youth / AAU</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>

          <div className="row">
            <label className="field">
              <span>Location</span>
              <input name="location" type="text" maxLength={100} placeholder="City, State" />
            </label>
            <label className="field">
              <span>Instagram</span>
              <input name="instagram" type="text" maxLength={50} placeholder="@username" />
            </label>
          </div>

          <label className="field full">
            <span>What are you looking to improve? *</span>
            <textarea name="message" required maxLength={2000} rows={5} placeholder="Tell us about your goals, what you've tried, and what you're looking for..." />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'SENDING...' : 'SUBMIT APPLICATION'}
          </button>

          <p className="footnote">Or email <a href="mailto:bbcodejc@gmail.com">bbcodejc@gmail.com</a> directly.</p>
        </form>
      )}

      <footer className="footer">
        Basketball Biomechanics &bull; BB Code LLC &bull; Las Vegas, NV
      </footer>

      <style>{`
        :root {
          --gold: #D4A843;
          --gold-light: #E8C96A;
          --dark: #0a0a0a;
          --surface: #111111;
          --gray: #aaaaaa;
          --gray-dim: #888888;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body {
          background: var(--dark);
          color: #fff;
        }

        .apply {
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
          text-decoration: none;
        }

        .hero {
          position: relative;
          z-index: 1;
          max-width: 720px;
          margin: 0 auto;
          padding: 40px 0 32px;
          text-align: center;
        }

        .eyebrow {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 4px;
          color: var(--gold);
          margin-bottom: 16px;
        }

        .headline {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: clamp(36px, 6vw, 56px);
          line-height: 1.1;
          text-transform: uppercase;
          letter-spacing: -1px;
          margin-bottom: 16px;
        }

        .sub {
          font-size: 16px;
          color: var(--gray);
          line-height: 1.6;
        }

        .form {
          position: relative;
          z-index: 1;
          max-width: 720px;
          margin: 0 auto;
          padding: 32px 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 600px) {
          .row { grid-template-columns: 1fr; }
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field span {
          font-family: var(--font-oswald), sans-serif;
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gold);
        }

        .field input,
        .field select,
        .field textarea {
          background: var(--surface);
          border: 1px solid #222;
          border-radius: 6px;
          padding: 14px 16px;
          color: #fff;
          font-family: inherit;
          font-size: 15px;
          transition: border-color 0.2s;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          outline: none;
          border-color: var(--gold);
        }

        .field textarea {
          resize: vertical;
          min-height: 120px;
        }

        .error {
          color: #ff6b6b;
          font-size: 14px;
          padding: 12px 16px;
          background: rgba(255,107,107,0.08);
          border: 1px solid rgba(255,107,107,0.3);
          border-radius: 6px;
        }

        .btn {
          display: inline-block;
          font-family: var(--font-oswald), sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          text-align: center;
          padding: 16px 32px;
          border-radius: 4px;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
          margin-top: 8px;
        }

        .btn-primary {
          background: var(--gold);
          color: var(--dark);
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--gold-light);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(212,168,67,0.4);
          margin-top: 24px;
        }

        .footnote {
          color: var(--gray-dim);
          font-size: 13px;
          text-align: center;
          margin-top: 8px;
        }

        .footnote a {
          color: var(--gold);
          text-decoration: none;
        }

        .success {
          position: relative;
          z-index: 1;
          max-width: 600px;
          margin: 40px auto;
          text-align: center;
          padding: 48px 24px;
          background: var(--surface);
          border: 2px solid var(--gold);
          border-radius: 12px;
        }

        .success h2 {
          font-family: var(--font-oswald), sans-serif;
          font-size: 28px;
          color: var(--gold);
          margin-bottom: 12px;
        }

        .success p {
          color: var(--gray);
          margin-bottom: 24px;
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
      `}</style>
    </main>
  );
}
