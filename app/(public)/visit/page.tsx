import type { Metadata } from 'next';
import Link from 'next/link';
import { Facebook, Mail, MapPin, Phone } from 'lucide-react';
import { PageHero } from '@/components/public/page-hero';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import { SectionHeader } from '@/components/public/section-header';
import { Accordion } from '@/components/public/accordion';
import { NeedsConfirmation } from '@/components/public/needs-confirmation';
import { PlanVisitCTA } from '@/components/public/plan-visit-cta';
import { ProgrammeSurface } from '@/components/public/programme-surface';
import { Photo } from '@/components/public/photo';
import { TodayBadge } from '@/components/public/today-badge';
import { getSiteInfo } from '@/lib/site-info';
import { facebookLabel } from '@/lib/social';
import {
  MORNING_MANNA,
  MORNING_PRAYER,
  SUNDAY_EVENING,
  SUNDAY_MORNING,
  VISIT_FAQS,
  programDays,
  programTimes,
} from '@/lib/site-config';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Plan Your Visit',
  description: `New to El Shaddai World Ministries? Join us on Sundays — morning ${programTimes(SUNDAY_MORNING)} and evening ${programTimes(SUNDAY_EVENING)} — and see what to expect on your first visit.`,
  alternates: { canonical: '/visit' },
  openGraph: { title: 'Plan Your Visit | El Shaddai World Ministries', url: '/visit' },
};

const pillars = ['Worship', 'Biblical teaching', 'Fellowship', 'Service'];

