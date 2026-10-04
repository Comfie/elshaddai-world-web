/**
 * Single source of truth for the public marketing site's *static* content.
 *
 * Anything that is dynamic in the CRM (sermons, events, ministries, books)
 * keeps coming from the database. Church facts that rarely change live here,
 * and can be overridden from the `Settings` table (see lib/site-info.ts).
 *
 * Fields set to `null` are deliberately unset — they need church confirmation
 * and the UI degrades gracefully instead of showing invented information.
 * See docs/public-site-redesign.md for the full "needs confirmation" list.
 */

export const SITE_NAME = 'El Shaddai World Ministries';
export const SITE_SHORT_NAME = 'El Shaddai';
export const SITE_TAGLINE = "Transforming Lives Through God's Love";
export const SITE_DESCRIPTION =
  'A Bible-believing, Spirit-filled church in Fourways where people encounter God, grow in faith and discover their purpose. Join us for Sunday worship, Morning Prayer and Morning Manna.';

/** Verified official Facebook page (supplied by the church). */
export const FACEBOOK_URL = 'https://www.facebook.com/ElShaddaiWorld';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://church-crm-live.vercel.app')
).replace(/\/$/, '');

/**
 * WEEKLY PROGRAMME — the single source of truth for recurring gatherings.
 * Verified by the church. Every component, metadata block and JSON-LD entry
 * renders from this list; never hard-code a service time anywhere else.
 *
 * `days` uses JS weekday numbers (0 = Sunday … 6 = Saturday), in South African time.
 * `startTime` / `endTime` are 24-hour "HH:mm".
 *
 * Venue / livestream details have NOT been confirmed, so nothing here
 * implies where a gathering takes place or that it is broadcast.
 */
export type ProgramCategory = 'prayer' | 'devotional' | 'service';

export type ProgramItem = {
  id: string;
  name: string;
  /** Compact label for footers and tight layouts. */
  shortName: string;
  subtitle?: string;
  days: number[];
  startTime: string;
  endTime: string;
  category: ProgramCategory;
  tagline?: string;
  /**
   * How a non-Sunday programme is attended (confirmed by the church).
   * NOTE: the Zoom link itself is deliberately NOT published — it is shared in
   * the church WhatsApp group, so the site only explains how to get it.
   */
  access?: { format: 'Zoom' | 'Facebook Live'; chip: string; note: string };
};

