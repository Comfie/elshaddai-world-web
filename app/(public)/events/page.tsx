import type { Metadata } from 'next';
import { PageHero } from '@/components/public/page-hero';
import { EventsBrowser } from '@/components/public/events-browser';
import { PlanVisitCTA } from '@/components/public/plan-visit-cta';
import { getUpcomingEvents } from '@/lib/public-data';
import { getSiteInfo } from '@/lib/site-info';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Events',
  description: 'See what is happening at El Shaddai World Ministries — upcoming services, conferences, outreach and more.',
  alternates: { canonical: '/events' },
  openGraph: { title: 'Events | El Shaddai World Ministries', url: '/events' },
};

export default async function EventsPage() {
  const [events, info] = await Promise.all([getUpcomingEvents(30), getSiteInfo()]);

  return (
    <>
      <PageHero
        variant={0}
        kicker="Events"
        title={
          <>
            What&rsquo;s <em className="text-gold-light">happening.</em>
          </>
        }
        description="Gatherings, conferences and community moments — come and be part of them."
      />
      <section aria-label="Upcoming events" className="on-light section-y bg-ivory">
        <div className="wrap">
          <EventsBrowser
            events={events.map((e) => ({
              id: e.id,
              title: e.title,
              description: e.description,
              eventDate: e.eventDate.toISOString(),
              startTime: e.startTime,
              endTime: e.endTime,
              location: e.location,
              eventType: e.eventType,
              imageUrl: e.imageUrl,
              posterUrl: e.posterUrl,
              isOnline: e.isOnline,
              isFeatured: e.isFeatured,
              ministry: e.ministry ? { name: e.ministry.name } : null,
            }))}
          />
        </div>
      </section>
      <PlanVisitCTA info={info} />
    </>
  );
}
