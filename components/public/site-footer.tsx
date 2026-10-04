import Link from 'next/link';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { Logo } from '@/components/public/logo';
import { CtaLink } from '@/components/public/cta';
import {
  MORNING_MANNA,
  MORNING_PRAYER,
  SITE_DESCRIPTION,
  SUNDAY_EVENING,
  SUNDAY_MORNING,
  programDays,
  programTimes,
} from '@/lib/site-config';
import type { SiteInfo } from '@/lib/site-info';
import { facebookLabel } from '@/lib/social';

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

const colHeading = 'kicker mb-6 text-brand-300';
const footLink =
  'inline-flex min-h-11 items-center [overflow-wrap:anywhere] text-[0.95rem] text-mist transition-colors hover:text-white';

export function SiteFooter({ info }: { info: SiteInfo }) {
  const socials = [
    { name: 'Facebook', href: info.social.facebook, Icon: Facebook },
    { name: 'Instagram', href: info.social.instagram, Icon: Instagram },
    { name: 'YouTube', href: info.social.youtube, Icon: Youtube },
  ].filter((s): s is { name: string; href: string; Icon: typeof Facebook } => !!s.href);

  return (
    <footer className="on-dark bg-brand-navy text-white">
      <div className="wrap pb-10 pt-20 sm:pt-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="El Shaddai World Ministries — home" className="inline-flex min-h-11 items-center">
              <Logo tone="light" />
            </Link>
            <p className="mt-7 max-w-sm text-[0.95rem] leading-relaxed text-mist">{SITE_DESCRIPTION}</p>
            <div className="mt-7">
              <CtaLink href="/give" variant="outline-light" className="min-h-11 px-6 py-2">
                Give
              </CtaLink>
            </div>
            {socials.length > 0 && (
              <ul className="mt-7 flex gap-2" aria-label="Social media">
                {socials.map(({ name, href, Icon }) => (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={facebookLabel(info.name)}
                      className="grid size-11 place-items-center rounded-full border border-white/15 text-mist transition-colors hover:border-brand-500 hover:text-brand-300"
                    >
                      <Icon className="size-[1.1rem]" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-[1fr_1.35fr_0.8fr_1.3fr]">
            <div>
              <h2 className={colHeading}>Service times</h2>
              <ul className="space-y-5 text-[0.95rem] text-mist">
                {[SUNDAY_MORNING, SUNDAY_EVENING].map((p) => (
                  <li key={p.id}>
                    <span className="block text-white">{p.shortName}</span>
                    {programTimes(p)}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className={colHeading}>Prayer &amp; devotion</h2>
              <ul className="space-y-5 text-[0.95rem] text-mist">
                {[MORNING_PRAYER, MORNING_MANNA].map((p) => (
                  <li key={p.id}>
                    <span className="block text-white">{p.name}</span>
                    {p.subtitle && <span className="block">{p.subtitle}</span>}
                    <span className="mt-1 block">{programDays(p, true)}</span>
                    <span className="block whitespace-nowrap">{programTimes(p)}</span>
                  </li>
                ))}
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
                {info.social.facebook && (
                  <li>
                    <a
                      href={info.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={facebookLabel(info.name, 'Facebook')}
                      className={footLink}
                    >
                      Facebook
                    </a>
                  </li>
                )}
              </ul>
              <ul className="mt-3 space-y-1 text-[0.95rem] text-mist">
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
                {info.addressLines && (
                  <li className="pt-2">
                    <address className="not-italic leading-relaxed">
                      {info.addressLines.map((l) => (
                        <span key={l} className="block">
                          {l}
                        </span>
                      ))}
                    </address>
                    {info.directionsUrl && (
                      <a
                        href={info.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center text-brand-300 underline-offset-4 hover:underline"
                      >
                        Get directions
                      </a>
                    )}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {info.name}. All rights reserved.
          </p>
          <p>Transforming lives through God&rsquo;s love.</p>
        </div>
      </div>
    </footer>
  );
}
