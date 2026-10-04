import { Photo } from '@/components/public/photo';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import { ChildrenArt } from '@/components/public/children-art';
import { slotHasImage } from '@/lib/images';
import { CHILDREN_PILLARS } from '@/lib/children';
import { SUNDAY_EVENING, SUNDAY_MORNING, formatClock } from '@/lib/site-config';

type MinistryImages = { imageUrl?: string | null; bannerUrl?: string | null } | null;

/**
 * Promotes the Children's Ministry. Photos come from the Ministry record
 * (set in the admin) or from public/images/ministries/children/; until then a
 * designed blue placeholder is shown.
 *  - layout "section": homepage band
 *  - layout "banner":  wide card above the ministries grid
 */
export function ChildrenFeature({ ministry, layout = 'section' }: { ministry?: MinistryImages; layout?: 'section' | 'banner' }) {
  const image = ministry?.imageUrl ?? ministry?.bannerUrl ?? null;

  const copy = (
    <>
      <p className={layout === 'banner' ? 'kicker text-brand-300' : 'kicker text-brand-700'}>Children&rsquo;s Ministry</p>
      <h2
        id="children-heading"
        className={`display-lg mt-5 [&_em]:italic ${layout === 'banner' ? 'text-white [&_em]:text-brand-300' : 'text-brand-navy [&_em]:text-brand-700'}`}
      >
        Every child <em>belongs</em> here.
      </h2>
      <p className={`lead mt-6 max-w-xl ${layout === 'banner' ? 'text-brand-100' : 'text-body'}`}>
        Children are a treasured part of our church family. Bring yours this Sunday and let us show them how much they
        are loved.
      </p>
      <ul className="mt-7 flex flex-wrap gap-2" aria-label="What we want for every child">
        {CHILDREN_PILLARS.map((p) => (
          <li
            key={p.word}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${layout === 'banner' ? 'bg-white/10 text-white' : 'bg-white text-brand-700'}`}
          >
            {p.word.replace('.', '')}
          </li>
        ))}
      </ul>
      <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        <CtaLink href="/children" variant={layout === 'banner' ? 'white' : 'primary'}>
          Explore children&rsquo;s ministry
        </CtaLink>
        <CtaLink href="/children#ask" variant={layout === 'banner' ? 'text-light' : 'text-dark'}>
          Ask a question
        </CtaLink>
      </div>
    </>
  );

  const picture = (
    <div className="relative">
      <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] bg-brand-900">
        <Photo src={image} slot="childrenStory" variant={2} sizes="(min-width: 1024px) 45vw, 100vw" />
        {!image && !slotHasImage('childrenStory') && <ChildrenArt />}
      </div>
      <div className="absolute -bottom-5 left-5 right-5 rounded-2xl bg-white p-4 text-brand-navy shadow-[0_20px_40px_-20px_rgba(7,27,61,0.5)] sm:left-auto sm:right-6 sm:max-w-xs">
        <p className="kicker text-brand-700">Bring the whole family</p>
        <p className="mt-2 text-sm text-body">
          Sundays {formatClock(SUNDAY_MORNING.startTime)} &amp; {formatClock(SUNDAY_EVENING.startTime)}
        </p>
      </div>
    </div>
  );

  if (layout === 'banner') {
    return (
      <Reveal>
        <section
          aria-labelledby="children-heading"
          className="on-dark relative isolate mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy via-brand-900 to-brand-800 text-white"
        >
          <div aria-hidden="true" className="absolute -right-24 -top-24 size-80 rounded-full bg-brand-500/20" />
          <div className="relative grid items-center gap-10 p-6 sm:p-12 lg:grid-cols-2 lg:gap-14">
            <div className="min-w-0">{copy}</div>
            <div className="min-w-0 pb-6">{picture}</div>
          </div>
        </section>
      </Reveal>
    );
  }

  return (
    <section aria-labelledby="children-heading" className="on-light section-y relative overflow-hidden bg-brand-100">
      <div aria-hidden="true" className="absolute -left-28 -top-28 size-80 rounded-full bg-brand-500/10" />
      <div aria-hidden="true" className="absolute -bottom-32 right-0 size-96 rounded-full bg-brand-300/25" />
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <Reveal className="order-2 min-w-0 lg:col-span-6 lg:order-1">{copy}</Reveal>
        <Reveal className="order-1 min-w-0 pb-5 lg:col-span-6 lg:order-2" delay={120}>
          {picture}
        </Reveal>
      </div>
    </section>
  );
}
