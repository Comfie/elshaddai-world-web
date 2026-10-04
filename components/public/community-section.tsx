import { Photo } from '@/components/public/photo';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';

const pillars = [
  { title: 'Serve', body: 'Hands and hearts put to work for the people around us.' },
  { title: 'Connect', body: 'Real friendships and families formed through shared faith.' },
  { title: 'Reach', body: 'Carrying hope into our community and to the nations.' },
];

/** Full-bleed storytelling band about church life beyond Sunday. */
export function CommunitySection() {
  return (
    <section aria-labelledby="community-heading" className="on-dark relative isolate overflow-hidden bg-brand-navy text-white">
      <Photo slot="community" variant={2} sizes="100vw" />
      <div aria-hidden="true" className="absolute inset-0 bg-brand-navy/60" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-brand-navy/80 via-brand-navy/30 to-transparent" />

      <div className="wrap relative flex min-h-[44rem] flex-col justify-end pb-16 pt-32 sm:pb-24">
        <Reveal className="max-w-4xl">
          <p className="kicker mb-6 text-brand-300">Community &amp; mission</p>
          <h2 id="community-heading" className="display-xl [&_em]:italic">
            Faith that moves <em className="text-brand-300">beyond Sunday.</em>
          </h2>
          <p className="lead mt-8 max-w-xl text-brand-100">
            Church is more than a service. It is a family that serves together, walks with one another and carries the
            love of God into the places we live and work.
          </p>
          <div className="mt-9">
            <CtaLink href="/ministries" variant="primary">
              Find your place
            </CtaLink>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <ul className="mt-16 grid gap-8 border-t border-white/20 pt-8 sm:grid-cols-3">
            {pillars.map((p) => (
              <li key={p.title}>
                <p className="display-sm text-brand-300">{p.title}</p>
                <p className="mt-2 max-w-xs text-[0.95rem] leading-relaxed text-brand-100">{p.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
