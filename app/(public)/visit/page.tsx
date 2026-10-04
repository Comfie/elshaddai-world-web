import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, MapPin, Mail, Phone } from 'lucide-react';
import { PageHero } from '@/components/public/page-hero';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import { SectionHeader } from '@/components/public/section-header';
import { Accordion } from '@/components/public/accordion';
import { NeedsConfirmation } from '@/components/public/needs-confirmation';
import { PlanVisitCTA } from '@/components/public/plan-visit-cta';
import { Photo } from '@/components/public/photo';
import { getSiteInfo } from '@/lib/site-info';
import { SERVICES, VISIT_FAQS } from '@/lib/site-config';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Plan Your Visit',
  description:
    'New to El Shaddai World Ministries? Find our service times, location and what to expect on your first Sunday.',
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
      f.answer ?? (
        <p>
          We are finalising the details for this one. Please{' '}
          <Link href="/contact?topic=visitor" className="text-ink-900 underline underline-offset-4">
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
        variant={3}
        kicker="First time?"
        title={
          <>
            We&rsquo;ve saved <em className="text-gold-light">you a seat.</em>
          </>
        }
        description="Everything you need to know before you arrive — when we meet, where to find us and what to expect."
      >
        <CtaLink href={info.directionsUrl} variant="gold" external>
          Get directions
        </CtaLink>
        <CtaLink href="#faq" variant="outline-light" arrow={false}>
          Common questions
        </CtaLink>
      </PageHero>

      {/* Service times + location */}
      <section aria-labelledby="times-heading" className="on-light section-y bg-ivory">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <SectionHeader
              kicker="When &amp; where"
              title={<span id="times-heading">Join us <em>this week.</em></span>}
            />
            <ul className="mt-10 divide-y divide-stone-200 border-y border-stone-200">
              {SERVICES.map((s) => (
                <li key={s.id} className="py-6">
                  <p className="kicker text-bronze">{s.day}</p>
                  <div className="mt-2 flex items-baseline justify-between gap-4">
                    <p className="display-sm text-ink-900">{s.name}</p>
                    <p className="font-display text-[1.75rem] text-ink-900">{s.times.join(' & ')}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-start gap-3 text-stone-600">
              <MapPin className="mt-1 size-5 shrink-0 text-bronze" aria-hidden="true" />
              <address className="not-italic leading-relaxed">
                {info.addressLines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={100}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-stone-200 bg-ivory-200 lg:aspect-auto lg:h-full lg:min-h-[28rem]">
              <iframe
                title={`Map showing the location of ${info.name}`}
                src={info.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
              <CtaLink href={info.directionsUrl} variant="text-dark" external>
                Open in Google Maps
              </CtaLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What to expect */}
      <section aria-labelledby="expect-heading" className="on-dark section-y bg-ink-900 text-white">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-6">
            <SectionHeader
              tone="dark"
              kicker="What to expect"
              title={<span id="expect-heading">Come as you are. <em>Leave encouraged.</em></span>}
              description="We are a Bible-believing, Spirit-filled church. When you join us you will find a warm welcome, and a community that gathers around four simple things."
            />
          </Reveal>
          <Reveal className="lg:col-span-6" delay={100}>
            <ol className="divide-y divide-white/10 border-y border-white/10">
              {pillars.map((p, i) => (
                <li key={p} className="flex items-baseline gap-6 py-6">
                  <span className="kicker w-8 text-gold-light">{String(i + 1).padStart(2, '0')}</span>
                  <span className="display-md">{p}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Families + parking */}
      <section className="on-light section-y bg-ivory">
        <div className="wrap grid gap-6 lg:grid-cols-2 lg:gap-8">
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-2xl bg-ink-950 text-white">
              <Photo variant={1} />
              <div aria-hidden="true" className="absolute inset-0 bg-ink-950/50" />
              <div className="on-dark relative flex min-h-[22rem] flex-col justify-end p-8 sm:p-12">
                <p className="kicker mb-4 text-gold-light">Children &amp; families</p>
                <h2 className="display-md">Bringing little ones?</h2>
                <p className="mt-4 max-w-md text-stone-200">
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
            <div className="flex h-full flex-col justify-end rounded-2xl border border-stone-200 bg-ivory-50 p-8 sm:p-12">
              <p className="kicker mb-4 text-bronze">Parking &amp; directions</p>
              <h2 className="display-md text-ink-900">Finding us.</h2>
              <p className="mt-4 max-w-md text-stone-600">
                We meet at {info.addressOneLine}. Open the address in your maps app for turn-by-turn directions.
                <NeedsConfirmation what="parking details" />
              </p>
              <div className="mt-7">
                <CtaLink href={info.directionsUrl} variant="dark" external>
                  Get directions
                </CtaLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" aria-labelledby="faq-heading" className="on-light bg-ivory pb-[clamp(4.5rem,9vw,8.5rem)]">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-4">
            <SectionHeader
              kicker="FAQ"
              title={<span id="faq-heading">Good <em>questions.</em></span>}
              description="Not finding your answer? We would love to hear from you."
            />
            <div className="mt-8 space-y-3 text-stone-600">
              {info.email && (
                <p className="flex items-center gap-3">
                  <Mail className="size-5 text-bronze" aria-hidden="true" />
                  <a href={`mailto:${info.email}`} className="underline-offset-4 hover:underline">
                    {info.email}
                  </a>
                </p>
              )}
              {info.phone && (
                <p className="flex items-center gap-3">
                  <Phone className="size-5 text-bronze" aria-hidden="true" />
                  <a href={`tel:${info.phone.replace(/\s/g, '')}`} className="underline-offset-4 hover:underline">
                    {info.phone}
                  </a>
                </p>
              )}
              <p className="flex items-center gap-3">
                <Clock className="size-5 text-bronze" aria-hidden="true" />
                <CtaLink href="/contact?topic=visitor" variant="text-dark" className="min-h-0 py-0.5">
                  Send a message
                </CtaLink>
              </p>
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
