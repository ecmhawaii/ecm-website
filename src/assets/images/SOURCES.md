# Image sources

| File | Source | Status |
| --- | --- | --- |
| ecm-logo.png | ECM's own logo, copied from the live ecmhawaii.com builder site | ECM's brand. Use approved by Ellard for the draft 2026-11-21. Jesse to send the original file (Answer Sheet row 22). |
| hero-diamond-head.jpg | Hero photo on the live ecmhawaii.com builder site | Origin unknown (ECM, bought, or downloaded). Draft use only until Jesse confirms (Answer Sheet row 22). Swap before launch if not confirmed. Also used for the share card (og:image). |

## Placeholder photos (hotlinked, draft only)

Unsplash License (free to use). Each page was checked as a "Free Photo" page by the PM on 2026-11-21. Shown on the site with a visible "Sample photo" tag. Never captioned as ECM work. All slots are set in `src/content/images.ts`. Replace every row before launch; `npm run check:launch` fails while any remain.

| Slot | URL | Status |
| --- | --- | --- |
| home | https://images.unsplash.com/photo-1791882895731-a46380dc545e | PLACEHOLDER |
| adu | https://images.unsplash.com/photo-1774847408513-bebd160c419a | PLACEHOLDER |
| kitchen | https://images.unsplash.com/photo-1617228069096-4638a7ffc906 | PLACEHOLDER |
| bathroom | https://images.unsplash.com/photo-1763485956310-55f3c0e822d5 | PLACEHOLDER |
| commercial | https://images.unsplash.com/photo-1758448500688-3ababa93fd67 | PLACEHOLDER |
| framing | https://images.unsplash.com/photo-1777105939822-21228c81916d | PLACEHOLDER |
| crew | https://images.unsplash.com/photo-1587582423116-ec07293f0395 | PLACEHOLDER |

Every image added to the site gets a row here: file, where it came from, licence, and whether it is a placeholder.

## ECM job photos (from the live ecmhawaii.com portfolio, 2026-11-21)

ECM's own job photos, copied from the live builder site by the PM with Ellard's go-ahead (Jesse's work, partners agreement). Renamed so no homeowner names appear, phone camera metadata (including any GPS location) stripped, long edge capped at 2400px. Groupings follow the live site's portfolio captions; where a photo's job is not stated it is marked "job unconfirmed".

| File | Job (per live site) | Status |
| --- | --- | --- |
| projects/acs-hope-lodge-exterior.jpg | American Cancer Society Hope Lodge, Honolulu | ECM job. Small (709px wide): use only at card size |
| projects/acs-hope-lodge-sign.jpg | American Cancer Society Hope Lodge | ECM job |
| projects/acs-hope-lodge-ceiling-repair-1.jpg, -2.jpg | Hope Lodge interior restoration and ceiling work | ECM job (grouping per live site order) |
| projects/acs-hope-lodge-pergola-1.jpg, -2.jpg | Hope Lodge aluminum pergola system | ECM job (grouping per live site order) |
| projects/concrete-walkway-1.jpg, -2.jpg, -3.jpg | Concrete walkway in a garden courtyard | ECM job, which project unconfirmed |
| projects/bamboo-floor-before.jpg, bamboo-floor-after.jpg | Bamboo floor remodel, Kaneohe residence | ECM job, before and after |
| projects/driveway-salt-lake-before.jpg, driveway-salt-lake-during.jpg | Concrete driveway and walkway, Salt Lake residence | ECM job, before and during |
| projects/longs-drip-edge-before.jpg, longs-drip-edge-after.jpg, longs-drip-edge-1/2/3.jpg | Longs Drugs stores, Oahu: metal drip edge replacement | ECM job |

Not imported, on purpose:
- "Hawaii Residential" photo on the live home page: an Unsplash stock photo, not ECM work.
- long-s-drug-store-support-commercial-oahu-honolulu-drip-edge: carries an "AI-generated content" mark, so it is not a real job photo.
- longs-drug-pali-outside (night storefront) and projects.png: origin unknown, may not be ECM's own photos.
- acs-logo: no longer on the server (404). ACS is named in text only, no logo.
