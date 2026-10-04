import { cn } from '@/lib/utils';
import { Photo } from '@/components/public/photo';
import { slotHasImage, type ImageSlot } from '@/lib/images';

/**
 * A blue programme panel: photograph (or designed blue placeholder) with a
 * navy overlay for text legibility, and — only while no real photo exists — a
 * giant typographic watermark so the panel reads as deliberate artwork.
 */
export function ProgrammeSurface({
  slot,
  variant = 0,
  watermark,
  overlay = 'bg-brand-navy/55',
  className,
  children,
}: {
  slot: ImageSlot;
  variant?: number;
  /** Large faint word(s) shown when there is no photo yet. */
  watermark?: string;
  /** Tailwind classes for the legibility overlay. */
  overlay?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('on-dark group relative isolate overflow-hidden rounded-xl text-white', className)}>
      <Photo slot={slot} variant={variant} zoom sizes="(min-width: 1024px) 40vw, 100vw" />
      {watermark && !slotHasImage(slot) && (
        <span
          aria-hidden="true"
          className="font-display pointer-events-none absolute -bottom-6 -right-2 select-none text-[clamp(5rem,16vw,9rem)] uppercase leading-none tracking-tight text-white/[0.05]"
        >
          {watermark}
        </span>
      )}
      <div aria-hidden="true" className={cn('absolute inset-0', overlay)} />
      <div className="relative">{children}</div>
    </div>
  );
}
