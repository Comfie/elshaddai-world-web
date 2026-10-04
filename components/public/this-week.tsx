import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CtaLink } from '@/components/public/cta';
import { ProgrammeSurface } from '@/components/public/programme-surface';
import { Reveal } from '@/components/public/reveal';
import { TodayBadge } from '@/components/public/today-badge';
import {
  MORNING_MANNA,
  MORNING_PRAYER,
  SUNDAY_EVENING,
  SUNDAY_MORNING,
  programDays,
  programTimes,
  type ProgramItem,
} from '@/lib/site-config';
import type { SiteInfo } from '@/lib/site-info';
import { facebookLabel } from '@/lib/social';

/** Time styling shared by the three blocks: serif, never wraps mid-range. */
const timeClass = 'font-display whitespace-nowrap text-[clamp(1.6rem,6.4vw,2.5rem)] leading-none';

/**
 * "This week at El Shaddai" — overlaps the hero. Hierarchy, not equal cards:
 * the two Sunday gatherings lead; Morning Prayer and Morning Manna support.
 * Everything is rendered from WEEKLY_PROGRAM.
 */
export function ThisWeek({ info }: { info: SiteInfo }) {
  return (
    <section aria-labelledby="week-heading" className="on-light relative z-10 -mt-24 lg:-mt-28">
      <div className="wrap">
        <Reveal>
          <div className="rounded-2xl border border-brand-200 bg-white p-3 shadow-[0_40px_70px_-45px_rgba(7,27,61,0.6)] sm:p-5">
            <div className="px-3 pb-5 pt-4 sm:px-4">
              <p className="kicker text-brand-700">Weekly programme</p>
              <h2 id="week-heading" className="display-md mt-3 text-brand-navy">
                This week at <em className="text-brand-700">El Shaddai</em>
              </h2>
            </div>

            <div className="grid gap-3 lg:grid-cols-12 lg:gap-4">
              {/* Sunday — the featured block */}
              <ProgrammeSurface
                slot="sundayService"
                variant={1}
                watermark="Sunday"
                overlay="bg-gradient-to-br from-brand-navy/85 via-brand-900/75 to-brand-700/75"
                className="lg:col-span-7"
              >
                <div className="flex h-full flex-col p-7 sm:p-10">
                  <div className="flex items-center justify-between gap-4">
                    <p className="kicker text-brand-100">Sunday</p>
                    <TodayBadge days={SUNDAY_MORNING.days} />
                  </div>
                  <h3 className="display-md mt-5">Worship with us</h3>

                  <ul className="mt-8 divide-y divide-white/20 border-y border-white/20">
                    {[SUNDAY_MORNING, SUNDAY_EVENING].map((s) => (
                      <li key={s.id} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                        <p className="text-lg text-brand-100">{s.shortName.replace('Sunday ', '')} Service</p>
                        <p className={timeClass}>{programTimes(s)}</p>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <CtaLink href="/visit" variant="white">
                      Plan your visit
                    </CtaLink>
                  </div>
                </div>
              </ProgrammeSurface>

              {/* Supporting programme */}
              <div className="grid gap-3 lg:col-span-5 lg:gap-4">
                <SupportingBlock
                  program={MORNING_PRAYER}
                  slot="morningPrayer"
                  variant={0}
                  link={<TextLink href="/prayer-requests">Submit a prayer request</TextLink>}
                />
                <SupportingBlock
                  program={MORNING_MANNA}
                  slot="morningManna"
                  variant={2}
                  link={
                    info.social.facebook ? (
                      <CtaLink href={info.social.facebook} variant="text-light" aria-label={facebookLabel(info.name, 'Follow on Facebook')}>
                        Follow on Facebook
                      </CtaLink>
                    ) : (
                      <TextLink href="#morning-manna">About Morning Manna</TextLink>
                    )
                  }
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SupportingBlock({
  program,
  slot,
  variant,
  link,
}: {
  program: ProgramItem;
  slot: 'morningPrayer' | 'morningManna';
  variant: number;
  link: React.ReactNode;
}) {
  return (
    <ProgrammeSurface
      slot={slot}
      variant={variant}
      watermark={program.shortName.split(' ')[1]}
      overlay="bg-gradient-to-br from-brand-navy/90 to-brand-900/85"
    >
      <div className="flex h-full flex-col p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <p className="kicker text-brand-100">{programDays(program)}</p>
          <TodayBadge days={program.days} />
        </div>
        <h3 className="display-sm mt-4 uppercase tracking-wide">{program.name}</h3>
        {program.subtitle && <p className="mt-1 text-brand-100">{program.subtitle}</p>}
        <p className={`${timeClass} mt-5`}>{programTimes(program)}</p>
        <p className="kicker mt-5 text-brand-300">{program.tagline}</p>
        <div className="mt-4">{link}</div>
      </div>
    </ProgrammeSurface>
  );
}

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group/t inline-flex min-h-11 items-center gap-2 border-b border-white/40 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-white"
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 group-hover/t:translate-x-1" aria-hidden="true" />
    </Link>
  );
}
