'use client';

import { useState, type FormEvent } from 'react';
import { bbTrack } from '../../lib/analytics';

/* Kit destination: form "BB Movement System Early Access" (created 2026-07-14
   in the Basketball Biomechanics Kit account); endpoint verified live. */
const KIT_FORM_ID = '9685069';
const KIT_FORM_ACTION = KIT_FORM_ID
  ? `https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`
  : '';

export default function MovementEarlyAccessPage() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;

    if (!KIT_FORM_ACTION) {
      setStatus('error');
      return;
    }

    setStatus('submitting');
    bbTrack('movement_waitlist_submit', { product: 'BB Movement System' });
    try {
      const res = await fetch(KIT_FORM_ACTION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email_address: email.trim(),
          first_name: firstName.trim(),
          fields: { first_name: firstName.trim() },
        }),
      });
      if (!res.ok) throw new Error(`Kit responded ${res.status}`);
      bbTrack('movement_waitlist_success', { product: 'BB Movement System' });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="mea-page">
      <main className="mea-main">
        <div className="mea-container">
          <p className="mea-kicker">Coming Soon</p>
          <h1 className="mea-headline">The BB Movement System</h1>
          <p className="mea-sub">
            The basketball-specific movement progressions we use to develop
            better rhythm, timing, coordination, movement options, and
            adaptability.
          </p>
          <p className="mea-support">
            This introductory system brings together our foundational court
            patterns and jump-rope progressions into a clear program players
            can begin applying anywhere.
          </p>

          <div className="mea-form-block">
            {status === 'success' ? (
              <div className="mea-success" role="status">
                <span className="mea-success-mark" aria-hidden="true">
                  ✓
                </span>
                <h2 className="mea-success-heading">You&apos;re on the list.</h2>
                <p className="mea-success-copy">
                  Watch your inbox for early access.
                </p>
              </div>
            ) : (
              <>
                <h2 className="mea-form-heading">Join the Early-Access List</h2>
                <form className="mea-form" onSubmit={handleSubmit}>
                  <div className="mea-form-row">
                    <div>
                      <label className="mea-label" htmlFor="mea-first-name">
                        First name
                      </label>
                      <input
                        id="mea-first-name"
                        className="mea-input"
                        type="text"
                        name="first_name"
                        autoComplete="given-name"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mea-label" htmlFor="mea-email">
                        Email address
                      </label>
                      <input
                        id="mea-email"
                        className="mea-input"
                        type="email"
                        name="email_address"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    className="mea-submit"
                    type="submit"
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? 'Joining…' : 'Join Early Access'}
                  </button>
                </form>
                <p className="mea-microcopy">
                  Be the first to know when enrollment opens.
                </p>
                {status === 'error' && (
                  <p className="mea-error" role="alert">
                    Something went wrong. Please try again.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="mea-footer">
        <p>© {new Date().getFullYear()} Basketball Biomechanics</p>
      </footer>
    </div>
  );
}
