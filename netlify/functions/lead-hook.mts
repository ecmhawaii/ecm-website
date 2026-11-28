// Lead relay (2026-11-26). Netlify's form webhooks post here instead of straight to the lead log,
// because an Apps Script web app answers every POST with a 302 redirect, which Netlify counts as
// a failure (it disabled the direct webhook after 6 retries). This function answers Netlify with
// a plain status and forwards the submission to the lead log itself.
//
// POST /api/lead-hook
//   405 for any other method. 503 if LEAD_HOOK_JWS_SECRET or LEAD_LOG_URL is not set.
//   413 for a body over 100 KB. 401 (no detail) unless X-Webhook-Signature verifies:
//     a JWS (JWT) signed HS256 with LEAD_HOOK_JWS_SECRET, claim iss "netlify", and claim sha256
//     equal to the hex SHA-256 of the raw request body. All compares are constant time.
//   Then the raw body is forwarded to LEAD_LOG_URL (the Apps Script /exec URL with ?k=) as
//   application/json, following redirects, with a 10 second timeout.
//   200 when the lead log answers ok, duplicate or ignored; 502 otherwise, so Netlify retries
//   (the lead log dedupes by Netlify ID, so a retry never makes a second row).
//
// Secrets: LEAD_HOOK_JWS_SECRET and LEAD_LOG_URL live only in Netlify's environment variables.
// Logging: only status codes and timing. Never the body, headers, env values or the lead log URL.
// Signature format: from Netlify's "Payload signature" description as given in the PM brief of
// 2026-11-26. docs.netlify.com could not be opened from the build session; confirm there before
// relying on it (a mismatch shows up as 401s in Netlify's notification log, never as a silent pass).
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const MAX_BYTES = 100 * 1024;
export const FORWARD_TIMEOUT_MS = 10_000;
const ACCEPTED = ['ok', 'duplicate', 'ignored'];

type Env = (key: string) => string | undefined;
type Log = (line: string) => void;

const b64url = (buf: Buffer) => buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64url = (s: string) => Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
const sameText = (a: string, b: string) => {
  const x = Buffer.from(a, 'utf8');
  const y = Buffer.from(b, 'utf8');
  return x.length === y.length && timingSafeEqual(x, y);
};

/** True only for a well formed HS256 JWS with iss "netlify" whose sha256 claim matches the body. */
export function verifySignature(token: string, secret: string, body: Uint8Array, nowSeconds = Math.floor(Date.now() / 1000)): boolean {
  const parts = token.split('.');
  if (parts.length !== 3 || parts.some((p) => !/^[A-Za-z0-9_-]+$/.test(p))) return false;
  let header: Record<string, unknown>;
  let claims: Record<string, unknown>;
  try {
    header = JSON.parse(fromB64url(parts[0]).toString('utf8'));
    claims = JSON.parse(fromB64url(parts[1]).toString('utf8'));
  } catch {
    return false;
  }
  if (!header || header.alg !== 'HS256' || !claims || typeof claims !== 'object') return false;
  const expected = b64url(createHmac('sha256', secret).update(`${parts[0]}.${parts[1]}`).digest());
  if (!sameText(expected, parts[2])) return false;
  if (claims.iss !== 'netlify') return false;
  if (typeof claims.sha256 !== 'string') return false;
  const bodyHash = createHash('sha256').update(body).digest('hex');
  if (!sameText(claims.sha256.toLowerCase(), bodyHash)) return false;
  // Not required by the brief; honored if Netlify ever sends it.
  if (typeof claims.exp === 'number' && claims.exp < nowSeconds) return false;
  return true;
}

export function makeHandler(env: Env, fetchFn: typeof fetch = fetch, log: Log = (l) => console.log(l), now: () => number = Date.now) {
  return async (req: Request): Promise<Response> => {
    const started = now();
    const reply = (status: number, upstream?: number) => {
      log(`lead-hook ${status}${upstream !== undefined ? ` upstream ${upstream}` : ''} ${now() - started}ms`);
      return new Response(null, { status, headers: { 'cache-control': 'no-store' } });
    };

    if (req.method !== 'POST') return reply(405);
    const secret = env('LEAD_HOOK_JWS_SECRET');
    const target = env('LEAD_LOG_URL');
    if (!secret || !target) return reply(503);

    const declared = Number(req.headers.get('content-length') || '0');
    if (declared > MAX_BYTES) return reply(413);
    const body = new Uint8Array(await req.arrayBuffer());
    if (body.byteLength > MAX_BYTES) return reply(413);

    const signature = req.headers.get('x-webhook-signature') || '';
    if (!signature || !verifySignature(signature, secret, body, Math.floor(now() / 1000))) return reply(401);

    try {
      const res = await fetchFn(target, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
        redirect: 'follow',
        signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
      });
      const answer = (await res.text()).trim().toLowerCase();
      if (res.ok && ACCEPTED.includes(answer)) return reply(200, res.status);
      return reply(502, res.status);
    } catch {
      return reply(502);
    }
  };
}

declare const Netlify: { env: { get(key: string): string | undefined } } | undefined;
const env: Env = (k) => (typeof Netlify !== 'undefined' ? Netlify.env.get(k) : process.env[k]);

export default makeHandler(env);

export const config = { path: '/api/lead-hook' };
