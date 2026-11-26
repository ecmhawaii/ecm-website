// Launch gate. `npm run check:launch` builds the site, then FAILS while any draft-only
// item remains. Run it before asking for the launch merge.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { SITE, SITE_NOINDEX } from '../site.config.mjs';

const DIST = 'dist';
if (!existsSync(DIST)) { console.error('check:launch: dist/ not found. Run npm run build first.'); process.exit(2); }

const htmlFiles = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith('.html') ? [p] : [];
});
const pages = htmlFiles(DIST).map((file) => ({
  file,
  path: '/' + file.slice(DIST.length + 1).replace(/\.html$/, '').replace(/^index$/, ''),
  html: readFileSync(file, 'utf8'),
}));

const blockers = [];
const warnings = [];
const notes = [];

// 1. Placeholder images (sample stock photos or the unconfirmed hero) on any page.
const ph = pages.filter((p) => p.html.includes('data-placeholder="true"'));
if (ph.length) blockers.push(`Placeholder images on ${ph.length} pages: ${ph.map((p) => p.path).join(', ')} (replace slots in src/content/images.ts)`);
const imagesTs = readFileSync('src/content/images.ts', 'utf8');
const phSlots = [
  ...[...imagesTs.matchAll(/^\s*(?:export const )?(\w+)\s*[:=]\s*\{[^\n]*placeholder: true/gm)].map((m) => m[1]),
  ...[...imagesTs.matchAll(/^\s*(\w+):\s*stock\(/gm)].map((m) => m[1]),
];
if (phSlots.length) blockers.push(`Image slots still marked placeholder: ${phSlots.join(', ')}`);

// 2. noindex.
if (SITE_NOINDEX) blockers.push('SITE_NOINDEX is true in site.config.mjs (noindex on every page)');
const noindexPages = pages.filter((p) => /<meta name="robots" content="[^"]*noindex/.test(p.html) && !p.html.includes('class="draft-badge"') && p.path !== '/404');
if (noindexPages.length && !SITE_NOINDEX) blockers.push(`noindex tag on non-draft pages: ${noindexPages.map((p) => p.path).join(', ')}`);

// 3. Blocked robots.txt.
const robots = readFileSync('public/robots.txt', 'utf8');
if (/^\s*Disallow:\s*\/\s*$/m.test(robots)) blockers.push('public/robots.txt blocks all crawlers (swap in public/robots.launch.txt)');

// 4. A DRAFT page in the sitemap.
const sitemapFile = join(DIST, 'sitemap-0.xml');
if (existsSync(sitemapFile)) {
  const locs = [...readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, '') || '/');
  const drafts = pages.filter((p) => p.html.includes('class="draft-badge"'));
  const draftInMap = drafts.filter((d) => locs.includes(d.path || '/'));
  if (draftInMap.length) blockers.push(`DRAFT pages in the sitemap: ${draftInMap.map((d) => d.path).join(', ')}`);
  if (drafts.length) notes.push(`DRAFT pages (kept out of the sitemap, noindex): ${drafts.map((d) => d.path).join(', ')}`);
  const wrongHost = locs.length && !readFileSync(sitemapFile, 'utf8').includes(`<loc>${SITE}`);
  if (wrongHost) blockers.push(`Sitemap URLs do not start with SITE (${SITE})`);
} else {
  blockers.push('dist/sitemap-0.xml missing');
}

// 5. Unsplash in the CSP.
const headers = readFileSync('public/_headers', 'utf8');
if (headers.includes('images.unsplash.com')) blockers.push('images.unsplash.com is still allowed in the CSP (public/_headers img-src)');

