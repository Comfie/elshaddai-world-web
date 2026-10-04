import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Facebook, Mail, MapPin, Phone } from 'lucide-react';
import { PageHero } from '@/components/public/page-hero';
import { ContactForm } from '@/components/public/contact-form';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import { NeedsConfirmation } from '@/components/public/needs-confirmation';
import { WEEKLY_PROGRAM, programDays, programTimes } from '@/lib/site-config';
import { getSiteInfo } from '@/lib/site-info';
import { facebookLabel } from '@/lib/social';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with El Shaddai World Ministries — questions, prayer, visitor information and more.',
  alternates: { canonical: '/contact' },
  openGraph: { title: 'Contact | El Shaddai World Ministries', url: '/contact' },
};

export default async function ContactPage() {
  const info = await getSiteInfo();

  return (
    <>
      <PageHero
        variant={2}
        kicker="Contact"
        title={
          <>
            We&rsquo;d love to <em className="text-brand-300">hear from you.</em>
          </>
        }
        description="Questions, prayer, or planning a visit — send us a message and we will get back to you."
      />

      <section className="on-light section-y bg-brand-50">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <p className="kicker mb-6 text-brand-700">Find us</p>
            <ul className="divide-y divide-brand-200 border-y border-brand-200">
              <li className="flex gap-5 py-7">
                <MapPin className="mt-1 size-5 shrink-0 text-brand-700" aria-hidden="true" />
                <div>
                  <p className="display-sm text-brand-navy">Visit</p>
                  {info.addressLines ? (
                    <>
                      <address className="mt-2 not-italic leading-relaxed text-body">
                        {info.addressLines.map((l) => (
                          <span key={l} className="block">
                            {l}
                          </span>
                        ))}
                      </address>
                      {info.directionsUrl && (
                        <CtaLink href={info.directionsUrl} variant="text-dark" external className="mt-2">
                          Get directions
                        </CtaLink>
                      )}
                    </>
                  ) : (
                    <p className="mt-2 text-body">
                      Planning to visit? Send us a message and we will share exactly where to come.
                      <NeedsConfirmation what="church address (Settings: church_address)" />
                    </p>
                  )}
                </div>
              </li>
              {info.email && (
                <li className="flex gap-5 py-7">
                  <Mail className="mt-1 size-5 shrink-0 text-brand-700" aria-hidden="true" />
                  <div>
                    <p className="display-sm text-brand-navy">Email</p>
                    <a href={`mailto:${info.email}`} className="mt-2 inline-flex min-h-11 items-center break-all text-body underline-offset-4 hover:underline">
                      {info.email}
                    </a>
                  </div>
                </li>
              )}
              {info.phone && (
                <li className="flex gap-5 py-7">
                  <Phone className="mt-1 size-5 shrink-0 text-brand-700" aria-hidden="true" />
                  <div>
                    <p className="display-sm text-brand-navy">Phone</p>
                    <a href={`tel:${info.phone.replace(/\s/g, '')}`} className="mt-2 inline-flex min-h-11 items-center text-body underline-offset-4 hover:underline">
                      {info.phone}
                    </a>
                  </div>
                </li>
              )}
              {info.social.facebook && (
                <li className="flex gap-5 py-7">
                  <Facebook className="mt-1 size-5 shrink-0 text-brand-700" aria-hidden="true" />
                  <div>
                    <p className="display-sm text-brand-navy">Facebook</p>
                    <a
                      href={info.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={facebookLabel(info.name, 'Message or follow us on Facebook')}
                      className="mt-2 inline-flex min-h-11 items-center text-body underline-offset-4 hover:underline"
                    >
                      Message or follow us on Facebook
                    </a>
                  </div>
                </li>
              )}
              <li className="py-7">
                <p className="display-sm text-brand-navy">When we gather</p>
                <ul className="mt-4 space-y-3 text-body">
                  {WEEKLY_PROGRAM.slice()
                    .sort((a, b) => b.days.length - a.days.length || a.startTime.localeCompare(b.startTime))
                    .map((p) => (
                      <li key={p.id}>
                        <span className="text-brand-navy">{p.name}</span>
                        <span className="block text-sm">
                          {programDays(p, true)} &middot; {programTimes(p)}
                          {p.access && <> &middot; {p.access.chip}</>}
                        </span>
                      </li>
                    ))}
                </ul>
              </li>
            </ul>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={100}>
            <Suspense fallback={null}>
              <ContactForm />
            </Suspense>
          </Reveal>
        </div>
      </section>

      {info.mapEmbedUrl && (
        <section aria-label="Map" className="on-light bg-brand-50 pb-[clamp(4.5rem,9vw,8.5rem)]">
          <div className="wrap">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-brand-200 bg-brand-100 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-700 sm:aspect-[16/7]">
              <iframe
                title={`Map showing the location of ${info.name}`}
                src={info.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
