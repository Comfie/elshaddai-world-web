import { Photo } from '@/components/public/photo';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import { SUNDAY_EVENING, SUNDAY_MORNING, programTimes } from '@/lib/site-config';
import type { SiteInfo } from '@/lib/site-info';

/** Large closing invitation used on the homepage and key inner pages. */
export function PlanVisitCTA({
  info,
  title = (
    <>
      You&rsquo;re <em>invited.</em>
    </>
  ),
  lead = 'Come worship with us this Sunday.',
  showVisitButton = true,
}: {
  info: SiteInfo;
  title?: React.ReactNode;
  lead?: string;
  showVisitButton?: boolean;
}) {
  return (
    <section
      aria-labelledby="invite-heading"
      className="on-dark relative isolate overflow-hidden bg-brand-navy py-28 text-center text-white sm:py-36 lg:py-44"
    >
      <Photo slot="finalCta" variant={1} sizes="100vw" />
      <div aria-hidden="true" className="absolute inset-0 bg-brand-navy/50" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-brand-700/30" />
      <Reveal className="wrap relative">
        <h2 id="invite-heading" className="display-xl [&_em]:italic [&_em]:text-brand-300">
          {title}
        </h2>
        <p className="font-display mt-6 text-[clamp(1.5rem,3vw,2.25rem)] italic text-white/95">{lead}</p>

        <dl className="mx-auto mt-8 grid max-w-xl gap-4 text-left sm:grid-cols-2 sm:text-center">
          {[SUNDAY_MORNING, SUNDAY_EVENING].map((s) => (
            <div key={s.id} className="border-l-2 border-brand-500 pl-4 sm:border-l-0 sm:border-t-2 sm:pl-0 sm:pt-4">
              <dt className="kicker text-brand-300">{s.shortName}</dt>
              <dd className="mt-2 whitespace-nowrap text-lg">{programTimes(s)}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {showVisitButton && (
            <CtaLink href="/visit" variant="primary">
              Plan your visit
            </CtaLink>
          )}
          {info.directionsUrl ? (
            <CtaLink href={info.directionsUrl} variant="outline-light" external>
              Get directions
            </CtaLink>
          ) : (
            <CtaLink href="/contact?topic=visitor" variant="outline-light">
              Ask us anything
            </CtaLink>
          )}
        </div>
      </Reveal>
    </section>
  );
}
