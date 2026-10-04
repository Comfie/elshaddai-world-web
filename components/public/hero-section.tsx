import { Photo } from '@/components/public/photo';
import { CtaLink } from '@/components/public/cta';
import { SITE_DESCRIPTION, SUNDAY_MORNING, formatClock } from '@/lib/site-config';

/** Homepage hero — near-full-screen, deep navy/blue photographic treatment. */
export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="on-dark relative isolate flex min-h-[84svh] items-end overflow-hidden bg-brand-navy text-white lg:min-h-[82vh]"
    >
      <Photo slot="homeHero" priority variant={1} className="slow-zoom" sizes="100vw" />
      {/* Controlled blue overlay: navy base, a touch of royal at the top-right for brand presence. */}
      <div aria-hidden="true" className="absolute inset-0 bg-brand-navy/40" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-brand-700/25"
      />

      <div className="wrap relative pb-36 pt-44 sm:pb-40 lg:pb-44">
        <div aria-hidden="true" className="rise-in mb-7 h-1 w-14 rounded-full bg-brand-500" />
        <p className="kicker rise-in mb-6 text-brand-300" style={{ ['--rise-delay' as string]: '40ms' }}>
          Welcome to
        </p>
        <h1 id="hero-heading" className="display-xl rise-in max-w-5xl" style={{ ['--rise-delay' as string]: '90ms' }}>
          El Shaddai <em className="text-brand-300">World&nbsp;Ministries</em>
        </h1>
        <p
          className="font-display rise-in mt-6 text-[clamp(1.5rem,3vw,2.25rem)] italic leading-tight text-white/95"
          style={{ ['--rise-delay' as string]: '200ms' }}
        >
          Transforming lives through God&rsquo;s love.
        </p>
        <p className="lead rise-in mt-6 max-w-xl text-brand-100" style={{ ['--rise-delay' as string]: '300ms' }}>
          A Bible-believing, Spirit-filled community where people encounter God, grow in faith and discover their
          purpose.
        </p>
        <div className="rise-in mt-10 flex flex-col gap-4 sm:flex-row" style={{ ['--rise-delay' as string]: '400ms' }}>
          <CtaLink href="/visit" variant="primary">
            Plan your visit
          </CtaLink>
          <CtaLink href="/sermons" variant="outline-light" arrow={false}>
            Watch a message
          </CtaLink>
        </div>

        {/* Small contextual marker — the full programme lives just below. */}
        <p
          className="rise-in mt-10 inline-flex items-center gap-4 border-l-2 border-brand-500 pl-4"
          style={{ ['--rise-delay' as string]: '500ms' }}
        >
          <span className="kicker text-brand-100">Join us Sunday</span>
          <span className="font-display text-3xl leading-none">{formatClock(SUNDAY_MORNING.startTime)}</span>
        </p>
      </div>
      <span className="sr-only">{SITE_DESCRIPTION}</span>
    </section>
  );
}
