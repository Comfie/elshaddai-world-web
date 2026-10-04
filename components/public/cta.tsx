import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const base =
  'group/cta inline-flex min-h-12 max-w-full items-center justify-center gap-3 rounded-lg px-6 py-3 text-center sm:whitespace-nowrap text-[0.8rem] font-semibold uppercase tracking-[0.14em] transition-[color,background-color,border-color] duration-300';

/**
 * Button hierarchy
 *  primary        — strong cobalt, white text (5.1:1). One per view where possible.
 *  white          — white fill, for use *on* blue panels where cobalt would disappear.
 *  outline-light  — secondary on dark/blue surfaces.
 *  outline-dark   — secondary on light surfaces (royal border).
 *  text-*         — tertiary: text + arrow.
 */
const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  white: 'bg-white text-brand-navy hover:bg-brand-100',
  'outline-light': 'border border-white/60 text-white hover:border-white hover:bg-white hover:text-brand-navy',
  'outline-dark': 'border border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white',
  // Inline text links
  'text-light': 'min-h-11 rounded-none px-0 py-2 text-white border-b border-white/40 hover:border-white',
  'text-dark': 'min-h-11 rounded-none px-0 py-2 text-brand-700 border-b border-brand-700/30 hover:border-brand-700',
  'text-accent': 'min-h-11 rounded-none px-0 py-2 text-brand-300 border-b border-brand-300/40 hover:border-brand-300',
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
  variant = 'primary',
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
      <span className="inline-flex items-center gap-2">{children}</span>
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
