# Image sources

| File | Source | Status |
| --- | --- | --- |
| ecm-logo.png | ECM's own logo, copied from the live ecmhawaii.com builder site | ECM's brand. Use approved by Ellard for the draft 2026-11-21. Jesse to send the original file (Answer Sheet row 22). |
| hero-diamond-head.jpg | Hero photo on the live ecmhawaii.com builder site | Origin unknown (ECM, bought, or downloaded). **Not used since 2026-11-23** (hero is now projects/hawaii-island-new-home-exterior-2.jpg). Kept in the repo; not imported anywhere. |

## Placeholder photos (hotlinked, draft only)

Unsplash License (free to use). Each page was checked as a "Free Photo" page by the PM on 2026-11-21. Shown on the site with a visible "Sample photo" tag. Never captioned as ECM work. All slots are set in `src/content/images.ts`. Replace every row before launch; `npm run check:launch` fails while any remain.

v3 (2026-11-22): only the four slots with no matching ECM photo still use stock.

**2026-11-23: all stock retired.** No Unsplash photo is used anywhere, the `unsplash` and `stock` helpers are removed from `src/content/images.ts`, and `images.unsplash.com` is removed from the CSP in `public/_headers`.

| Slot | URL | Used on (v3) | Status |
| --- | --- | --- | --- |
| home | https://images.unsplash.com/photo-1791882895731-a46380dc545e | Not used since 2026-11-23 (slot now hawaii-island-new-home-great-room-1) | Retired |
| adu | https://images.unsplash.com/photo-1774847408513-bebd160c419a | Not used since 2026-11-23 (slot now waianae-addition-siding-done) | Retired |
| kitchen | https://images.unsplash.com/photo-1617228069096-4638a7ffc906 | Not used since 2026-11-23 (slot now mililani-kitchen-1) | Retired |
| bathroom | https://images.unsplash.com/photo-1763485956310-55f3c0e822d5 | Not used since 2026-11-23 (slot now waianae-bathroom-after-1) | Retired |
| commercial | https://images.unsplash.com/photo-1758448500688-3ababa93fd67 | Not used in v3 (replaced by ECM Longs Drugs photos) | Retired |
| framing | https://images.unsplash.com/photo-1777105939822-21228c81916d | Not used in v3 | Retired |
| crew | https://images.unsplash.com/photo-1587582423116-ec07293f0395 | Not used in v3 (replaced by ECM job site photos) | Retired |

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

## Where the ECM job photos are used (v3, 2026-11-22)

All through Astro's Image component (resized, WebP). Slot names are in `src/content/images.ts`.

| File | Slot | Used on |
| --- | --- | --- |
| projects/acs-hope-lodge-exterior.jpg | acsExterior | /portfolio gallery (card size only) |
| projects/acs-hope-lodge-sign.jpg | acsSign | Home featured project card, home slider, /portfolio |
| projects/acs-hope-lodge-ceiling-repair-1.jpg, -2.jpg | acsCeiling1, acsCeiling2 | /portfolio gallery |
| projects/acs-hope-lodge-pergola-1.jpg | pergola1 | Home slider, /about photo, /portfolio gallery |
| projects/acs-hope-lodge-pergola-2.jpg | pergolaView | Home full-width photo band, /portfolio gallery |
| projects/bamboo-floor-before.jpg, bamboo-floor-after.jpg | bambooBefore, bambooAfter | /portfolio before and after slider; after also on home (Remodels, featured card, slider) and the /remodeling photo hero |
| projects/driveway-salt-lake-before.jpg, driveway-salt-lake-during.jpg | drivewayBefore, drivewayDuring | /portfolio before and during slider (no finished photo on file); during also in the home slider |
| projects/concrete-walkway-1.jpg, -2.jpg, -3.jpg | walk1, walk2, walk3 | /portfolio gallery; walk3 in the home slider |
| projects/longs-drip-edge-before.jpg, -after.jpg | longsBefore, longsAfter | /portfolio gallery; after in the home slider |
| projects/longs-drip-edge-1.jpg, -3.jpg | longs1, longsSign | /portfolio gallery |
| projects/longs-drip-edge-2.jpg | longsStore | Home Commercial service, featured card, slider; /commercial-tenant-improvements photo hero |
| hero-diamond-head.jpg | hero | Home hero and share card (still unconfirmed, see above) |

## ECM job photos from Bleys Wright's flips (2026-11-23)

Two residential jobs ECM built for Bleys Wright's real estate investing projects. Bleys owns all of these photos and approved ECM using them on its website; staging in the finished photos was real furniture, not digital (Bleys via Ellard, 2026-11-23; ECM Standing Decision). Construction and before photos are phone shots; finished photos are the listing photos Bleys commissioned. Copied by the PM from Bleys's OneDrive with Ellard's go-ahead. Renamed so no street address appears, camera metadata (including any GPS location) stripped, long edge capped at 2400px. One truck licence plate blurred (waianae-addition-roof.jpg). One exterior cropped to remove a third party's phone number (waianae-addition-siding-done.jpg). Left out: the aerial of the finished house (makes the home easy to locate) and a shot with a worker's face.

