# Image sources

| File | Source | Status |
| --- | --- | --- |
| ecm-logo.png | ECM's own logo, copied from the live ecmhawaii.com builder site | ECM's brand. Use approved by Ellard for the draft 2026-11-21. Jesse to send the original file (Answer Sheet row 22). |
| hero-diamond-head.jpg | Hero photo on the live ecmhawaii.com builder site | Origin unknown (ECM, bought, or downloaded). Retired 2026-11-23 (hero is now projects/hawaii-island-new-home-exterior-2.jpg) and **deleted from the repo 2026-11-24** (pre-launch audit finding 23). |

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
| projects/acs-hope-lodge-exterior.jpg | American Cancer Society Hope Lodge, Honolulu | ECM job. Small (709px wide): card size only. It was the /commercial-tenant-improvements header for one build on 2026-11-25 and looked soft at 1440, so the header went back to acs-hope-lodge-sign.jpg until a full size building photo arrives (Ellard) |
| projects/acs-hope-lodge-sign.jpg | American Cancer Society Hope Lodge | ECM job |
| projects/acs-hope-lodge-ceiling-repair-1.jpg, -2.jpg | Hope Lodge interior restoration and ceiling work | ECM job (grouping per live site order) |
| projects/acs-hope-lodge-pergola-2.jpg | Hope Lodge aluminum pergola system | ECM job (grouping per live site order). The install photo acs-hope-lodge-pergola-1.jpg was removed from the site and deleted from the repo 2026-11-25 (Ellard) |
| projects/concrete-walkway-1.jpg, -2.jpg, -3.jpg | Concrete walkway in a garden courtyard | ECM job, which project unconfirmed |
| projects/bamboo-floor-before.jpg, bamboo-floor-after.jpg | Bamboo floor remodel, Kaneohe residence | ECM job, before and after |
| projects/bamboo-floor-after-aligned.jpg | Same job. Made 2026-11-25 from bamboo-floor-after.jpg so it lines up with the before photo: Pillow LANCZOS resize x1.46 to 1775x3153, crop box (507, 105, 1723, 2265), JPEG quality 85, progressive, no EXIF (Ellard approved the PM preview) | ECM job, after. Used only as the "after" in the bamboo compare slider |
| projects/driveway-salt-lake-before.jpg, driveway-salt-lake-during.jpg | Concrete driveway and walkway, Salt Lake residence | ECM job, before and during |
| projects/driveway-salt-lake-before-aligned.jpg | Same job. Made 2026-11-25 from driveway-salt-lake-before.jpg so it lines up with the during photo: Pillow LANCZOS resize to 1398x2484, crop box (92, 262, 1308, 2422), JPEG quality 85, progressive, no EXIF (Ellard approved the PM preview) | ECM job, before. Used only as the "before" in the driveway compare slider |
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
| projects/acs-hope-lodge-exterior.jpg | acsExterior | /portfolio, Hope Lodge gallery only (native 709px, no server crop) |
| projects/acs-hope-lodge-sign.jpg | acsSign | /portfolio, Hope Lodge gallery only (since 2026-11-27). The cover, the commercial header and the Commercial service moved to edited copies (see "Edited copies") |
| projects/acs-hope-lodge-ceiling-repair-1.jpg, -2.jpg | acsCeiling1, acsCeiling2 | /portfolio gallery |
| projects/acs-hope-lodge-pergola-2.jpg | pergolaView | Not placed since 2026-11-27 (its edited copy is the Hope Lodge cover and the commercial header; the gallery shows the sign photo instead, so the pergola never shows twice on /portfolio) |
| projects/bamboo-floor-before.jpg, bamboo-floor-after.jpg | bambooBefore, bambooAfter | before: /portfolio compare slider; after: Kaneohe card cover. The /remodeling header uses mililani-remodel-living-room.jpg since 2026-11-27 (the bamboo edit was rejected) |
| projects/bamboo-floor-after-aligned.jpg | bambooAfterAligned | /portfolio compare slider ("after") only |
| projects/driveway-salt-lake-before.jpg, driveway-salt-lake-during.jpg | drivewayBefore, drivewayDuring | before: registered, not placed (the slider uses the aligned copy); during: /portfolio compare slider and the home slider |
| projects/driveway-salt-lake-before-aligned.jpg | drivewayBeforeAligned | /portfolio compare slider ("before") only |
| projects/concrete-walkway-1.jpg, -2.jpg, -3.jpg | walk1, walk2 | walk2: Concrete walkway portfolio card cover (since 2026-11-25), its gallery and the home slider ("From the job site"); walk1: its gallery. concrete-walkway-3.jpg is NOT USED anywhere (not registered in images.ts) because two crew faces are clearly readable (Ellard, 2026-11-25) |
| projects/longs-drip-edge-before.jpg, -after.jpg | longsBefore, longsAfter | /portfolio gallery. Since 2026-11-25 no longer in the home slider |
| projects/longs-drip-edge-1.jpg, -3.jpg | longs1, longsSign | /portfolio gallery |
| projects/longs-drip-edge-2.jpg | longsStore | Longs Drugs portfolio card cover. Not a home featured card since 2026-11-27; its edited copy is the home Commercial service image and the Commercial service card |

