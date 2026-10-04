import { Photo } from '@/components/public/photo';
import { slotHasImage, type ImageSlot } from '@/lib/images';
import { programDays, programTimes, type ProgramItem } from '@/lib/site-config';
import { cn } from '@/lib/utils';

/**
 * Portrait programme artwork. With no photo it is a typographic poster
 * (name, host, days, time) on a navy → royal composition; once a real photo is
 * supplied for the slot, the photo is shown with a compact caption instead.
 */
export function ProgrammePoster({
  program,
  slot,
  variant = 1,
  className,
}: {
  program: ProgramItem;
  slot: ImageSlot;
  variant?: number;
  className?: string;
}) {
  const [first, ...rest] = program.name.split(' ');
  const hasPhoto = slotHasImage(slot);

  return (
    <div className={cn('on-dark relative isolate aspect-[4/5] overflow-hidden rounded-2xl bg-brand-navy text-white', className)}>
      <Photo slot={slot} variant={variant} sizes="(min-width: 1024px) 38vw, 100vw" />
      {hasPhoto ? (
        <>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p className="display-md">{program.name}</p>
            <p className="mt-2 text-brand-100">
              {programDays(program)} · {programTimes(program)}
            </p>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col justify-between p-7 sm:p-10">
          <div aria-hidden="true" className="absolute inset-0 bg-brand-navy/30" />
          <p className="kicker relative text-brand-100">El Shaddai World Ministries</p>
          <div className="relative">
            <p className="font-display text-[clamp(3.25rem,10vw,5.5rem)] uppercase leading-[0.9] tracking-tight">
              {first}
              <br />
              {rest.join(' ')}
            </p>
            {program.subtitle && (
              <p className="mt-6">
                <span className="kicker block text-brand-100">With</span>
                <span className="display-sm mt-2 block">{program.subtitle.replace(/^with /i, '')}</span>
              </p>
            )}
          </div>
          <div className="relative border-t border-white/25 pt-5">
            <p className="kicker text-brand-100">{programDays(program)}</p>
            <p className="font-display mt-2 whitespace-nowrap text-[clamp(1.5rem,5vw,2.25rem)]">
              {programTimes(program)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
