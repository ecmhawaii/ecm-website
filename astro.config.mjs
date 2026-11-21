import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './site.config.mjs';
import { draftPaths } from './src/content/site.ts';

const excluded = ['/thank-you', ...draftPaths];

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
    sitemap({
      // Thank you page and any guide still marked DRAFT stay out of the sitemap.
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '') || '/';
        return !excluded.includes(path);
      },
    }),
  ],
});
