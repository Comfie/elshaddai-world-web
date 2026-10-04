'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/public/logo';
import { CtaLink } from '@/components/public/cta';
import { displayFont } from '@/lib/fonts';
import { NAV_MORE, NAV_PRIMARY, SERVICES } from '@/lib/site-config';

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // Remember the path the drawer was opened on: navigating elsewhere closes it, no effect needed.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const setMenuOpen = (open: boolean) => setMenuPath(open ? pathname : null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={cn(
        'on-dark fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300',
        solid
          ? 'bg-ink-950/90 shadow-[0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-md'
          : 'bg-gradient-to-b from-ink-950/70 via-ink-950/25 to-transparent',
      )}
    >
      <nav
        aria-label="Main"
        className={cn(
          'wrap flex items-center justify-between gap-6 transition-[height] duration-300',
          solid ? 'h-[4.25rem]' : 'h-20',
        )}
      >
        <Link href="/" aria-label="El Shaddai World Ministries — home" className="inline-flex min-h-11 items-center rounded-md">
          <Logo tone="light" />
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-1 lg:flex xl:gap-2">
          {NAV_PRIMARY.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className="relative inline-flex min-h-11 items-center px-3 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-white/85 transition-colors hover:text-white"
                >
                  <span className="link-underline pb-1">{item.name}</span>
                </Link>
              </li>
            );
          })}
          <li className="hidden xl:block">
            <Link
              href="/prayer-requests"
              aria-current={isActive(pathname, '/prayer-requests') ? 'page' : undefined}
              className="relative inline-flex min-h-11 items-center px-3 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-white/85 transition-colors hover:text-white"
            >
              <span className="link-underline pb-1">Prayer</span>
            </Link>
          </li>
          <li>
            <MoreMenu pathname={pathname} />
          </li>
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <CtaLink href="/give" variant="outline-light" arrow={false} className="min-h-11 px-6 py-2">
            Give
          </CtaLink>
          <CtaLink href="/visit" variant="gold" arrow={false} className="min-h-11 px-6 py-2">
            Plan a visit
          </CtaLink>
        </div>

        {/* Mobile drawer */}
        <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
            >
              <Menu className="size-6" aria-hidden="true" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content
              className={cn(
                displayFont.variable,
                'public-site on-dark drawer-in fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink-950 text-white',
              )}
              aria-describedby="mobile-menu-description"
            >
              <Dialog.Title className="sr-only">Site menu</Dialog.Title>
              <Dialog.Description id="mobile-menu-description" className="sr-only">
                Navigate to a page on the El Shaddai World Ministries website.
              </Dialog.Description>

              <div className="wrap flex h-20 shrink-0 items-center justify-between">
                <Link href="/" onClick={() => setMenuOpen(false)} aria-label="El Shaddai World Ministries — home" className="inline-flex min-h-11 items-center">
                  <Logo tone="light" />
                </Link>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                  >
                    <X className="size-6" aria-hidden="true" />
                  </button>
                </Dialog.Close>
              </div>

              <nav aria-label="Mobile" className="wrap flex flex-1 flex-col justify-between pb-10 pt-6">
                <ul className="space-y-1">
                  {[...NAV_PRIMARY, { name: 'Prayer', href: '/prayer-requests' }].map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                        className={cn(
                          'font-display block py-2 text-[2.5rem] leading-[1.15] tracking-tight transition-colors',
                          isActive(pathname, item.href) ? 'text-gold-light' : 'text-white hover:text-gold-light',
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  <li className="mt-4 flex flex-wrap gap-x-6 border-t border-white/10 pt-5">
                    {NAV_MORE.filter((i) => i.name !== 'Prayer').map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="inline-flex min-h-11 items-center text-sm font-medium uppercase tracking-[0.14em] text-stone-400 transition-colors hover:text-white"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </li>
                </ul>

                <div className="mt-10 space-y-6">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <CtaLink href="/visit" variant="gold" className="flex-1" arrow={false}>
                      Plan a visit
                    </CtaLink>
                    <CtaLink href="/give" variant="outline-light" className="flex-1" arrow={false}>
                      Give
                    </CtaLink>
                  </div>
                  <p className="text-sm leading-relaxed text-stone-400">
                    <span className="kicker mb-2 block text-gold-light">Sundays</span>
                    {SERVICES[0].times.join(' & ')}
                  </p>
                </div>
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </nav>
    </header>
  );
}

function MoreMenu({ pathname }: { pathname: string }) {
  const anyActive = NAV_MORE.some((i) => isActive(pathname, i.href));
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="group inline-flex min-h-11 items-center gap-1.5 px-3 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-white/85 transition-colors hover:text-white data-[state=open]:text-white"
        >
          <span className="link-underline pb-1" data-active={anyActive}>
            More
          </span>
          <ChevronDown
            aria-hidden="true"
            className="size-3.5 transition-transform duration-300 group-data-[state=open]:rotate-180"
          />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className={cn(
            displayFont.variable,
            'public-site on-dark z-[70] min-w-52 rounded-2xl border border-white/10 bg-ink-900/95 p-2 text-white shadow-2xl backdrop-blur-md',
            'data-[state=open]:animate-[drawer-in_0.2s_var(--ease-out-quart)]',
          )}
        >
          {NAV_MORE.map((item) => (
            <DropdownMenu.Item key={item.href} asChild>
              <Link
                href={item.href}
                aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                className={cn(
                  'flex min-h-11 cursor-pointer items-center rounded-xl px-4 text-sm font-medium tracking-wide outline-none transition-colors',
                  'text-white/85 data-[highlighted]:bg-white/10 data-[highlighted]:text-white',
                  isActive(pathname, item.href) && 'text-gold-light',
                  'hideFrom' in item && item.hideFrom === 'xl' && 'xl:hidden',
                )}
              >
                {item.name}
              </Link>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
