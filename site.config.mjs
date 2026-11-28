// One place for site-wide settings shared by astro.config.mjs and the pages.
// Plain JS so the Astro config and Node scripts can both import it.

// Canonical origin. The PM decides www or bare domain at launch; change it only here.
export const SITE = 'https://ecmhawaii.com';

// REMOVE AT LAUNCH: true adds a noindex tag to every page while the site is a draft.
export const SITE_NOINDEX = true;
