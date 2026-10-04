import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Calendar, Facebook, Mail, MapPin, Phone, User } from 'lucide-react';
import { PageHero } from '@/components/public/page-hero';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import { SectionHeader } from '@/components/public/section-header';
import { Accordion } from '@/components/public/accordion';
import { ImageTextSection } from '@/components/public/image-text-section';
import { EventCard } from '@/components/public/event-card';
import { ContactForm } from '@/components/public/contact-form';
import { NeedsConfirmation } from '@/components/public/needs-confirmation';
import { PlanVisitCTA } from '@/components/public/plan-visit-cta';
import { ChildrenArt } from '@/components/public/children-art';
import { Photo } from '@/components/public/photo';
import { getSiteInfo } from '@/lib/site-info';
import { getChildrenMinistry, CHILDREN_FAQS, CHILDREN_PILLARS, CHILDREN_SCRIPTURE } from '@/lib/children';
import { slotHasImage, type ImageSlot } from '@/lib/images';
import { facebookLabel } from '@/lib/social';
import { SUNDAY_EVENING, SUNDAY_MORNING, programTimes } from '@/lib/site-config';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Children’s Ministry',
  description:
    'Every child belongs at El Shaddai World Ministries. Bring your family this Sunday — see what we want for every child, ask us anything, or find out how to serve.',
  alternates: { canonical: '/children' },
  openGraph: { title: 'Children’s Ministry | El Shaddai World Ministries', url: '/children' },
};

const MOMENTS: ImageSlot[] = ['childrenMoment1', 'childrenMoment2', 'childrenMoment3'];

