import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const ADMIN_EMAILS = ['bbcodejc@gmail.com'];

/**
 * Server-side admin layout — blocks rendering ENTIRELY for unauthenticated
 * or non-admin users. No loading state, no flash of content.
 * This runs on the server before ANY HTML is sent to the browser.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  // Not logged in → redirect to login
  if (error || !user) {
    redirect('/login');
  }

  // Logged in but not an admin → redirect to home
  if (!user.email || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    redirect('/');
  }

  // Admin verified — render the admin pages
  return <>{children}</>;
}
