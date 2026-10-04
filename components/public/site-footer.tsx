import Link from 'next/link';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { Logo } from '@/components/public/logo';
import { CtaLink } from '@/components/public/cta';
import { SERVICES, SITE_DESCRIPTION } from '@/lib/site-config';
import type { SiteInfo } from '@/lib/site-info';

const explore = [
  { name: 'About', href: '/about' },
  { name: 'Ministries', href: '/ministries' },
  { name: 'Sermons', href: '/sermons' },
  { name: 'Events', href: '/events' },
  { name: 'Books', href: '/books' },
];

const connect = [
  { name: 'Prayer Requests', href: '/prayer-requests' },
  { name: 'Join Us', href: '/join' },
  { name: 'Contact', href: '/contact' },
];

const colHeading = 'kicker mb-6 text-gold-light';
const footLink =
  'inline-flex min-h-11 items-center text-[0.95rem] text-stone-400 transition-colors hover:text-white';

export function SiteFooter({ info }: { info: SiteInfo }) {
  const socials = [
    { name: 'Facebook', href: info.social.facebook, Icon: Facebook },
    { name: 'Instagram', href: info.social.instagram, Icon: Instagram },
    { name: 'YouTube', href: info.social.youtube, Icon: Youtube },
  ].filter((s): s is { name: string; href: string; Icon: typeof Facebook } => !!s.href);

  return (
    <footer className="on-dark bg-ink-950 text-white">
      <div className="wrap pb-10 pt-20 sm:pt-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="El Shaddai World Ministries — home" className="inline-flex min-h-11 items-center">
              <Logo tone="light" />
            </Link>
            <p className="mt-7 max-w-sm text-[0.95rem] leading-relaxed text-stone-400">{SITE_DESCRIPTION}</p>
            {socials.length > 0 && (
              <ul className="mt-7 flex gap-2" aria-label="Social media">
                {socials.map(({ name, href, Icon }) => (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${info.name} on ${name}`}
                      className="grid size-11 place-items-center rounded-full border border-white/15 text-stone-400 transition-colors hover:border-gold hover:text-gold-light"
                    >
                      <Icon className="size-[1.1rem]" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            <div>
              <h2 className={colHeading}>Visit</h2>
              <ul className="space-y-4 text-[0.95rem] text-stone-400">
                {SERVICES.map((s) => (
                  <li key={s.id}>
                    <span className="block text-white">{s.name}</span>
                    {s.times.join(' & ')}
                  </li>
                ))}
                <li>
                  <address className="not-italic leading-relaxed">
                    {info.addressLines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </address>
                  <a
                    href={info.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex min-h-11 items-center text-gold-light underline-offset-4 hover:underline"
                  >
                    Get directions
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className={colHeading}>Explore</h2>
              <ul>
                {explore.map((i) => (
                  <li key={i.href}>
                    <Link href={i.href} className={footLink}>
                      {i.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className={colHeading}>Connect</h2>
              <ul>
                {connect.map((i) => (
                  <li key={i.href}>
                    <Link href={i.href} className={footLink}>
                      {i.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="mt-4 space-y-1 text-[0.95rem] text-stone-400">
                {info.email && (
                  <li>
                    <a href={`mailto:${info.email}`} className={footLink}>
                      {info.email}
                    </a>
                  </li>
                )}
                {info.phone && (
                  <li>
                    <a href={`tel:${info.phone.replace(/\s/g, '')}`} className={footLink}>
                      {info.phone}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h2 className={colHeading}>Give</h2>
              <p className="mb-6 text-[0.95rem] leading-relaxed text-stone-400">
                Your generosity helps sustain our ministries and mission.
              </p>
              <CtaLink href="/give" variant="outline-light" className="min-h-11 px-6 py-2">
                Give
              </CtaLink>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {info.name}. All rights reserved.
          </p>
          <p>Transforming lives through God&rsquo;s love.</p>
        </div>
      </div>
    </footer>
  );
}
