'use client';

import { useEffect, useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { AuthShell } from '@/components/auth/auth-shell';
import { PasswordField } from '@/components/auth/password-field';
import { Field, inputClass } from '@/components/public/form-controls';

export default function RegisterPage() {
  const router = useRouter();
  const errorId = useId();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => router.push('/login'), 2000);
    return () => clearTimeout(t);
  }, [success, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('The two passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Your password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        setIsLoading(false);
        return;
      }
      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthShell title="Account created">
        <div role="status" className="flex flex-col items-center py-4 text-center">
          <CheckCircle2 className="size-12 text-brand-700" aria-hidden="true" />
          <p className="mt-5 text-body">Your account is ready. Taking you to the sign-in page&hellip;</p>
          <Loader2 className="mt-4 size-5 animate-spin text-brand-700 motion-reduce:animate-none" aria-hidden="true" />
          <Link href="/login" className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-brand-700 underline underline-offset-4">
            Go to sign in now
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create an account"
      subtitle="Register with your name and email."
      footer={
        <p>
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-brand-700 underline underline-offset-4">
            Sign in
          </Link>
        </p>
      }
    >
      <div className="mb-6 flex gap-3 rounded-xl border border-brand-200 bg-brand-100 p-4 text-sm text-brand-navy">
        <Info className="mt-0.5 size-5 shrink-0 text-brand-700" aria-hidden="true" />
        <p>
          Accounts created here are member-level and do not include dashboard access. Staff accounts are created by a
          church administrator.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div id={errorId} role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        )}

        <Field id="name" label="Full name" required>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
            className={inputClass}
          />
        </Field>

        <Field id="email" label="Email address" required>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            className={inputClass}
          />
        </Field>

        <Field id="password" label="Password" required hint="At least 8 characters.">
          <PasswordField
            id="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            describedBy="password-hint"
          />
        </Field>

        <Field id="confirmPassword" label="Confirm password" required>
          <PasswordField
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            invalid={!!error && error.includes('match')}
            describedBy={error && error.includes('match') ? errorId : undefined}
          />
        </Field>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-8 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading && <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
          {isLoading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
}