## ECM job photos from a repeat client's investment properties (2026-11-23)

Two residential jobs ECM built for a repeat client's investment properties. The client owns all of these photos and approved ECM using them on its website; staging in the finished photos was real furniture, not digital (the client via Ellard, 2026-11-23; ECM Standing Decision). Construction and before photos are phone shots; finished photos are the listing photos the client commissioned. Copied by the PM from the client's OneDrive with Ellard's go-ahead. Renamed so no street address appears, camera metadata (including any GPS location) stripped, long edge capped at 2400px. One truck licence plate blurred (waianae-addition-roof.jpg). One exterior cropped to remove a third party's phone number (waianae-addition-siding-done.jpg). Left out: the aerial of the finished house (makes the home easy to locate) and a shot with a worker's face.

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
| projects/waianae-remodel-demo.jpg | /portfolio, Waianae gallery ("During demolition"); home slider |
| projects/waianae-addition-framing-1.jpg | /portfolio, Waianae gallery ("Addition framing"); home slider |
| projects/waianae-addition-framing-3.jpg | /portfolio, Waianae gallery ("Addition framing"); home slider |
| projects/waianae-addition-house-wrap.jpg | /portfolio, Waianae gallery ("Addition wrapped"); home slider |
| projects/waianae-addition-framing-2.jpg, waianae-addition-roof.jpg | Home slider (since 2026-11-25). The truck plate in waianae-addition-roof.jpg is blurred in the file |
| projects/waianae-addition-siding-done.jpg | /portfolio, Waianae gallery ("Addition sided"). The `adu` slot (home services list, /adu-oahu header, the ADU panel card on /services) uses the edited copy since 2026-11-27 |
| projects/waianae-kitchen-before-1.jpg | /portfolio, Waianae gallery ("Kitchen before") |
| projects/waianae-kitchen-after-1.jpg | /portfolio, Waianae card cover and gallery ("Kitchen after"); home featured project card. Since 2026-11-25 no longer in the home slider |
| projects/waianae-bathroom-before-1.jpg | /portfolio, Waianae gallery ("Bathroom before") |
| projects/waianae-shower-after.jpg | /portfolio, Waianae gallery ("Bathroom after") |
| projects/waianae-bathroom-after-1.jpg | `bathroom` slot: /remodeling, Bathroom remodels section; /portfolio, Waianae gallery ("Bathroom after") |
| projects/waianae-second-unit-kitchenette-1.jpg | /portfolio, Waianae gallery ("Second unit kitchenette") |
| projects/mililani-kitchen-1.jpg | `kitchen` slot: /remodeling, Kitchen remodels section; home services list (Remodels); /portfolio, Mililani card cover. Since 2026-11-25 no longer in the home slider |
| projects/mililani-remodel-living-room.jpg | /portfolio, Mililani gallery ("Living room"); /remodeling header since 2026-11-27 |
| projects/mililani-remodel-dining-kitchen.jpg | /portfolio, Mililani gallery ("Dining and kitchen") |
| projects/mililani-kitchen-2.jpg | /portfolio, Mililani gallery ("Kitchen") |
| projects/mililani-bathroom-1.jpg, mililani-bathroom-2.jpg | /portfolio, Mililani gallery ("Bathroom") |
| projects/waianae-remodel-exterior-before-2.jpg, waianae-kitchen-before-2.jpg, waianae-kitchen-after-2.jpg, waianae-kitchen-after-3.jpg, waianae-bathroom-before-2.jpg, waianae-bathroom-after-2.jpg, waianae-bathroom-vanity-after.jpg, waianae-second-unit-kitchenette-2.jpg | Registered in images.ts with alt text, not placed on a page yet |

