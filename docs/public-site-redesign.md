# Public site redesign — handover notes

Scope: the **public marketing site only** (`app/(public)`, `components/public`, a few `lib/*` helpers).
Admin/CRM (`app/admin`, `app/(auth)`, `app/api`, `middleware.ts`, `prisma/`, `components/admin`, `components/ui`) is untouched.

## Design system (blue-led El Shaddai identity)

Blue is the principal brand colour. Tokens live in `app/globals.css` (`@theme inline`) — use the semantic classes (`bg-brand-700`, `text-brand-navy` …), never raw hex.

| Token | Value | Use |
|---|---|---|
| `brand-navy` | `#071B3D` | deepest sections, header, footer, hero overlays |
| `brand-900` | `#0A2458` | midnight blue — dark section backgrounds |
| `brand-800` | `#0E3B8C` | between midnight and royal |
| `brand-700` | `#1252B8` | royal / brand blue — links, accent text on light, outline buttons |
| `brand-600` | `#1769E0` | strong cobalt — **primary buttons** (white text 5.1:1) |
| `brand-500` | `#3693F5` | bright blue — rules, indicators, accents on dark |
| `brand-300` | `#79B9FF` | sky — kickers / italic accents **on navy only** |
| `brand-200` | `#CFE2FB` | hairlines and borders |
| `brand-100` | `#EAF4FF` | pale-blue sections; secondary text on royal surfaces |
| `brand-50` | `#F5F9FF` | page tint |
| `ink` / `body` / `slate` / `mist` | `#172033` / `#475467` / `#667085` / `#B9C8E0` | charcoal text / paragraph / muted / muted-on-navy |
| `field` | `#7083A3` | input borders (3.9:1 on white) |

Contrast rules baked into the tokens: white on 600 = 5.1:1, 700 on 50 = 6.8:1, 300 on navy = 8.3:1. **Do not** put 300/500 text on 700 surfaces (3.5:1) — use `brand-100` or white there.
The palette was supplied in the brief; the church's Facebook page is login-walled so brand colours could not be sampled from it. If the official logo uses a different blue, change only the `--color-brand-*` values.

Type: **Instrument Serif** (display, via `next/font`) + **Geist** (UI/body). Buttons: `primary` (cobalt) → `outline-light`/`outline-dark` (secondary) → `text-*` (tertiary); `white` is for use on blue panels. All motion is disabled under `prefers-reduced-motion`.
Placeholders are blue (three tones — deep / royal / bright) with a faint ring motif; programme placeholders are typographic posters.

## Where things live

- `lib/site-config.ts` — **`WEEKLY_PROGRAM` (single source of truth for every recurring service time)**, verified Facebook URL, contact defaults, visit FAQ, nav. Components, footer, drawer, metadata, FAQ answers and JSON-LD (`openingHoursSpecification`) all render from it — never hard-code a time elsewhere.
- `lib/images.ts` + `scripts/generate-image-manifest.mjs` — photography slots (see below).
- `lib/children.ts` + `app/(public)/children/page.tsx` — the Children's Ministry page (see below).
- `lib/site-info.ts` — merges config with the `Settings` table. Seed placeholders (e.g. `+27 XX XXX XXXX`, `Church Address Here`, `facebook.com/elshaddai`) are ignored.
- `lib/public-data.ts` — read helpers for events/ministries/sermons.
- `components/public/*` — `SiteHeader`, `SiteFooter`, `HeroSection`, `ThisWeek`, `MorningManna`, `PrayerCTA`, `StayConnected`, `ProgrammeSurface`, `ProgrammePoster`, `TodayBadge`, `PageHero`, `Photo`, `CtaLink`, sermon/event/ministry components, forms…
- Routes: `/visit`, `/children`, `/events/[id]`, `/events/[id]/calendar.ics`, `/sitemap.xml`, `/robots.txt`, a branded 404 (`app/(public)/not-found.tsx`) plus the original public routes.

### Current weekly programme (verified by the church)

