import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const base =
  'group/cta inline-flex min-h-12 items-center justify-center gap-3 whitespace-nowrap rounded-full px-7 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300';

const variants = {
  gold: 'bg-gold text-ink-950 hover:bg-gold-light',
  light: 'bg-ivory text-ink-900 hover:bg-white',
  dark: 'bg-ink-900 text-ivory hover:bg-ink-700',
  'outline-light': 'border border-white/50 text-white hover:border-white hover:bg-white/10',
  'outline-dark': 'border border-ink-900/40 text-ink-900 hover:border-ink-900 hover:bg-ink-900 hover:text-ivory',
  // Inline text links
  'text-light':
    'min-h-11 rounded-none px-0 py-2 text-white border-b border-white/40 hover:border-white',
  'text-dark':
    'min-h-11 rounded-none px-0 py-2 text-ink-900 border-b border-ink-900/30 hover:border-ink-900',
  'text-gold':
    'min-h-11 rounded-none px-0 py-2 text-gold-light border-b border-gold-light/40 hover:border-gold-light',
} as const;

export type CtaVariant = keyof typeof variants;

type CtaProps = {
  href: string;
  variant?: CtaVariant;
  children: React.ReactNode;
  className?: string;
  /** Hide the arrow (e.g. for "Back" links). */
  arrow?: boolean;
  external?: boolean;
  'aria-label'?: string;
};

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

export function CtaLink({
  href,
  variant = 'gold',
  children,
  className,
  arrow = true,
  external,
  ...rest
}: CtaProps) {
  const classes = cn(base, variants[variant], className);
  const out = external ?? /^https?:/.test(href);
  const Icon = out ? ArrowUpRight : ArrowRight;
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <Icon
          aria-hidden="true"
          className={cn(
            'size-4 shrink-0 transition-transform duration-300',
            out ? 'group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5' : 'group-hover/cta:translate-x-1',
          )}
        />
      )}
    </>
  );

  if (isExternal(href)) {
    return (
      <a
        href={href}
        className={classes}
        {...(out ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
