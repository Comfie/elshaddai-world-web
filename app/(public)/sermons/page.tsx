import type { Metadata } from 'next';
import { PageHero } from '@/components/public/page-hero';
import { SermonLibrary } from '@/components/public/sermon-library';
import { prisma } from '@/lib/db';
import { safeQuery } from '@/lib/public-data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Sermons',
  description:
    'Watch and listen to messages from El Shaddai World Ministries — Sunday services, midweek teaching, conferences and special events.',
  alternates: { canonical: '/sermons' },
  openGraph: { title: 'Sermons | El Shaddai World Ministries', url: '/sermons' },
};

export default async function SermonsPage() {
  // Same data and ordering the public /api/sermons endpoint returns.
  const sermons = await safeQuery(
    () => prisma.sermon.findMany({ orderBy: [{ isFeatured: 'desc' }, { sermonDate: 'desc' }] }),
    [],
  );

  return (
    <>
      <PageHero
        variant={2}
        kicker="Sermons"
        title={
          <>
            Hear the <em className="text-gold-light">Word.</em>
          </>
        }
        description="Messages from our Sunday services, midweek teaching and special gatherings — to watch, listen to and share."
      />
      <SermonLibrary
        sermons={sermons.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          preacher: s.preacher,
          sermonDate: s.sermonDate.toISOString(),
          series: s.series,
          topic: s.topic,
          scripture: s.scripture,
          category: s.category,
          thumbnailUrl: s.thumbnailUrl,
          videoUrl: s.videoUrl,
          audioUrl: s.audioUrl,
          isFeatured: s.isFeatured,
        }))}
      />
    </>
  );
}
