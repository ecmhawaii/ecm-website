# Pre-launch audit, 2026-11-24

Independent audit of branch `build/site-v1` at commit `2f94e63`, done by a Claude session that did not build the site. Report only: nothing in the site was changed.

**Typo fixes made: none.** A spell check of all visible text, alt text, link names and meta descriptions on the 17 built pages found no typos (only names and trade words such as Kapolei, ohana, midrange, rebar). The guide source link `.../building-permit-requriements/` is misspelled, but that is the real address of the Honolulu DPP page (it appears that way in search results), so it was left alone.

## How this was checked

1. `npm ci`, then `npm run build`: passes, 17 pages built. `node scripts/check-launch.mjs`: NOT READY, 2 blockers (SITE_NOINDEX true, robots.txt blocks all), exactly as expected.
2. Read every file in `src/content`, `src/pages`, `src/components`, `src/layouts`, `src/lib`, `src/scripts`, `public`, `scripts`, the configs and the git history for where each claim came from.
3. Crawled the built `dist/` in headless Chromium (Playwright) with a local server that resolves URLs the way Netlify does for `build.format: 'file'`: titles, descriptions, H1s, canonicals, robots tags, JSON-LD, every link and anchor, every image, every form control.
4. axe-core 4.10.3 (WCAG 2.0, 2.1, 2.2 A and AA, plus best practice) on all 17 pages.
5. Measured text contrast over the hero and photo page heads from screenshots (axe cannot judge text on photos).
6. Keyboard tests of the slider, before and after compare, lightbox and the Tab order of every main page, with animations on and off.
7. Loaded 9 pages under the exact Content-Security-Policy from `public/_headers`, with animations on and off: 0 violations.

What could not be checked is listed at the end.

## Severity

- **Blocker:** do not launch until it is resolved.
- **Fix before launch:** a real defect or open confirmation; small; should go in the launch pull request.
- **Nice to have:** polish or housekeeping; can follow launch.

Counts: **5 blockers, 12 fix before launch, 13 nice to have.**

## Part A. Findings

