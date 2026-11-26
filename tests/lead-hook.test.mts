// Tests for netlify/functions/lead-hook.mts. Run: npm run test:lead-hook
// Uses throwaway secrets made here (never real ones) and local servers only.
import { createHash, createHmac, randomBytes } from 'node:crypto';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { makeHandler, verifySignature, MAX_BYTES } from '../netlify/functions/lead-hook.mts';

let fails = 0;
const ok = (cond: boolean, msg: string) => { console.log(`${cond ? 'PASS' : 'FAIL'} ${msg}`); if (!cond) fails++; };

const SECRET = randomBytes(32).toString('hex');
const b64url = (b: Buffer) => b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const sign = (claims: object, secret = SECRET, alg = 'HS256') => {
  const h = b64url(Buffer.from(JSON.stringify({ alg, typ: 'JWT' })));
  const p = b64url(Buffer.from(JSON.stringify(claims)));
  return `${h}.${p}.${b64url(createHmac('sha256', secret).update(`${h}.${p}`).digest())}`;
};
const sha = (s: string) => createHash('sha256').update(s).digest('hex');
const BODY = JSON.stringify({ id: 'abc123def456', form_name: 'estimate', data: { name: 'Test Lead' } });
const goodSig = sign({ iss: 'netlify', sha256: sha(BODY) });

type Call = { url: string; init: RequestInit };
const fakeFetch = (status: number, text: string, calls: Call[] = [], fail = false) =>
  (async (url: string, init: RequestInit) => { calls.push({ url, init }); if (fail) throw new Error('network'); return new Response(text, { status }); }) as unknown as typeof fetch;
const envWith = (vars: Record<string, string | undefined>) => (k: string) => vars[k];
const ENV = { LEAD_HOOK_JWS_SECRET: SECRET, LEAD_LOG_URL: 'https://lead-log.invalid/exec?k=test-key' };
const req = (body: string, sig?: string, method = 'POST') =>
  new Request('https://site.invalid/api/lead-hook', { method, body: method === 'POST' ? body : undefined, headers: sig ? { 'x-webhook-signature': sig, 'content-type': 'application/json' } : { 'content-type': 'application/json' } });

// Signature checks
ok(verifySignature(goodSig, SECRET, Buffer.from(BODY)), 'verifySignature: valid HS256, iss netlify, sha256 of body');
ok(!verifySignature(sign({ iss: 'netlify', sha256: sha(BODY) }, 'wrong-secret'), SECRET, Buffer.from(BODY)), 'verifySignature: wrong secret');
ok(!verifySignature(sign({ iss: 'someone', sha256: sha(BODY) }), SECRET, Buffer.from(BODY)), 'verifySignature: wrong iss');
ok(!verifySignature(sign({ iss: 'netlify' }), SECRET, Buffer.from(BODY)), 'verifySignature: missing sha256 claim');
ok(!verifySignature(sign({ iss: 'netlify', sha256: sha(BODY) }, SECRET, 'none'), SECRET, Buffer.from(BODY)), 'verifySignature: alg other than HS256');
const [h, p] = goodSig.split('.');
ok(!verifySignature(`${h}.${p}.`, SECRET, Buffer.from(BODY)) && !verifySignature('not-a-jwt', SECRET, Buffer.from(BODY)), 'verifySignature: empty or malformed token');
ok(!verifySignature(sign({ iss: 'netlify', sha256: sha(BODY), exp: 1 }), SECRET, Buffer.from(BODY)), 'verifySignature: expired exp claim');