| Programme | Days | Time |
|---|---|---|
| Morning Prayer | Monday – Saturday | 5:00 AM – 6:00 AM |
| Morning Manna *with Apostle Juliana* | Monday – Friday | 6:00 AM – 6:30 AM |
| Sunday Morning Service | Every Sunday | 9:30 AM – 10:10 AM |
| Sunday Evening Service | Every Sunday | 7:00 PM – 10:00 PM |

Times are interpreted in South African time (Africa/Johannesburg). A small "Today" marker appears on items that run on the current day; it reflects the schedule only and never claims anything is live.

**How the weekday programmes are attended (confirmed by the church):** Morning Manna is streamed **live on the church Facebook page** (the site links there). Morning Prayer is **on Zoom** and the Zoom link is **shared in the church WhatsApp group** — the site deliberately never publishes the link; it shows "Ask how to join" which opens the contact form pre-filled. These live in the `access` field of `WEEKLY_PROGRAM`.
The earlier provisional schedule (two different Sunday times plus a midweek study and a Friday prayer meeting) and the Contact page office hours were removed everywhere — re-add anything to `WEEKLY_PROGRAM` only if the church confirms it. The seed (`prisma/seed.ts`) now generates its `service_times` Settings row from `WEEKLY_PROGRAM`; databases that were seeded earlier keep their old row (the public site does not read it, but it is worth updating by hand).

## Children's Ministry page (`/children`)

A full landing page designed to show the church values its children: a "Every child belongs here" hero, scripture (Mark 10:14, NIV), "our heart for children" (Loved / Taught / Known / Included), a "bring the whole family" block with the verified Sunday times and address, a parents' FAQ, upcoming children's events, a "serve with us" call, and an enquiry form that goes through the existing contact API (CRM `ContactMessage`, category *Visitor Information*). It is promoted on the homepage, at the top of `/ministries`, on `/visit`, in the footer, in the mobile menu and under **More** in the header.

**Photos and text are managed in the admin — no code changes.** Create (or rename) a Ministry in the admin called e.g. *Children's Ministry* (slug `childrens-ministry`; any ministry whose name contains "child" or "kids" is matched), tick *display on website*, then:

| Admin field | Appears on the page as |
|---|---|
| Banner image URL | hero photo |
| Image URL | homepage band + "bring the whole family" photo |
| Description | hero text |
| Vision / Mission | "Our heart" copy |
| Meeting day / time / location | "When & where" line + an extra FAQ answer |
| Leader name, contact email/phone | "Led by" + contact details |
| Events assigned to this ministry | "Coming up for children" |

Until photos exist, the image frames show designed typographic artwork (Loved. Taught. Known. Included.), which disappears automatically once a photo is set. An optional "moments" gallery appears if you drop `public/images/ministries/children/moment-1..3.jpg` in. The old `/ministries/<slug>` URL redirects to `/children`, and the ministry is not repeated in the ministries grid.

**No programme facts are invented.** The copy is framed as convictions and aims. Everything that needs the church's real details (ages, what happens on arrival, how children are kept safe, shy/first-time children) shows a warm "ask us" fallback until `answer` is filled in `CHILDREN_FAQS` (`lib/children.ts`) — **child-safety information in particular is something parents will look for; please supply it.**

## Adding real photography

There are no photographs in the repo, so every image surface renders a designed blue placeholder (never a fake photo of people). Filenames are listed in `public/images/README.md`
(`home/hero.jpg`, `programmes/morning-manna.jpg`, `programmes/morning-prayer.jpg`, `leadership/apostle-juliana.jpg`, …). Drop a file at the listed path and redeploy — the build scans `public/images` and uses it automatically; no code change and no 404s for missing files.
Admin-entered images (ministry/event/sermon/book URLs) keep working and take priority; `ministries|sermons|events/default.jpg` are optional fallbacks.

## Settings keys the site reads (table `Settings`)

`church_name`, `church_email`, `church_phone`, `church_address`, `church_maps_url` (a Google Maps share link for an exact pin — overrides the generated directions link), `facebook_url`, `instagram_url`, `youtube_url`,
and for giving: `give_online_url`, `bank_name`, `bank_account_name`, `bank_account_number`, `bank_branch_code`.
There is no admin UI for Settings yet, so these are edited in the database. The address (below) is built in; set `church_address` only to override it.

## ⚠ Content that needs church confirmation