| File | Job | Status |
| --- | --- | --- |
| projects/waianae-remodel-exterior-before-1.jpg, -2.jpg | Waianae, Oahu: whole house remodel plus new addition with a second unit | ECM job, before |
| projects/waianae-remodel-demo.jpg | Same job, demolition | ECM job, during |
| projects/waianae-addition-framing-1.jpg, -2.jpg, -3.jpg | Same job, addition framing | ECM job, during |
| projects/waianae-addition-roof.jpg, waianae-addition-house-wrap.jpg, waianae-addition-siding-done.jpg | Same job, addition roofed, wrapped, sided | ECM job, during |
| projects/waianae-kitchen-before-1.jpg, -2.jpg | Same job, original kitchen | ECM job, before |
| projects/waianae-kitchen-after-1.jpg, -2.jpg, -3.jpg | Same job, new kitchen | ECM job, after (listing photo, staged) |
| projects/waianae-bathroom-before-1.jpg, -2.jpg | Same job, original bathroom | ECM job, before |
| projects/waianae-bathroom-after-1.jpg, -2.jpg, waianae-bathroom-vanity-after.jpg, waianae-shower-after.jpg | Same job, new bathrooms | ECM job, after (listing photo, staged) |
| projects/waianae-second-unit-kitchenette-1.jpg, -2.jpg | Same job, kitchenette in the second unit | ECM job, after (listing photo, staged). Describe as a second unit unless Jesse confirms it was permitted as an ADU or ohana |
| projects/mililani-remodel-living-room.jpg, mililani-remodel-dining-kitchen.jpg | Mililani, Oahu: whole house remodel | ECM job, after (listing photo, staged) |
| projects/mililani-kitchen-1.jpg, -2.jpg | Same job, kitchen | ECM job, after (listing photo, staged) |
| projects/mililani-bathroom-1.jpg, -2.jpg | Same job, bathrooms | ECM job, after (listing photo, staged) |

## Where the Waianae and Mililani photos are used (2026-11-23)

All through Astro's Image component. Slot keys in `src/content/images.ts` are the file names (without .jpg), plus the service slots named below.

| File | Used on |
| --- | --- |
| projects/waianae-remodel-exterior-before-1.jpg | /portfolio, Waianae gallery ("Before") |
| projects/waianae-remodel-demo.jpg | /portfolio, Waianae gallery ("During demolition") |
| projects/waianae-addition-framing-1.jpg | /portfolio, Waianae gallery ("Addition framing") |
| projects/waianae-addition-framing-3.jpg | /portfolio, Waianae gallery ("Addition framing"); home slider |
| projects/waianae-addition-house-wrap.jpg | /portfolio, Waianae gallery ("Addition wrapped") |
| projects/waianae-addition-siding-done.jpg | `adu` slot: home services list (ADUs and additions), /adu-oahu photo header; /portfolio, Waianae gallery ("Addition sided") |
| projects/waianae-kitchen-before-1.jpg | /portfolio, Waianae gallery ("Kitchen before") |
| projects/waianae-kitchen-after-1.jpg | /portfolio, Waianae card cover and gallery ("Kitchen after"); home featured project card; home slider |
| projects/waianae-bathroom-before-1.jpg | /portfolio, Waianae gallery ("Bathroom before") |
| projects/waianae-shower-after.jpg | /portfolio, Waianae gallery ("Bathroom after") |
| projects/waianae-bathroom-after-1.jpg | `bathroom` slot: /remodeling, Bathroom remodels section; /portfolio, Waianae gallery ("Bathroom after") |
| projects/waianae-second-unit-kitchenette-1.jpg | /portfolio, Waianae gallery ("Second unit kitchenette") |
| projects/mililani-kitchen-1.jpg | `kitchen` slot: /remodeling, Kitchen remodels section; home services list (Remodels); /portfolio, Mililani card cover; home slider |
| projects/mililani-remodel-living-room.jpg | /portfolio, Mililani gallery ("Living room") |
| projects/mililani-remodel-dining-kitchen.jpg | /portfolio, Mililani gallery ("Dining and kitchen") |
| projects/mililani-kitchen-2.jpg | /portfolio, Mililani gallery ("Kitchen") |
| projects/mililani-bathroom-1.jpg, mililani-bathroom-2.jpg | /portfolio, Mililani gallery ("Bathroom") |
| projects/waianae-remodel-exterior-before-2.jpg, waianae-addition-framing-2.jpg, waianae-addition-roof.jpg, waianae-kitchen-before-2.jpg, waianae-kitchen-after-2.jpg, waianae-kitchen-after-3.jpg, waianae-bathroom-before-2.jpg, waianae-bathroom-after-2.jpg, waianae-bathroom-vanity-after.jpg, waianae-second-unit-kitchenette-2.jpg | Registered in images.ts with alt text, not placed on a page yet |

