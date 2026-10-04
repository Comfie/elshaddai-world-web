import { Photo } from '@/components/public/photo';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import { SUNDAY_TIMES } from '@/lib/site-config';
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
      className="on-dark relative isolate overflow-hidden bg-ink-950 py-28 text-center text-white sm:py-36 lg:py-44"
    >
      <Photo slot="finalCta" variant={3} sizes="100vw" />
      <div aria-hidden="true" className="absolute inset-0 bg-ink-950/55" />
      <Reveal className="wrap relative">
        <h2 id="invite-heading" className="display-xl [&_em]:italic [&_em]:text-gold-light">
          {title}
        </h2>
        <p className="font-display mt-6 text-[clamp(1.5rem,3vw,2.25rem)] italic text-white/95">{lead}</p>
        <p className="mt-6 text-lg text-stone-200">
          <span className="kicker mr-3 text-gold-light">Sunday</span>
          {SUNDAY_TIMES}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {showVisitButton && (
            <CtaLink href="/visit" variant="gold">
              Plan your visit
            </CtaLink>
          )}
          <CtaLink href={info.directionsUrl} variant="outline-light" external>
            Get directions
          </CtaLink>
        </div>
      </Reveal>
    </section>
  );
}
