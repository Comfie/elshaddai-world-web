import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CalendarPlus, Clock, ExternalLink, MapPin } from 'lucide-react';
import { prisma } from '@/lib/db';
import { safeQuery } from '@/lib/public-data';
import { PageHero } from '@/components/public/page-hero';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import { ShareButtons } from '@/components/public/share-buttons';
import { DateBlock } from '@/components/public/event-card';
import { PlanVisitCTA } from '@/components/public/plan-visit-cta';
import { JsonLd } from '@/components/public/json-ld';
import { getSiteInfo } from '@/lib/site-info';
import { eventTimes, googleCalendarUrl } from '@/lib/calendar';
import { dateParts, formatEventType, formatLongDate, formatTime } from '@/lib/format';
import { SITE_URL } from '@/lib/site-config';

export const revalidate = 60;

const getEvent = (id: string) =>
  prisma.event.findFirst({
    where: { id, displayOnWebsite: true, status: { not: 'CANCELLED' } },
    include: { ministry: { select: { name: true, slug: true } } },
  });

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const event = await safeQuery(() => getEvent(id), null);
  if (!event) return { title: 'Event not found' };
  const description =
    event.description?.slice(0, 160) ?? `${event.title} — ${formatLongDate(event.eventDate)} at ${event.location}.`;
  const image = event.imageUrl ?? event.posterUrl;
  return {
    title: event.title,
    description,
    alternates: { canonical: `/events/${event.id}` },
    openGraph: {
      title: event.title,
      description,
      url: `/events/${event.id}`,
      ...(image && { images: [{ url: image }] }),
    },
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [event, info] = await Promise.all([getEvent(id), getSiteInfo()]);
  if (!event) notFound();

  const t = eventTimes(event);
  const past = (t.allDay ? new Date(`${t.endYmd}T00:00:00+02:00`) : t.endUtc) < new Date();
  const start = formatTime(event.startTime);
  const end = formatTime(event.endTime);
  const venue = [event.location, event.address].filter(Boolean).join(', ');
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue)}`;
  const p = dateParts(event.eventDate);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description ?? undefined,
    startDate: t.allDay ? t.startYmd : t.startUtc.toISOString(),
    endDate: t.allDay ? t.endYmd : t.endUtc.toISOString(),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.isOnline
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: event.isOnline
      ? { '@type': 'VirtualLocation', url: event.onlineLink ?? `${SITE_URL}/events/${event.id}` }
      : { '@type': 'Place', name: event.location, address: event.address ?? event.location },
    image: [event.imageUrl ?? event.posterUrl].filter(Boolean),
    organizer: { '@type': 'Organization', name: info.name, url: SITE_URL },
  };

  return (
    <>
      <JsonLd data={schema} />
      <PageHero
        imageSrc={event.imageUrl ?? event.posterUrl}
        variant={event.title.length}
        kicker={formatEventType(event.eventType)}
        title={event.title}
        size="tall"
      >
        <DateBlock date={event.eventDate} />
        <p className="flex items-center text-lg text-brand-100">
          {p.weekday}
          {start && <>&nbsp;&middot;&nbsp;{start}{end && <>&ndash;{end}</>}</>}
        </p>
      </PageHero>

      <section className="on-light section-y bg-brand-50">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-7">
            {past && (
              <p className="mb-8 inline-block rounded-full bg-brand-100 px-4 py-2 text-sm font-semibold text-body">
                This event has taken place.
              </p>
            )}
            <h2 className="kicker mb-5 text-brand-700">About this event</h2>
            {event.description ? (
              <p className="lead max-w-2xl whitespace-pre-wrap text-body">{event.description}</p>
            ) : (
              <p className="lead max-w-2xl text-body">
                Join us for {event.title}. Get in touch if you would like to know more.
              </p>
            )}

            {event.requiresRSVP && (
              <div className="mt-10 rounded-2xl border border-brand-200 bg-white p-7">
                <p className="kicker mb-3 text-brand-700">Registration</p>
                <p className="text-body">
                  Please let us know you are coming
                  {event.registrationDeadline && <> before {formatLongDate(event.registrationDeadline)}</>}
                  {event.maxAttendees && <> — space is limited to {event.maxAttendees} guests</>}.
                </p>
                <div className="mt-5">
                  <CtaLink
                    href={`/contact?topic=event&subject=${encodeURIComponent(`RSVP: ${event.title}`)}`}
                    variant="primary"
                  >
                    RSVP
                  </CtaLink>
                </div>
              </div>
            )}

            <div className="mt-12">
              <h2 className="kicker mb-5 text-brand-700">Share</h2>
              <ShareButtons url={`${SITE_URL}/events/${event.id}`} title={event.title} />
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={100}>
            <div className="rounded-2xl border border-brand-200 bg-white p-8 sm:p-10 lg:sticky lg:top-28">
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <Clock className="mt-1 size-5 shrink-0 text-brand-700" aria-hidden="true" />
                  <div>
                    <p className="kicker mb-1 text-brand-700">When</p>
                    <p className="text-lg text-brand-navy">{formatLongDate(event.eventDate)}</p>
                    {start && (
                      <p className="text-body">
                        {start}
                        {end && <> &ndash; {end}</>}
                      </p>
                    )}
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <MapPin className="mt-1 size-5 shrink-0 text-brand-700" aria-hidden="true" />
                  <div>
                    <p className="kicker mb-1 text-brand-700">Where</p>
                    <p className="text-lg text-brand-navy">{event.isOnline ? 'Online' : event.location}</p>
                    {event.address && !event.isOnline && <p className="text-body">{event.address}</p>}
                    {event.isOnline && event.onlineLink && (
                      <a
                        href={event.onlineLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-1.5 text-brand-navy underline underline-offset-4"
                      >
                        Join online <ExternalLink className="size-4" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </li>
                {event.ministry && (
                  <li className="flex items-start gap-4">
                    <span className="mt-1 size-5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="kicker mb-1 text-brand-700">Hosted by</p>
                      <Link
                        href={`/ministries/${event.ministry.slug}`}
                        className="text-lg text-brand-navy underline-offset-4 hover:underline"
                      >
                        {event.ministry.name}
                      </Link>
                    </div>
                  </li>
                )}
              </ul>

              <div className="mt-9 flex flex-col gap-3 border-t border-brand-200 pt-8">
                {!event.isOnline && (
                  <CtaLink href={directions} variant="primary" external>
                    Get directions
                  </CtaLink>
                )}
                <CtaLink href={googleCalendarUrl(event)} variant="outline-dark" external arrow={false}>
                  <CalendarPlus className="size-4" aria-hidden="true" /> Google Calendar
                </CtaLink>
                <a
                  href={`/events/${event.id}/calendar.ics`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-brand-navy underline-offset-4 hover:underline"
                >
                  Download .ics (Apple / Outlook)
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <PlanVisitCTA info={info} />
    </>
  );
}