export default async function VisitPage() {
  const info = await getSiteInfo();

  const faqItems = VISIT_FAQS.map((f) => ({
    id: f.id,
    question: f.question,
    answer:
      f.answer !== null ? (
        <p>{f.answer}</p>
      ) : (
        <p>
          We are finalising the details for this one. Please{' '}
          <Link href="/contact?topic=visitor" className="text-brand-700 underline underline-offset-4">
            send us a message
          </Link>{' '}
          and we will gladly help.
          <NeedsConfirmation what={f.question} />
        </p>
      ),
  }));

  return (
    <>
      <PageHero
        slot="visitHero"
        variant={1}
        kicker="First time?"
        title={
          <>
            We&rsquo;ve saved <em className="text-brand-300">you a seat.</em>
          </>
        }
        description="Everything you need to know before you arrive — when we gather and what to expect."
      >
        <CtaLink href="#sundays" variant="primary">
          Sunday times
        </CtaLink>
        <CtaLink href="#faq" variant="outline-light" arrow={false}>
          Common questions
        </CtaLink>
      </PageHero>

      {/* Sundays — the two services, side by side */}
      <section id="sundays" aria-labelledby="sundays-heading" className="on-light section-y bg-brand-50">
        <div className="wrap">
          <Reveal>
            <SectionHeader
              kicker="Worship with us"
              title={
                <span id="sundays-heading">
                  Sundays at <em>El Shaddai.</em>
                </span>
              }
              description="Two gatherings every Sunday — come to whichever suits you."
            />
          </Reveal>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:gap-6">
            {[SUNDAY_MORNING, SUNDAY_EVENING].map((s, i) => (
              <Reveal key={s.id} delay={i * 90}>
                <ProgrammeSurface
                  slot="sundayService"
                  variant={i === 0 ? 1 : 0}
                  watermark={i === 0 ? 'AM' : 'PM'}
                  overlay="bg-gradient-to-br from-brand-navy/85 via-brand-900/75 to-brand-700/70"
                  className="h-full"
                >
                  <div className="flex min-h-[19rem] flex-col justify-between p-7 sm:p-10">
                    <div className="flex items-center justify-between gap-4">
                      <p className="kicker text-brand-100">Every Sunday</p>
                      <TodayBadge days={s.days} />
                    </div>
                    <div className="mt-10">
                      <h3 className="kicker text-brand-100">{s.name}</h3>
                      <p className="font-display mt-4 whitespace-nowrap text-[clamp(1.9rem,7.4vw,3rem)] leading-none">
                        {programTimes(s)}
                      </p>
                    </div>
                  </div>
                </ProgrammeSurface>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Through the week */}
      <section aria-labelledby="week-heading" className="on-light section-y bg-brand-100">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-4">
            <SectionHeader
              kicker="Through the week"
              title={
                <span id="week-heading">
                  Start your day <em>with God.</em>
                </span>
              }
            />
          </Reveal>
          <Reveal className="lg:col-span-8" delay={100}>
            <ul className="divide-y divide-brand-200 border-y border-brand-200">
              {[MORNING_PRAYER, MORNING_MANNA].map((p) => (
                <li key={p.id} className="flex flex-col gap-3 py-8 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="display-sm text-brand-navy">{p.name}</h3>
                      <TodayBadge days={p.days} className="border border-brand-200" />
                    </div>
                    {p.subtitle && <p className="mt-1 text-body">{p.subtitle}</p>}
                    <p className="kicker mt-3 text-brand-700">{programDays(p)}</p>
                  </div>
                  <p className="font-display whitespace-nowrap text-[clamp(1.6rem,6vw,2.25rem)] leading-none text-brand-navy">
                    {programTimes(p)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <CtaLink href="/prayer-requests" variant="outline-dark">
                Submit a prayer request
              </CtaLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What to expect */}
      <section aria-labelledby="expect-heading" className="on-dark section-y bg-brand-navy text-white">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-6">
            <SectionHeader
              tone="dark"
              kicker="What to expect"
              title={
                <span id="expect-heading">
                  Come as you are. <em>Leave encouraged.</em>
                </span>
              }
              description="We are a Bible-believing, Spirit-filled church. When you join us you will find a warm welcome, and a community that gathers around four simple things."
            />
          </Reveal>
          <Reveal className="lg:col-span-6" delay={100}>
            <ol className="divide-y divide-white/15 border-y border-white/15">
              {pillars.map((p, i) => (
                <li key={p} className="flex items-baseline gap-6 py-6">
                  <span className="kicker w-8 text-brand-300">{String(i + 1).padStart(2, '0')}</span>
                  <span className="display-md">{p}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Location */}
      <section aria-labelledby="location-heading" className="on-light section-y bg-brand-50">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <SectionHeader
              kicker="Location"
              title={
                <span id="location-heading">
                  Finding <em>us.</em>
                </span>
              }
            />
            {info.addressLines ? (
              <div className="mt-8 flex items-start gap-3 text-body">
                <MapPin className="mt-1 size-5 shrink-0 text-brand-700" aria-hidden="true" />
                <address className="not-italic leading-relaxed">
                  {info.addressLines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              </div>
            ) : (
              <>
                <p className="lead mt-8 max-w-md text-body">
                  Planning your first visit? Send us a message or reach us on Facebook and we will happily share exactly
                  where to come and how to find us.
                  <NeedsConfirmation what="church address (Settings: church_address)" />
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <CtaLink href="/contact?topic=visitor" variant="primary">
                    Ask for directions
                  </CtaLink>
                  {info.social.facebook && (
                    <CtaLink
                      href={info.social.facebook}
                      variant="outline-dark"
                      aria-label={facebookLabel(info.name, 'Facebook')}
                    >
                      <Facebook className="size-4" aria-hidden="true" /> Facebook
                    </CtaLink>
                  )}
                </div>
              </>
            )}
            {info.directionsUrl && (
              <div className="mt-6">
                <CtaLink href={info.directionsUrl} variant="text-dark" external>
                  Get directions
                </CtaLink>
              </div>
            )}
          </Reveal>

          <Reveal className="lg:col-span-7" delay={100}>
            {info.mapEmbedUrl ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-brand-200 bg-brand-100 lg:aspect-auto lg:h-full lg:min-h-[26rem]">
                <iframe
                  title={`Map showing the location of ${info.name}`}
                  src={info.mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            ) : (
              <div className="on-dark relative isolate aspect-[4/3] overflow-hidden rounded-2xl bg-brand-navy lg:aspect-auto lg:h-full lg:min-h-[26rem]">
                <Photo variant={2} />
                <div aria-hidden="true" className="absolute inset-0 bg-brand-navy/55" />
                <div className="absolute inset-0 flex items-end p-8 sm:p-10">
                  <p className="display-md max-w-sm text-white">
                    Everyone is <em className="text-brand-300">welcome.</em>
                  </p>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* Families + parking */}
      <section className="on-light bg-brand-50 pb-[clamp(4.5rem,9vw,8.5rem)]">
        <div className="wrap grid gap-4 lg:grid-cols-2 lg:gap-6">
          <Reveal>
            <div className="on-dark relative isolate h-full overflow-hidden rounded-2xl bg-brand-navy text-white">
              <Photo variant={1} />
              <div aria-hidden="true" className="absolute inset-0 bg-brand-navy/55" />
              <div className="relative flex min-h-[22rem] flex-col justify-end p-8 sm:p-12">
                <p className="kicker mb-4 text-brand-300">Children &amp; families</p>
                <h2 className="display-md">Bringing little ones?</h2>
                <p className="mt-4 max-w-md text-brand-100">
                  Families are very welcome. Please get in touch ahead of your visit and we will explain what is
                  available for children and parents.
                  <NeedsConfirmation what="children's ministry details" />
                </p>
                <div className="mt-7">
                  <CtaLink href="/contact?topic=visitor" variant="text-light">
                    Ask about children&rsquo;s ministry
                  </CtaLink>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex h-full flex-col justify-end rounded-2xl border border-brand-200 bg-white p-8 sm:p-12">
              <p className="kicker mb-4 text-brand-700">Parking &amp; accessibility</p>
              <h2 className="display-md text-brand-navy">Getting here.</h2>
              <p className="mt-4 max-w-md text-body">
                We want your first visit to be easy. Ask us about parking and access before you come and we will help.
                <NeedsConfirmation what="parking and accessibility details" />
              </p>
              <div className="mt-7">
                <CtaLink href="/contact?topic=visitor" variant="primary">
                  Ask a question
                </CtaLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" aria-labelledby="faq-heading" className="on-light bg-brand-100 section-y">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-4">
            <SectionHeader
              kicker="FAQ"
              title={
                <span id="faq-heading">
                  Good <em>questions.</em>
                </span>
              }
              description="Not finding your answer? We would love to hear from you."
            />
            <div className="mt-8 space-y-1 text-body">
              {info.email && (
                <p className="flex items-center gap-3">
                  <Mail className="size-5 text-brand-700" aria-hidden="true" />
                  <a href={`mailto:${info.email}`} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                    {info.email}
                  </a>
                </p>
              )}
              {info.phone && (
                <p className="flex items-center gap-3">
                  <Phone className="size-5 text-brand-700" aria-hidden="true" />
                  <a href={`tel:${info.phone.replace(/\s/g, '')}`} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                    {info.phone}
                  </a>
                </p>
              )}
              {info.social.facebook && (
                <p className="flex items-center gap-3">
                  <Facebook className="size-5 text-brand-700" aria-hidden="true" />
                  <a
                    href={info.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={facebookLabel(info.name, 'Message us on Facebook')}
                    className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
                  >
                    Message us on Facebook
                  </a>
                </p>
              )}
            </div>
            <div className="mt-6">
              <CtaLink href="/contact?topic=visitor" variant="text-dark">
                Send a message
              </CtaLink>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={100}>
            <Accordion items={faqItems} />
          </Reveal>
        </div>
      </section>

      <PlanVisitCTA
        info={info}
        showVisitButton={false}
        title={
          <>
            We can&rsquo;t wait to <em>meet you.</em>
          </>
        }
        lead="Come as you are this Sunday."
      />
    </>
  );
}
