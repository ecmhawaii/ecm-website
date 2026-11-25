// DRAFT GATING (2026-11-25). One mechanism for all new copy.
//
// Every new piece of copy is an object with an `id` and a `confirm` flag, written on ONE line:
//   { id: 'privacy-page', confirm: false, ... }
// - confirm: false  The item renders on deploy previews, branch deploys and local builds with a
//                   visible "Draft" badge, and is left out of production builds.
// - confirm: true   The item renders everywhere with no badge.
// Production = Netlify's CONTEXT=production (the live site). `npm run check:launch` builds with
// CONTEXT=production and lists every confirm:false item (scripts/check-launch.mjs reads the
// `id` and `confirm` on the same line, so keep them together).
//
// Only import this in page or component frontmatter (it reads process.env at build time).
export const IS_PRODUCTION = process.env.CONTEXT === 'production';

export type Confirmable = { id: string; confirm: boolean };

/** True when the item is built: confirmed, or any non-production build. */
export const shown = (item: Confirmable) => item.confirm || !IS_PRODUCTION;
/** True when the item is shown but not confirmed yet (it gets a Draft badge). */
export const draftBadge = (item: Confirmable) => !item.confirm && !IS_PRODUCTION;
