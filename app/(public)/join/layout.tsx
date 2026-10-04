import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join Us',
  description: 'Join the El Shaddai World Ministries family — register as a visitor, new convert or transferring member.',
  alternates: { canonical: '/join' },
  openGraph: { title: 'Join Us | El Shaddai World Ministries', url: '/join' },
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
