import { cn } from '@/lib/utils';

/**
 * Text wordmark. There is no official logo file in the repository yet —
 * swap this component's contents for the real logo when one is supplied.
 */
export function Logo({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <span
        aria-hidden="true"
        className="relative grid size-9 shrink-0 place-items-center rounded-full border border-gold/70"
      >
        <span className="font-display text-[1.05rem] leading-none text-gold-light">ES</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('font-display text-[1.35rem] tracking-tight', tone === 'light' ? 'text-white' : 'text-ink-900')}>
          El Shaddai
        </span>
        <span
          className={cn(
            'mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.28em]',
            tone === 'light' ? 'text-stone-400' : 'text-stone-600',
          )}
        >
          World Ministries
        </span>
      </span>
    </span>
  );
}
