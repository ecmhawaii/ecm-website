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

## Before launch

Every page has a noindex meta tag (set once in `src/layouts/Base.astro`) and `public/robots.txt` disallows everything. Both are marked REMOVE AT LAUNCH.

## Editing website text

All visible text is in `src/content/site.ts`. Replace copy there once it is approved. Pages, the layout and styles do not hold any copy of their own.
