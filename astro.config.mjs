import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './site.config.mjs';
import { draftPaths } from './src/content/site.ts';
import { legalPages } from './src/content/legal.ts';
import { readiness } from './src/content/readiness.ts';
import { noRepeatPhotos } from './scripts/photo-checks.mjs';

// Unconfirmed pages (confirm:false) stay out of the sitemap; production does not build them at all.
const excluded = ['/thank-you', ...draftPaths, ...[...legalPages, readiness].filter((p) => !p.confirm).map((p) => p.path)];
// Printable checklists are noindex and never in the sitemap.
const excludedPrefixes = ['/checklists/'];

export default defineConfig({
  output: 'static',
  site: SITE,
  // Pages build as /services.html etc. so URLs have no trailing slash on Netlify.
  build: {
    format: 'file',
    // Keep all CSS in files so the Content-Security-Policy can stay strict (no inline styles).
    inlineStylesheets: 'never',
  },
  // Keep scripts and small assets as files too (no inline scripts or data URIs).
  vite: { build: { assetsInlineLimit: 0 } },
  trailingSlash: 'never',
  integrations: [
    // Fails the build if one source photo renders twice on a page (scripts/photo-checks.mjs).
    noRepeatPhotos(),
    sitemap({
      // Thank you page and any guide still marked DRAFT stay out of the sitemap.
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '') || '/';
        return !excluded.includes(path) && !excludedPrefixes.some((p) => path.startsWith(p));
      },
    }),
  ],
});
