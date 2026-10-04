import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Download, Headphones, Play } from 'lucide-react';
import { prisma } from '@/lib/db';
import { safeQuery } from '@/lib/public-data';
import { CtaLink } from '@/components/public/cta';
import { Photo } from '@/components/public/photo';
import { Reveal } from '@/components/public/reveal';
import { ShareButtons } from '@/components/public/share-buttons';
import { SermonCard } from '@/components/public/sermon-card';
import { PlanVisitCTA } from '@/components/public/plan-visit-cta';
import { JsonLd } from '@/components/public/json-ld';
import { getSiteInfo } from '@/lib/site-info';
import { formatCategory, formatLongDate } from '@/lib/format';
import { extractYouTubeId, getVideoType, isDirectAudio, sermonThumbnail } from '@/lib/media';
import { SITE_URL } from '@/lib/site-config';

export const revalidate = 60;

const getSermon = (id: string) => prisma.sermon.findUnique({ where: { id } });

async function getRelatedSermons(sermon: { id: string; series: string | null; category: string }) {
  const candidates = await prisma.sermon.findMany({
    where: {
      id: { not: sermon.id },
      OR: [
        ...(sermon.series ? [{ series: sermon.series }] : []),
        { category: sermon.category as never },
      ],
    },
    orderBy: { sermonDate: 'desc' },
    take: 12,
  });
  // Same series first, then same category, newest first within each.
  return candidates
    .sort((a, b) => Number(b.series === sermon.series && !!sermon.series) - Number(a.series === sermon.series && !!sermon.series))
    .slice(0, 3);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const sermon = await safeQuery(() => getSermon(id), null);
  if (!sermon) return { title: 'Sermon not found' };

  const description =
    sermon.description?.slice(0, 160) ||
    `Watch “${sermon.title}” by ${sermon.preacher} at El Shaddai World Ministries.`;
  const image = sermonThumbnail(sermon);
  return {
    title: sermon.title,
    description,
    alternates: { canonical: `/sermons/${sermon.id}` },
    openGraph: {
      title: sermon.title,
      description,
      type: 'video.other',
      url: `/sermons/${sermon.id}`,
      ...(image && { images: [{ url: image }] }),
    },
  };
}

