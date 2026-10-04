import type { Metadata } from 'next';
import { PageHero } from '@/components/public/page-hero';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import { SectionHeader } from '@/components/public/section-header';
import { NeedsConfirmation } from '@/components/public/needs-confirmation';
import { PlanVisitCTA } from '@/components/public/plan-visit-cta';
import { getSiteInfo } from '@/lib/site-info';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Give',
  description:
    'Give to El Shaddai World Ministries and help sustain our ministries, outreach and mission. Every gift makes a difference.',
  alternates: { canonical: '/give' },
  openGraph: { title: 'Give | El Shaddai World Ministries', url: '/give' },
};

const reasons = [
  { title: 'Worship', body: 'Giving is an act of worship and obedience to God.' },
  { title: 'Ministry', body: 'Your gifts support our ministries and outreach programmes.' },
  { title: 'Kingdom growth', body: 'Together we are building God’s kingdom locally and globally.' },
];

const supports = [
  { title: 'Ministry & programmes', items: ['Sunday services and worship', 'Children and youth programmes', 'Small groups and discipleship', 'Prayer and counselling ministries'] },
  { title: 'Community outreach', items: ['Food and clothing assistance', 'Community service projects', 'Evangelism and missions', 'Support for those in need'] },
  { title: 'Facilities & operations', items: ['Building maintenance and utilities', 'Audio/visual equipment', 'Office operations', 'Technology and communications'] },
  { title: 'Staff & leadership', items: ['Pastoral staff support', 'Ministry leaders', 'Administrative team', 'Leadership development'] },
];

export default async function GivePage() {
  const info = await getSiteInfo();
  const { onlineUrl, bank } = info.giving;

  return (
    <>
      <PageHero
        slot="giving"
        variant={4}
        kicker="Giving"
        title={
          <>
            Generosity <em className="text-brand-300">changes</em> lives.
          </>
        }
        description="Your generosity helps us spread the Gospel and serve our community. Give as you feel led — we are grateful for every gift."
      />

      <section className="on-light section-y bg-brand-50">
        <div className="wrap-narrow text-center">
          <Reveal>
            <p className="kicker mb-6 text-brand-700">Why we give</p>
            <p className="display-md text-brand-navy">
              &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under
              compulsion, for God loves a cheerful giver.&rdquo;
            </p>
            <p className="kicker mt-6 text-body">2 Corinthians 9:7</p>
          </Reveal>
        </div>
        <div className="wrap mt-20">
          <ul className="grid gap-10 border-t border-brand-200 pt-10 md:grid-cols-3">
            {reasons.map((r, i) => (
              <Reveal as="li" key={r.title} delay={i * 80}>
                <p className="display-sm text-brand-navy">{r.title}</p>
                <p className="mt-3 max-w-xs text-body">{r.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="ways-heading" className="on-dark section-y bg-brand-900 text-white">
        <div className="wrap">
          <Reveal>
            <SectionHeader tone="dark" kicker="Ways to give" title={<span id="ways-heading">Choose what <em>suits you.</em></span>} />
          </Reveal>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            <Reveal className="rounded-2xl border border-white/10 p-8 sm:p-10">
              <p className="kicker mb-4 text-brand-300">Online</p>
              <h3 className="display-sm">Give online</h3>
              {onlineUrl ? (
                <>
                  <p className="mt-4 text-mist">Give securely online using your card.</p>
                  <div className="mt-8">
                    <CtaLink href={onlineUrl} variant="primary" external>
                      Give online
                    </CtaLink>
                  </div>
                </>
              ) : (
                <p className="mt-4 text-mist">
                  Online giving is coming soon. In the meantime, please use another way to give or contact the church
                  office.
                  <NeedsConfirmation what="online giving link (Settings: give_online_url)" />
                </p>
              )}
            </Reveal>

            <Reveal className="rounded-2xl border border-white/10 p-8 sm:p-10" delay={80}>
              <p className="kicker mb-4 text-brand-300">Bank transfer</p>
              <h3 className="display-sm">Transfer directly</h3>
              {bank ? (
                <>
                  <dl className="mt-5 space-y-3 text-brand-100">
                    {bank.bankName && (
                      <div>
                        <dt className="text-sm text-mist">Bank</dt>
                        <dd>{bank.bankName}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm text-mist">Account name</dt>
                      <dd>{bank.accountName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-mist">Account number</dt>
                      <dd>{bank.accountNumber}</dd>
                    </div>
                    {bank.branchCode && (
                      <div>
                        <dt className="text-sm text-mist">Branch code</dt>
                        <dd>{bank.branchCode}</dd>
                      </div>
                    )}
                  </dl>
                  <p className="mt-5 text-sm text-mist">
                    Please use your name and &ldquo;Offering&rdquo; or &ldquo;Tithe&rdquo; as the reference.
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-4 text-mist">
                    Please contact the church office for our banking details.
                    <NeedsConfirmation what="bank details (Settings: bank_*)" />
                  </p>
                  <div className="mt-8">
                    <CtaLink href="/contact" variant="outline-light">
                      Contact the office
                    </CtaLink>
                  </div>
                </>
              )}
            </Reveal>

            <Reveal className="rounded-2xl border border-white/10 p-8 sm:p-10" delay={160}>
              <p className="kicker mb-4 text-brand-300">Mobile</p>
              <h3 className="display-sm">Mobile payment</h3>
              <p className="mt-4 text-mist">Contact the church office for mobile payment options.</p>
              <div className="mt-8">
                <CtaLink href="/contact" variant="outline-light">
                  Get in touch
                </CtaLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="impact-heading" className="on-light section-y bg-brand-50">
        <div className="wrap">
          <Reveal>
            <SectionHeader
              kicker="Your impact"
              title={<span id="impact-heading">What your giving <em>supports.</em></span>}
            />
          </Reveal>
          <div className="mt-14 grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {supports.map((s, i) => (
              <Reveal key={s.title} delay={i * 70}>
                <h3 className="display-sm border-b border-brand-200 pb-4 text-brand-navy">{s.title}</h3>
                <ul className="mt-5 space-y-2 text-body">
                  {s.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-20 rounded-2xl border border-brand-200 bg-white p-8 sm:p-10">
            <p className="kicker mb-3 text-brand-700">Tax information</p>
            <p className="max-w-3xl text-body">
              El Shaddai World Ministries is a registered non-profit organisation. All donations are tax-deductible to
              the extent allowed by law. Tax receipts will be issued for all qualifying donations at the end of each
              financial year.
              <NeedsConfirmation what="non-profit / tax-receipt (Section 18A) wording" />
            </p>
          </Reveal>
        </div>
      </section>

      <PlanVisitCTA info={info} />
    </>
  );
}
