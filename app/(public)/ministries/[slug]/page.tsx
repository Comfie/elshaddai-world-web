import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calendar, Mail, MapPin, Phone, User } from 'lucide-react';
import { prisma } from '@/lib/db';
import { safeQuery } from '@/lib/public-data';
import { startOfTodayZA } from '@/lib/format';
import { PageHero } from '@/components/public/page-hero';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import { EventCard } from '@/components/public/event-card';
import { PlanVisitCTA } from '@/components/public/plan-visit-cta';
import { getSiteInfo } from '@/lib/site-info';

export const revalidate = 60;

const getMinistry = (slug: string) =>
  prisma.ministry.findFirst({
    where: { slug, isActive: true, displayOnWebsite: true },
    include: {
      leader: { select: { name: true } },
      events: {
        where: { eventDate: { gte: startOfTodayZA() }, status: 'SCHEDULED', displayOnWebsite: true },
        orderBy: { eventDate: 'asc' },
        take: 6,
      },
    },
  });

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ministry = await safeQuery(() => getMinistry(slug), null);
  if (!ministry) return { title: 'Ministry not found' };
  const description =
    ministry.description?.slice(0, 160) ?? `${ministry.name} at El Shaddai World Ministries.`;
  const image = ministry.bannerUrl ?? ministry.imageUrl;
  return {
    title: ministry.name,
    description,
    alternates: { canonical: `/ministries/${ministry.slug}` },
    openGraph: {
      title: `${ministry.name} | El Shaddai World Ministries`,
      description,
      url: `/ministries/${ministry.slug}`,
      ...(image && { images: [{ url: image }] }),
    },
  };
}

export default async function MinistryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [ministry, info] = await Promise.all([getMinistry(slug), getSiteInfo()]);
  if (!ministry) notFound();

  const leaderName = ministry.leaderName || ministry.leader?.name;
  const hasMeeting =
    ministry.meetingDay || ministry.meetingTime || ministry.meetingLocation || ministry.meetingSchedule;
  const hasContact = ministry.contactEmail || ministry.contactPhone;
  const joinHref = `/contact?topic=ministry&subject=${encodeURIComponent(`I'd like to join ${ministry.name}`)}`;

  return (
    <>
      <PageHero
        imageSrc={ministry.bannerUrl ?? ministry.imageUrl}
        variant={ministry.name.length}
        kicker="Ministry"
        title={ministry.name}
        description={ministry.description}
        size="tall"
      >
        <CtaLink href={joinHref} variant="primary">
          Join this ministry
        </CtaLink>
        <CtaLink href="/ministries" variant="outline-light" arrow={false}>
          All ministries
        </CtaLink>
      </PageHero>

      {(ministry.vision || ministry.mission) && (
        <section className="on-light section-y bg-brand-50">
          <div className="wrap grid gap-14 lg:grid-cols-2 lg:gap-24">
            {ministry.vision && (
              <Reveal>
                <p className="kicker mb-5 text-brand-700">Our vision</p>
                <p className="display-sm whitespace-pre-wrap text-brand-navy sm:text-[1.75rem] sm:leading-snug">{ministry.vision}</p>
              </Reveal>
            )}
            {ministry.mission && (
              <Reveal delay={100}>
                <p className="kicker mb-5 text-brand-700">Our mission</p>
                <p className="display-sm whitespace-pre-wrap text-brand-navy sm:text-[1.75rem] sm:leading-snug">{ministry.mission}</p>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {(hasMeeting || leaderName || hasContact) && (
        <section aria-label="Meeting and contact information" className="on-dark section-y bg-brand-900 text-white">
          <div className="wrap grid gap-12 md:grid-cols-3">
            {hasMeeting && (
              <Reveal>
                <p className="kicker mb-5 text-brand-300">When &amp; where</p>
                <ul className="space-y-4 text-lg">
                  {(ministry.meetingDay || ministry.meetingTime) && (
                    <li className="flex items-start gap-3">
                      <Calendar className="mt-1 size-5 shrink-0 text-brand-300" aria-hidden="true" />
                      <span>{[ministry.meetingDay, ministry.meetingTime].filter(Boolean).join(' · ')}</span>
                    </li>
                  )}
                  {ministry.meetingLocation && (
                    <li className="flex items-start gap-3">
                      <MapPin className="mt-1 size-5 shrink-0 text-brand-300" aria-hidden="true" />
                      <span>{ministry.meetingLocation}</span>
                    </li>
                  )}
                  {ministry.meetingSchedule && (
                    <li className="text-mist">{ministry.meetingSchedule}</li>
                  )}
                </ul>
              </Reveal>
            )}
            {leaderName && (
              <Reveal delay={80}>
                <p className="kicker mb-5 text-brand-300">Led by</p>
                <p className="flex items-start gap-3 text-lg">
                  <User className="mt-1 size-5 shrink-0 text-brand-300" aria-hidden="true" />
                  {leaderName}
                </p>
              </Reveal>
            )}
            {hasContact && (
              <Reveal delay={160}>
                <p className="kicker mb-5 text-brand-300">Contact</p>
                <ul className="space-y-4 text-lg">
                  {ministry.contactEmail && (
                    <li className="flex items-start gap-3">
                      <Mail className="mt-1 size-5 shrink-0 text-brand-300" aria-hidden="true" />
                      <a href={`mailto:${ministry.contactEmail}`} className="inline-flex min-h-11 items-center break-all underline-offset-4 hover:underline">
                        {ministry.contactEmail}
                      </a>
                    </li>
                  )}
                  {ministry.contactPhone && (
                    <li className="flex items-start gap-3">
                      <Phone className="mt-1 size-5 shrink-0 text-brand-300" aria-hidden="true" />
                      <a href={`tel:${ministry.contactPhone.replace(/\s/g, '')}`} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                        {ministry.contactPhone}
                      </a>
                    </li>
                  )}
                </ul>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {ministry.events.length > 0 && (
        <section aria-labelledby="min-events" className="on-light section-y bg-brand-50">
          <div className="wrap">
            <h2 id="min-events" className="display-md mb-12 text-brand-navy">
              Upcoming events
            </h2>
            <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {ministry.events.map((e, i) => (
                <Reveal key={e.id} delay={i * 70}>
                  <EventCard event={{ ...e, ministry: { name: ministry.name } }} variant={i} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <PlanVisitCTA
        info={info}
        title={
          <>
            Ready to <em>belong?</em>
          </>
        }
        lead={`Join ${ministry.name}, or visit us this Sunday.`}
      />
    </>
  );
}
