import { cn } from '@/lib/utils';
import { Photo } from '@/components/public/photo';
import type { ImageSlot } from '@/lib/images';

/**
 * Hero for inner pages. Dark, photographic and sized to sit beneath the
 * transparent site header.
 */
export function PageHero({
  kicker,
  title,
  description,
  slot,
  imageSrc,
  variant = 1,
  children,
  align = 'left',
  size = 'default',
  titleAs: Heading = 'h1',
}: {
  kicker?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  slot?: ImageSlot;
  imageSrc?: string | null;
  variant?: number;
  children?: React.ReactNode;
  align?: 'left' | 'center';
  size?: 'default' | 'tall';
  titleAs?: 'h1' | 'h2';
}) {
  return (
    <section
      className={cn(
        'on-dark relative isolate overflow-hidden bg-brand-navy text-white',
        size === 'tall' ? 'min-h-[68vh]' : 'min-h-[52vh]',
        'flex items-end',
      )}
    >
      <Photo slot={slot} src={imageSrc} variant={variant} priority sizes="100vw" />
      <div aria-hidden="true" className="absolute inset-0 bg-brand-navy/40" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/55 to-brand-700/20" />

      <div
        className={cn(
          'wrap relative pb-14 pt-40 sm:pb-20 sm:pt-48',
          align === 'center' && 'text-center',
        )}
      >
        <div className={cn('max-w-4xl', align === 'center' && 'mx-auto')}>
          <div aria-hidden="true" className="rise-in mb-6 h-1 w-12 rounded-full bg-brand-500" />
          {kicker && <p className="kicker rise-in mb-6 text-brand-300">{kicker}</p>}
          <Heading
            className="display-lg rise-in [&_em]:italic"
            style={{ ['--rise-delay' as string]: '80ms' }}
          >
            {title}
          </Heading>
          {description && (
            <p
              className={cn(
                'lead rise-in mt-7 max-w-2xl text-brand-100',
                align === 'center' && 'mx-auto',
              )}
              style={{ ['--rise-delay' as string]: '180ms' }}
            >
              {description}
            </p>
          )}
          {children && (
            <div
              className={cn(
                'rise-in mt-9 flex flex-wrap gap-4',
                align === 'center' && 'justify-center',
              )}
              style={{ ['--rise-delay' as string]: '260ms' }}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
