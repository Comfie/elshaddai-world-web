'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Play, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Photo } from '@/components/public/photo';
import { SermonCard, type SermonLike } from '@/components/public/sermon-card';
import { EmptyState } from '@/components/public/empty-state';
import { CtaLink } from '@/components/public/cta';
import { formatLongDate } from '@/lib/format';
import { sermonThumbnail } from '@/lib/media';

type Sermon = SermonLike & { topic?: string | null };

const CATEGORIES = [
  { value: 'ALL', label: 'All' },
  { value: 'SUNDAY_SERVICE', label: 'Sunday Service' },
  { value: 'MIDWEEK_SERVICE', label: 'Midweek Service' },
  { value: 'SPECIAL_EVENT', label: 'Special Event' },
  { value: 'CONFERENCE', label: 'Conference' },
  { value: 'SERIES', label: 'Series' },
  { value: 'GUEST_SPEAKER', label: 'Guest Speaker' },
];

const PAGE_SIZE = 12;

/**
 * Searchable, filterable sermon library. Same filtering behaviour as before
 * (title / description / scripture / topic search + category), presented as a
 * media library: featured message, series artwork, then a responsive grid.
 */
export function SermonLibrary({ sermons }: { sermons: Sermon[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ALL');
  const [series, setSeries] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtering = query.trim() !== '' || category !== 'ALL' || series !== null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sermons.filter((s) => {
      if (category !== 'ALL' && s.category !== category) return false;
      if (series && s.series !== series) return false;
      if (!q) return true;
      return [s.title, s.description, s.scripture, s.topic].some((f) => f?.toLowerCase().includes(q));
    });
  }, [sermons, query, category, series]);

  const seriesList = useMemo(() => {
    const map = new Map<string, { name: string; count: number; cover: Sermon }>();
    for (const s of sermons) {
      if (!s.series) continue;
      const hit = map.get(s.series);
      if (hit) hit.count += 1;
      else map.set(s.series, { name: s.series, count: 1, cover: s });
    }
    return [...map.values()];
  }, [sermons]);

  const featured = !filtering ? (sermons.find((s) => s.isFeatured) ?? sermons[0]) : undefined;
  const grid = featured ? filtered.filter((s) => s.id !== featured.id) : filtered;

  const reset = (fn: () => void) => {
    fn();
    setVisible(PAGE_SIZE);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="on-light border-b border-stone-200 bg-ivory">
        <div className="wrap py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative lg:w-96">
              <label htmlFor="sermon-search" className="sr-only">
                Search sermons by title, topic or scripture
              </label>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-stone-500" aria-hidden="true" />
              <input
                id="sermon-search"
                type="search"
                inputMode="search"
                value={query}
                onChange={(e) => reset(() => setQuery(e.target.value))}
                placeholder="Search title, topic, scripture"
                className="h-12 w-full rounded-full border border-stone-200 bg-ivory-50 pl-12 pr-5 text-base text-ink-900 placeholder:text-stone-500 focus:border-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-900"
              />
            </div>

            <div
              role="group"
              aria-label="Filter by category"
              className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0"
            >
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  aria-pressed={category === c.value}
                  onClick={() => reset(() => setCategory(c.value))}
                  className={cn(
                    'min-h-11 shrink-0 rounded-full border px-5 text-[0.8rem] font-semibold uppercase tracking-[0.1em] transition-colors',
                    category === c.value
                      ? 'border-ink-900 bg-ink-900 text-ivory'
                      : 'border-stone-200 text-ink-900 hover:border-ink-900',
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex min-h-6 flex-wrap items-center gap-3 text-sm text-stone-600" aria-live="polite">
            <span>
              {filtered.length} {filtered.length === 1 ? 'message' : 'messages'}
            </span>
            {series && (
              <button
                type="button"
                onClick={() => reset(() => setSeries(null))}
                className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-ink-900 px-3 text-xs font-semibold uppercase tracking-wider text-ivory"
              >
                Series: {series} <X className="size-3.5" aria-hidden="true" />
                <span className="sr-only">Clear series filter</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Featured */}
      {featured && (
        <section aria-label="Featured message" className="on-dark bg-ink-900 text-white">
          <div className="wrap grid items-center gap-10 py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
            <div className="group relative lg:col-span-7">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink-950">
                <Photo src={sermonThumbnail(featured)} alt="" variant={2} zoom sizes="(min-width: 1024px) 58vw, 100vw" priority />
                <div aria-hidden="true" className="absolute inset-0 bg-ink-950/25" />
                <Link href={`/sermons/${featured.id}`} tabIndex={-1} aria-hidden="true" className="absolute inset-0 grid place-items-center">
                  <span className="grid size-20 place-items-center rounded-full bg-gold text-ink-950 transition-transform duration-300 group-hover:scale-110 sm:size-24">
                    <Play className="ml-1 size-8 fill-current" />
                  </span>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <p className="kicker mb-5 text-gold-light">{featured.isFeatured ? 'Featured message' : 'Latest message'}</p>
              {featured.series && <p className="kicker mb-3 text-stone-400">{featured.series}</p>}
              <h2 className="display-md">
                <Link href={`/sermons/${featured.id}`} className="link-underline">
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-5 text-lg text-white">{featured.preacher}</p>
              <p className="text-stone-400">
                {formatLongDate(featured.sermonDate)}
                {featured.scripture && <span className="text-gold-light"> &middot; {featured.scripture}</span>}
              </p>
              <div className="mt-8">
                <CtaLink href={`/sermons/${featured.id}`} variant="gold">
                  Watch message
                </CtaLink>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Series */}
      {!filtering && seriesList.length > 0 && (
        <section aria-labelledby="series-heading" className="on-light bg-ivory pt-16 sm:pt-20">
          <div className="wrap">
            <h2 id="series-heading" className="kicker mb-6 text-bronze">
              Browse by series
            </h2>
            <ul className="no-scrollbar -mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
              {seriesList.map((s, i) => (
                <li key={s.name} className="w-[15rem] shrink-0 snap-start sm:w-[18rem]">
                  <button
                    type="button"
                    onClick={() => reset(() => setSeries(s.name))}
                    className="on-dark group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink-950 text-left text-white"
                  >
                    <Photo src={sermonThumbnail(s.cover)} alt="" variant={i} zoom sizes="300px" />
                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-ink-950/10" />
                    <span className="absolute inset-x-0 bottom-0 p-5">
                      <span className="display-sm line-clamp-2 block">{s.name}</span>
                      <span className="kicker mt-2 block text-gold-light">
                        {s.count} {s.count === 1 ? 'message' : 'messages'}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Grid */}
      <section aria-label="Sermons" className="on-light bg-ivory section-y">
        <div className="wrap">
          {sermons.length === 0 ? (
            <EmptyState
              title="Messages are on their way."
              description="Our sermon library is being prepared. In the meantime we would love to worship with you in person."
            >
              <CtaLink href="/visit" variant="dark">
                Plan your visit
              </CtaLink>
            </EmptyState>
          ) : grid.length === 0 && !featured ? (
            <EmptyState title="No messages match your search." description="Try a different word, or clear the filters.">
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setCategory('ALL');
                  setSeries(null);
                }}
                className="inline-flex min-h-12 items-center rounded-full border border-ink-900/40 px-7 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-ink-900 hover:bg-ink-900 hover:text-ivory"
              >
                Clear filters
              </button>
            </EmptyState>
          ) : (
            <>
              {featured && <h2 className="display-md mb-12 text-ink-900">All messages</h2>}
              <div className="grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {grid.slice(0, visible).map((s, i) => (
                  <SermonCard key={s.id} sermon={s} variant={i} />
                ))}
              </div>
              {grid.length > visible && (
                <div className="mt-16 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="inline-flex min-h-12 items-center rounded-full border border-ink-900/40 px-8 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-ink-900 transition-colors hover:bg-ink-900 hover:text-ivory"
                  >
                    Load more messages
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