// Handler
{
  const calls: Call[] = []; const logs: string[] = [];
  const res = await makeHandler(envWith(ENV), fakeFetch(200, 'ok', calls), (l) => logs.push(l))(req(BODY, goodSig));
  const sent = calls[0];
  ok(res.status === 200, 'valid signature: 200');
  ok(calls.length === 1 && sent.url === ENV.LEAD_LOG_URL && sent.init.method === 'POST' && (sent.init.headers as Record<string, string>)['content-type'] === 'application/json' && sent.init.redirect === 'follow' && !!sent.init.signal,
    'valid signature: forwards POST application/json to LEAD_LOG_URL, follows redirects, with a timeout signal');
  ok(Buffer.from(sent.init.body as Uint8Array).toString('utf8') === BODY, 'valid signature: forwards the raw body byte for byte');
  ok(logs.length === 1 && /^lead-hook 200 upstream 200 \d+ms$/.test(logs[0]), 'log line has only status codes and timing: ' + logs[0]);
  const all = logs.join(' ');
  ok(!all.includes('lead-log.invalid') && !all.includes('test-key') && !all.includes(SECRET) && !all.includes('Test Lead') && !all.includes(goodSig), 'logs never contain the URL, key, secret, body or signature');
}
for (const answer of ['duplicate', 'ignored', ' ok\n']) {
  const res = await makeHandler(envWith(ENV), fakeFetch(200, answer), () => {})(req(BODY, goodSig));
  ok(res.status === 200, `lead log answers ${JSON.stringify(answer)}: 200`);
}
{
  const calls: Call[] = [];
  const res = await makeHandler(envWith(ENV), fakeFetch(200, 'ok', calls), () => {})(req(BODY, sign({ iss: 'netlify', sha256: sha(BODY) }, 'not-the-secret')));
  ok(res.status === 401 && calls.length === 0 && (await res.text()) === '', 'bad signature: 401, no detail, nothing forwarded');
}
{
  const calls: Call[] = [];
  const tampered = BODY.replace('Test Lead', 'Other Lead');
  const res = await makeHandler(envWith(ENV), fakeFetch(200, 'ok', calls), () => {})(req(tampered, goodSig));
  ok(res.status === 401 && calls.length === 0, 'tampered body (signature from the original body): 401, nothing forwarded');
}
{
  const res = await makeHandler(envWith(ENV), fakeFetch(200, 'ok'), () => {})(req(BODY));
  ok(res.status === 401, 'missing X-Webhook-Signature: 401');
}
for (const missing of ['LEAD_HOOK_JWS_SECRET', 'LEAD_LOG_URL']) {
  const calls: Call[] = [];
  const res = await makeHandler(envWith({ ...ENV, [missing]: undefined }), fakeFetch(200, 'ok', calls), () => {})(req(BODY, goodSig));
  ok(res.status === 503 && calls.length === 0, `missing ${missing}: 503`);
}
for (const [status, text, why] of [[500, 'error', 'HTTP 500'], [200, 'forbidden', 'answer "forbidden" (wrong key)'], [200, 'bad request', 'answer "bad request"'], [200, '<html>login</html>', 'an HTML page']] as const) {
  const res = await makeHandler(envWith(ENV), fakeFetch(status, text), () => {})(req(BODY, goodSig));
  ok(res.status === 502, `lead log error (${why}): 502 so Netlify retries`);
}
{
  const res = await makeHandler(envWith(ENV), fakeFetch(200, 'ok', [], true), () => {})(req(BODY, goodSig));
  ok(res.status === 502, 'lead log unreachable or timed out: 502');
}
{
  const res = await makeHandler(envWith(ENV), fakeFetch(200, 'ok'), () => {})(req('', undefined, 'GET'));
  ok(res.status === 405, 'GET: 405');
}
{
  const big = JSON.stringify({ pad: 'x'.repeat(MAX_BYTES) });
  const res = await makeHandler(envWith(ENV), fakeFetch(200, 'ok'), () => {})(req(big, sign({ iss: 'netlify', sha256: sha(big) })));
  ok(res.status === 413, 'body over 100 KB: 413');
}

// Redirect followed, with real fetch against a local server that behaves like Apps Script:
// the POST runs the script, then answers 302 to a page that shows the script's output.
{
  let posted = ''; let postedType = ''; let postedQuery = '';
  const server = createServer((r, s) => {
    const url = new URL(r.url || '/', 'http://127.0.0.1');
    if (url.pathname === '/exec' && r.method === 'POST') {
      let data = ''; r.on('data', (c) => (data += c)); r.on('end', () => { posted = data; postedType = String(r.headers['content-type']); postedQuery = url.search; s.writeHead(302, { location: '/echo?user_content_key=abc' }); s.end(); });
    } else if (url.pathname === '/echo' && r.method === 'GET') {
      s.writeHead(200, { 'content-type': 'text/plain' }); s.end('ok');
    } else { s.writeHead(404); s.end(); }
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const port = (server.address() as AddressInfo).port;
  const res = await makeHandler(envWith({ ...ENV, LEAD_LOG_URL: `http://127.0.0.1:${port}/exec?k=test-key` }), fetch, () => {})(req(BODY, goodSig));
  server.close();
  ok(res.status === 200 && posted === BODY && postedType === 'application/json' && postedQuery === '?k=test-key', 'redirect followed: POST reached /exec with the body and ?k=, the 302 was followed to "ok", 200');
}

console.log('fails:', fails);
process.exit(fails ? 1 : 0);
