import type { Metadata } from 'next';
import { PageHero } from '@/components/public/page-hero';
import { MinistryCard } from '@/components/public/ministry-card';
import { EmptyState } from '@/components/public/empty-state';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import { SectionHeader } from '@/components/public/section-header';
import { getWebsiteMinistries } from '@/lib/public-data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Ministries',
  description:
    'Find your place at El Shaddai World Ministries — ministries for women, men, young people and more.',
  alternates: { canonical: '/ministries' },
  openGraph: { title: 'Ministries | El Shaddai World Ministries', url: '/ministries' },
};

export default async function MinistriesPage() {
  const ministries = await getWebsiteMinistries();

  return (
    <>
      <PageHero
        variant={4}
        kicker="Ministries"
        title={
          <>
            There&rsquo;s a place <em className="text-gold-light">for you here.</em>
          </>
        }
        description="Find a community to grow with, serve alongside and belong to."
      />

      <section aria-labelledby="ministries-list" className="on-light section-y bg-ivory">
        <div className="wrap">
          <h2 id="ministries-list" className="sr-only">
            Our ministries
          </h2>
          {ministries.length === 0 ? (
            <EmptyState
              title="Ministries are being added."
              description="Check back soon, or get in touch and we will help you find the right place to connect."
            >
              <CtaLink href="/contact" variant="dark">
                Contact us
              </CtaLink>
            </EmptyState>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ministries.map((m, i) => (
                <Reveal key={m.id} delay={(i % 3) * 80}>
                  <MinistryCard ministry={m} variant={i} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="on-light section-y bg-ivory-200">
        <div className="wrap">
          <Reveal>
            <SectionHeader
              align="center"
              kicker="Get involved"
              title={
                <>
                  Not sure where <em>to begin?</em>
                </>
              }
              description="Tell us a little about yourself and we will help you find the right ministry."
            />
            <div className="mt-10 flex justify-center">
              <CtaLink href="/contact" variant="dark">
                Talk to us
              </CtaLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
