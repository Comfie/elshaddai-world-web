import { cn } from '@/lib/utils';

type Props = {
  kicker?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
  size?: 'lg' | 'md';
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  /** Right-aligned slot, e.g. a "View all" link. */
  action?: React.ReactNode;
};

export function SectionHeader({
  kicker,
  title,
  description,
  tone = 'light',
  align = 'left',
  size = 'md',
  as: Heading = 'h2',
  className,
  action,
}: Props) {
  const dark = tone === 'dark';
  return (
    <div
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'items-center text-center md:flex-col md:items-center md:justify-start',
        className,
      )}
    >
      <div className={cn('max-w-3xl', align === 'center' && 'mx-auto')}>
        {kicker && (
          <p className={cn('kicker mb-5', dark ? 'text-brand-300' : 'text-brand-700')}>{kicker}</p>
        )}
        <Heading
          className={cn(
            size === 'lg' ? 'display-lg' : 'display-md',
            dark ? 'text-white [&_em]:text-brand-300' : 'text-brand-navy [&_em]:text-brand-700',
            '[&_em]:italic',
          )}
        >
          {title}
        </Heading>
        {description && (
          <p className={cn('lead mt-6 max-w-2xl', dark ? 'text-mist' : 'text-body', align === 'center' && 'mx-auto')}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
