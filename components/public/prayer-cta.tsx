import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';

/** Calm, typographic invitation to submit a prayer request. */
export function PrayerCTA() {
  return (
    <section aria-labelledby="prayer-heading" className="on-light section-y bg-ivory-200">
      <div className="wrap-narrow text-center">
        <Reveal>
          <div aria-hidden="true" className="mx-auto mb-10 h-14 w-px bg-gradient-to-b from-transparent to-gold" />
          <p className="kicker mb-6 text-bronze">Prayer</p>
          <h2 id="prayer-heading" className="display-lg text-ink-900">
            How can we <em>pray</em> for you?
          </h2>
          <p className="lead mx-auto mt-8 max-w-xl text-stone-600">
            It would be our honour to pray with you. Share what is on your heart and our prayer team will lift it up
            &mdash; privately, and with care.
          </p>
          <div className="mt-10 flex justify-center">
            <CtaLink href="/prayer-requests" variant="dark">
              Submit a prayer request
            </CtaLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