In development builds these show an amber **"Needs confirmation"** tag; production hides the tag but the fallback wording is honest and non-committal.

| Item | Status / what was done |
|---|---|
| Phone number | Old site showed `+27 12 345 6789` (dummy). **Hidden** until `church_phone` is set. |
| Church address | **Confirmed**: "El Shaddai World Centre, Farmall, Chartwell, Fourways" (as given; no street number or postal code was invented). Shown in the footer, Visit, Contact and children's pages; powers Get-directions links, the map embeds and the structured-data address. Directions/maps search for the address text, so for an exact pin set `church_maps_url`. |
| Morning Prayer / Morning Manna access | **Confirmed**: Manna live on the church Facebook page; Prayer on Zoom with the link shared in the church WhatsApp group (link never published). |
| Apostle Juliana | **Confirmed**: wife of Apostle Charles Magaiza; Morning Manna is "with Apostle Juliana". Shown on About beside Apostle Charles. Still needed: her full name/title as she wishes it shown, a short bio and a portrait (`leadership/apostle-juliana.jpg`). |
| Email `info@elshaddaiworld.org` | Kept (used site-wide, in seed). Confirm it is monitored. |
| Bank details | Old site showed account `1234567890` (dummy). **Hidden**; page says "contact the office" until `bank_*` Settings exist. |
| Online giving link | "Coming soon" until `give_online_url` is set. |
| Tax/non-profit wording (Give) | Existing copy kept. Legal claim — confirm registration & Section 18A receipts. |
| Social links | **Facebook** (`https://www.facebook.com/ElShaddaiWorld`) is verified and shown. Instagram/YouTube stay hidden until real URLs are supplied. |
| Leadership | Placeholder people (John Doe, Jane Smith, Mike Johnson) stay **removed**. One card for Apostle Charles Magaiza (already the default preacher/author in the CRM) is retained — confirm title, bio, portrait. Apostle Juliana is treated as a separate person. |
| Vision, mission, values, beliefs, "Our Story" | Existing copy retained — leadership should sign off. |
| Office hours (Contact) | **Removed** (unverified, conflicted with the real programme). Re-add if confirmed. |
| Visit page FAQ | Answered from the programme: arrival, service length, weekday gatherings and where they take place. **Unanswered** (fallback shown): parking, dress, arrival experience, children's ministry specifics, accessibility, first-timer expectations. Fill `answer` in `VISIT_FAQS`. |
| **Children's ministry specifics** | Ages, what happens on arrival, **child-safety practices**, class times/venue, leader. The page is complete without them but parents will ask — fill `CHILDREN_FAQS` / the admin ministry record. The "Loved/Taught/Known/Included" wording is an aim statement for the ministry leader to confirm. |
| Visit page: children's ministry & parking blocks | Generic invitation to ask; need real details. |
| Logo | No logo file exists; `components/public/logo.tsx` is a typographic wordmark. Swap in the real logo there (and re-check the blue tokens against it). |

## Behaviour changes worth knowing about

- **Prayer form bug fixed (pre-existing).** The form sent `email: ""` when blank and the API rejects that (`z.string().email().optional()`), so anyone leaving email empty — including anonymous requests — got *"Invalid email address"*. The form now omits blank optional fields. API unchanged.
- Ministry cards/pages no longer show member counts or a leader's login email; they use the ministry's explicit `contactEmail/contactPhone` and `leaderName`.
- Events: "upcoming" now includes events happening *today* (previously dropped once the clock passed midnight-of-event). Dates render in `Africa/Johannesburg`.
- Books/sermon/event/ministry images use a plain `<img>` with a graceful fallback; `next/image` was failing for unknown remote hosts (no `remotePatterns`).
- Public pages are statically generated with ISR (`revalidate` 60–300 s) instead of being frozen at build time.
- `/contact` accepts `?topic=visitor|prayer|partnership|media` and `?subject=` to pre-fill the form.

## Known repo issue (not changed here)

`prisma/schema.prisma` has `MemberStatus.PENDING` (member self-registration) but **no migration** creates it — `prisma migrate deploy` on a fresh DB leaves `/api/members/register` broken. Production presumably used `db push`; a migration should be added.
