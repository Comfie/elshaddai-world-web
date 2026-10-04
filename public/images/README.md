# Church photography

Drop real photographs here using the filenames below, then redeploy. No code
changes are needed — `scripts/generate-image-manifest.mjs` runs before every
build and the site picks the files up automatically. Until a file exists, a
designed blue placeholder is shown.

Use real photos of the church only (no stock/AI people). Landscape JPEG/WebP,
under ~400 KB each. Keep faces in the centre/right of hero images.

| File | Where it appears | Suggested size |
|---|---|---|
| `home/hero.jpg` | Homepage hero | 2400×1400 |
| `home/worship.jpg` | Worship surfaces | 1600×1200 |
| `home/welcome.jpg` | "A place to belong" | 1600×1200 |
| `home/community.jpg`, `home/outreach.jpg` | Community section | 2400×1400 |
| `home/prayer.jpg`, `home/giving.jpg` | Prayer / giving sections | 1600×1200 |
| `home/invitation.jpg` | Closing invitation | 2400×1400 |
| `home/visit.jpg` | /visit hero | 2400×1400 |
| `home/steps/{visit,grow,prayer,connect,serve}.jpg` | "Next step" tiles | 1200×900 |
| `about/hero.jpg`, `about/story.jpg` | About page | 2400×1400 / 1600×1200 |
| `programmes/sunday-service.jpg` | Sunday programme | 1600×1200 |
| `programmes/morning-prayer.jpg` | Morning Prayer | 1600×1200 |
| `programmes/morning-manna.jpg` | Morning Manna | 1600×1200 |
| `leadership/apostle-juliana.jpg` | Morning Manna host portrait | 1200×1500 |
| `leadership/apostle-charles-magaiza.jpg` | About page leadership | 1200×1500 |
| `ministries/default.jpg`, `sermons/default.jpg`, `events/default.jpg` | Fallback artwork when a record has no image | 1600×1000 |

Ministry, sermon and event images entered in the admin keep working as before
(they are stored as URLs in the database and take priority over these defaults).
