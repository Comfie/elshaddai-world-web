# Public site redesign — handover notes

Scope: the **public marketing site only** (`app/(public)`, `components/public`, a few `lib/*` helpers).
Admin/CRM (`app/admin`, `app/(auth)`, `app/api`, `middleware.ts`, `prisma/`, `components/admin`, `components/ui`) is untouched.

## Design system

| Token | Value | Use |
|---|---|---|
| `ink-950/900/800` | `#0d0f12` / `#14171c` / `#1d2128` | dark sections, header, footer |
| `ivory` / `ivory-200` | `#f7f3ea` / `#f1ebdd` | page backgrounds |
| `gold` / `gold-light` | `#c8963e` / `#e0b25f` | accent on dark, primary buttons |
| `bronze` | `#8a5a12` | accent *text* on ivory (5.3:1 contrast) |
| `stone-600` | `#5f5a4f` | muted body copy (6.2:1 on ivory) |

Type: **Instrument Serif** (display, via `next/font`) + **Geist** (UI/body). Utilities: `display-xl/lg/md/sm`, `lead`, `kicker`, `wrap`, `section-y` (all in `app/globals.css`, public-scoped).
Light surfaces use the `on-light` focus ring (ink); dark surfaces use `on-dark` (gold).
All motion is disabled under `prefers-reduced-motion`.

## Where things live

- `lib/site-config.ts` — service times, default contact details, **image slots**, visit FAQ, nav. Edit this for static church facts.
- `lib/site-info.ts` — merges those defaults with the `Settings` table. Seed placeholders (e.g. `+27 XX XXX XXXX`, `Church Address Here`, `facebook.com/elshaddai`) are ignored automatically.
- `lib/public-data.ts` — read helpers for events/ministries/sermons. Presentation components never query Prisma directly.
- `components/public/*` — `SiteHeader`, `SiteFooter`, `PageHero`, `Photo`, `CtaLink`, `SectionHeader`, `ImageTextSection`, `FeaturedSermon`, `SermonCard`, `SermonLibrary`, `MinistryCard`, `EventCard`, `EventsBrowser`, `NextSteps`, `PrayerCTA`, `GivingCTA`, `PlanVisitCTA`, `LeadershipCard`, `Accordion`, `EmptyState`, form controls…
- New routes: `/visit`, `/events/[id]`, `/events/[id]/calendar.ics`, `/sitemap.xml`, `/robots.txt`.

## Adding real photography

There were no photographs in the repo, so every image surface renders a designed placeholder (never a fake photo of people).
To replace one: put a file in `public/images/` and set its `src` in `IMAGES` (`lib/site-config.ts`), e.g. `homeHero: { src: '/images/home-hero.jpg', alt: '…' }`.
Admin-entered images (ministry/event/sermon/book URLs) already flow through automatically and fall back to the placeholder if the URL fails.
Suggested sizes: heroes 2400×1400, split sections 1600×1200; JPEG/WebP under ~400 KB.

## Settings keys the site reads (table `Settings`)

`church_name`, `church_email`, `church_phone`, `church_address`, `facebook_url`, `instagram_url`, `youtube_url`,
and for giving: `give_online_url`, `bank_name`, `bank_account_name`, `bank_account_number`, `bank_branch_code`.
There is no admin UI for Settings yet, so these are edited in the database.

## ⚠ Content that needs church confirmation

In development builds these show an amber **"Needs confirmation"** tag; production hides the tag but the fallback wording is honest and non-committal.

| Item | Status / what was done |
|---|---|
| Phone number | Old site showed `+27 12 345 6789` (dummy). **Hidden** until `church_phone` is set. |
| Address | Footer said "123 Church Street, Pretoria"; Contact page said "5th Road, Northwold, Randburg 2188". Site now uses **Randburg** — please confirm. |
| Email `info@elshaddaiworld.org` | Kept (used site-wide, in seed). Confirm it is monitored. |
| Bank details | Old site showed account `1234567890` (dummy). **Hidden**; page says "contact the office" until `bank_*` Settings exist. |
| Online giving link | "Coming soon" until `give_online_url` is set. |
| Tax/non-profit wording (Give) | Existing copy kept. Legal claim — confirm registration & Section 18A receipts. |
| Social links | None are shown (seed values were demo). Appear automatically once real URLs are in Settings. |
| Leadership | Placeholder people (John Doe, Jane Smith, Mike Johnson) **removed**. One card for Apostle Charles Magaiza (already the default preacher/author in the CRM) — confirm title, bio, portrait. |
| Vision, mission, values, beliefs, "Our Story" | Existing copy retained — leadership should sign off. |
| Office hours (Contact) | Existing copy retained — confirm. |
| Visit page FAQ | Answered: arrival time. **Unanswered** (fallback shown): service length, parking, dress, arrival experience, children's ministry, accessibility, first-timer expectations. Fill `answer` in `VISIT_FAQS`. |
| Visit page: children's ministry & parking blocks | Generic invitation to ask; need real details. |
| Logo | No logo file exists; `components/public/logo.tsx` is a typographic wordmark. Swap in the real logo there. |

## Behaviour changes worth knowing about

- **Prayer form bug fixed (pre-existing).** The form sent `email: ""` when blank and the API rejects that (`z.string().email().optional()`), so anyone leaving email empty — including anonymous requests — got *"Invalid email address"*. The form now omits blank optional fields. API unchanged.
- Ministry cards/pages no longer show member counts or a leader's login email; they use the ministry's explicit `contactEmail/contactPhone` and `leaderName`.
- Events: "upcoming" now includes events happening *today* (previously dropped once the clock passed midnight-of-event). Dates render in `Africa/Johannesburg`.
- Books/sermon/event/ministry images use a plain `<img>` with a graceful fallback; `next/image` was failing for unknown remote hosts (no `remotePatterns`).
- Public pages are statically generated with ISR (`revalidate` 60–300 s) instead of being frozen at build time.
- `/contact` accepts `?topic=visitor|prayer|partnership|media` and `?subject=` to pre-fill the form.

## Known repo issue (not changed here)

`prisma/schema.prisma` has `MemberStatus.PENDING` (member self-registration) but **no migration** creates it — `prisma migrate deploy` on a fresh DB leaves `/api/members/register` broken. Production presumably used `db push`; a migration should be added.
