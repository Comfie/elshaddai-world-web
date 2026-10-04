import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { PageHero } from '@/components/public/page-hero';
import { ContactForm } from '@/components/public/contact-form';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import { NeedsConfirmation } from '@/components/public/needs-confirmation';
import { getSiteInfo } from '@/lib/site-info';

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
            We&rsquo;d love to <em className="text-gold-light">hear from you.</em>
          </>
        }
        description="Questions, prayer, or planning a visit — send us a message and we will get back to you."
      />

      <section className="on-light section-y bg-ivory">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <p className="kicker mb-6 text-bronze">Find us</p>
            <ul className="divide-y divide-stone-200 border-y border-stone-200">
              <li className="flex gap-5 py-7">
                <MapPin className="mt-1 size-5 shrink-0 text-bronze" aria-hidden="true" />
                <div>
                  <p className="display-sm text-ink-900">Visit</p>
                  <address className="mt-2 not-italic leading-relaxed text-stone-600">
                    {info.addressLines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </address>
                  <CtaLink href={info.directionsUrl} variant="text-dark" external className="mt-2">
                    Get directions
                  </CtaLink>
                </div>
              </li>
              {info.email && (
                <li className="flex gap-5 py-7">
                  <Mail className="mt-1 size-5 shrink-0 text-bronze" aria-hidden="true" />
                  <div>
                    <p className="display-sm text-ink-900">Email</p>
                    <a href={`mailto:${info.email}`} className="mt-2 inline-flex min-h-11 items-center break-all text-stone-600 underline-offset-4 hover:underline">
                      {info.email}
                    </a>
                  </div>
                </li>
              )}
              {info.phone && (
                <li className="flex gap-5 py-7">
                  <Phone className="mt-1 size-5 shrink-0 text-bronze" aria-hidden="true" />
                  <div>
                    <p className="display-sm text-ink-900">Phone</p>
                    <a href={`tel:${info.phone.replace(/\s/g, '')}`} className="mt-2 inline-flex min-h-11 items-center text-stone-600 underline-offset-4 hover:underline">
                      {info.phone}
                    </a>
                  </div>
                </li>
              )}
              <li className="flex gap-5 py-7">
                <Clock className="mt-1 size-5 shrink-0 text-bronze" aria-hidden="true" />
                <div>
                  <p className="display-sm text-ink-900">Office hours</p>
                  <div className="mt-2 space-y-1 text-stone-600">
                    <p>Monday – Friday: 9:00 AM – 5:00 PM</p>
                    <p>Saturday: 9:00 AM – 1:00 PM</p>
                    <p>Sunday: Before and after services</p>
                  </div>
                  <NeedsConfirmation what="office hours" />
                </div>
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

      <section aria-label="Map" className="on-light bg-ivory pb-[clamp(4.5rem,9vw,8.5rem)]">
        <div className="wrap">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-stone-200 bg-ivory-200 sm:aspect-[16/7]">
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
    </>
  );
}
