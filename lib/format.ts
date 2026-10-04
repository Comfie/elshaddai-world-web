/**
 * Date/time helpers for the public site. All dates are rendered in
 * South African time so a server running in UTC never shows the wrong day.
 */

const TZ = 'Africa/Johannesburg';

type DateInput = Date | string | number;

const toDate = (d: DateInput) => (d instanceof Date ? d : new Date(d));

export function dateParts(input: DateInput) {
  const d = toDate(input);
  const f = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-ZA', { timeZone: TZ, ...opts }).format(d);
  return {
    day: f({ day: '2-digit' }),
    month: f({ month: 'short' }).replace('.', '').toUpperCase(),
    monthLong: f({ month: 'long' }),
    weekday: f({ weekday: 'long' }),
    weekdayShort: f({ weekday: 'short' }).replace('.', ''),
    year: f({ year: 'numeric' }),
  };
}

export function formatLongDate(input: DateInput) {
  return new Intl.DateTimeFormat('en-ZA', {
    timeZone: TZ,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(toDate(input));
}

export function formatShortDate(input: DateInput) {
  return new Intl.DateTimeFormat('en-ZA', {
    timeZone: TZ,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(toDate(input));
}

/** "18:30" → "6:30 PM"; leaves already-friendly strings alone. */
export function formatTime(value?: string | null) {
  if (!value) return null;
  const m = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return value;
  const h = Number(m[1]);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m[2]} ${suffix}`;
}

/** Start of "today" in South Africa (UTC+2, no DST) — used for upcoming-event queries. */
export function startOfTodayZA() {
  const now = new Date();
  const za = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  za.setUTCHours(0, 0, 0, 0);
  return new Date(za.getTime() - 2 * 60 * 60 * 1000);
}

export function formatEventType(type: string) {
  return type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export function formatCategory(value: string) {
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
