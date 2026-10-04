import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/public/logo';

/**
 * Shared layout for the sign-in screens: a brand panel (desktop) beside the
 * form. Exactly one <h1> — the form heading.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-brand-50 lg:grid-cols-[5fr_6fr]">
      {/* Brand panel (desktop) */}
      <aside className="on-dark relative isolate hidden overflow-hidden bg-brand-navy text-white lg:flex lg:flex-col lg:justify-between lg:p-14 xl:p-16">
        <div
          aria-hidden="true"
          className="photo-placeholder absolute inset-0 -z-10"
          data-tone="royal"
          style={{ ['--px' as string]: '85%', ['--py' as string]: '12%' }}
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-brand-700/20" />

        <Link href="/" aria-label="El Shaddai World Ministries — back to the website" className="inline-flex min-h-11 w-fit items-center">
          <Logo tone="light" />
        </Link>

        <div>
          <div aria-hidden="true" className="mb-7 h-1 w-14 rounded-full bg-brand-500" />
          <p className="display-lg max-w-md">
            Care for the <em className="text-brand-300">church family.</em>
          </p>
          <p className="lead mt-6 max-w-sm text-brand-100">
            Members, events, sermons, prayer requests and more &mdash; all in one place.
          </p>
        </div>

        <p className="text-sm text-mist">&copy; {new Date().getFullYear()} El Shaddai World Ministries</p>
      </aside>

      {/* Form panel */}
      <main className="on-light flex flex-col px-5 py-8 sm:px-10 lg:px-16">
        {/* Compact brand bar (mobile / tablet) */}
        <div className="flex items-center justify-between lg:hidden">
          <Link href="/" aria-label="El Shaddai World Ministries — back to the website" className="inline-flex min-h-11 items-center">
            <Logo tone="dark" />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <h1 className="display-md text-brand-navy">{title}</h1>
            {subtitle && <p className="mt-3 text-body">{subtitle}</p>}
            <div className="mt-9">{children}</div>
            {footer && <div className="mt-8 border-t border-brand-200 pt-6 text-sm text-body">{footer}</div>}
          </div>
        </div>

        <div className="flex justify-center pb-2">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to the website
          </Link>
        </div>
      </main>
    </div>
  );
}
