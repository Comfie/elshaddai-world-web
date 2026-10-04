import { AVAILABLE_IMAGES } from '@/lib/image-manifest.generated';

/**
 * Photography slots. Each slot maps to a sensible filename under
 * public/images/. When that file exists at build time (see
 * scripts/generate-image-manifest.mjs) it is used automatically; otherwise a
 * designed blue placeholder renders. No code changes are needed to add a photo.
 */
type SlotDef = { file: string; alt: string };

export const IMAGE_SLOTS = {
  // Home
  homeHero: { file: 'home/hero.jpg', alt: 'The El Shaddai congregation worshipping together' },
  worship: { file: 'home/worship.jpg', alt: 'Worship at El Shaddai World Ministries' },
  welcome: { file: 'home/welcome.jpg', alt: 'Church family fellowshipping together' },
  community: { file: 'home/community.jpg', alt: 'El Shaddai members in the community' },
  outreach: { file: 'home/outreach.jpg', alt: 'El Shaddai outreach' },
  prayer: { file: 'home/prayer.jpg', alt: 'Hands raised in prayer' },
  giving: { file: 'home/giving.jpg', alt: 'Generosity at work in the community' },
  finalCta: { file: 'home/invitation.jpg', alt: 'Worship at El Shaddai World Ministries' },
  visitHero: { file: 'home/visit.jpg', alt: 'Guests being welcomed at El Shaddai World Ministries' },
  stepVisit: { file: 'home/steps/visit.jpg', alt: 'A warm welcome for first-time guests' },
  stepGrow: { file: 'home/steps/grow.jpg', alt: 'Ministry members growing together' },
  stepPrayer: { file: 'home/steps/prayer.jpg', alt: 'Praying together' },
  stepConnect: { file: 'home/steps/connect.jpg', alt: 'Church community connecting' },
  stepServe: { file: 'home/steps/serve.jpg', alt: 'Volunteers serving' },

  // About
  aboutHero: { file: 'about/hero.jpg', alt: 'El Shaddai World Ministries congregation' },
  aboutStory: { file: 'about/story.jpg', alt: 'El Shaddai World Ministries church family' },

  // Weekly programme
  sundayService: { file: 'programmes/sunday-service.jpg', alt: 'A Sunday service at El Shaddai' },
  morningPrayer: { file: 'programmes/morning-prayer.jpg', alt: 'Morning Prayer' },
  morningManna: { file: 'programmes/morning-manna.jpg', alt: 'Morning Manna' },

  // People (only add once the church confirms and supplies the photo)
  apostleJuliana: { file: 'leadership/apostle-juliana.jpg', alt: 'Apostle Juliana' },
  aboutLeader: { file: 'leadership/apostle-charles-magaiza.jpg', alt: 'Apostle Charles Magaiza' },

  // Fallback artwork for records that have no image of their own
  ministryDefault: { file: 'ministries/default.jpg', alt: '' },
  sermonDefault: { file: 'sermons/default.jpg', alt: '' },
  eventDefault: { file: 'events/default.jpg', alt: '' },
} satisfies Record<string, SlotDef>;

export type ImageSlot = keyof typeof IMAGE_SLOTS;

const available = new Set(AVAILABLE_IMAGES);

export function resolveSlot(slot: ImageSlot): { src: string | null; alt: string } {
  const def: SlotDef = IMAGE_SLOTS[slot];
  return { src: available.has(def.file) ? `/images/${def.file}` : null, alt: def.alt };
}

export const slotHasImage = (slot: ImageSlot) => resolveSlot(slot).src !== null;
