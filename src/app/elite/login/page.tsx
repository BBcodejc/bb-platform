'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

function EliteLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoLogging, setAutoLogging] = useState(false);

  const redirect = searchParams.get('redirect');

  // Auto-login if ?token=xxx is in the URL
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setAutoLogging(true);
      handleLogin(tokenParam);
    }
  }, [searchParams]);

  async function handleLogin(accessToken: string) {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/elite/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: accessToken.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid access code');
        setLoading(false);
        setAutoLogging(false);
        return;
      }

      // Redirect to player portal
      const destination = redirect || `/elite/${data.slug}`;
      router.push(destination);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
      setAutoLogging(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) {
      setError('Please enter your access code');
      return;
    }
    handleLogin(token);
  }

  if (autoLogging) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto mb-4" />
          <p className="text-gray-400">Authenticating...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-gold-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">BB Elite Portal</h1>
          <p className="text-gray-500 mt-2">Enter your access code to continue</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-400 mb-2">
                Access Code
              </label>
              <input
                id="token"
                type="text"
                value={token}
                onChange={(e) => { setToken(e.target.value); setError(''); }}
                placeholder="e.g. ds-bb-2025"
                autoFocus
                autoComplete="off"
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors text-lg tracking-wide"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-colors text-lg"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Enter Portal
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Basketball Biomechanics Elite Player Portal
        </p>
      </div>
    </main>
  );
}

export default function EliteLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </main>
      }
    >
      <EliteLoginContent />
    </Suspense>
  );
}
