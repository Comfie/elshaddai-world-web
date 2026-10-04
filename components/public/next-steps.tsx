import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Photo } from '@/components/public/photo';
import { Reveal } from '@/components/public/reveal';
import { SectionHeader } from '@/components/public/section-header';
import type { ImageSlot } from '@/lib/site-config';

const steps: {
  eyebrow: string;
  title: string;
  href: string;
  slot: ImageSlot;
  span: string;
  variant: number;
}[] = [
  { eyebrow: 'New here?', title: 'Plan your visit', href: '/visit', slot: 'stepVisit', span: 'lg:col-span-7', variant: 0 },
  { eyebrow: 'Need prayer?', title: 'Send a prayer request', href: '/prayer-requests', slot: 'stepPrayer', span: 'lg:col-span-5', variant: 3 },
  { eyebrow: 'Grow', title: 'Join a ministry', href: '/ministries', slot: 'stepGrow', span: 'lg:col-span-4', variant: 1 },
  { eyebrow: 'Connect', title: 'Become part of our community', href: '/join', slot: 'stepConnect', span: 'lg:col-span-4', variant: 4 },
  { eyebrow: 'Serve', title: 'Find your place', href: '/contact', slot: 'stepServe', span: 'lg:col-span-4', variant: 2 },
];

/** "Take your next step" — large typographic tiles over imagery (not icon cards). */
export function NextSteps() {
  return (
    <section aria-labelledby="steps-heading" className="on-light section-y bg-ivory">
      <div className="wrap">
        <Reveal>
          <SectionHeader
            kicker="Next steps"
            title={
              <span id="steps-heading">
                Take your <em>next step.</em>
              </span>
            }
            description="Wherever you are on your journey, there is a simple way to begin."
          />
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {steps.map((step, i) => (
            <Reveal key={step.href + step.eyebrow} className={cn(step.span, i === 0 && 'sm:col-span-2 lg:col-span-7')} delay={i * 70}>
              <Link
                href={step.href}
                className="on-dark group relative isolate flex min-h-[18rem] overflow-hidden rounded-2xl bg-ink-950 p-7 text-white sm:min-h-[22rem] sm:p-9 lg:h-[26rem]"
              >
                <Photo slot={step.slot} variant={step.variant} zoom sizes="(min-width: 1024px) 40vw, 100vw" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/35 to-ink-950/10" />
                <div className="relative mt-auto flex w-full items-end justify-between gap-6">
                  <div>
                    <p className="kicker mb-3 text-gold-light">{step.eyebrow}</p>
                    <p className="display-md max-w-sm">{step.title}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="grid size-12 shrink-0 place-items-center rounded-full border border-white/40 transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-ink-950"
                  >
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