// Extra safety checks.
const dashPages = pages.filter((p) => /[\u2013\u2014]/.test(p.html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')));
if (dashPages.length) blockers.push(`Em or en dashes in: ${dashPages.map((p) => p.path).join(', ')}`);
const launchRobots = readFileSync('public/robots.launch.txt', 'utf8');
if (!launchRobots.includes(`Sitemap: ${SITE}/sitemap-index.xml`)) blockers.push(`public/robots.launch.txt sitemap line does not match SITE (${SITE})`);
const ext = pages.filter((p) => /images\.unsplash\.com/.test(p.html));
if (ext.length) notes.push(`Pages hotlinking images.unsplash.com: ${ext.length}`);

const siteTs = readFileSync('src/content/site.ts', 'utf8');

// 6. Public phone (2026-11-25): the ECM Twilio number must be set in site.ts (const PHONE),
// and no built page may still show the placeholder.
const phoneLine = siteTs.match(/^const PHONE(?::\s*string)?\s*=\s*(.+?);\s*$/m);
const placeholder = (siteTs.match(/^export const PHONE_PLACEHOLDER\s*=\s*'([^']*)'/m) || [])[1];
const phoneRaw = phoneLine ? phoneLine[1].trim() : '';
const phoneValue = phoneRaw === 'PHONE_PLACEHOLDER' ? placeholder : phoneRaw.replace(/^['"`]|['"`]$/g, '');
const phoneDigits = phoneValue.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
const placeholderPages = pages.filter((p) => p.html.includes('data-phone-placeholder'));
if (!phoneLine || !phoneValue || phoneValue === placeholder || phoneDigits.length !== 10 || placeholderPages.length) {
  blockers.push('Set the ECM Twilio number before launch.' + (placeholderPages.length ? ` (phone placeholder on ${placeholderPages.length} pages; PHONE in src/content/site.ts)` : ' (PHONE in src/content/site.ts)'));
}

// 7. Draft gating (src/lib/draft.ts). Every confirm:false item is listed. Privacy and terms
// pages that are not confirmed are blockers (the forms and the SMS program link to them);
// the rest are warnings. A production build must contain no Draft badge.
const LAUNCH_BLOCKING = ['privacy-page', 'terms-page'];
const srcFiles = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? srcFiles(p) : /\.(ts|mjs|astro)$/.test(p) ? [p] : [];
});
const unconfirmed = [];
for (const file of srcFiles('src')) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (/^\s*(\/\/|\*)/.test(line)) return; // comments and docs
    const m = line.match(/\bconfirm:\s*false\b/);
    if (!m) return;
    const id = (line.match(/\bid:\s*'([^']+)'/) || [])[1] || '(no id on this line)';
    unconfirmed.push({ id, where: `${file}:${i + 1}`, revised: /\bwas:\s*'/.test(line) });
  });
}
for (const u of unconfirmed) {
  if (LAUNCH_BLOCKING.includes(u.id)) blockers.push(`Not confirmed: ${u.id} (${u.where}). Privacy and terms must be confirmed before launch.`);
  else if (u.revised) warnings.push(`Not confirmed (production keeps the old wording): ${u.id} (${u.where})`);
  else warnings.push(`Not confirmed (left out of production): ${u.id} (${u.where})`);
}
// 8. A confirmed privacy or terms page needs its effective date (src/content/legal.ts).
const legalLines = readFileSync('src/content/legal.ts', 'utf8').split('\n');
for (const id of LAUNCH_BLOCKING) {
  const start = legalLines.findIndex((l) => l.includes(`id: '${id}'`));
  if (start === -1) { blockers.push(`${id} not found in src/content/legal.ts`); continue; }
  const confirmed = /\bconfirm:\s*true\b/.test(legalLines[start]);
  let effective = '';
  for (let i = start + 1; i < legalLines.length && !/^export const/.test(legalLines[i]); i++) {
    const m = legalLines[i].match(/^\s*effectiveDate:\s*'([^']*)'/);
    if (m) { effective = m[1]; break; }
  }
  if (confirmed && !effective.trim()) blockers.push(`${id} is confirmed but has no effective date (effectiveDate in src/content/legal.ts:${start + 1}).`);
}

const draftInBuild = pages.filter((p) => p.html.includes('data-draft='));
if (draftInBuild.length) {
  const how = process.env.CONTEXT === 'production' ? '' : ' (this dist was not built with CONTEXT=production; run npm run check:launch)';
  blockers.push(`Draft badges in the build on ${draftInBuild.length} pages: ${draftInBuild.map((p) => p.path).join(', ')}${how}`);
}

// Hidden slots (information only, not blockers).
const slotsBlock = siteTs.slice(siteTs.indexOf('export const slots'), siteTs.indexOf('export const nav'));
const offSlots = [...slotsBlock.matchAll(/^ {2}(\w+): \{\s*\n\s*enabled: false/gm)].map((m) => m[1]);
if (offSlots.length) notes.push(`Hidden slots switched off (fine at launch if Jesse has not supplied them): ${offSlots.join(', ')}`);

console.log(`\ncheck:launch for ${SITE}  (${pages.length} built pages)\n`);
if (notes.length) { console.log('Notes:'); notes.forEach((n) => console.log(`  - ${n}`)); console.log(''); }
if (warnings.length) { console.log(`Warnings (${warnings.length}):`); warnings.forEach((w) => console.log(`  - ${w}`)); console.log(''); }
if (blockers.length) {
  console.log(`NOT READY. ${blockers.length} launch blocker(s):`);
  blockers.forEach((b, i) => console.log(`  ${i + 1}. ${b}`));
  console.log('');
  process.exit(1);
}
console.log('READY: no launch blockers found.\n');