## ECM job photos from Bleys Wright's flips, set 2 (2026-11-23)

Same source and terms as the set above: Bleys owns the photos, approved website use, staging was real furniture, and ECM built these jobs (Bleys via Ellard, 2026-11-23; ECM Standing Decision). All are the listing photos Bleys commissioned. Renamed so no street address appears, metadata stripped, long edge capped at 2400px. Checked for faces, plates and third party phone numbers: none found. Note: the files marked 1067px are the largest versions in Bleys's folder.

| File | Job | Status |
| --- | --- | --- |
| projects/hawaii-island-new-home-exterior-1.jpg | New single family home, Puna district, Hawaii Island | ECM job, finished. 1067px wide only |
| projects/hawaii-island-new-home-exterior-2.jpg, -3.jpg | Two more new single family homes, same area | ECM job, finished. 2400px |
| projects/hawaii-island-new-home-exterior-4.jpg | Another new home, same area | ECM job, finished. 1067px wide only |
| projects/hawaii-island-new-home-entry.jpg | Entry porch of a new home | ECM job, finished. 2400px |
| projects/hawaii-island-new-home-great-room-1.jpg | Great room and kitchen | ECM job, finished, staged. 2400px |
| projects/hawaii-island-new-home-great-room-2.jpg, hawaii-island-new-home-living-dining.jpg | Great room, living and dining | ECM job, finished, staged. 1067px wide only |
| projects/hawaii-island-new-home-kitchen-1.jpg | Kitchen | ECM job, finished, staged. 2400px |
| projects/hawaii-island-new-home-kitchen-2.jpg, -3.jpg | Kitchens | ECM job, finished, staged. 1067px wide only |
| projects/hawaii-island-new-home-bathroom-1.jpg, hawaii-island-new-home-shower.jpg, hawaii-island-new-home-double-vanity.jpg | Bathrooms | ECM job, finished, staged. 1067px wide only |
| projects/hawaii-island-new-home-barn-door.jpg | Interior barn door detail | ECM job, finished. 2400px |
| projects/waianae-remodel-2-kitchen.jpg, waianae-remodel-2-shower.jpg | A second Waianae, Oahu home remodel (not the remodel and addition above) | ECM job, finished, staged. 2400px |

## Where the set 2 photos are used (2026-11-23)

| File | Used on |
| --- | --- |
| projects/hawaii-island-new-home-exterior-2.jpg | **Home hero and share card (og:image, twitter:image)**; /portfolio, Hawaii Island card cover |
| projects/hawaii-island-new-home-exterior-1.jpg | /portfolio, Hawaii Island gallery ("New home"). Not the hero: only 1067px wide, soft when stretched to desktop widths |
| projects/hawaii-island-new-home-exterior-3.jpg, -4.jpg | /portfolio, Hawaii Island gallery ("New home") |
| projects/hawaii-island-new-home-entry.jpg | /portfolio, Hawaii Island gallery ("Entry porch") |
| projects/hawaii-island-new-home-great-room-1.jpg | `home` slot: /custom-homes photo header, home services list (Custom homes); /portfolio, Hawaii Island gallery ("Great room and kitchen") |
| projects/hawaii-island-new-home-living-dining.jpg | /portfolio, Hawaii Island gallery ("Living and dining") |
| projects/hawaii-island-new-home-kitchen-1.jpg | Home slider; /portfolio, Hawaii Island gallery ("Kitchen") |
| projects/hawaii-island-new-home-kitchen-3.jpg | /portfolio, Hawaii Island gallery ("Kitchen") |
| projects/hawaii-island-new-home-bathroom-1.jpg | /portfolio, Hawaii Island gallery ("Bathroom") |
| projects/hawaii-island-new-home-shower.jpg | /portfolio, Hawaii Island gallery ("Shower and tub") |
| projects/hawaii-island-new-home-double-vanity.jpg | /portfolio, Hawaii Island gallery ("Double vanity") |
| projects/hawaii-island-new-home-barn-door.jpg | /portfolio, Hawaii Island gallery ("Barn door detail") |
| projects/waianae-remodel-2-kitchen.jpg | /portfolio, Waianae home remodel card cover and gallery ("Kitchen") |
| projects/waianae-remodel-2-shower.jpg | /portfolio, Waianae home remodel gallery ("Shower") |
| projects/hawaii-island-new-home-great-room-2.jpg, hawaii-island-new-home-kitchen-2.jpg | Registered in images.ts with alt text, not placed on a page yet |
