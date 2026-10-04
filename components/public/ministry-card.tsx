import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Photo } from '@/components/public/photo';

export type MinistryLike = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  meetingDay?: string | null;
  meetingTime?: string | null;
};

/**
 * Large photographic tile. Deliberately shows no internal data such as
 * member counts.
 */
export function MinistryCard({
  ministry,
  variant = 0,
  tall = true,
}: {
  ministry: MinistryLike;
  variant?: number;
  tall?: boolean;
}) {
  return (
    <article
      className={`group relative isolate overflow-hidden rounded-2xl bg-ink-950 ${
        tall ? 'aspect-[4/5]' : 'aspect-[16/11]'
      }`}
    >
      <Photo
        src={ministry.imageUrl}
        alt=""
        variant={variant + ministry.name.length}
        zoom
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/5" />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        {(ministry.meetingDay || ministry.meetingTime) && (
          <p className="kicker mb-3 text-gold-light">
            {[ministry.meetingDay, ministry.meetingTime].filter(Boolean).join(' · ')}
          </p>
        )}
        <h3 className="display-md text-white">
          <Link href={`/ministries/${ministry.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {ministry.name}
          </Link>
        </h3>
        {ministry.description && (
          <p className="mt-3 line-clamp-2 max-w-sm text-[0.95rem] leading-relaxed text-stone-200">
            {ministry.description}
          </p>
        )}
        <p className="mt-5 inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-white">
          Learn more
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:translate-x-1.5"
          />
        </p>
      </div>
    </article>
  );
}
