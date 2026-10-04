import type { Metadata } from 'next';
import { PageHero } from '@/components/public/page-hero';
import { ImageTextSection } from '@/components/public/image-text-section';
import { SectionHeader } from '@/components/public/section-header';
import { Accordion } from '@/components/public/accordion';
import { LeadershipCard } from '@/components/public/leadership-card';
import { PlanVisitCTA } from '@/components/public/plan-visit-cta';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import { getSiteInfo } from '@/lib/site-info';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Our story, vision, mission and beliefs. El Shaddai World Ministries is a Bible-believing, Spirit-filled church committed to transforming lives.',
  alternates: { canonical: '/about' },
  openGraph: { title: 'About | El Shaddai World Ministries', url: '/about' },
};

// Existing site copy — leadership should confirm before launch (see docs/public-site-redesign.md).
const values = [
  { title: 'Biblical truth', body: 'We believe in the authority and sufficiency of Scripture for life and faith.' },
  { title: 'Loving community', body: 'We are committed to loving God and loving one another as Christ loved us.' },
  { title: 'Unity in diversity', body: 'We celebrate our diversity while maintaining unity in Christ.' },
  { title: 'Global impact', body: 'We are passionate about reaching the nations with the Gospel.' },
  { title: 'Spirit-led worship', body: 'We seek to honour God through authentic, Spirit-filled worship.' },
  { title: 'Excellence', body: 'We strive for excellence in all we do, offering our best to God.' },
];

const beliefs = [
  { id: 'bible', question: 'The Bible', answer: 'We believe the Bible is the inspired, infallible Word of God and the final authority for faith and practice.' },
  { id: 'trinity', question: 'The Trinity', answer: 'We believe in one God eternally existing in three persons: Father, Son, and Holy Spirit.' },
  { id: 'salvation', question: 'Salvation', answer: 'We believe that salvation is by grace alone, through faith alone, in Christ alone. It is a free gift of God, not earned by works.' },
  { id: 'church', question: 'The Church', answer: 'We believe the Church is the Body of Christ, called to worship God, build up believers, and reach the lost.' },
  { id: 'spirit', question: 'The Holy Spirit', answer: 'We believe in the baptism of the Holy Spirit and the operation of spiritual gifts for the edification of the Church.' },
  { id: 'return', question: 'Christ’s return', answer: 'We believe in the personal, visible return of Jesus Christ to establish His eternal kingdom.' },
];

export default async function AboutPage() {
  const info = await getSiteInfo();

  return (
    <>
      <PageHero
        slot="aboutHero"
        variant={1}
        kicker="About us"
        title={
          <>
            Who we are, <em className="text-brand-300">and what we believe.</em>
          </>
        }
        description="A Bible-believing, Spirit-filled church committed to transforming lives through the power of God’s Word."
      />

      <ImageTextSection
        kicker="Our story"
        title={
          <>
            Built on a <em>name</em> that says it all.
          </>
        }
        slot="aboutStory"
        variant={2}
        cta={
          <CtaLink href="/visit" variant="primary">
            Plan your visit
          </CtaLink>
        }
      >
        <p>
          El Shaddai World Ministries was founded with a vision to create a church where people can encounter the
          living God, grow in their faith, and discover their purpose.
        </p>
        <p>
          &ldquo;El Shaddai&rdquo; means &ldquo;God Almighty&rdquo; &mdash; God who is more than enough for every
          need, challenge and circumstance. That truth shapes everything we do.
        </p>
        <p>
          Today we are a growing family of believers from diverse backgrounds, united by our love for Jesus Christ and
          our commitment to advancing His Kingdom both locally and globally.
        </p>
      </ImageTextSection>

      {/* Vision & mission */}
      <section className="on-dark section-y bg-brand-navy text-white">
        <div className="wrap grid gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <p className="kicker mb-6 text-brand-300">Our vision</p>
            <p className="display-md">
              To be a Bible-based, Spirit-filled church that transforms lives, builds strong families, and impacts
              communities.
            </p>
            <p className="mt-6 max-w-lg text-mist">
              Through the power of God&rsquo;s Word and the demonstration of His love.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <p className="kicker mb-6 text-brand-300">Our mission</p>
            <p className="display-md">
              To glorify God by making disciples of Jesus Christ through worship, biblical teaching, fellowship and
              service.
            </p>
            <p className="mt-6 max-w-lg text-mist">
              Equipping believers to fulfil their God-given purpose.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section aria-labelledby="values-heading" className="on-light section-y bg-brand-50">
        <div className="wrap">
          <Reveal>
            <SectionHeader
              kicker="Core values"
              title={<span id="values-heading">What we <em>hold dear.</em></span>}
              description="These values guide everything we do as a church family."
            />
          </Reveal>
          <ol className="mt-16 grid gap-x-16 border-t border-brand-200 md:grid-cols-2">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={(i % 2) * 80} className="flex gap-6 border-b border-brand-200 py-9">
                <span className="kicker mt-3 w-8 shrink-0 text-brand-700">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="display-md text-brand-navy">{v.title}</h3>
                  <p className="mt-3 max-w-md text-body">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Beliefs */}
      <section aria-labelledby="beliefs-heading" className="on-light section-y bg-brand-100">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-4">
            <SectionHeader
              kicker="What we believe"
              title={<span id="beliefs-heading">Rooted in <em>Scripture.</em></span>}
              description="The foundations of our faith."
            />
          </Reveal>
          <Reveal className="lg:col-span-8" delay={100}>
            <Accordion items={beliefs.map((b) => ({ ...b, answer: <p>{b.answer}</p> }))} />
          </Reveal>
        </div>
      </section>

      {/* Leadership */}
      <section aria-labelledby="leadership-heading" className="on-dark section-y bg-brand-900 text-white">
        <div className="wrap">
          <Reveal>
            <SectionHeader tone="dark" kicker="Leadership" title={<span id="leadership-heading">Our <em>leadership.</em></span>} />
          </Reveal>
          <Reveal className="mt-14" delay={100}>
            <LeadershipCard
              name="Apostle Charles Magaiza"
              role="Preacher & author"
              initials="CM"
              slot="aboutLeader"
              needsConfirmation="title, biography and portrait"
            >
              <p>
                Messages and books from Apostle Charles Magaiza are available to watch, listen to and read.
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-2 pt-2">
                <CtaLink href="/sermons" variant="text-accent">
                  Sermons
                </CtaLink>
                <CtaLink href="/books" variant="text-accent">
                  Books
                </CtaLink>
              </div>
            </LeadershipCard>
          </Reveal>
        </div>
      </section>

      <PlanVisitCTA info={info} />
    </>
  );
}
