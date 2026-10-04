import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { safeQuery } from '@/lib/public-data';
import { SITE_URL } from '@/lib/site-config';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [sermons, ministries, events, books] = await Promise.all([
    safeQuery(() => prisma.sermon.findMany({ select: { id: true, updatedAt: true } }), []),
    safeQuery(
      () =>
        prisma.ministry.findMany({
          where: { isActive: true, displayOnWebsite: true },
          select: { slug: true, updatedAt: true },
        }),
      [],
    ),
    safeQuery(
      () =>
        prisma.event.findMany({
          where: { displayOnWebsite: true, status: { not: 'CANCELLED' } },
          select: { id: true, updatedAt: true },
        }),
      [],
    ),
    safeQuery(() => prisma.book.findMany({ where: { isAvailable: true }, select: { id: true, updatedAt: true } }), []),
  ]);

  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']) => ({
    url: `${SITE_URL}${path}`,
    priority,
    changeFrequency,
  });

  return [
    page('/', 1, 'weekly'),
    page('/visit', 0.9, 'monthly'),
    page('/about', 0.7, 'yearly'),
    page('/ministries', 0.8, 'weekly'),
    page('/sermons', 0.8, 'weekly'),
    page('/events', 0.8, 'daily'),
    page('/prayer-requests', 0.6, 'yearly'),
    page('/give', 0.6, 'yearly'),
    page('/join', 0.6, 'yearly'),
    page('/contact', 0.6, 'yearly'),
    page('/books', 0.5, 'monthly'),
    ...ministries.map((m) => ({ ...page(`/ministries/${m.slug}`, 0.6, 'monthly'), lastModified: m.updatedAt })),
    ...sermons.map((s) => ({ ...page(`/sermons/${s.id}`, 0.5, 'yearly'), lastModified: s.updatedAt })),
    ...events.map((e) => ({ ...page(`/events/${e.id}`, 0.5, 'weekly'), lastModified: e.updatedAt })),
    ...books.map((b) => ({ ...page(`/books/${b.id}`, 0.4, 'yearly'), lastModified: b.updatedAt })),
  ];
}
