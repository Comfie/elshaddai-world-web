import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/public/page-hero';
import { CtaLink } from '@/components/public/cta';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

const links = [
  { name: 'Plan your visit', href: '/visit', note: 'Sunday times and how to find us' },
  { name: 'Sermons', href: '/sermons', note: 'Watch and listen to recent messages' },
  { name: 'Children’s Ministry', href: '/children', note: 'Every child belongs here' },
  { name: 'Events', href: '/events', note: 'What is happening at El Shaddai' },
  { name: 'Contact us', href: '/contact', note: 'We would love to hear from you' },
];

/**
 * Branded 404 for the public site. Without a dark hero the fixed, transparent
 * header's white text would sit on the pale page and disappear — so this page
 * supplies one.
 */
export default function PublicNotFound() {
  return (
    <>
      <PageHero
        variant={0}
        kicker="404"
        title={
          <>
            We can&rsquo;t find <em className="text-brand-300">that page.</em>
          </>
        }
        description="It may have moved or no longer exists. Here are some good places to start."
      >
        <CtaLink href="/" variant="primary">
          Back to home
        </CtaLink>
      </PageHero>
      <section className="on-light section-y bg-brand-50">
        <div className="wrap">
          <ul className="divide-y divide-brand-200 border-y border-brand-200">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="group flex min-h-16 items-center justify-between gap-6 py-5">
                  <span>
                    <span className="display-sm block text-brand-navy transition-colors group-hover:text-brand-700">{l.name}</span>
                    <span className="mt-1 block text-body">{l.note}</span>
                  </span>
                  <ArrowRight className="size-5 shrink-0 text-brand-700 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