export default async function SermonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sermon = await getSermon(id);
  if (!sermon) notFound();

  const [related, info] = await Promise.all([getRelatedSermons(sermon), getSiteInfo()]);

  const videoType = getVideoType(sermon.videoUrl);
  const youtubeId = videoType === 'youtube' && sermon.videoUrl ? extractYouTubeId(sermon.videoUrl) : null;
  const thumb = sermonThumbnail(sermon);
  const shareUrl = `${SITE_URL}/sermons/${sermon.id}`;
  const watchLabel =
    videoType === 'youtube' ? 'Watch on YouTube' : videoType === 'facebook' ? 'Watch on Facebook' : 'Watch video';

  const schema = sermon.videoUrl && {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: sermon.title,
    description: sermon.description || sermon.title,
    uploadDate: sermon.sermonDate.toISOString(),
    ...(thumb && { thumbnailUrl: thumb }),
    ...(youtubeId && { embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}` }),
    contentUrl: sermon.videoUrl,
  };

  return (
    <>
      {schema && <JsonLd data={schema} />}

      {/* Player */}
      <section className="on-dark relative isolate overflow-hidden bg-brand-navy pb-14 pt-28 text-white sm:pb-20 sm:pt-36">
        <Photo src={thumb} alt="" variant={2} className="scale-110 opacity-30 blur-2xl" />
        <div aria-hidden="true" className="absolute inset-0 bg-brand-navy/70" />
        <div className="wrap relative">
          <CtaLink href="/sermons" variant="text-light" arrow={false} className="mb-8">
            ← All sermons
          </CtaLink>

          <div className="mx-auto max-w-5xl">
            {youtubeId ? (
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`}
                  title={sermon.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            ) : sermon.videoUrl ? (
              <a
                href={sermon.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-video overflow-hidden rounded-2xl bg-brand-900"
              >
                <Photo src={thumb} alt="" variant={1} zoom />
                <span aria-hidden="true" className="absolute inset-0 bg-brand-navy/40" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="flex flex-col items-center gap-4">
                    <span className="grid size-20 place-items-center rounded-full bg-brand-600 text-white transition-transform duration-300 group-hover:scale-110">
                      <Play className="ml-1 size-8 fill-current" aria-hidden="true" />
                    </span>
                    <span className="rounded-lg bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-brand-navy">
                      {watchLabel}
                    </span>
                  </span>
                </span>
              </a>
            ) : thumb || sermon.audioUrl ? (
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-brand-900">
                <Photo src={thumb} alt={sermon.title} variant={0} />
                <div aria-hidden="true" className="absolute inset-0 bg-brand-navy/35" />
                {sermon.audioUrl && (
                  <span className="absolute inset-0 grid place-items-center">
                    <Headphones className="size-14 text-white/90" aria-hidden="true" />
                  </span>
                )}
              </div>
            ) : null}

            {sermon.audioUrl && isDirectAudio(sermon.audioUrl) && (
              <div className="mt-5 rounded-2xl border border-white/15 bg-white/5 p-4">
                <p className="kicker mb-3 text-brand-300">Listen</p>
                <audio controls preload="none" src={sermon.audioUrl} className="w-full" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="on-light section-y bg-brand-50">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-8">
            <p className="kicker mb-5 text-brand-700">{sermon.series || formatCategory(sermon.category)}</p>
            <h1 className="display-lg text-brand-navy">{sermon.title}</h1>
            <p className="mt-6 text-lg text-body">
              <span className="text-brand-navy">{sermon.preacher}</span> &middot; {formatLongDate(sermon.sermonDate)}
            </p>

            {sermon.scripture && (
              <blockquote className="mt-10 border-l-2 border-brand-500 pl-6">
                <p className="kicker mb-2 text-brand-700">Scripture</p>
                <p className="display-sm text-brand-navy">{sermon.scripture}</p>
              </blockquote>
            )}

            {sermon.description && (
              <div className="mt-10">
                <h2 className="kicker mb-4 text-brand-700">About this message</h2>
                <p className="lead max-w-2xl whitespace-pre-wrap text-body">{sermon.description}</p>
              </div>
            )}

            {(sermon.topic || sermon.tags.length > 0) && (
              <ul className="mt-10 flex flex-wrap gap-2" aria-label="Topics">
                {[sermon.topic, ...sermon.tags].filter(Boolean).map((t) => (
                  <li key={t} className="rounded-full border border-brand-200 px-4 py-1.5 text-sm text-body">
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>

          <Reveal className="lg:col-span-4" delay={100}>
            <div className="space-y-10 lg:sticky lg:top-28">
              <div>
                <h2 className="kicker mb-5 text-brand-700">Watch &amp; listen</h2>
                <div className="flex flex-col items-start gap-3">
                  {sermon.videoUrl && (
                    <CtaLink href={sermon.videoUrl} variant="primary" external>
                      {watchLabel}
                    </CtaLink>
                  )}
                  {sermon.audioUrl && (
                    <CtaLink href={sermon.audioUrl} variant="outline-dark" external>
                      Listen to audio
                    </CtaLink>
                  )}
                  {sermon.notesUrl && (
                    <CtaLink href={sermon.notesUrl} variant="outline-dark" external arrow={false}>
                      <Download className="size-4" aria-hidden="true" /> Sermon notes
                    </CtaLink>
                  )}
                  {!sermon.videoUrl && !sermon.audioUrl && !sermon.notesUrl && (
                    <p className="text-body">Media for this message will be added soon.</p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="kicker mb-5 text-brand-700">Share</h2>
                <ShareButtons url={shareUrl} title={sermon.title} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="on-light bg-brand-100 section-y">
          <div className="wrap">
            <h2 id="related-heading" className="display-md mb-12 text-brand-navy">
              {sermon.series ? 'More from this series' : 'Keep listening'}
            </h2>
            <div className="grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s, i) => (
                <SermonCard key={s.id} sermon={s} variant={i} />
              ))}
            </div>
            <div className="mt-14">
              <Link href="/sermons" className="link-underline inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-[0.14em] text-brand-navy">
                Explore all sermons
              </Link>
            </div>
          </div>
        </section>
      )}

      <PlanVisitCTA info={info} />
    </>
  );
}
