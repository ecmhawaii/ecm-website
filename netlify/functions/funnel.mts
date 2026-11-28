// First party step counter (2026-11-25). NEEDS ELLARD'S APPROVAL IN THE PR (CLAUDE.md rule 8).
// See docs/funnel-counter.md for exactly what is and is not collected.
//
// POST /api/f          body {"f":"estimate","s":2,"e":"view"}  ->  204
//   f: estimate | checklist | readiness
//   e: view | start | finish | submit
//   s: integer 0 to 10 (step number; for checklists the checklist number; else 0)
//   Anything else, or a body over 200 bytes, is rejected (400 / 413). Nothing else is read.
//   Each accepted event is one blob in the Netlify Blobs store "funnel", key
//   CONTEXT/YYYY-MM-DD (Hawaii date)/f/e/s/randomUUID, value "1". No IP, user agent,
//   referrer, cookie, storage or identifier is stored or logged.
//
// GET /api/f/report?days=N   header Authorization: Bearer <FUNNEL_REPORT_TOKEN>
//   Production only (404 elsewhere). 503 if FUNNEL_REPORT_TOKEN is not set, 401 on a bad
//   token. Returns counts by day, form, event and step for the last N Hawaii days (1 to 90).
//   The token is set by Ellard in Netlify's environment variables, never in code.
import { getStore } from '@netlify/blobs';
import { createHash, timingSafeEqual } from 'node:crypto';

type Store = {
  set(key: string, value: string): Promise<unknown>;
  list(options: { prefix: string }): Promise<{ blobs: Array<{ key: string }> }>;
};
type Ctx = { deploy?: { context?: string } };

export const FORMS = ['estimate', 'checklist', 'readiness'] as const;
export const EVENTS = ['view', 'start', 'finish', 'submit'] as const;
export const MAX_BYTES = 200;
const HAWAII_OFFSET_MS = 10 * 60 * 60 * 1000; // HST is UTC-10 all year (no daylight saving).

/** Hawaii calendar date (YYYY-MM-DD) for a UTC timestamp. */
export const hawaiiDate = (ms: number) => new Date(ms - HAWAII_OFFSET_MS).toISOString().slice(0, 10);

/** Returns the event, or null for anything that is not exactly {f, s, e} with allowed values. */
export function parseEvent(text: string): { f: string; s: number; e: string } | null {
  let body: unknown;
  try { body = JSON.parse(text); } catch { return null; }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const keys = Object.keys(body).sort();
  if (keys.join() !== 'e,f,s') return null;
  const { f, s, e } = body as Record<string, unknown>;
  if (typeof f !== 'string' || !(FORMS as readonly string[]).includes(f)) return null;
  if (typeof e !== 'string' || !(EVENTS as readonly string[]).includes(e)) return null;
  if (typeof s !== 'number' || !Number.isInteger(s) || s < 0 || s > 10) return null;
  return { f, s, e };
}

const sha = (v: string) => createHash('sha256').update(v).digest();
const sameToken = (a: string, b: string) => timingSafeEqual(sha(a), sha(b));
const deployContext = (ctx: Ctx | undefined, env: (k: string) => string | undefined) =>
  (ctx?.deploy?.context || env('CONTEXT') || 'unknown').replace(/[^a-z-]/g, '') || 'unknown';
const empty = (status: number) => new Response(null, { status, headers: { 'cache-control': 'no-store' } });

export function makeHandler(openStore: () => Store, env: (k: string) => string | undefined, now: () => number = Date.now) {
  return async (req: Request, ctx?: Ctx): Promise<Response> => {
    const url = new URL(req.url);
    const context = deployContext(ctx, env);

    if (url.pathname === '/api/f/report') {
      if (req.method !== 'GET') return empty(405);
      if (context !== 'production') return empty(404);
      const token = env('FUNNEL_REPORT_TOKEN');
      if (!token) return empty(503);
      const auth = req.headers.get('authorization') || '';
      const given = auth.startsWith('Bearer ') ? auth.slice(7) : '';
      if (!given || !sameToken(given, token)) return empty(401);
      const days = Math.min(90, Math.max(1, Number.parseInt(url.searchParams.get('days') || '7', 10) || 7));
      const store = openStore();
      const counts = new Map<string, number>();
      const dates: string[] = [];
      for (let i = 0; i < days; i++) dates.push(hawaiiDate(now() - i * 86_400_000));
      for (const date of dates) {
        const { blobs } = await store.list({ prefix: `production/${date}/` });
        for (const { key } of blobs) {
          const [, d, f, e, s] = key.split('/');
          const k = `${d}|${f}|${e}|${s}`;
          counts.set(k, (counts.get(k) || 0) + 1);
        }
      }
      const rows = [...counts.entries()]
        .map(([k, count]) => { const [date, f, e, s] = k.split('|'); return { date, f, e, s: Number(s), count }; })
        .sort((a, b) => (a.date + a.f + a.e).localeCompare(b.date + b.f + b.e) || a.s - b.s);
      return new Response(JSON.stringify({ context: 'production', timeZone: 'Pacific/Honolulu', days, from: dates[dates.length - 1], to: dates[0], rows }), {
        status: 200,
        headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
      });
    }

    if (url.pathname !== '/api/f') return empty(404);
    if (req.method !== 'POST') return empty(405);
    const declared = Number(req.headers.get('content-length') || '0');
    if (declared > MAX_BYTES) return empty(413);
    const buf = await req.arrayBuffer();
    if (buf.byteLength > MAX_BYTES) return empty(413);
    const event = parseEvent(new TextDecoder().decode(buf));
    if (!event) return empty(400);
    await openStore().set(`${context}/${hawaiiDate(now())}/${event.f}/${event.e}/${event.s}/${crypto.randomUUID()}`, '1');
    return empty(204);
  };
}

declare const Netlify: { env: { get(key: string): string | undefined } } | undefined;
const env = (k: string) => (typeof Netlify !== 'undefined' ? Netlify.env.get(k) : process.env[k]);

export default makeHandler(() => getStore({ name: 'funnel', consistency: 'strong' }) as unknown as Store, env);

export const config = { path: ['/api/f', '/api/f/report'] };
