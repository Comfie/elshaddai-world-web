import Link from 'next/link';
import { Headphones, Play, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Photo } from '@/components/public/photo';
import { formatCategory, formatShortDate } from '@/lib/format';
import { sermonThumbnail } from '@/lib/media';

export type SermonLike = {
  id: string;
  title: string;
  preacher: string;
  sermonDate: Date | string;
  series?: string | null;
  scripture?: string | null;
  category: string;
  thumbnailUrl?: string | null;
  videoUrl?: string | null;
  audioUrl?: string | null;
  description?: string | null;
  isFeatured?: boolean;
};

/** Media-library style card: artwork first, text beneath, one stretched link. */
export function SermonCard({
  sermon,
  tone = 'light',
  priority,
  variant = 0,
}: {
  sermon: SermonLike;
  tone?: 'light' | 'dark';
  priority?: boolean;
  variant?: number;
}) {
  const dark = tone === 'dark';
  const thumb = sermonThumbnail(sermon);
  return (
    <article className="group relative">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink-900">
        <Photo
          src={thumb}
          alt=""
          variant={variant + sermon.title.length}
          zoom
          priority={priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
        <span
          aria-hidden="true"
          className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink-950/70 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur"
        >
          {sermon.videoUrl ? <Video className="size-3.5" /> : sermon.audioUrl ? <Headphones className="size-3.5" /> : null}
          {sermon.videoUrl ? 'Watch' : sermon.audioUrl ? 'Listen' : formatCategory(sermon.category)}
        </span>
        <span
          aria-hidden="true"
          className="absolute bottom-4 right-4 grid size-12 place-items-center rounded-full bg-gold text-ink-950 transition-transform duration-300 group-hover:scale-110"
        >
          <Play className="ml-0.5 size-5 fill-current" />
        </span>
      </div>

      <div className="mt-5">
        <p className={cn('kicker mb-3', dark ? 'text-gold-light' : 'text-bronze')}>
          {sermon.series || formatCategory(sermon.category)}
        </p>
        <h3 className={cn('display-sm line-clamp-2', dark ? 'text-white' : 'text-ink-900')}>
          <Link
            href={`/sermons/${sermon.id}`}
            className="link-underline after:absolute after:inset-0 after:content-['']"
          >
            {sermon.title}
          </Link>
        </h3>
        <p className={cn('mt-3 text-[0.95rem]', dark ? 'text-stone-400' : 'text-stone-600')}>
          {sermon.preacher} &middot; {formatShortDate(sermon.sermonDate)}
          {sermon.scripture && <> &middot; {sermon.scripture}</>}
        </p>
      </div>
    </article>
  );
}
