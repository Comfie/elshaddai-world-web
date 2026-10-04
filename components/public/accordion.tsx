'use client';

import { useId, useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AccordionItem = { id: string; question: string; answer: React.ReactNode };

/**
 * Accessible disclosure list (button + region, aria-expanded/controls) with a
 * smooth height transition. Multiple items may be open at once.
 */
export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const base = useId();
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className={cn('divide-y divide-stone-200 border-y border-stone-200', className)}>
      {items.map((item) => {
        const isOpen = open.has(item.id);
        const panelId = `${base}-${item.id}-panel`;
        const buttonId = `${base}-${item.id}-button`;
        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span className="display-sm text-ink-900 transition-colors group-hover:text-bronze">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'grid size-10 shrink-0 place-items-center rounded-full border border-stone-200 text-ink-900 transition-all duration-300',
                    isOpen && 'rotate-45 border-ink-900 bg-ink-900 text-ivory',
                  )}
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="accordion-panel"
              data-open={isOpen}
            >
              <div>
                <div className="max-w-2xl pb-7 leading-relaxed text-stone-600">{item.answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
