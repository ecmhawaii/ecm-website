# ecm-website

Website for Elite Construction Management (ecmhawaii.com). Built with Astro as a static site.

This repository is public. Read CLAUDE.md before adding anything.

## Run locally

1. Install the Node version in `.nvmrc` (22.23.4). With nvm: `nvm install`.
2. `npm install`
3. `npm run dev` (opens at http://localhost:4321)
4. To test the production build: `npm run build`, then `npm run preview`.

## Deploys

Netlify builds this repo from `main` (`npm run build`, publish folder `dist`, set in `netlify.toml`). Changes reach `main` only through a reviewed pull request.

## Where things live

- `src/content/site.ts`: all visible text, plus on/off switches for hidden slots (reviews, Instagram, financing, Trusted By, insurance line, reply time), guide status and FAQs.
- `src/content/images.ts`: every image slot. Swap a real photo in by editing one line.
- `src/assets/images/SOURCES.md`: where every image came from and its status.
- `site.config.mjs`: the canonical site URL (`SITE`) and the site-wide noindex switch.
- `public/_headers`: security headers (Content-Security-Policy and others).
- `src/scripts/motion.ts` and `motion-gsap.ts`: page animation (gsap from npm, self-hosted). Elements are hidden for animation only when scripting is on and reduced motion is off (CSS media queries), so with JavaScript off or reduced motion everything shows at once. gsap loads only after the first photo and fonts are ready, to protect page speed.

## Before launch

Run `npm run check:launch`. It builds the site and fails while anything draft-only remains:

1. Placeholder images (sample photos or the unconfirmed hero) in `src/content/images.ts`.
2. `SITE_NOINDEX` still `true` in `site.config.mjs` (REMOVE AT LAUNCH).
3. `public/robots.txt` still blocking everything. Replace it with `public/robots.launch.txt`.
4. A guide marked DRAFT in the sitemap.
5. `images.unsplash.com` still allowed in `public/_headers`.

After launch only: `npm run build && node scripts/indexnow-submit.mjs --yes` pings IndexNow. It refuses to run while the site is still noindex or blocked.
