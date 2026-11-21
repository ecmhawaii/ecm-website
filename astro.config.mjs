import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://ecmhawaii.com',
  // Pages build as /services.html etc. so URLs have no trailing slash on Netlify.
  build: { format: 'file' },
  trailingSlash: 'never',
  integrations: [
    sitemap({
      // The thank you page is only reached after a form submit, so keep it out of the sitemap.
      filter: (page) => !page.includes('/thank-you'),
    }),
  ],
});