## ECM job photos from a repeat client's investment properties, set 2 (2026-11-23)

Same source and terms as the set above: the client owns the photos, approved website use, staging was real furniture, and ECM built these jobs (the client via Ellard, 2026-11-23; ECM Standing Decision). All are the listing photos the client commissioned. Renamed so no street address appears, metadata stripped, long edge capped at 2400px. Checked for faces, plates and third party phone numbers: none found. Note: the files marked 1067px are the largest versions in the client's folder.

| File | Job | Status |
| --- | --- | --- |
| projects/hawaii-island-new-home-exterior-1.jpg | New single family home, Puna district, Big Island | ECM job, finished. 1067px wide only |
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
| projects/hawaii-island-new-home-exterior-2.jpg | /portfolio and /services, Big Island card cover. The home hero and share card use the edited copy since 2026-11-27 |
| projects/hawaii-island-new-home-exterior-1.jpg | /portfolio, Big Island gallery ("New home"). Not the hero: only 1067px wide, soft when stretched to desktop widths |
| projects/hawaii-island-new-home-exterior-3.jpg, -4.jpg | /portfolio, Big Island gallery ("New home"); exterior-4 is also the /about photo since 2026-11-25 |
| projects/hawaii-island-new-home-entry.jpg | /portfolio, Big Island gallery ("Entry porch") |
| projects/hawaii-island-new-home-great-room-1.jpg | `home` slot: /custom-homes photo header, home services list (Custom homes); home full-width photo band (since 2026-11-25); /portfolio, Big Island gallery ("Great room and kitchen") |
| projects/hawaii-island-new-home-living-dining.jpg | /portfolio, Big Island gallery ("Living and dining") |
| projects/hawaii-island-new-home-kitchen-1.jpg | /portfolio, Big Island gallery ("Kitchen"). Since 2026-11-25 no longer in the home slider |
| projects/hawaii-island-new-home-kitchen-3.jpg | /portfolio, Big Island gallery ("Kitchen") |
| projects/hawaii-island-new-home-bathroom-1.jpg | /portfolio, Big Island gallery ("Bathroom") |
| projects/hawaii-island-new-home-shower.jpg | /portfolio, Big Island gallery ("Shower and tub") |
| projects/hawaii-island-new-home-double-vanity.jpg | /portfolio, Big Island gallery ("Double vanity") |
| projects/hawaii-island-new-home-barn-door.jpg | /portfolio, Big Island gallery ("Barn door detail") |
| projects/waianae-remodel-2-kitchen.jpg | /portfolio, Waianae home remodel card cover and gallery ("Kitchen") |
| projects/waianae-remodel-2-shower.jpg | /portfolio, Waianae home remodel gallery ("Shower") |
| projects/hawaii-island-new-home-great-room-2.jpg | Home Custom homes service image since 2026-11-27, unedited (level and clean). It replaced the exterior-4 edit there because the exterior's gravel made it a 59 KB file that slowed the hero on phones; great-room-2 is 23 KB |
| projects/hawaii-island-new-home-kitchen-2.jpg | Registered in images.ts with alt text, not placed on a page yet |

