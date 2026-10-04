import { Photo } from '@/components/public/photo';
import { NeedsConfirmation } from '@/components/public/needs-confirmation';
import type { ImageSlot } from '@/lib/site-config';

/** Portrait + name + role. Uses a designed placeholder until a real photo is supplied. */
export function LeadershipCard({
  name,
  role,
  initials,
  slot,
  children,
  needsConfirmation,
}: {
  name: string;
  role: string;
  initials: string;
  slot?: ImageSlot;
  children?: React.ReactNode;
  needsConfirmation?: string;
}) {
  return (
    <article className="grid items-center gap-10 md:grid-cols-12 md:gap-16">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-900 md:col-span-5">
        <Photo slot={slot} variant={3} sizes="(min-width: 768px) 40vw, 100vw" />
        <span
          aria-hidden="true"
          className="font-display absolute inset-0 grid place-items-center text-[7rem] leading-none text-gold-light/40"
        >
          {initials}
        </span>
      </div>
      <div className="md:col-span-7">
        <p className="kicker mb-4 text-gold-light">{role}</p>
        <h3 className="display-lg">{name}</h3>
        {children && <div className="lead mt-6 max-w-xl space-y-4 text-stone-400">{children}</div>}
        {needsConfirmation && <NeedsConfirmation what={needsConfirmation} />}
      </div>
    </article>
  );
}
