// IndexNow: tells Bing, Yandex and other IndexNow search engines that pages changed.
// DO NOT RUN during the draft. Run only after launch (noindex removed, robots.txt open):
//   npm run build && node scripts/indexnow-submit.mjs --yes
//
// The key file public/<key>.txt is public by design: IndexNow checks it at the site root
// to prove the site owner sent the ping. It is not a secret.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { SITE, SITE_NOINDEX } from '../site.config.mjs';

const fail = (msg) => { console.error(`indexnow: ${msg}`); process.exit(1); };

if (!process.argv.includes('--yes')) fail('refusing to run without --yes (draft safety). Run only after launch.');
if (SITE_NOINDEX) fail('SITE_NOINDEX is still true in site.config.mjs. The site is not launched.');
if (/^\s*Disallow:\s*\/\s*$/m.test(readFileSync('public/robots.txt', 'utf8'))) fail('public/robots.txt still blocks everything.');

const keyFile = readdirSync('public').find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) fail('no IndexNow key file (32 hex characters + .txt) in public/.');
const key = readFileSync(`public/${keyFile}`, 'utf8').trim();

const sitemap = 'dist/sitemap-0.xml';
if (!existsSync(sitemap)) fail('dist/sitemap-0.xml not found. Run npm run build first.');
const urlList = [...readFileSync(sitemap, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) fail('sitemap has no URLs.');

const host = new URL(SITE).host;
const body = { host, key, keyLocation: `${SITE}/${keyFile}`, urlList };
console.log(`indexnow: submitting ${urlList.length} URLs for ${host}`);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});
console.log(`indexnow: HTTP ${res.status} ${res.statusText}`);
if (!res.ok && res.status !== 202) process.exit(1);