## Edited copies (2026-11-27)

Honest edits only (Ellard, 2026-11-27): crop, level (3 degrees or less), perspective correction, mild exposure, contrast and white balance, saturation up 10% or less. Nothing added or removed, no sky replacement, no generative fill. Each edit is a new file next to its original, which stays unchanged. Metadata stripped. Never upscaled. Made with Pillow (scripts kept out of the repo); no rotation or perspective correction was needed on these.

| File | Exact operations |
| --- | --- |
| projects/hawaii-island-new-home-exterior-2-edit.jpg | Edit of hawaii-island-new-home-exterior-2.jpg (2026-11-27): Pillow contrast x1.06, saturation x1.06, JPEG quality 88, progressive, no metadata. Result 2400x1800. Home hero. Overcast and flat; tone only, no crop (the hero crops itself). Ellard approved 2026-11-27. |
| projects/hawaii-island-new-home-exterior-1-edit.jpg | Edit of hawaii-island-new-home-exterior-1.jpg (2026-11-27): Pillow crop box (145, 40, 1067, 731) to 922x691, contrast x1.04, saturation x1.05, JPEG quality 88, progressive, no metadata. Result 922x691. Big Island featured card. Crops out the utility pole and wires at the left; driveway leads from the bottom left corner to the garage; roofline near the upper third. Ellard approved 2026-11-27. |
| projects/hawaii-island-new-home-exterior-4-edit.jpg | Edit of hawaii-island-new-home-exterior-4.jpg (2026-11-27): Pillow crop box (60, 20, 1067, 775) to 1007x755, contrast x1.04, saturation x1.05, JPEG quality 88, progressive, no metadata. Result 1007x755. Home Custom homes service image. Crops out the pole at the left edge and some gravel. Ellard approved 2026-11-27. |
| projects/waianae-addition-siding-done-edit.jpg | Edit of waianae-addition-siding-done.jpg (2026-11-27): Pillow crop box (110, 140, 1365, 1081) to 1255x941, contrast x1.04, saturation x1.05, JPEG quality 88, progressive, no metadata. Result 1255x941. ADU slot (home service image, /adu-oahu header). Crops out the car hood at the bottom right, the person at the left edge and most of the bare gravel. Ellard approved 2026-11-27. |
| projects/longs-drip-edge-2-edit.jpg | Edit of longs-drip-edge-2.jpg (2026-11-27): Pillow crop box (236, 960, 1067, 1583) to 831x623, contrast x1.04, saturation x1.05, JPEG quality 88, progressive, no metadata. Result 831x623. Commercial service image. Keeps the store sign, crops out the shopping carts and most of the sky; the roof edge runs from the upper right toward the sign. Ellard approved 2026-11-27. |
| projects/acs-hope-lodge-pergola-2-edit.jpg | Edit of acs-hope-lodge-pergola-2.jpg (2026-11-27): Pillow crop box (0, 500, 1216, 1412) to 1216x912, contrast x1.04, saturation x1.05, JPEG quality 88, progressive, no metadata. Result 1216x912. Hope Lodge cover. Pergola beams run from the lower left toward Diamond Head and the city near the upper third. Ellard approved 2026-11-27. |
| projects/waianae-addition-framing-3-edit.jpg | Edit of waianae-addition-framing-3.jpg (2026-11-27): Pillow crop box (1000, 30, 2333, 1030) to 1333x1000, contrast x1.04, saturation x1.05, JPEG quality 88, progressive, no metadata. Result 1333x1000. Job site slider. Crops out the wheelbarrow in front of the frame; the top plate leads toward the hillside. Ellard approved 2026-11-27. |
| projects/driveway-salt-lake-during-edit.jpg | Edit of driveway-salt-lake-during.jpg (2026-11-27): Pillow crop box (0, 560, 1216, 1472) to 1216x912, contrast x1.04, saturation x1.05, JPEG quality 88, progressive, no metadata. Result 1216x912. Job site slider. Fresh driveway leads from the bottom toward the crew; faces stay too small to read. Ellard approved 2026-11-27. |
| projects/waianae-addition-framing-1-edit.jpg | Edit of waianae-addition-framing-1.jpg (2026-11-27): Pillow crop box (520, 0, 2320, 1350) to 1800x1350, contrast x1.04, saturation x1.05, JPEG quality 88, progressive, no metadata. Result 1800x1350. Job site slider. Frame on the right third; crops out buckets and the wood pile at the left. Ellard approved 2026-11-27. |
| projects/waianae-addition-framing-2-edit.jpg | Edit of waianae-addition-framing-2.jpg (2026-11-27): Pillow crop box (0, 0, 1800, 1350) to 1800x1350, contrast x1.04, saturation x1.05, JPEG quality 88, progressive, no metadata. Result 1800x1350. Job site slider. Stud shadows lead across the slab toward the frame. Ellard approved 2026-11-27. |
| projects/waianae-addition-house-wrap-edit.jpg | Edit of waianae-addition-house-wrap.jpg (2026-11-27): Pillow crop box (260, 0, 2060, 1350) to 1800x1350, contrast x1.04, saturation x1.05, JPEG quality 88, progressive, no metadata. Result 1800x1350. Job site slider. 4:3 crop on the wrapped house. Ellard approved 2026-11-27. |
| projects/waianae-addition-roof-edit.jpg | Edit of waianae-addition-roof.jpg (2026-11-27): Pillow crop box (200, 140, 1680, 1250) to 1480x1110, contrast x1.04, saturation x1.05, JPEG quality 88, progressive, no metadata. Result 1480x1110. Job site slider. Crops out the parked truck at the right and the wires at the top left. Ellard approved 2026-11-27. |

