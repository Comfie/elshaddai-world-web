import type { Metadata } from 'next';
import { displayFont } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Sign in | El Shaddai World Ministries',
  robots: { index: false, follow: false },
};

/** Applies the El Shaddai brand typography/tokens to the sign-in screens. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className={cn(displayFont.variable, 'public-site')}>{children}</div>;
}
