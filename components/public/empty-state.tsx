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
        dark ? 'border-white/10 bg-white/[0.03]' : 'border-stone-200 bg-ivory-50',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="mx-auto mb-8 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent"
      />
      <p className={cn('display-sm', dark ? 'text-white' : 'text-ink-900')}>{title}</p>
      {description && (
        <p className={cn('mx-auto mt-4 max-w-md', dark ? 'text-stone-400' : 'text-stone-600')}>{description}</p>
      )}
      {children && <div className="mt-8 flex flex-wrap items-center justify-center gap-4">{children}</div>}
    </div>
  );
}