Where the edited copies are used: home hero and share card (exterior-2-edit); home featured Big Island card (exterior-1-edit; /portfolio keeps exterior-2 as the card cover); home Commercial service and the Commercial service card (longs-drip-edge-2-edit); Hope Lodge cover on home and /portfolio, and the /commercial-tenant-improvements header (acs-hope-lodge-pergola-2-edit); exterior-4-edit is approved but not placed since 2026-11-27 (the home Custom homes service moved to great-room-2); `adu` slot (siding-done-edit); home job site slider (framing-1, framing-2, framing-3, house-wrap, roof and driveway edits).

Rejected (2026-11-27):
- bamboo-floor-after-edit.jpg, an edit of bamboo-floor-after.jpg (crop box (0, 640, 1216, 1552), contrast x1.04, saturation x1.05). Ellard rejected it on 2026-11-27: the crop drops the window and leaves dark door jambs. The file was deleted. The /remodeling header now uses mililani-remodel-living-room.jpg, unedited (1600x1067, already level and clean; the header's own 4:3 crop is enough).

Looked at and left unedited (2026-11-27):
- concrete-walkway-2.jpg (home slider): two wheelbarrows sit inside the walkway forms, the subject; a crop cannot remove them.
- waianae-remodel-demo.jpg (home slider): the utility pole and wires stand mid frame; a crop cannot remove them.
- hawaii-island-new-home-exterior-3.jpg: a power line crosses the upper right toward the roof; a crop cannot remove it without losing the house. Not used on the home page.
- hawaii-island-new-home-great-room-1.jpg (home band, /custom-homes header), mililani-kitchen-1.jpg (home Remodels service), waianae-kitchen-after-1.jpg (home featured Waianae card): already level and clean; the slot's own 4:3 or 16:10 crop is enough.
