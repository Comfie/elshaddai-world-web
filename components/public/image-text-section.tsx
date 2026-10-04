import { cn } from '@/lib/utils';
import { Photo } from '@/components/public/photo';
import { Reveal } from '@/components/public/reveal';
import type { ImageSlot } from '@/lib/images';

/** Editorial split: copy on one side, a tall photograph on the other. */
export function ImageTextSection({
  kicker,
  title,
  children,
  cta,
  slot,
  imageSrc,
  reverse,
  tone = 'light',
  variant = 1,
  className,
  id,
}: {
  kicker?: string;
  title: React.ReactNode;
  children: React.ReactNode;
  cta?: React.ReactNode;
  slot?: ImageSlot;
  imageSrc?: string | null;
  reverse?: boolean;
  tone?: 'light' | 'dark' | 'sand';
  variant?: number;
  className?: string;
  id?: string;
}) {
  const dark = tone === 'dark';
  return (
    <section
      id={id}
      className={cn(
        'section-y',
        dark ? 'on-dark bg-brand-900 text-white' : tone === 'sand' ? 'on-light bg-brand-100' : 'on-light bg-brand-50',
        className,
      )}
    >
      <div className="wrap grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
        <Reveal className={cn('lg:col-span-6', reverse ? 'lg:order-2' : 'lg:order-1')}>
          {kicker && <p className={cn('kicker mb-6', dark ? 'text-brand-300' : 'text-brand-700')}>{kicker}</p>}
          <h2 className={cn('display-lg [&_em]:italic', dark ? 'text-white' : 'text-brand-navy')}>{title}</h2>
          <div className={cn('lead mt-8 max-w-xl space-y-5', dark ? 'text-mist' : 'text-body')}>
            {children}
          </div>
          {cta && <div className="mt-10">{cta}</div>}
        </Reveal>

        <Reveal className={cn('lg:col-span-6', reverse ? 'lg:order-1' : 'lg:order-2')} delay={120}>
          <div className="group relative">
            <div
              aria-hidden="true"
              className={cn(
                'absolute -bottom-4 hidden h-full w-full rounded-2xl border lg:block',
                reverse ? '-right-4' : '-left-4',
                dark ? 'border-brand-500/40' : 'border-brand-500',
              )}
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-900 sm:aspect-[5/6]">
              <Photo slot={slot} src={imageSrc} variant={variant} zoom sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