export default async function ChildrenPage() {
  const [ministry, info] = await Promise.all([getChildrenMinistry(), getSiteInfo()]);

  const heroImage = ministry?.bannerUrl ?? ministry?.imageUrl ?? null;
  const storyImage = ministry?.imageUrl ?? ministry?.bannerUrl ?? null;
  const leaderName = ministry?.leaderName || ministry?.leader?.name;
  const meets = [ministry?.meetingDay, ministry?.meetingTime].filter(Boolean).join(' · ');
  const hasMeeting = !!(meets || ministry?.meetingLocation || ministry?.meetingSchedule);
  const hasContact = !!(ministry?.contactEmail || ministry?.contactPhone || leaderName);
  const moments = MOMENTS.filter(slotHasImage);

  const faqItems = [
    ...CHILDREN_FAQS.slice(0, 1),
    ...(hasMeeting
      ? [
          {
            id: 'when',
            question: 'When and where does the children’s ministry meet?',
            answer: [meets, ministry?.meetingLocation, ministry?.meetingSchedule].filter(Boolean).join(' — '),
          },
        ]
      : []),
    ...CHILDREN_FAQS.slice(1),
  ].map((f) => ({
    id: f.id,
    question: f.question,
    answer:
      f.answer !== null ? (
        <p>{f.answer}</p>
      ) : (
        <p>
          We would love to talk this through with you. Please{' '}
          <Link href="#ask" className="text-brand-700 underline underline-offset-4">
            send us a message
          </Link>{' '}
          and we will gladly help.
          <NeedsConfirmation what={f.question} />
        </p>
      ),
  }));

  return (
    <>
      <PageHero
        slot="childrenHero"
        imageSrc={heroImage}
        variant={2}
        size="tall"
        kicker="Children’s Ministry"
        title={
          <>
            Every child <em className="text-brand-300">belongs</em> here.
          </>
        }
        description={
          ministry?.description ||
          'At El Shaddai, children are not an afterthought. They are a treasured part of our church family — and we want every one of them to know how loved they are by God.'
        }
      >
        <CtaLink href="/visit" variant="primary">
          Plan your visit
        </CtaLink>
        <CtaLink href="#ask" variant="outline-light" arrow={false}>
          Ask us a question
        </CtaLink>
      </PageHero>

      {/* Scripture */}
      <section aria-label="Scripture" className="on-dark section-y bg-brand-navy text-white">
        <div className="wrap-narrow text-center">
          <Reveal>
            <div aria-hidden="true" className="mx-auto mb-8 h-1 w-12 rounded-full bg-brand-500" />
            <blockquote>
              <p className="display-md">&ldquo;{CHILDREN_SCRIPTURE.quote}&rdquo;</p>
              <footer className="kicker mt-8 text-brand-300">{CHILDREN_SCRIPTURE.reference}</footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Our heart */}
      <section aria-labelledby="heart-heading" className="on-light section-y relative overflow-hidden bg-brand-50">
        <div aria-hidden="true" className="absolute -right-32 top-10 size-96 rounded-full bg-brand-300/20" />
        <div className="wrap relative">
          <Reveal>
            <SectionHeader
              kicker="Our heart for children"
              title={
                <span id="heart-heading">
                  Children are not the church of tomorrow. <em>They are the church today.</em>
                </span>
              }
              description={
                ministry?.vision ||
                'We believe the youngest members of our family matter deeply to God — and so they matter deeply to us. Every child who walks through our doors should feel welcomed, known and celebrated.'
              }
            />
          </Reveal>

          <ul className="mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2">
            {CHILDREN_PILLARS.map((p, i) => (
              <Reveal as="li" key={p.word} delay={(i % 2) * 90} className="border-t border-brand-200 pt-8">
                <p className="display-lg text-brand-700">{p.word}</p>
                <p className="mt-4 max-w-sm text-body">{p.body}</p>
              </Reveal>
            ))}
          </ul>
          {ministry?.mission && (
            <Reveal className="mt-14 max-w-2xl rounded-3xl bg-brand-100 p-8 sm:p-10">
              <p className="kicker mb-3 text-brand-700">Our mission</p>
              <p className="display-sm text-brand-navy sm:text-[1.6rem] sm:leading-snug">{ministry.mission}</p>
            </Reveal>
          )}
          <NeedsConfirmation what="children's ministry wording (confirm with the ministry leader)" />
        </div>
      </section>

      {/* Come as a family */}
      <ImageTextSection
        kicker="Come as a family"
        title={
          <>
            Bring the <em>whole family.</em>
          </>
        }
        slot="childrenStory"
        imageSrc={storyImage}
        art={!storyImage && !slotHasImage('childrenStory') ? <ChildrenArt /> : undefined}
        variant={1}
        tone="sand"
        cta={
          <div className="flex flex-col gap-3 sm:flex-row">
            <CtaLink href="/visit" variant="primary">
              Plan your visit
            </CtaLink>
            {info.directionsUrl && (
              <CtaLink href={info.directionsUrl} variant="outline-dark" external>
                Get directions
              </CtaLink>
            )}
          </div>
        }
      >
        <p>Families are warmly welcome at both of our Sunday services. Come as you are, and bring the children.</p>
        <dl className="grid gap-4 pt-2 sm:grid-cols-2">
          {[SUNDAY_MORNING, SUNDAY_EVENING].map((s) => (
            <div key={s.id} className="border-l-2 border-brand-600 pl-4">
              <dt className="kicker text-brand-700">{s.shortName}</dt>
              <dd className="font-display mt-2 whitespace-nowrap text-[1.5rem] leading-none text-brand-navy">{programTimes(s)}</dd>
            </div>
          ))}
        </dl>
        {info.addressLines && (
          <p className="flex items-start gap-3 text-base">
            <MapPin className="mt-1 size-5 shrink-0 text-brand-700" aria-hidden="true" />
            <span>{info.addressLines.join(', ')}</span>
          </p>
        )}
        {hasMeeting && (
          <p className="flex items-start gap-3 text-base">
            <Calendar className="mt-1 size-5 shrink-0 text-brand-700" aria-hidden="true" />
            <span>
              Children&rsquo;s ministry: {[meets, ministry?.meetingLocation].filter(Boolean).join(' · ')}
            </span>
          </p>
        )}
      </ImageTextSection>

      {/* Moments gallery — appears automatically once photos are added */}
      {moments.length > 0 && (
        <section aria-label="Moments from children's ministry" className="on-light bg-brand-50 pt-[clamp(4.5rem,9vw,8.5rem)]">
          <div className="wrap grid gap-4 sm:grid-cols-3">
            {moments.map((slot, i) => (
              <Reveal key={slot} delay={i * 80}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-brand-900">
                  <Photo slot={slot} sizes="(min-width: 640px) 30vw, 100vw" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Parents */}
      <section aria-labelledby="parents-heading" className="on-light section-y bg-white">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-4">
            <SectionHeader
              kicker="For parents"
              title={
                <span id="parents-heading">
                  Ask us <em>anything.</em>
                </span>
              }
              description="Choosing a church is a family decision. There are no silly questions — we would love to help."
            />
            {hasContact && (
              <ul className="mt-8 space-y-1 text-body">
                {leaderName && (
                  <li className="flex items-center gap-3 py-2">
                    <User className="size-5 text-brand-700" aria-hidden="true" /> Led by {leaderName}
                  </li>
                )}
                {ministry?.contactEmail && (
                  <li className="flex items-center gap-3">
                    <Mail className="size-5 text-brand-700" aria-hidden="true" />
                    <a href={`mailto:${ministry.contactEmail}`} className="inline-flex min-h-11 items-center break-all underline-offset-4 hover:underline">
                      {ministry.contactEmail}
                    </a>
                  </li>
                )}
                {ministry?.contactPhone && (
                  <li className="flex items-center gap-3">
                    <Phone className="size-5 text-brand-700" aria-hidden="true" />
                    <a href={`tel:${ministry.contactPhone.replace(/\s/g, '')}`} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                      {ministry.contactPhone}
                    </a>
                  </li>
                )}
              </ul>
            )}
            {info.social.facebook && (
              <p className="mt-4 flex items-center gap-3 text-body">
                <Facebook className="size-5 text-brand-700" aria-hidden="true" />
                <a
                  href={info.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={facebookLabel(info.name, 'Message us on Facebook')}
                  className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
                >
                  Message us on Facebook
                </a>
              </p>
            )}
          </Reveal>
          <Reveal className="lg:col-span-8" delay={100}>
            <Accordion items={faqItems} />
          </Reveal>
        </div>
      </section>

      {/* Upcoming events */}
      {ministry && ministry.events.length > 0 && (
        <section aria-labelledby="kids-events" className="on-light section-y bg-brand-50">
          <div className="wrap">
            <h2 id="kids-events" className="display-md mb-12 text-brand-navy">
              Coming up for children
            </h2>
            <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {ministry.events.map((e, i) => (
                <Reveal key={e.id} delay={i * 70}>
                  <EventCard event={{ ...e, ministry: { name: ministry.name } }} variant={i} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Serve */}
      <section aria-labelledby="serve-heading" className="on-dark section-y relative isolate overflow-hidden bg-gradient-to-br from-brand-navy via-brand-900 to-brand-800 text-white">
        <div aria-hidden="true" className="absolute -right-24 top-0 size-96 rounded-full bg-brand-500/15" />
        <div className="wrap relative grid items-center gap-10 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-7">
            <p className="kicker mb-5 text-brand-300">Serve with us</p>
            <h2 id="serve-heading" className="display-lg [&_em]:italic">
              Called to serve <em className="text-brand-300">children?</em>
            </h2>
            <p className="lead mt-6 max-w-xl text-brand-100">
              Children are best served by people who love them. If you feel drawn to invest in the next generation, we
              would love to hear from you.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:justify-self-end" delay={100}>
            <CtaLink
              href={`/contact?topic=children&subject=${encodeURIComponent('I’d like to serve in Children’s Ministry')}`}
              variant="white"
            >
              I&rsquo;d like to serve
            </CtaLink>
          </Reveal>
        </div>
      </section>

      {/* Ask form */}
      <section id="ask" aria-labelledby="ask-heading" className="on-light section-y bg-brand-100">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <SectionHeader
              kicker="Say hello"
              title={
                <span id="ask-heading">
                  Tell us about <em>your family.</em>
                </span>
              }
              description="Share a little about your children and what you would like to know. We will get back to you personally."
            />
          </Reveal>
          <Reveal className="lg:col-span-7" delay={100}>
            <Suspense fallback={null}>
              <ContactForm
                defaults={{ category: 'VISITOR_INFO', subject: 'Children’s Ministry enquiry' }}
                heading="Ask about children’s ministry"
                intro="Your message goes straight to our team."
              />
            </Suspense>
          </Reveal>
        </div>
      </section>

      <PlanVisitCTA
        info={info}
        title={
          <>
            Bring the children. <em>We would love to meet them.</em>
          </>
        }
        lead="Come as a family this Sunday."
      />
    </>
  );
}
