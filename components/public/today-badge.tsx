'use client';

import { useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';

/**
 * "Today" marker for programme items that run on the current day (South
 * African time). It reflects the *schedule only* — it never claims something
 * is live or broadcast. Renders nothing on the server, then fills in after
 * hydration, so statically generated pages stay cacheable.
 */
const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function todayZA() {
  const wd = new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Johannesburg', weekday: 'short' }).format(new Date());
  return DAY.indexOf(wd);
}

const subscribe = () => () => {};

export function TodayBadge({ days, className }: { days: number[]; className?: string }) {
  const today = useSyncExternalStore(subscribe, todayZA, () => -1);
  if (!days.includes(today)) return null;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-700',
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-600" />
      Today
    </span>
  );
}
