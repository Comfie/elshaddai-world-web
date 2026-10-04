import { CHILDREN_PILLARS } from '@/lib/children';

/**
 * Decorative typographic artwork for the Children's Ministry image frames.
 * Shown ONLY until a real photo exists (admin image or public/images file),
 * so the frame reads as intentional design rather than a missing picture.
 */
export function ChildrenArt() {
  // White / pale blue only: sky blue on the cobalt placeholder tone is too faint (2.2:1).
  const tones = ['text-white', 'text-brand-100', 'text-white', 'text-brand-100'];
  return (
    <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-center gap-1 bg-brand-navy/25 px-8 pb-10 sm:px-12">
      <p className="kicker mb-4 text-brand-100">Every child</p>
      {CHILDREN_PILLARS.map((p, i) => (
        <p
          key={p.word}
          className={`font-display text-[clamp(2.4rem,6.4vw,4.25rem)] leading-[0.98] tracking-tight ${tones[i % tones.length]}`}
          style={{ marginLeft: `${(i % 2) * 1.5}rem` }}
        >
          {p.word}
        </p>
      ))}
    </div>
  );
}
