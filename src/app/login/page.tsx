'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if already logged in
  useEffect(() => {
    async function checkSession() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Already logged in, redirect
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          const role = user.user_metadata?.role;
          if (role === 'admin' || role === 'coach') {
            router.push('/admin');
          } else {
            const playerSlug = user.user_metadata?.player_slug;
            router.push(playerSlug ? `/players/${playerSlug}` : '/');
          }
        }
      }
    }
    checkSession();
  }, [redirectUrl, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        console.log('User logged in:', data.user.email);
        console.log('User metadata:', data.user.user_metadata);

        // If there's a redirect URL, use it
        if (redirectUrl) {
          router.push(redirectUrl);
          router.refresh();
          return;
        }

        // Check role from user_metadata
        const userRole = data.user.user_metadata?.role;
        const playerSlug = data.user.user_metadata?.player_slug;

        console.log('User role:', userRole);
        console.log('Player slug:', playerSlug);

        // Admin/Coach users go to admin dashboard
        if (userRole === 'admin' || userRole === 'coach') {
          console.log('Redirecting to /admin');
          router.push('/admin');
        }
        // Players go to their dashboard
        else if (playerSlug) {
          console.log('Redirecting to player dashboard:', playerSlug);
          router.push(`/players/${playerSlug}`);
        }
        // Default: if no role set, assume admin (for initial setup)
        else {
          console.log('No role set, defaulting to /admin');
          router.push('/admin');
        }
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/players/bb-logo.png"
            alt="Basketball Biomechanics"
            width={80}
            height={80}
            className="mx-auto mb-4 rounded-2xl"
          />
          <h1 className="text-2xl font-bold text-white">Basketball Biomechanics</h1>
          <p className="text-gray-500 mt-2">Login to your portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-[#0D0D0D] border-[#2A2A2A] text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-[#0D0D0D] border-[#2A2A2A] text-white pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold py-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-gold-500 hover:text-gold-400">
              Forgot your password?
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-8">
          &copy; {new Date().getFullYear()} Basketball Biomechanics
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
