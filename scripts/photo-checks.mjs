// Build time photo checks (Astro integration, added in astro.config.mjs).
//
// noRepeatPhotos: fails `astro build` if the same source photo renders twice on one page.
// Every photo <img> counts (PhotoSlot photos carry data-photo, the home hero data-hero-img);
// blurred placeholders and logos do not, and neither does a PhotoSlot marked layoutCopy (the same
// photo in a second layout that is never shown at the same time, e.g. the home services list's
// phone list and desktop preview). Copies made from one original count as that original:
// "<name>-edit.jpg" and "<name>-aligned.jpg" are the same source as "<name>.jpg".
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const htmlFiles = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith('.html') ? [p] : [];
});

/** "/_astro/acs-hope-lodge-pergola-2-edit.AbC123_xyz.webp" -> "acs-hope-lodge-pergola-2" */
export function sourceOf(src) {
  const file = src.split('?')[0].split('/').pop() || '';
  return file.split('.')[0].replace(/-(edit|aligned)$/, '');
}

/** Map of page path -> [{ source, count }] for every source photo used more than once. */
export function findRepeats(distDir) {
  const repeats = {};
  for (const file of htmlFiles(distDir)) {
    const html = readFileSync(file, 'utf8');
    const counts = new Map();
    for (const tag of html.match(/<img\b[^>]*>/g) || []) {
      if (!/\sdata-(photo|hero-img)\b/.test(tag) || /\sdata-layout-copy\b/.test(tag)) continue;
      const src = (tag.match(/\ssrc="([^"]+)"/) || [])[1];
      if (!src) continue;
      const source = sourceOf(src);
      counts.set(source, (counts.get(source) || 0) + 1);
    }
    const dupes = [...counts].filter(([, n]) => n > 1).map(([source, count]) => ({ source, count }));
    if (dupes.length) repeats['/' + file.slice(distDir.length + 1).replace(/\.html$/, '')] = dupes;
  }
  return repeats;
}

export function noRepeatPhotos() {
  return {
    name: 'ecm-no-repeat-photos',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const distDir = fileURLToPath(dir).replace(/\/$/, '');
        const repeats = findRepeats(distDir);
        const pages = Object.keys(repeats);
        if (pages.length) {
          const lines = pages.map((p) => `  ${p}: ${repeats[p].map((d) => `${d.source} x${d.count}`).join(', ')}`);
          throw new Error(`Same photo shown twice on one page (scripts/photo-checks.mjs):\n${lines.join('\n')}`);
        }
      },
    },
  };
}