export const WEEKLY_PROGRAM: ProgramItem[] = [
  {
    id: 'morning-prayer',
    name: 'Morning Prayer',
    shortName: 'Morning Prayer',
    days: [1, 2, 3, 4, 5, 6], // every day except Sunday
    startTime: '05:00',
    endTime: '06:00',
    category: 'prayer',
    tagline: 'Start your day in prayer',
    access: {
      format: 'Zoom',
      chip: 'On Zoom',
      note: 'The Zoom link is shared in the church WhatsApp group.',
    },
  },
  {
    id: 'morning-manna',
    name: 'Morning Manna',
    shortName: 'Morning Manna',
    subtitle: 'with Apostle Juliana',
    days: [1, 2, 3, 4, 5], // weekdays
    startTime: '06:00',
    endTime: '06:30',
    category: 'devotional',
    tagline: 'Start your day in the Word',
    access: {
      format: 'Facebook Live',
      chip: 'Live on Facebook',
      note: 'Streamed live on the El Shaddai Facebook page.',
    },
  },
  {
    id: 'sunday-morning',
    name: 'Sunday Morning Service',
    shortName: 'Sunday Morning',
    days: [0],
    startTime: '09:30',
    endTime: '10:10',
    category: 'service',
  },
  {
    id: 'sunday-evening',
    name: 'Sunday Evening Service',
    shortName: 'Sunday Evening',
    days: [0],
    startTime: '19:00',
    endTime: '22:00',
    category: 'service',
  },
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** [1..6] → "Monday – Saturday"; [0] → "Every Sunday". `short` → "Mon – Sat" / "Sundays". */
export function describeDays(days: number[], short = false) {
  const name = (d: number) => (short ? DAY_NAMES[d].slice(0, 3) : DAY_NAMES[d]);
  if (days.length === 1) return short ? `${DAY_NAMES[days[0]]}s` : `Every ${DAY_NAMES[days[0]]}`;
  return `${name(days[0])} – ${name(days[days.length - 1])}`;
}

/** "05:00" → "5:00 AM", "19:00" → "7:00 PM". */
export function formatClock(time: string) {
  const [h, m] = time.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

/** "5:00 AM – 6:00 AM" */
export const programTimes = (p: ProgramItem) => `${formatClock(p.startTime)} – ${formatClock(p.endTime)}`;

export const programDays = (p: ProgramItem, short = false) => describeDays(p.days, short);

export const getProgram = (id: string) => {
  const item = WEEKLY_PROGRAM.find((p) => p.id === id);
  if (!item) throw new Error(`Unknown programme item: ${id}`);
  return item;
};

export const SUNDAY_SERVICES = WEEKLY_PROGRAM.filter((p) => p.category === 'service');
export const SUNDAY_MORNING = getProgram('sunday-morning');
export const SUNDAY_EVENING = getProgram('sunday-evening');
export const MORNING_PRAYER = getProgram('morning-prayer');
export const MORNING_MANNA = getProgram('morning-manna');

/** schema.org openingHoursSpecification generated from the programme above. */
export const programmeSchema = () =>
  WEEKLY_PROGRAM.map((p) => ({
    '@type': 'OpeningHoursSpecification',
    name: p.subtitle ? `${p.name} ${p.subtitle}` : p.name,
    dayOfWeek: p.days.map((d) => DAY_NAMES[d]),
    opens: p.startTime,
    closes: p.endTime,
  }));

/**
 * Church contact defaults.
 *
 * ADDRESS — confirmed by the church: "El Shaddai World Centre, Farmall,
 * Chartwell, Fourways". (The old site contradicted itself with Pretoria and
 * Randburg; both are gone.) Only what the church stated is shown — no street
 * number or postal code has been invented. For an exact map pin, set the
 * Settings key `church_maps_url` to the Google Maps share link.
 *
 * PHONE — the number that used to be shown was a placeholder; it stays `null`
 * until supplied (Settings: `church_phone`).
 */
export const DEFAULT_CONTACT = {
  email: 'info@elshaddaiworld.org',
  phone: null as string | null,
  addressLines: ['El Shaddai World Centre', 'Farmall, Chartwell', 'Fourways'] as string[] | null,
};

/**
 * "Plan Your Visit" FAQ. `answer: null` means the church has not yet
 * confirmed the answer — the page shows a gracious fallback and flags the
 * item for administrators (see NeedsConfirmation).
 * Answers that can be derived from the verified programme are generated from it.
 */
export const VISIT_FAQS: { id: string; question: string; answer: string | null }[] = [
  {
    id: 'arrive',
    question: 'What time should I arrive?',
    answer: `Our Sunday services are at ${programTimes(SUNDAY_MORNING)} (morning) and ${programTimes(SUNDAY_EVENING)} (evening). Arriving a little early gives you time to find a seat and be welcomed.`,
  },
  {
    id: 'length',
    question: 'How long is a service?',
    answer: `The Sunday morning service runs ${programTimes(SUNDAY_MORNING)} and the Sunday evening service runs ${programTimes(SUNDAY_EVENING)}.`,
  },
  {
    id: 'week',
    question: 'Is there anything during the week?',
    answer: `Yes. ${MORNING_PRAYER.name} is ${programDays(MORNING_PRAYER)}, ${programTimes(MORNING_PRAYER)}, and ${MORNING_MANNA.name} ${MORNING_MANNA.subtitle} is ${programDays(MORNING_MANNA)}, ${programTimes(MORNING_MANNA)}.`,
  },
  {
    id: 'weekday-where',
    question: 'Where do Morning Prayer and Morning Manna take place?',
    answer: `${MORNING_MANNA.name} is streamed live on our Facebook page. ${MORNING_PRAYER.name} is on Zoom — the link is shared in our church WhatsApp group, and if you are new we will gladly help you join: just send us a message.`,
  },
  { id: 'parking', question: 'Where do I park?', answer: null },
  { id: 'wear', question: 'What should I wear?', answer: null },
  { id: 'arrival', question: 'What happens when I arrive?', answer: null },
  { id: 'children', question: 'Is there a children’s ministry?', answer: null },
  { id: 'accessible', question: 'Is the venue accessible?', answer: null },
  { id: 'first-time', question: 'What should a first-time visitor expect?', answer: null },
];

export const NAV_PRIMARY = [
  { name: 'About', href: '/about' },
  { name: 'Ministries', href: '/ministries' },
  { name: 'Sermons', href: '/sermons' },
  { name: 'Events', href: '/events' },
  { name: 'Visit', href: '/visit' },
] as const;

export const NAV_MORE = [
  { name: 'Children', href: '/children' },
  { name: 'Prayer', href: '/prayer-requests', hideFrom: 'xl' },
  { name: 'Books', href: '/books' },
  { name: 'Join Us', href: '/join' },
  { name: 'Contact', href: '/contact' },
] as const;
