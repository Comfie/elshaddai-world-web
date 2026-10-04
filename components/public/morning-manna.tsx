import { Photo } from '@/components/public/photo';
import { CtaLink } from '@/components/public/cta';
import { ProgrammePoster } from '@/components/public/programme-poster';
import { Reveal } from '@/components/public/reveal';
import { TodayBadge } from '@/components/public/today-badge';
import { MORNING_MANNA, programDays, programTimes } from '@/lib/site-config';
import type { SiteInfo } from '@/lib/site-info';
import { facebookLabel } from '@/lib/social';

/**
 * Morning Manna feature — a branded recurring programme, so it gets a full
 * section rather than a timetable row. Copy states only confirmed facts: the
 * name, host, days and time. No livestream or venue is implied.
 */
export function MorningManna({ info }: { info: SiteInfo }) {
  return (
    <section
      id="morning-manna"
      aria-labelledby="manna-heading"
      className="on-dark section-y relative isolate overflow-hidden bg-brand-900 text-white"
    >
      <Photo slot="morningManna" variant={1} sizes="100vw" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-900/95 to-brand-800/90" />

      <div className="wrap relative grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-3">
            <p className="kicker text-brand-300">
              {MORNING_MANNA.name} <span className="text-white/60">·</span> {MORNING_MANNA.subtitle}
            </p>
            <TodayBadge days={MORNING_MANNA.days} />
          </div>
          <h2 id="manna-heading" className="display-lg mt-6">
            Start your morning <em className="text-brand-300">with the Word.</em>
          </h2>
          <p className="lead mt-7 max-w-xl text-brand-100">
            Begin your weekday with Morning Manna &mdash; a focused time in God&rsquo;s Word with Apostle Juliana.
          </p>

          <dl className="mt-9 inline-flex flex-col gap-1 border-l-2 border-brand-500 pl-5">
            <dt className="sr-only">When</dt>
            <dd className="kicker text-brand-100">{programDays(MORNING_MANNA)}</dd>
            <dd className="font-display whitespace-nowrap text-[clamp(1.75rem,6vw,2.75rem)] leading-tight">
              {programTimes(MORNING_MANNA)}
            </dd>
          </dl>

          {info.social.facebook && (
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <CtaLink
                href={info.social.facebook}
                variant="primary"
                aria-label={facebookLabel(info.name, 'Follow on Facebook')}
              >
                Follow on Facebook
              </CtaLink>
            </div>
          )}
        </Reveal>

        <Reveal className="lg:col-span-5" delay={120}>
          <ProgrammePoster program={MORNING_MANNA} slot="apostleJuliana" variant={1} className="mx-auto max-w-md lg:max-w-none" />
        </Reveal>
      </div>
    </section>
  );
}