| # | Page | Issue | Severity |
| --- | --- | --- | --- |
| 1 | All 17 pages | `SITE_NOINDEX = true` puts `noindex, nofollow` on every page. Expected; launch runbook step 2.3. | Blocker |
| 2 | /robots.txt | `Disallow: /` for all crawlers. Expected; launch runbook step 2.4. | Blocker |
| 3 | /, /adu-oahu, /custom-homes, /remodeling, /commercial-tenant-improvements ("How it works") | "You get a fixed price contract with the scope written out." Reads as a promise about price terms. Known flag: pending Jesse's attorney. Note the hiring guide itself tells readers cost plus contracts are allowed, so a blanket fixed price promise may not match how ECM contracts every job. Launch only with the attorney's OK or with the line removed. | Blocker |
| 4 | /services (Remodels), /remodeling (intro) | "...scoped clearly before work starts so the price is set up front." Known flag: pending Jesse's attorney. Same rule as #3. | Blocker |
| 5 | /, /services, /adu-oahu, /custom-homes, /about, all 3 guides, FAQ blocks | ECM claims in live copy with no source in the repo (CLAUDE.md rule 4: only claims Jesse has confirmed in writing). `site.ts` itself marks the service copy "DRAFT copy: needs approval before launch" and no approval is recorded. The unsourced claims are marked NO SOURCE in Part B: C17 permits, subs and inspections through to move in; C18 handle the build and coordinate permits; C19 first walkthrough to final inspection; C20 site visit; C21 crew and regular updates; C22 "other trades" by licensed subs; C25 jobs under $50k; C27 and C28 a site visit for every request. One written OK from Jesse can clear them all; otherwise remove the lines. | Blocker |
| 6 | /, /portfolio, /adu-oahu, /services, /about, guides | Keyboard: with animations on (the default for most visitors), elements waiting to animate in are `visibility: hidden` (`global.css` lines 512 to 518), so Tab skips them. Measured by tabbing each page from the top: 21 controls never reached on / (all 4 service links, See all projects, the 3 featured projects, all 10 FAQ questions, estimate band links), 43 on /portfolio (every gallery photo link and both before and after sliders), 10 on /adu-oahu, 11 on the hiring guide (all 7 FAQ questions and the estimate band), 3 on /services and 3 on /about (estimate band). With reduced motion on, nothing is skipped (links inside closed accordions are skipped either way, as expected). WCAG 2.1.1. Suggested fix: animate opacity and transform only, never visibility, or reveal an element when it receives focus. | Fix before launch |
| 7 | / at phone width | Hero eyebrow "Licensed Hawaii general contractor" (light gray #e0e0e0, 12.5px) sits on the light sky of the hero photo. Measured contrast at 390px wide: 2.6:1 (95th percentile of background pixels), needs 4.5:1. Desktop passes (5.2:1). Suggested fix: darker overlay at the top of the hero on phones, or white text with a text shadow. | Fix before launch |
| 8 | / (photo slider) | Screen readers announce the slider as "Sample photos" (`ui.sliderLabel` in `site.ts`), but every slide is a real ECM job photo. Tells a blind visitor the work shown is not ECM's. One word change, for example "Job site photos". | Fix before launch |
| 9 | /remodeling, /commercial-tenant-improvements | Title over 65 characters: 73 and 72. Suggestions that keep the full business name: "Home Remodeling in Hawaii \| Elite Construction Management" (57), "Tenant Improvements in Hawaii \| Elite Construction Management" (61). | Fix before launch |
| 10 | /thank-you | Kept out of the sitemap, but after `SITE_NOINDEX` goes false it will be indexable (it has a canonical and no noindex of its own). Pass `noindex` from `thank-you.astro`. With this fixed, the sitemap lists exactly the indexable pages. | Fix before launch |
| 11 | /guides/adu-oahu | The draft ADU guide is built and will be public at launch: 7 empty sections each labeled "DRAFT, content pending". It is noindex, out of the sitemap and not linked, but anyone who guesses the URL sees an unfinished page. Suggested fix: leave draft guides out of `getStaticPaths` in production. | Fix before launch |
| 12 | /start-your-project | Contact line under the form reads "Call (808) 987-5782: (808) 987-5782 · Email: info@ecmhawaii.com" (phone shown twice). Use `ui.phoneLabel` ("Phone") as the label, as the estimate band does. | Fix before launch |
| 13 | / (services list, "Custom homes" row), /custom-homes (photo header) | The photo is from the Big Island homes built for sale. `site.ts` and `SOURCES.md` say never present them as custom homes, but placing them under a "Custom homes" heading does. The /custom-homes page H1 says "Custom homes and new construction", which is closer. Jesse decides: relabel the home row "Custom homes and new construction" or use a different photo. | Fix before launch |
| 14 | Footer, credentials strip, FAQ, guides, 2 meta descriptions | License number CT-37929 and "Class B General Building" come from the PM's DCCA lookup (commit 56fd816), not from Jesse in writing. ECM's own workspace instructions still say "BC-37929 (use this number on contracts and bids)". The site and the contracts may show different numbers. Jesse confirms CT-37929 and the class in writing; Ellard updates the workspace instructions and contract templates to match. If contracts already went out with BC-37929, flag for Jesse's attorney. | Fix before launch |
| 15 | /, /about, /commercial-tenant-improvements, /portfolio, home FAQ | Client names (Longs Drugs, American Cancer Society, Tesla, Buffalo Wild Wings). CLAUDE.md rule 5 needs the owner's written OK; `site.ts` records "Confirmed by Jesse (via Ellard, 2026-11-21)" with no written record noted. The FAQ answer to "Do you do commercial build outs?" says ECM "worked on projects for ... Tesla and Buffalo Wild Wings", which implies build outs for them; nothing about those two jobs is on file. File Jesse's written OK. Whether naming a client needs that client's permission is a question for Jesse's attorney. | Fix before launch |
| 16 | Repo only (`SOURCES.md`, comment in `images.ts`, message of commit 51b841c) | The public repo names the owner of the Waianae and Mililani jobs (CLAUDE.md rule 1: no homeowner names). He is on the ECM team and approved the photos, so this may be fine; Ellard decides. Removing it from the files does not remove it from git history. | Fix before launch |
| 17 | All 3 guides | The guides describe contract law, lien and disclosure rules and a May 2026 Intermediate Court of Appeals ruling. Workspace rule 7 says legal topics get flagged for Jesse's attorney. The ruling is newer than anything this session can verify, and the source links could not be opened from this session. A short attorney read before launch is cheap insurance. | Fix before launch |
| 18 | /portfolio, home featured cards | Some caption facts come only from "PM wording" comments in `site.ts`, not `SOURCES.md` or Jesse: Hope Lodge "Leak prevention and water mitigation"; Longs "Honolulu, Kapolei and Nanakuli" and "retail store renovations and maintenance"; Waianae "gut remodel of an older home"; alt text "Clarence T.C. Ching Hope Lodge". Confirm with Jesse and add them to `SOURCES.md`. | Nice to have |
| 19 | Estimate band (11 pages), /start-your-project, /thank-you, FAQ, guides | "We'll call you back the same business day" and "ECM calls back the same business day". Sourced (Jesse, 2026-11-21) but reads as a guarantee to every lead. Keep only if the office can meet it every business day, including job site days. | Nice to have |
| 20 | /start-your-project, /subcontractors | The forms collect name, phone, email and ZIP, and the site has no privacy notice. Some states (California, for example) can require a posted privacy policy when a site collects personal details from their residents. Question for Jesse's attorney. | Nice to have |
| 21 | Hiring guide | "DCCA says a licensed contractor has workers' compensation and liability insurance" sits in the same guide as "ECM is a licensed Hawaii general contractor", which implies ECM's coverage while the insurance slot is switched off pending Jesse. Confirm coverage, then switch the slot on. | Nice to have |
| 22 | `src/assets/images/SOURCES.md`, `src/content/images.ts` | Stale notes: `SOURCES.md` line 66 still lists `hero-diamond-head.jpg` as the home hero "still unconfirmed"; line 60 says the bamboo after photo is on the home Remodels row and featured card (now Mililani and Waianae photos). `images.ts` line 96 still says "Hero: origin unknown". | Nice to have |
| 23 | Repo | `src/assets/images/hero-diamond-head.jpg` (origin unknown, per `SOURCES.md`) is still committed to the public repo, though nothing uses it. Delete it. | Nice to have |
| 24 | /robots.launch.txt | Everything in `public/` is published, so this file is live at /robots.launch.txt, and its first comment line ("Not live yet...") will be copied into robots.txt at launch. Edit the comment when swapping. | Nice to have |
| 25 | `scripts/check-launch.mjs` | Gaps: the dash check skips JSON-LD (it is clean today); no check for title length, thank-you noindex, published draft pages, or SITE matching the Netlify primary domain. | Nice to have |
| 26 | Guides | `og:type` is "website" on guide pages (could be "article"); Article JSON-LD has no `datePublished` or `image`. | Nice to have |
| 27 | All pages (JSON-LD) | GeneralContractor data has no email and no license credential. Google's Rich Results Test may warn about the missing street address and postal code; leave them out on purpose (CLAUDE.md rule 1). | Nice to have |
| 28 | /portfolio | Full size lightbox images are large: concrete walkway photo 2 is 751 kB, photo 3 is 480 kB (1600px wide, quality 78). Lower the quality or the width cap. | Nice to have |
| 29 | Bathroom guide | Opens with "There is no current published average for a bathroom remodel in Honolulu alone", an absolute claim; the rest of the guide correctly says "we found no". The guide is approved final copy, so the PM decides. | Nice to have |
| 30 | Cost guide, hiring guide | A few statements have no citation: "land, design and engineering fees, permit fees and financing are usually counted separately as soft costs" (and its FAQ echo); "Search by the license ID ... A class code such as BC ... returns no result" (the PM's own lookup); "Permit rules are set by each county". Fine as general guidance; listed for completeness. | Nice to have |

### Results by audit area

**2. Consistency: pass.** On all 17 pages, including JSON-LD and the footer:

- Business name "Elite Construction Management", the same everywhere.
- Phone `(808) 987-5782` displayed, `tel:+18089875782` in links, `+1-808-987-5782` in JSON-LD: one number. The only other number on the site is the DCCA Consumer Resource Center line, 1-844-808-3222, quoted in the hiring guide.
- License CT-37929 is the only license number on the site. Wording varies slightly ("Hawaii license CT-37929" in the credentials strip, "Hawaii contractor license CT-37929" in the footer); the number never does. The license is not in the structured data at all (finding 27).
- Email info@ecmhawaii.com everywhere.
- No street address anywhere. Footer and JSON-LD say Kapolei, HI only.

**3. Links: pass.**

- Every internal link on all 17 pages resolves to a built file.
- Every `#anchor` (table of contents, portfolio index, featured projects, citation links) exists on its target page.
- All 43 lightbox full size image links return 200.
- 28 external links, all guide sources. All are https and well formed, and each link text matches its address.
- Every citation marker in the 3 guides (49, 37 and 41 markers) points to `#source-N`, and source N in the built list is the entry with that number in the Markdown. Sources are numbered 1 to N with no gaps, and every source is cited at least once.
- No links or hotlinks to the old builder site. The logo and the older job photos were copied from it but are served from this site.
- The external source links were not opened (network blocked in this session).

**4. SEO.**

| Page | Title chars | Description chars | H1 | Canonical | JSON-LD | Index at launch | In sitemap |
| --- | --- | --- | --- | --- | --- | --- | --- |
| / | 57 | 146 | 1 | https://ecmhawaii.com/ | GeneralContractor, FAQPage (10) | yes | yes |
| /about | 37 | 102 | 1 | correct | GC, BreadcrumbList | yes | yes |
| /services | 40 | 120 | 1 | correct | GC, BreadcrumbList | yes | yes |
| /custom-homes | 61 | 144 | 1 | correct | GC, BreadcrumbList, FAQPage (4) | yes | yes |
| /adu-oahu | 60 | 147 | 1 | correct | GC, BreadcrumbList, FAQPage (4) | yes | yes |
| /remodeling | **73** | 151 | 1 | correct | GC, BreadcrumbList, FAQPage (4) | yes | yes |
| /commercial-tenant-improvements | **72** | 149 | 1 | correct | GC, BreadcrumbList, FAQPage (4) | yes | yes |
| /portfolio | 40 | 149 | 1 | correct | GC, BreadcrumbList | yes | yes |
| /start-your-project | 51 | 101 | 1 | correct | GC, BreadcrumbList | yes | yes |
| /subcontractors | 52 | 114 | 1 | correct | GC, BreadcrumbList | yes | yes |
| /guides | 47 | 98 | 1 | correct | GC, BreadcrumbList | yes | yes |
| /guides/hiring-a-general-contractor-in-hawaii | 55 | 137 | 1 | correct | GC, BreadcrumbList, Article, FAQPage (7) | yes | yes |
| /guides/cost-to-build-a-house-in-hawaii | 54 | 138 | 1 | correct | GC, BreadcrumbList, Article, FAQPage (7) | yes | yes |
| /guides/bathroom-remodel-cost-honolulu | 45 | 132 | 1 | correct | GC, BreadcrumbList, Article, FAQPage (7) | yes | yes |
| /thank-you | 41 | 71 | 1 | correct | GC, BreadcrumbList | **yes (should be no)** | no |
| /guides/adu-oahu (draft) | 62 | 94 | 1 | correct | GC, BreadcrumbList | no (draft noindex) | no |
| /404 | 46 | 29 | 1 | none (correct) | GC | n/a | no |

- Every JSON-LD block parses as valid JSON.
- No heading levels are skipped on any page.
- Descriptions are all under 160 characters.
- Canonicals match `SITE` (bare domain). If Ellard picks www at launch, they all follow once `SITE` changes.
- The sitemap (`sitemap-index.xml` and `sitemap-0.xml`) lists 14 URLs, every indexable page except /thank-you, which should not be indexable (finding 10).
- FAQPage data repeats the same questions on up to 5 pages. Harmless: Google shows FAQ rich results only for government and health sites now.

**5. Accessibility.**

- axe-core: **0 violations** on all 17 pages. It could not judge text on photos or gradients, so that was measured separately (below).
- Alt text: every image has alt text. The header and footer logo use `alt=""` inside a link that already says "Elite Construction Management", which is correct.
- Form labels: all 34 estimate form controls, 11 subcontractor controls and both before and after sliders have accessible names. Required fields carry `required`, and the step error uses `role="alert"`.
- Heading order: one H1 per page, no skipped levels.
- Contrast on solid colors:

| Text on background | Ratio |
| --- | --- |
| Footer text #e0e0e0 on #111111 | 14.3:1 |
| Footer links #fff on #111111 | 18.9:1 |
| Estimate band, white on #2d5c9b | 6.7:1 |
| Brand blue on white | 6.7:1 |
| Body text | 12.6:1 |

- Contrast on photos: the home hero headline, support line and buttons pass at both widths, as do the photo page head headlines, eyebrows and buttons on the 4 service pages. The home hero eyebrow fails on phones (finding 7). The compare labels pass (dark label backgrounds).
- Keyboard:
  - Slider: Tab reaches the track; the arrow keys move it (count updates "2 / 11"); Previous and Next buttons follow.
  - Compare: the range input takes the arrow keys, Home and End, and updates `aria-valuetext`.
  - Lightbox: Enter opens it with focus on Close; Tab stays inside; the arrow keys change the photo; Escape closes and returns focus to the photo link.
  - These results are with reduced motion on. With animations on, the slider still works, but Tab skips the compare sliders and every gallery link on /portfolio until they have scrolled into view (finding 6).

**6. CLAUDE.md rules.**

- Dashes: zero U+2012 to U+2015 characters in all 17 built HTML files (JSON-LD included) and in built JS, CSS, XML and TXT. The open accordion marker is a CSS minus sign (U+2212), not a dash.
- Third party scripts: none. All scripts load from `/_astro/` (gsap is bundled). Loading all 17 pages made 0 requests to any other host. There are no iframes. The CSP allows `'self'` only, and loading pages under it produced 0 violations.
- Secrets: none found in tracked files (searched for keys, tokens, passwords and common key formats). `.env` files are git-ignored. The IndexNow key file is public by design.
- Rule 7 (name and phone identical): pass. Rule 8 (no analytics or tracking): pass. Rule 10: production build passes. Rules 1, 4 and 5: see findings 5, 15 and 16.

## Part B. Every factual claim and its source

Status key:

- **OK:** source in the repo.
- **WEAK:** source is PM wording or a lookup, not Jesse in writing.
- **NO SOURCE:** nothing in the repo.
- **GUARANTEE:** reads as a promise.
- **ATTORNEY:** pending Jesse's attorney.

### ECM claims on the site pages

| # | Claim as shown | Where | Source | Status |
| --- | --- | --- | --- | --- |
| C1 | Business name "Elite Construction Management" | Every page, title tags, JSON-LD | `site.ts` `business.name` | OK |
| C2 | Phone (808) 987-5782 | Header, footer, buttons, estimate band, FAQ, guides, JSON-LD | `site.ts` `business.phone*`; CLAUDE.md names it ECM's business line | OK |
| C3 | Email info@ecmhawaii.com | Footer, estimate band, estimate page | `site.ts` `business.email` | OK |
| C4 | Based in Kapolei, Hawaii | Footer, home intro, /about, FAQ, service intros, guides, JSON-LD | `site.ts` `business.city`; matches ECM's workspace profile | OK |
| C5 | "Hawaii contractor license CT-37929", "Hawaii license CT-37929" | Footer (all pages), credentials strip (/, /services, 4 service pages, /about), FAQ, guides, 2 meta descriptions | `site.ts` comment: DCCA public license search, checked 2026-11-22 (commit 56fd816). Workspace instructions say BC-37929 | WEAK (finding 14) |
| C6 | "Class B General Building" | Footer, credentials strip, FAQ, guides | `site.ts` `licenseClass`, no note; matches workspace profile | WEAK (finding 14) |
| C7 | "Licensed Hawaii general contractor"; FAQ "Are you a licensed contractor? Yes." | Hero eyebrow, home intro, /about meta, /adu-oahu intro, service meta, FAQ | Follows from C5 | OK once C5 is confirmed |
| C8 | "Veteran owned"; "Owner Jesse Alverio is a veteran." | Footer, credentials strip, home FAQ, guides | `site.ts`: confirmed by Jesse (via Ellard, 2026-11-21) | OK |
| C9 | "led by owner Jesse Alverio" | /about text and meta | No note in `src/content`; matches workspace profile | OK, add a note |
| C10 | Serves Oahu, Maui and the Big Island | Hero line, credentials strip, footer, FAQ, guides, JSON-LD `areaServed` | `site.ts`: islands Jesse confirmed 2026-11-21 | OK |
| C11 | Builds custom homes and new homes, ADUs and ohana units, additions, kitchen, bathroom and whole home remodels, commercial tenant improvements and build outs for retail, office and other commercial spaces | Home, /services, 4 service pages, FAQ, guides | `site.ts` home `servicesList` "(confirmed copy)"; workspace profile | OK |
| C12 | "New homes from plans you bring or plans developed with your architect or designer"; FAQ "Can you build from my architect's plans? Yes." | Home, /services, /custom-homes, FAQ (/, /adu-oahu, /custom-homes) | `servicesList` "(confirmed copy)" | OK |
| C13 | "An ADU or addition adds space without moving." | Home, /services, /adu-oahu | `servicesList` "(confirmed copy)" | OK (descriptive) |
| C14 | "Kitchens, bathrooms and whole home remodels, scoped clearly before work starts." | Home, /services, /remodeling, FAQ | `servicesList` "(confirmed copy)" | OK |
| C15 | "...so the price is set up front." | /services, /remodeling | None | ATTORNEY, GUARANTEE (finding 4) |
| C16 | "Proposal. You get a fixed price contract with the scope written out." | "How it works" on /, /adu-oahu, /custom-homes, /remodeling, /commercial-tenant-improvements | None | ATTORNEY, GUARANTEE (finding 3) |
| C17 | "We manage permits, subs and inspections through to move in."; FAQ "Do you manage permits, subs and inspections? Yes." | /services, /custom-homes intro and FAQ | `site.ts` service copy marked "DRAFT copy: needs approval before launch" | NO SOURCE (finding 5) |
| C18 | "We handle the build and coordinate permits and inspections." | /services, /adu-oahu intro, FAQ (/, /adu-oahu) | Same DRAFT service copy | NO SOURCE (finding 5) |
| C19 | "One team from the first walkthrough to the final inspection."; "we run the job from first walkthrough to final inspection"; guides "ECM runs the job from first walkthrough to final inspection" | Home hook and intro, all 3 guides | None (added in draft v1, commit 5c37aea) | NO SOURCE (finding 5) |
| C20 | "Site visit. We walk the property with you and talk through scope, budget and timing."; FAQ "We will follow up to set up a site visit, walk the property with you..." | "How it works" (5 pages), FAQ (/, /remodeling) | None | NO SOURCE (finding 5), low risk |
| C21 | "Build. Our crew and licensed subs do the work, and you get regular updates." | "How it works" (5 pages) | None | NO SOURCE, GUARANTEE ("regular updates") (finding 5) |
| C22 | "Our crews are backed by licensed subcontractors for plumbing, electrical and other trades."; "Plumbing, electrical and other trades by licensed subcontractors." | /about, FAQ (/, /custom-homes, /remodeling, /commercial-tenant-improvements), /custom-homes list | Plumbing and electrical: workspace profile. "Other trades" and "crews" (plural, implies staff): none | Partly NO SOURCE (finding 5) |
| C23 | "Plumbing and electrical are done by licensed subcontractors." | /services; service page lists; guides | `site.ts` `subsLine`, no note; workspace profile | OK |
| C24 | Credentials do not include insurance, bonding, years in business, team size, ratings or reviews | n/a | Hidden slots switched off in `site.ts` | OK (none claimed) |
| C25 | "Do you take smaller jobs? Yes. We take jobs under $50k as well as larger projects." | FAQ (/, /remodeling) | None (added in v3, commit 1d73888, with no note) | NO SOURCE (finding 5) |
| C26 | "We'll call you back the same business day."; "ECM calls back the same business day." | Estimate band (11 pages), /start-your-project, /thank-you, FAQ (/, /adu-oahu), guides | `site.ts` `slots.replyTime`: confirmed by Jesse (via Ellard, 2026-11-21) | OK, GUARANTEE (finding 19) |
| C27 | "We received your request and will contact you to schedule a site visit."; "We review your project. We call you. We schedule a site visit." | /thank-you | None | NO SOURCE, low risk (finding 5) |
| C28 | "Tell us what you have in mind and we will follow up to set up a site visit."; "We will get back to you to set up a site visit." | Estimate band, /start-your-project, its meta | None | NO SOURCE, low risk (finding 5) |
| C29 | "We work with licensed subcontractors and suppliers in Hawaii... we will reach out when a project fits." | /subcontractors | None | Low risk, process statement |
| C30 | "Trusted on projects for Longs Drugs, American Cancer Society, Tesla, Buffalo Wild Wings"; FAQ "We have worked on projects for Longs Drugs, American Cancer Society, Tesla and Buffalo Wild Wings." | Home, /about, FAQ (/, /commercial-tenant-improvements) | `site.ts`: confirmed by Jesse (via Ellard, 2026-11-21), names only. No project or photo on file for Tesla or Buffalo Wild Wings | OK, written OK to file (finding 15) |
| C31 | American Cancer Society Hope Lodge, "Restoration and pergola · Honolulu, Oahu"; "Leak prevention and water mitigation, interior restoration and ceiling work, and an aluminum pergola system." | /portfolio, home featured card | `SOURCES.md` (Honolulu; interior restoration and ceiling work; aluminum pergola system). "Leak prevention and water mitigation": PM wording 2026-11-22 only | OK / WEAK (finding 18) |
| C32 | Alt text "American Cancer Society Clarence T.C. Ching Hope Lodge building in Honolulu" | /portfolio lightbox | Not in `SOURCES.md` | WEAK (finding 18) |
| C33 | "Longs Drugs Oahu stores · Retail · Honolulu, Kapolei and Nanakuli"; "Metal drip edge replacement, plus retail store renovations and maintenance." | /portfolio, home featured card | `SOURCES.md`: "Longs Drugs stores, Oahu: metal drip edge replacement". Towns and "renovations and maintenance": PM wording 2026-11-22 only | OK / WEAK (finding 18) |
| C34 | Waianae remodel and addition: "Gut remodel of an older home plus a new addition with a second unit, including a new kitchen, bathrooms and a kitchenette"; captions Before, During demolition, Addition framing, wrapped, sided, Kitchen and Bathroom before and after, Second unit kitchenette | /portfolio, home featured card, service photos | `SOURCES.md` (whole house remodel plus addition with a second unit; per photo rows); PM wording 2026-11-23 | OK |
| C35 | Mililani remodel: "Home remodel with a new kitchen and bathrooms" and captions | /portfolio, home and /remodeling photos | `SOURCES.md` | OK |
| C36 | Big Island new homes: "New single family homes built on the Big Island"; hero alt "New single family home built by Elite Construction Management on the Big Island" | /portfolio, home hero and share image, /custom-homes header, home services row | `SOURCES.md` set 2 (ECM job, built for sale) | OK; placement issue (finding 13) |
| C37 | Waianae home remodel: "Home remodel with a new kitchen and bathroom" | /portfolio | `SOURCES.md` set 2 | OK |
| C38 | Kaneohe bamboo floor remodel, before and after | /portfolio, /remodeling header, home slider | `SOURCES.md` | OK |
| C39 | Salt Lake concrete driveway and walkway, before and during | /portfolio, home slider | `SOURCES.md` | OK |
| C40 | Concrete walkway in a garden courtyard (no place given) | /portfolio, home slider | `SOURCES.md` ("which project unconfirmed") | OK |
| C41 | "A few recent jobs." | /portfolio intro | No job dates on file | WEAK, low risk |
| C42 | ECM logo | Header, footer, JSON-LD | `SOURCES.md`: ECM's own, "use approved by Ellard for the draft"; Jesse to send the original | OK for draft; confirm for launch |
| C29 (added 2026-11-25; not the subcontractor C29 above) | "ECM connects clients with an architect or designer" (custom homes card line, /services and /custom-homes text, FAQ "Can you build from my architect's plans?"; added 2026-11-25) | /, /services, /custom-homes, FAQ (/, /adu-oahu, /custom-homes) | Ellard, 2026-11-25 | ECM connects clients with an architect or designer. Needs Jesse's yes (Answer Sheet #30) before launch. If no, revert to the prior wording. |

### Claims in the 3 guides

Every third party fact in the guides carries a numbered citation, and every citation lands on the right source (Part A, area 3). Totals:

| Guide | Sources | Citation markers |
| --- | --- | --- |
| Hiring a general contractor | 16 | 49 |
| Cost to build | 12 | 37 |
| Bathroom remodel | 14 | 41 |

**The ECM paragraph.** Each guide's "How ECM can help" section repeats C2, C4, C5, C6, C8, C10, C11, C19, C23 and C26 (status as above).

**Numbers spot checked by arithmetic: all correct.**

- Cost per square foot table: 1,200, 1,500 and 2,000 sq ft at $345 and $645.
- RLB index: 32,798 to 34,743 is 5.93 percent.
- Honolulu 2021 bath remodel compared with the averages: $28,685 is about 3 percent over $27,883 and about 17 percent over $24,424.
- Upscale bath ($86,863) is "a little more than three times" midrange ($27,710).
- A midrange bathroom addition ($65,326) is "more than double" a midrange remodel ($27,710).

**Prices in the guides.** These are published third party figures, each labeled with its year and source. The cost table says it "is an illustration, not a price for any home", and both cost guides say a written bid is the only real number. None is an ECM price.

**Legal content.** Statute, rules and the 2026 appeals ruling: see finding 17.

**Uncited general statements:** see finding 30.

## What could not be checked

1. **The live preview.** No preview URL was provided, and this session's network policy blocks outside hosts. Not checked:
   - Netlify's real response headers and CSP, as served.
   - 404 status codes on Netlify.
   - Netlify form detection.
   - Whether form notifications reach info@ecmhawaii.com. (Update 2026-11-27: website leads now go to Ellard and Bleys. The estimate, contact and checklist-request forms email Ellard and Bleys and post to the lead relay; only the subcontractor form emails info@ecmhawaii.com. PM confirmed the live Netlify setup on 2026-11-26.)
   - Netlify's handling of trailing slash URLs.

   No form was submitted.
2. **The old live site, public DNS and the live sitemap.** Requests to the old site and to DNS over HTTPS services were refused by the network policy. The before state of the DNS zone in the runbook is typical Hostinger values, not a lookup.
3. **The 28 guide source links.** Their format was checked; whether each one still opens was not, because the network blocks those hosts.
4. **Official docs.** docs.netlify.com, support.hostinger.com and the Google and IndexNow pages could not be opened directly. The runbook cites them from search results; confirm the values on the pages on the day.
5. **Google's Rich Results Test and a real screen reader pass.** Both need tools this session does not have. JSON-LD was checked for valid JSON and the expected types only.
