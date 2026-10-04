'use client';

import { Suspense, useId, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getSession, signIn, signOut } from 'next-auth/react';
import { AlertCircle, Info, Loader2 } from 'lucide-react';
import { AuthShell } from '@/components/auth/auth-shell';
import { PasswordField } from '@/components/auth/password-field';
import { Field, inputClass } from '@/components/public/form-controls';
import { safeRedirectPath } from '@/lib/safe-redirect';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const helpId = useId();
  const errorId = useId();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [memberOnly, setMemberOnly] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', { email, password, redirect: false });

      if (result?.error) {
        setError('That email and password do not match. Please check them and try again.');
        setIsLoading(false);
        return;
      }

      // Member-level accounts can sign in but have no dashboard access. Say so
      // instead of bouncing them silently back to the home page.
      const session = await getSession();
      if ((session?.user as { role?: string } | undefined)?.role === 'MEMBER') {
        setMemberOnly(true);
        setIsLoading(false);
        return;
      }

      const target = safeRedirectPath(searchParams.get('callbackUrl'), window.location.origin);
      router.push(target);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    setMemberOnly(false);
    setPassword('');
  };

  if (memberOnly) {
    return (
      <AuthShell title="You are signed in" subtitle="Thank you for being part of our church family.">
        <div role="status" className="flex gap-3 rounded-xl border border-brand-200 bg-brand-100 p-4 text-sm text-brand-navy">
          <Info className="mt-0.5 size-5 shrink-0 text-brand-700" aria-hidden="true" />
          <p>
            This account does not have access to the church dashboard. If you should have it, please ask a church
            administrator to update your account.
          </p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-600 px-6 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-700"
          >
            Back to the website
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-brand-700 px-6 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-brand-700 transition-colors hover:bg-brand-700 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to the El Shaddai World Ministries dashboard."
      footer={
        <p>
          Need access? Ask a church administrator to create your account. Not a team member yet?{' '}
          <Link href="/join" className="font-medium text-brand-700 underline underline-offset-4">
            Join the church family
          </Link>
          .
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div
            id={errorId}
            role="alert"
            className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        )}

        <Field id="email" label="Email address" required>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={inputClass}
          />
        </Field>

        <Field id="password" label="Password" required>
          <PasswordField
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            invalid={!!error}
            describedBy={error ? errorId : undefined}
          />
        </Field>

        <div>
          <button
            type="button"
            onClick={() => setShowHelp((s) => !s)}
            aria-expanded={showHelp}
            aria-controls={helpId}
            className="inline-flex min-h-11 items-center text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
          >
            Forgot your password?
          </button>
          <div id={helpId} hidden={!showHelp} className="mt-1 rounded-xl bg-brand-100 p-4 text-sm text-brand-navy">
            Please ask a church administrator to reset your password for you.
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-8 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading && <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
