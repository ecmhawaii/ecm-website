// Builds the site the way Netlify builds the live site: CONTEXT=production, so every
// confirm:false item (src/lib/draft.ts) is left out. Used by `npm run check:launch`.
import { spawnSync } from 'node:child_process';

const r = spawnSync('npx', ['astro', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, CONTEXT: 'production' },
  shell: process.platform === 'win32',
});
process.exit(r.status ?? 1);
