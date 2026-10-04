import { MapPin } from 'lucide-react';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import { SERVICES } from '@/lib/site-config';
import type { SiteInfo } from '@/lib/site-info';

/**
 * "Join us this Sunday" — overlaps the bottom of the hero so a first-time
 * visitor sees *when* and *where* within seconds.
 */
export function ServiceTimes({ info }: { info: SiteInfo }) {
  const [sunday, ...midweek] = SERVICES;
  return (
    <section aria-labelledby="sunday-heading" className="on-light relative z-10 -mt-24 lg:-mt-28">
      <div className="wrap">
        <Reveal>
          <div className="grid overflow-hidden rounded-2xl border border-stone-200 bg-ivory-50 shadow-[0_40px_70px_-45px_rgba(13,15,18,0.55)] lg:grid-cols-12">
            <div className="border-b border-stone-200 p-7 sm:p-10 lg:col-span-6 lg:border-b-0 lg:border-r lg:p-12">
              <p className="kicker text-bronze">Join us this Sunday</p>
              <h2 id="sunday-heading" className="display-md mt-5 text-ink-900">
                {sunday.times[0]} <span className="text-stone-500">&amp;</span> {sunday.times[1]}
              </h2>
              <p className="mt-3 text-lg text-stone-600">{sunday.name}</p>

              <p className="mt-6 flex items-start gap-3 text-stone-600">
                <MapPin className="mt-1 size-5 shrink-0 text-bronze" aria-hidden="true" />
                <span>
                  {info.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CtaLink href={info.directionsUrl} variant="dark" external>
                  Get directions
                </CtaLink>
                <CtaLink href="/visit" variant="outline-dark">
                  Plan your visit
                </CtaLink>
              </div>
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:col-span-6 lg:p-12">
              <p className="kicker mb-2 text-bronze">Also this week</p>
              <ul className="divide-y divide-stone-200">
                {midweek.map((s) => (
                  <li key={s.id} className="flex items-baseline justify-between gap-6 py-6">
                    <div>
                      <p className="display-sm text-ink-900">{s.name}</p>
                      <p className="mt-1 text-stone-600">
                        Every {s.day} &middot; {s.summary}
                      </p>
                    </div>
                    <p className="font-display shrink-0 text-[1.75rem] text-ink-900 sm:text-[2rem]">
                      {s.times[0]}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
