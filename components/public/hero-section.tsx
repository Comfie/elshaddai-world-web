import { Photo } from '@/components/public/photo';
import { CtaLink } from '@/components/public/cta';
import { SITE_DESCRIPTION } from '@/lib/site-config';

/** Homepage hero — cinematic, image-led, ~90% of the viewport on large screens. */
export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="on-dark relative isolate flex min-h-[84svh] items-end overflow-hidden bg-ink-950 text-white lg:min-h-[82vh]"
    >
      <Photo slot="homeHero" priority variant={0} className="slow-zoom" sizes="100vw" />
      <div aria-hidden="true" className="absolute inset-0 bg-ink-950/35" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/20"
      />

      <div className="wrap relative pb-36 pt-44 sm:pb-40 lg:pb-44">
        <p className="kicker rise-in mb-7 text-gold-light">Welcome to</p>
        <h1 id="hero-heading" className="display-xl rise-in max-w-5xl" style={{ ['--rise-delay' as string]: '90ms' }}>
          El Shaddai <em className="text-gold-light">World&nbsp;Ministries</em>
        </h1>
        <p
          className="font-display rise-in mt-6 text-[clamp(1.5rem,3vw,2.25rem)] italic leading-tight text-white/95"
          style={{ ['--rise-delay' as string]: '200ms' }}
        >
          Transforming lives through God&rsquo;s love.
        </p>
        <p
          className="lead rise-in mt-6 max-w-xl text-stone-200"
          style={{ ['--rise-delay' as string]: '300ms' }}
        >
          A Bible-believing, Spirit-filled community where people encounter God, grow in faith and discover their
          purpose.
        </p>
        <div
          className="rise-in mt-10 flex flex-col gap-4 sm:flex-row"
          style={{ ['--rise-delay' as string]: '400ms' }}
        >
          <CtaLink href="/visit" variant="gold">
            Plan your visit
          </CtaLink>
          <CtaLink href="/sermons" variant="outline-light" arrow={false}>
            Watch a sermon
          </CtaLink>
        </div>
      </div>
      <span className="sr-only">{SITE_DESCRIPTION}</span>
    </section>
  );
}
