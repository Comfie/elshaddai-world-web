import { CtaLink } from '@/components/public/cta';
import { ProgrammePoster } from '@/components/public/programme-poster';
import { Reveal } from '@/components/public/reveal';
import { TodayBadge } from '@/components/public/today-badge';
import { MORNING_PRAYER, programDays, programTimes } from '@/lib/site-config';

/**
 * Morning Prayer — communicates spiritual discipline and community and leads
 * straight into the existing prayer-request form. No venue or livestream is
 * implied (neither has been confirmed).
 */
export function PrayerCTA() {
  return (
    <section aria-labelledby="prayer-heading" className="on-light section-y bg-brand-100">
      <div className="wrap grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-6 lg:order-2" delay={100}>
          <ProgrammePoster program={MORNING_PRAYER} slot="morningPrayer" variant={0} className="mx-auto max-w-md lg:max-w-none" />
        </Reveal>

        <Reveal className="lg:col-span-6 lg:order-1">
          <div className="flex flex-wrap items-center gap-3">
            <p className="kicker text-brand-700">Morning Prayer</p>
            <TodayBadge days={MORNING_PRAYER.days} className="border border-brand-200" />
          </div>
          <h2 id="prayer-heading" className="display-lg mt-6 text-brand-navy">
            Before the day begins, <em className="text-brand-700">we pray.</em>
          </h2>

          <dl className="mt-8 inline-flex flex-col gap-1 border-l-2 border-brand-600 pl-5">
            <dt className="sr-only">When</dt>
            <dd className="kicker text-brand-700">{programDays(MORNING_PRAYER)}</dd>
            <dd className="font-display whitespace-nowrap text-[clamp(1.75rem,6vw,2.75rem)] leading-tight text-brand-navy">
              {programTimes(MORNING_PRAYER)}
            </dd>
          </dl>

          <p className="lead mt-8 max-w-xl text-body">
            Prayer is at the heart of life at El Shaddai. How can we pray for you? It would be our honour to pray with
            you &mdash; privately, and with care.
          </p>
          <div className="mt-9">
            <CtaLink href="/prayer-requests" variant="primary">
              Submit a prayer request
            </CtaLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
