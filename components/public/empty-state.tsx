import { cn } from '@/lib/utils';

/** Intentional-looking empty state (no data yet / nothing matches). */
export function EmptyState({
  title,
  description,
  children,
  tone = 'light',
  className,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const dark = tone === 'dark';
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border px-6 py-14 text-center sm:px-12 sm:py-20',
        dark ? 'border-white/10 bg-white/[0.03]' : 'border-brand-200 bg-white',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="mx-auto mb-8 h-px w-16 bg-gradient-to-r from-transparent via-brand-500 to-transparent"
      />
      <p className={cn('display-sm', dark ? 'text-white' : 'text-brand-navy')}>{title}</p>
      {description && (
        <p className={cn('mx-auto mt-4 max-w-md', dark ? 'text-mist' : 'text-body')}>{description}</p>
      )}
      {children && <div className="mt-8 flex flex-wrap items-center justify-center gap-4">{children}</div>}
    </div>
  );
}
