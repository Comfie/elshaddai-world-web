import type { Metadata } from 'next';
import { SiteHeader } from '@/components/public/site-header';
import { SiteFooter } from '@/components/public/site-footer';
import { displayFont } from '@/lib/fonts';
import { getSiteInfo } from '@/lib/site-info';
import { SITE_NAME, SITE_DESCRIPTION, SITE_TAGLINE } from '@/lib/site-config';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: { default: `${SITE_NAME} — ${SITE_TAGLINE}`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
};

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const info = await getSiteInfo();

  return (
    <div className={cn(displayFont.variable, 'public-site flex min-h-screen flex-col overflow-x-clip')}>
      <a
        href="#main"
        className="sr-only z-[80] rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter info={info} />
    </div>
  );
}
