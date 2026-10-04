import type { Metadata } from 'next';
import { HeroSection } from '@/components/public/hero-section';
import { ThisWeek } from '@/components/public/this-week';
import { MorningManna } from '@/components/public/morning-manna';
import { StayConnected } from '@/components/public/stay-connected';
import { ChildrenFeature } from '@/components/public/children-feature';
import { ImageTextSection } from '@/components/public/image-text-section';
import { FeaturedSermon } from '@/components/public/featured-sermon';
import { NextSteps } from '@/components/public/next-steps';
import { MinistryCard } from '@/components/public/ministry-card';
import { EventCard } from '@/components/public/event-card';
import { CommunitySection } from '@/components/public/community-section';
import { PrayerCTA } from '@/components/public/prayer-cta';
import { GivingCTA } from '@/components/public/giving-cta';
import { PlanVisitCTA } from '@/components/public/plan-visit-cta';
import { SectionHeader } from '@/components/public/section-header';
import { EmptyState } from '@/components/public/empty-state';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import { JsonLd } from '@/components/public/json-ld';
import { getRecentSermons, getUpcomingEvents, getWebsiteMinistries } from '@/lib/public-data';
import { getSiteInfo } from '@/lib/site-info';
import { getChildrenMinistry, isChildrenMinistry } from '@/lib/children';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL, programmeSchema } from '@/lib/site-config';

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — ${SITE_TAGLINE}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: 'website',
  },
};

export default async function HomePage() {
  const [info, sermons, allMinistries, events, childrenMinistry] = await Promise.all([
    getSiteInfo(),
    getRecentSermons(4),
    getWebsiteMinistries(8),
    getUpcomingEvents(3),
    getChildrenMinistry(),
  ]);
  // The Children's Ministry has its own feature band + page, so it is not repeated in the grid.
  const ministries = allMinistries.filter((m) => !isChildrenMinistry(m)).slice(0, 6);

  // Structured data is generated from verified facts only (no geo coordinates); opening
  // hours come from WEEKLY_PROGRAM and the address from the church-confirmed config.
  const churchSchema = {
    '@context': 'https://schema.org',
    '@type': 'Church',
    name: info.name,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    ...(info.email && { email: info.email }),
    ...(info.phone && { telephone: info.phone }),
    // Built only from the confirmed address: last line = locality, the rest = street/place.
    ...(info.addressLines && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: info.addressLines.slice(0, -1).join(', ') || info.addressLines[0],
        addressLocality: info.addressLines[info.addressLines.length - 1],
        addressCountry: 'ZA',
      },
    }),
    openingHoursSpecification: programmeSchema(),
    sameAs: Object.values(info.social).filter(Boolean),
  };

  return (
    <>
      <JsonLd data={churchSchema} />

      <HeroSection />
      <ThisWeek info={info} />
      <MorningManna info={info} />

      <ImageTextSection
        kicker="Welcome"
        title={
          <>
            A place to <em>belong.</em>
          </>
        }
        slot="welcome"
        variant={1}
        cta={
          <CtaLink href="/about" variant="primary">
            Discover our story
          </CtaLink>
        }
      >
        <p>
          El Shaddai World Ministries is a Bible-believing, Spirit-filled church committed to transforming lives
          through God&rsquo;s Word and demonstrating His love.
        </p>
        <p>Whoever you are and wherever you are on your journey, there is a seat for you here.</p>
      </ImageTextSection>

      <ChildrenFeature ministry={childrenMinistry} />

      <FeaturedSermon sermons={sermons} />

      <NextSteps />

      {ministries.length > 0 && (
        <section aria-labelledby="ministries-heading" className="on-dark section-y bg-brand-navy text-white">
          <div className="wrap">
            <Reveal>
              <SectionHeader
                tone="dark"
                kicker="Ministries"
                title={
                  <span id="ministries-heading">
                    There&rsquo;s a place <em>for you.</em>
                  </span>
                }
                action={
                  <CtaLink href="/ministries" variant="text-light">
                    All ministries
                  </CtaLink>
                }
              />
            </Reveal>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ministries.map((m, i) => (
                <Reveal key={m.id} delay={i * 80}>
                  <MinistryCard ministry={m} variant={i} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="events-heading" className="on-light section-y bg-brand-50">
        <div className="wrap">
          <Reveal>
            <SectionHeader
              kicker="Events"
              title={
                <span id="events-heading">
                  What&rsquo;s <em>happening.</em>
                </span>
              }
              action={
                events.length > 0 ? (
                  <CtaLink href="/events" variant="text-dark">
                    View all events
                  </CtaLink>
                ) : undefined
              }
            />
          </Reveal>

          {events.length > 0 ? (
            <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event, i) => (
                <Reveal key={event.id} delay={i * 80}>
                  <EventCard event={event} variant={i} />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal className="mt-14">
              <EmptyState
                title="No events on the calendar just yet."
                description="New gatherings are added as they are planned. Our services meet every week — we would love to see you."
              >
                <CtaLink href="/visit" variant="primary">
                  Plan your visit
                </CtaLink>
                <CtaLink href="/events" variant="text-dark">
                  Events page
                </CtaLink>
              </EmptyState>
            </Reveal>
          )}
        </div>
      </section>

      <CommunitySection />
      <PrayerCTA />
      <StayConnected info={info} />
      <GivingCTA />
      <PlanVisitCTA info={info} />
    </>
  );
}
