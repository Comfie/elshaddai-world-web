import { Photo } from '@/components/public/photo';
import { NeedsConfirmation } from '@/components/public/needs-confirmation';
import type { ImageSlot } from '@/lib/images';

/** Portrait + name + role. Uses a designed blue placeholder until a real photo is supplied. */
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
    <article className="on-dark flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-brand-navy/40 text-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-navy sm:aspect-[5/4]">
        <Photo slot={slot} variant={initials.length + (initials.charCodeAt(0) % 3)} sizes="(min-width: 768px) 45vw, 100vw" />
        <span
          aria-hidden="true"
          className="font-display absolute inset-0 grid place-items-center text-[6rem] leading-none text-brand-300/35"
        >
          {initials}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-7 sm:p-9">
        <p className="kicker text-brand-300">{role}</p>
        <h3 className="display-md mt-4">{name}</h3>
        {children && <div className="mt-5 space-y-4 text-brand-100">{children}</div>}
        {needsConfirmation && <NeedsConfirmation what={needsConfirmation} />}
      </div>
    </article>
  );
}
