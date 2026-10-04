import { SITE_NAME, SITE_URL } from '@/lib/site-config';

/**
 * Add-to-calendar helpers. Event dates come from a date picker (stored as an
 * instant at SAST midnight), and start/end times are free-text strings such as
 * "10:00" or "6:30 PM". Everything is interpreted in Africa/Johannesburg (UTC+2).
 */

type CalEvent = {
  id: string;
  title: string;
  description?: string | null;
  eventDate: Date;
  endDate?: Date | null;
  startTime?: string | null;
  endTime?: string | null;
  isAllDay?: boolean;
  location: string;
  address?: string | null;
};

const SAST_OFFSET_MS = 2 * 60 * 60 * 1000;

function zaYmd(date: Date) {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Johannesburg' }).format(date);
}

function parseTime(value?: string | null): { h: number; m: number } | null {
  if (!value) return null;
  const match = value.trim().match(/^(\d{1,2})(?::|\.|h)?(\d{2})?\s*(am|pm)?$/i);
  if (!match) return null;
  let h = Number(match[1]);
  const m = Number(match[2] ?? 0);
  const mer = match[3]?.toLowerCase();
  if (mer === 'pm' && h < 12) h += 12;
  if (mer === 'am' && h === 12) h = 0;
  if (h > 23 || m > 59) return null;
  return { h, m };
}

const pad = (n: number) => String(n).padStart(2, '0');
const toIcsUtc = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
const toIcsDate = (ymd: string) => ymd.replace(/-/g, '');

export function eventTimes(ev: CalEvent) {
  const startYmd = zaYmd(ev.eventDate);
  const start = parseTime(ev.startTime);

  if (ev.isAllDay || !start) {
    const endBase = ev.endDate ?? ev.eventDate;
    const [y, mo, d] = zaYmd(endBase).split('-').map(Number);
    const next = new Date(Date.UTC(y, mo - 1, d + 1));
    const endYmd = `${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}-${pad(next.getUTCDate())}`;
    return { allDay: true as const, startYmd, endYmd };
  }

  const [y, mo, d] = startYmd.split('-').map(Number);
  const startUtc = new Date(Date.UTC(y, mo - 1, d, start.h, start.m) - SAST_OFFSET_MS);
  const end = parseTime(ev.endTime);
  const [ey, emo, ed] = zaYmd(ev.endDate ?? ev.eventDate).split('-').map(Number);
  const endUtc = end
    ? new Date(Date.UTC(ey, emo - 1, ed, end.h, end.m) - SAST_OFFSET_MS)
    : new Date(startUtc.getTime() + 60 * 60 * 1000);
  return { allDay: false as const, startUtc, endUtc: endUtc > startUtc ? endUtc : new Date(startUtc.getTime() + 60 * 60 * 1000) };
}

const where = (ev: CalEvent) => [ev.location, ev.address].filter(Boolean).join(', ');

export function googleCalendarUrl(ev: CalEvent) {
  const t = eventTimes(ev);
  const dates = t.allDay
    ? `${toIcsDate(t.startYmd)}/${toIcsDate(t.endYmd)}`
    : `${toIcsUtc(t.startUtc)}/${toIcsUtc(t.endUtc)}`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: ev.title,
    dates,
    details: `${ev.description ?? ''}\n\n${SITE_URL}/events/${ev.id}`.trim(),
    location: where(ev),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const esc = (s: string) =>
  s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

export function buildIcs(ev: CalEvent) {
  const t = eventTimes(ev);
  const stamp = toIcsUtc(new Date());
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${SITE_NAME}//Events//EN`,
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${ev.id}@${new URL(SITE_URL).hostname}`,
    `DTSTAMP:${stamp}`,
    t.allDay
      ? `DTSTART;VALUE=DATE:${toIcsDate(t.startYmd)}`
      : `DTSTART:${toIcsUtc(t.startUtc)}`,
    t.allDay ? `DTEND;VALUE=DATE:${toIcsDate(t.endYmd)}` : `DTEND:${toIcsUtc(t.endUtc)}`,
    `SUMMARY:${esc(ev.title)}`,
    `DESCRIPTION:${esc(`${ev.description ?? ''}\n${SITE_URL}/events/${ev.id}`.trim())}`,
    `LOCATION:${esc(where(ev))}`,
    `URL:${SITE_URL}/events/${ev.id}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n') + '\r\n';
}
