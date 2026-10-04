import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prayer Requests',
  description:
    'Share your prayer request with the El Shaddai World Ministries prayer team. Submit privately or anonymously — we would be honoured to pray with you.',
  alternates: { canonical: '/prayer-requests' },
  openGraph: { title: 'Prayer Requests | El Shaddai World Ministries', url: '/prayer-requests' },
};

export default function PrayerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
