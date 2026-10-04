import Link from 'next/link';
import { Play } from 'lucide-react';
import { Photo } from '@/components/public/photo';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import { SermonCard, type SermonLike } from '@/components/public/sermon-card';
import { EmptyState } from '@/components/public/empty-state';
import { formatLongDate } from '@/lib/format';
import { sermonThumbnail } from '@/lib/media';

/** Latest / featured message with a short row of recent ones beneath. */
export function FeaturedSermon({ sermons }: { sermons: SermonLike[] }) {
  const [featured, ...rest] = sermons;
  return (
    <section aria-labelledby="sermon-heading" className="on-dark section-y bg-brand-900 text-white">
      <div className="wrap">
        <Reveal>
          <p className="kicker mb-5 text-brand-300">{featured?.isFeatured ? 'Featured message' : 'Latest message'}</p>
          <h2 id="sermon-heading" className="sr-only">
            Latest sermon
          </h2>
        </Reveal>

        {!featured ? (
          <EmptyState
            tone="dark"
            title="Messages are on their way."
            description="Our sermon library is being prepared. In the meantime, we would love to worship with you in person."
          >
            <CtaLink href="/visit" variant="primary">
              Plan your visit
            </CtaLink>
          </EmptyState>
        ) : (
          <>
            <Reveal className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="group relative lg:col-span-7">
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-brand-navy">
                  <Photo
                    src={sermonThumbnail(featured)}
                    alt=""
                    variant={2}
                    zoom
                    priority={false}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-brand-navy/10" />
                  <Link
                    href={`/sermons/${featured.id}`}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="absolute inset-0 grid place-items-center"
                  >
                    <span className="grid size-20 place-items-center rounded-full bg-brand-600 text-white shadow-xl transition-transform duration-300 group-hover:scale-110 sm:size-24">
                      <Play className="ml-1 size-8 fill-current" />
                    </span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                {featured.series && <p className="kicker mb-4 text-mist">{featured.series}</p>}
                <h3 className="display-md">
                  <Link href={`/sermons/${featured.id}`} className="link-underline inline-block py-1.5">
                    {featured.title}
                  </Link>
                </h3>
                <dl className="mt-6 space-y-1 text-mist">
                  <div className="flex gap-2">
                    <dt className="sr-only">Speaker</dt>
                    <dd className="text-lg text-white">{featured.preacher}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="sr-only">Date</dt>
                    <dd>{formatLongDate(featured.sermonDate)}</dd>
                  </div>
                  {featured.scripture && (
                    <div className="flex gap-2">
                      <dt className="sr-only">Scripture</dt>
                      <dd className="text-brand-300">{featured.scripture}</dd>
                    </div>
                  )}
                </dl>
                {featured.description && (
                  <p className="mt-6 line-clamp-3 max-w-md leading-relaxed text-mist">{featured.description}</p>
                )}
                <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <CtaLink href={`/sermons/${featured.id}`} variant="primary">
                    Watch message
                  </CtaLink>
                  <CtaLink href="/sermons" variant="text-light">
                    Explore all sermons
                  </CtaLink>
                </div>
              </div>
            </Reveal>

            {rest.length > 0 && (
              <Reveal className="mt-20 border-t border-white/10 pt-14" delay={80}>
                <p className="kicker mb-8 text-mist">More recent messages</p>
                <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.slice(0, 3).map((s, i) => (
                    <SermonCard key={s.id} sermon={s} tone="dark" variant={i} />
                  ))}
                </div>
              </Reveal>
            )}
          </>
        )}
      </div>
    </section>
  );
}
