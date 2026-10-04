import { Facebook } from 'lucide-react';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import type { SiteInfo } from '@/lib/site-info';
import { facebookLabel } from '@/lib/social';

/** Social connection — Facebook only (the one verified destination). */
export function StayConnected({ info }: { info: SiteInfo }) {
  const url = info.social.facebook;
  if (!url) return null;
  return (
    <section aria-labelledby="connect-heading" className="on-light bg-white py-14 sm:py-20">
      <div className="wrap">
        <Reveal>
          <div className="on-dark relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-brand-900 to-brand-700 p-8 text-white sm:p-14">
            <div
              aria-hidden="true"
              className="photo-placeholder absolute inset-0 -z-10 opacity-40 mix-blend-soft-light"
              data-tone="royal"
              style={{ ['--px' as string]: '88%', ['--py' as string]: '10%' }}
            />
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="kicker text-brand-100">Stay connected</p>
                <h2 id="connect-heading" className="display-md mt-5">
                  Follow El Shaddai World Ministries
                </h2>
                <p className="lead mt-5 text-brand-100">
                  Messages, ministry moments, announcements and updates &mdash; all in one place.
                </p>
              </div>
              <div className="shrink-0">
                <CtaLink
                  href={url}
                  variant="white"
                  aria-label={facebookLabel(info.name, 'Facebook')}
                >
                  <Facebook className="size-4" aria-hidden="true" /> Facebook
                </CtaLink>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
