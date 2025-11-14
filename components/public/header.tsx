'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Church, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Ministries', href: '/ministries' },
  { name: 'Events', href: '/events' },
  { name: 'Contact', href: '/contact' },
  { name: 'Give', href: '/give' },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <Church className="h-8 w-8 text-blue-900" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-blue-900">El Shaddai</span>
              <span className="text-xs text-blue-700">World Ministries</span>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-blue-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-semibold leading-6 transition-colors',
                  isActive
                    ? 'text-blue-900'
                    : 'text-blue-700 hover:text-blue-900'
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link href="/give">
            <Button className="bg-blue-900 hover:bg-blue-800">
              Give Now
            </Button>
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block rounded-md px-3 py-2 text-base font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-blue-700 hover:bg-blue-50 hover:text-blue-900'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="px-3 py-2">
              <Link href="/give" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-blue-900 hover:bg-blue-800">
                  Give Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
