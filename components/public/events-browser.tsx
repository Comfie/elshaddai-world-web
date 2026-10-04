'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Photo } from '@/components/public/photo';
import { DateBlock, EventCard, type EventLike } from '@/components/public/event-card';
import { EmptyState } from '@/components/public/empty-state';
import { CtaLink } from '@/components/public/cta';
import { dateParts, formatEventType, formatTime } from '@/lib/format';

type Ev = EventLike & { isFeatured?: boolean; description?: string | null };

/** Featured event + type filter + grid. Upcoming events only (the page passes them in). */
export function EventsBrowser({ events }: { events: Ev[] }) {
  const [type, setType] = useState('ALL');

  const types = useMemo(() => [...new Set(events.map((e) => e.eventType))], [events]);
  const featured = type === 'ALL' ? (events.find((e) => e.isFeatured) ?? events[0]) : undefined;
  const list = events.filter((e) => (type === 'ALL' || e.eventType === type) && e.id !== featured?.id);

  if (events.length === 0) {
    return (
      <EmptyState
        title="No upcoming events just yet."
        description="New gatherings are added as they are planned. Our regular services meet every week — we would love to see you."
      >
        <CtaLink href="/visit" variant="primary">
          Plan your visit
        </CtaLink>
        <CtaLink href="/sermons" variant="text-dark">
          Watch a sermon
        </CtaLink>
      </EmptyState>
    );
  }

  return (
    <div>
      {types.length > 1 && (
        <div
          role="group"
          aria-label="Filter events by type"
          className="no-scrollbar -mx-5 mb-12 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {['ALL', ...types].map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={type === t}
              onClick={() => setType(t)}
              className={cn(
                'min-h-11 shrink-0 rounded-lg border px-5 text-[0.8rem] font-semibold uppercase tracking-[0.1em] transition-colors',
                type === t ? 'border-brand-700 bg-brand-700 text-white' : 'border-brand-200 text-brand-navy hover:border-brand-700',
              )}
            >
              {t === 'ALL' ? 'All events' : formatEventType(t)}
            </button>
          ))}
        </div>
      )}

      {featured && (
        <article className="on-dark group relative mb-14 grid overflow-hidden rounded-2xl bg-brand-900 text-white lg:grid-cols-12">
          <div className="relative min-h-[18rem] lg:col-span-7 lg:min-h-[28rem]">
            <Photo src={featured.imageUrl ?? featured.posterUrl} alt="" variant={1} zoom sizes="(min-width: 1024px) 58vw, 100vw" />
            <DateBlock date={featured.eventDate} className="absolute left-5 top-5" />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-5">
            <p className="kicker mb-5 text-brand-300">{featured.isFeatured ? 'Featured event' : 'Next up'}</p>
            <h2 className="display-md">
              <Link href={`/events/${featured.id}`} className="link-underline after:absolute after:inset-0 after:content-['']">
                {featured.title}
              </Link>
            </h2>
            <ul className="mt-6 space-y-2 text-brand-100">
              <li className="flex items-center gap-2">
                <Clock className="size-4 shrink-0 text-brand-300" aria-hidden="true" />
                {dateParts(featured.eventDate).weekday}
                {featured.startTime && <> &middot; {formatTime(featured.startTime)}</>}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-brand-300" aria-hidden="true" />
                {featured.isOnline ? 'Online' : featured.location}
              </li>
            </ul>
            {featured.description && (
              <p className="mt-6 line-clamp-3 text-mist">{featured.description}</p>
            )}
            <p className="mt-8 inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-brand-300">
              Event details
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
            </p>
          </div>
        </article>
      )}

      {list.length > 0 ? (
        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((e, i) => (
            <EventCard key={e.id} event={e} variant={i} />
          ))}
        </div>
      ) : (
        !featured && <EmptyState title="No events of this type right now." description="Try another category." />
      )}
    </div>
  );
}
