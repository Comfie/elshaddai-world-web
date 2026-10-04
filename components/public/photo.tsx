import Image from 'next/image';
import { cn } from '@/lib/utils';
import { RemoteImg } from '@/components/public/remote-img';
import { IMAGES, type ImageSlot } from '@/lib/site-config';

/**
 * Photography surface.
 *
 * - With a real `src` it renders the image (next/image for local files,
 *   a plain lazy <img> for admin-supplied remote URLs of unknown hosts).
 * - Without one it renders a designed, atmospheric placeholder — clearly a
 *   backdrop, never a fake photograph — so layouts look finished and a real
 *   photo can be dropped in later (see IMAGES in lib/site-config.ts).
 *
 * The parent controls size (aspect ratio / height); Photo fills it.
 */

type PhotoProps = {
  /** Either an explicit URL, or a named slot from lib/site-config. */
  src?: string | null;
  slot?: ImageSlot;
  alt?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  /** Shifts the placeholder's glow so neighbouring surfaces don't look identical. */
  variant?: number;
  /** Slow scale on hover of a parent with the `group` class. */
  zoom?: boolean;
};

const GLOWS = [
  ['72%', '22%'],
  ['24%', '30%'],
  ['60%', '70%'],
  ['82%', '58%'],
  ['35%', '78%'],
];

export function Photo({
  src,
  slot,
  alt,
  className,
  imgClassName,
  priority,
  sizes = '100vw',
  variant = 0,
  zoom,
}: PhotoProps) {
  const resolved = src ?? (slot ? IMAGES[slot]?.src : null) ?? null;
  const altText = alt ?? (slot ? IMAGES[slot]?.alt : '') ?? '';
  const [px, py] = GLOWS[variant % GLOWS.length];

  const zoomClass = zoom
    ? 'transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none'
    : '';

  if (!resolved) {
    return (
      <div
        aria-hidden="true"
        data-placeholder={slot ?? 'photo'}
        className={cn('photo-placeholder absolute inset-0 overflow-hidden', className)}
        style={{ ['--px' as string]: px, ['--py' as string]: py }}
      />
    );
  }

  const isLocal = resolved.startsWith('/');

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      {isLocal ? (
        <Image
          src={resolved}
          alt={altText}
          fill
          sizes={sizes}
          priority={priority}
          className={cn('object-cover', zoomClass, imgClassName)}
        />
      ) : (
        <>
          {/* Placeholder sits beneath so a failed remote image degrades gracefully. */}
          <div
            aria-hidden="true"
            className="photo-placeholder absolute inset-0"
            style={{ ['--px' as string]: px, ['--py' as string]: py }}
          />
          {/* Remote URLs are entered by admins and the host is unknown, so they
              cannot go through next/image's allow-list. */}
          <RemoteImg src={resolved} alt={altText} priority={priority} className={cn(zoomClass, imgClassName)} />
        </>
      )}
    </div>
  );
}
