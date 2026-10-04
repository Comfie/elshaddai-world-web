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
  'A Bible-believing, Spirit-filled community in Randburg, Johannesburg where people encounter God, grow in faith and discover their purpose.';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://church-crm-live.vercel.app')
).replace(/\/$/, '');

/** Weekly gatherings — taken from the existing site copy. */
export const SERVICES = [
  {
    id: 'sunday',
    name: 'Sunday Service',
    day: 'Sunday',
    times: ['9:00 AM', '11:00 AM'],
    summary: 'Main worship service',
  },
  {
    id: 'bible-study',
    name: 'Wednesday Bible Study',
    day: 'Wednesday',
    times: ['6:00 PM'],
    summary: 'Midweek teaching',
  },
  {
    id: 'prayer',
    name: 'Friday Prayer',
    day: 'Friday',
    times: ['7:00 PM'],
    summary: 'Corporate prayer',
  },
] as const;

export const SUNDAY_TIMES = SERVICES[0].times.join(' & ');

/**
 * Defaults for church contact details. The address comes from the existing
 * Contact page. The phone number that used to be shown (+27 12 345 6789) was
 * an obvious placeholder, so it is intentionally `null` until supplied.
 */
export const DEFAULT_CONTACT = {
  email: 'info@elshaddaiworld.org',
  phone: null as string | null,
  addressLines: ['5th Road, Northwold', 'Randburg, Gauteng', 'South Africa, 2188'],
};

/**
 * Photography slots. Drop real church photos into /public/images and set the
 * `src` (e.g. '/images/home-hero.jpg'). Until then, the designed placeholder
 * renders — it never pretends to be a photograph of real people.
 *
 * Recommended: landscape 2400×1400 for heroes, 1600×1200 for split sections,
 * JPEG/WebP under 400 KB. Keep faces/subjects in the centre-right of heroes.
 */
type Slot = { src: string | null; alt: string };

export const IMAGES = {
  homeHero: { src: null, alt: 'The El Shaddai congregation worshipping together' },
  welcome: { src: null, alt: 'Church family fellowshipping after the service' },
  community: { src: null, alt: 'El Shaddai members serving in the community' },
  finalCta: { src: null, alt: 'Worship at El Shaddai World Ministries' },
  visitHero: { src: null, alt: 'Guests being welcomed at El Shaddai World Ministries' },
  aboutHero: { src: null, alt: 'El Shaddai World Ministries congregation' },
  aboutStory: { src: null, alt: 'El Shaddai World Ministries church family' },
  aboutLeader: { src: null, alt: 'Apostle Charles Magaiza' },
  prayer: { src: null, alt: 'Hands raised in prayer' },
  giving: { src: null, alt: 'Generosity at work in the community' },
  stepVisit: { src: null, alt: 'A warm welcome for first-time guests' },
  stepGrow: { src: null, alt: 'Ministry members growing together' },
  stepPrayer: { src: null, alt: 'Praying together' },
  stepConnect: { src: null, alt: 'Church community connecting' },
  stepServe: { src: null, alt: 'Volunteers serving' },
} satisfies Record<string, Slot> as Record<string, Slot>;

export type ImageSlot = keyof typeof IMAGES;

/**
 * "Plan Your Visit" FAQ. `answer: null` means the church has not yet
 * confirmed the answer — the page shows a gracious fallback and flags the
 * item for administrators (see NeedsConfirmation).
 */
export const VISIT_FAQS: { id: string; question: string; answer: string | null }[] = [
  {
    id: 'arrive',
    question: 'What time should I arrive?',
    answer:
      'Our Sunday services begin at 9:00 AM and 11:00 AM. Arriving a little early gives you time to find a seat and be welcomed.',
  },
  { id: 'length', question: 'How long is a service?', answer: null },
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
  { name: 'Prayer', href: '/prayer-requests', hideFrom: 'xl' },
  { name: 'Books', href: '/books' },
  { name: 'Join Us', href: '/join' },
  { name: 'Contact', href: '/contact' },
] as const;
