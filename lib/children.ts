import { prisma } from '@/lib/db';
import { safeQuery } from '@/lib/public-data';
import { startOfTodayZA } from '@/lib/format';

/**
 * Children's Ministry — content is DATA-DRIVEN from the CRM.
 *
 * Create (or rename) a Ministry in the admin called e.g. "Children's Ministry"
 * and tick "display on website". The /children page then uses its:
 *   imageUrl / bannerUrl  → the page's photos (update them any time in the admin)
 *   description           → hero text
 *   vision / mission      → "Our heart" copy (falls back to the default wording below)
 *   leaderName / contact* → "Led by" and contact details
 *   meetingDay/Time/Location → "When & where"
 *   events                → upcoming children's events
 *
 * Matching is by slug (childrens-ministry, children, kids …) OR by a name
 * containing "child" / "kids", so existing naming just works. With no record
 * at all the page still renders fully using the wording below.
 */
export const CHILDREN_SLUGS = ['childrens-ministry', 'children', 'childrens', 'kids', 'kids-church', 'childrens-church'];

export const isChildrenMinistry = (m: { slug: string; name: string }) =>
  CHILDREN_SLUGS.includes(m.slug) || /child|kids/i.test(m.name);

export const getChildrenMinistry = () =>
  safeQuery(
    () =>
      prisma.ministry.findFirst({
        where: {
          isActive: true,
          displayOnWebsite: true,
          OR: [
            { slug: { in: CHILDREN_SLUGS } },
            { name: { contains: 'child', mode: 'insensitive' } },
            { name: { contains: 'kids', mode: 'insensitive' } },
          ],
        },
        orderBy: { sortOrder: 'asc' },
        include: {
          leader: { select: { name: true } },
          events: {
            where: { eventDate: { gte: startOfTodayZA() }, status: 'SCHEDULED', displayOnWebsite: true },
            orderBy: { eventDate: 'asc' },
            take: 6,
          },
        },
      }),
    null,
  );

/** Scripture (NIV) — the foundation of the page. */
export const CHILDREN_SCRIPTURE = {
  quote:
    'Let the little children come to me, and do not hinder them, for the kingdom of God belongs to such as these.',
  reference: 'Mark 10:14',
};

/**
 * Our heart for children — framed as convictions/aims, NOT as claims about
 * specific programmes. The children's ministry leader should confirm the wording.
 */
export const CHILDREN_PILLARS = [
  { word: 'Loved.', body: 'Every child hears, in words and in action, that God loves them.' },
  { word: 'Taught.', body: 'The Bible shared in ways children can understand, enjoy and remember.' },
  { word: 'Known.', body: 'A place where children are seen, welcomed and called by name.' },
  { word: 'Included.', body: 'A community of friends and caring adults who help faith grow together.' },
];

/** Parent questions. `answer: null` = not confirmed yet → graceful "ask us" fallback + dev flag. */
export const CHILDREN_FAQS: { id: string; question: string; answer: string | null }[] = [
  { id: 'welcome', question: 'Can I bring my children to your Sunday services?', answer: 'Yes — families are very welcome at both of our Sunday services.' },
  { id: 'ages', question: 'What ages is the children’s ministry for?', answer: null },
  { id: 'arrive', question: 'What happens when I arrive with my child?', answer: null },
  { id: 'safe', question: 'How are children kept safe and cared for?', answer: null },
  { id: 'shy', question: 'What if my child is shy or has never been to church?', answer: null },
];
