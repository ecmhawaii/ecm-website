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

The home page has a noindex meta tag and `public/robots.txt` disallows everything. Both are marked REMOVE AT LAUNCH.
