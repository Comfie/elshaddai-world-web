import Link from 'next/link';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Photo } from '@/components/public/photo';
import { dateParts, formatEventType, formatTime } from '@/lib/format';

export type EventLike = {
  id: string;
  title: string;
  eventDate: Date | string;
  startTime?: string | null;
  endTime?: string | null;
  location: string;
  eventType: string;
  imageUrl?: string | null;
  posterUrl?: string | null;
  ministry?: { name: string } | null;
  isOnline?: boolean;
};

/** Date block shown over event imagery. */
export function DateBlock({ date, className }: { date: Date | string; className?: string }) {
  const p = dateParts(date);
  return (
    <div
      className={cn(
        'inline-flex min-w-[4.25rem] flex-col items-center rounded-xl bg-brand-50 px-3 py-2.5 text-center text-brand-navy',
        className,
      )}
    >
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-700">{p.month}</span>
      <span className="font-display text-[2rem] leading-none">{p.day}</span>
    </div>
  );
}

export function EventCard({
  event,
  tone = 'light',
  variant = 0,
}: {
  event: EventLike;
  tone?: 'light' | 'dark';
  variant?: number;
}) {
  const dark = tone === 'dark';
  const time = formatTime(event.startTime);
  const p = dateParts(event.eventDate);
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-brand-900">
        <Photo
          src={event.imageUrl ?? event.posterUrl}
          alt=""
          variant={variant + event.title.length}
          zoom
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-navy/50 via-transparent to-transparent" />
        <DateBlock date={event.eventDate} className="absolute left-4 top-4" />
        <span className="absolute bottom-4 left-4 rounded-full bg-brand-navy/85 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
          {formatEventType(event.eventType)}
        </span>
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <h3 className={cn('display-sm', dark ? 'text-white' : 'text-brand-navy')}>
          <Link
            href={`/events/${event.id}`}
            className="link-underline after:absolute after:inset-0 after:content-['']"
          >
            {event.title}
          </Link>
        </h3>
        <ul className={cn('mt-4 space-y-1.5 text-[0.95rem]', dark ? 'text-mist' : 'text-body')}>
          <li className="flex items-center gap-2">
            <Clock className="size-4 shrink-0" aria-hidden="true" />
            <span>
              <span className="sr-only">{p.weekday}, </span>
              {p.weekdayShort}
              {time && <> &middot; {time}</>}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">{event.isOnline ? 'Online' : event.location}</span>
          </li>
        </ul>
        <p
          className={cn(
            'mt-5 inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em]',
            dark ? 'text-brand-300' : 'text-brand-navy',
          )}
        >
          Details
          <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </p>
      </div>
    </article>
  );
}
