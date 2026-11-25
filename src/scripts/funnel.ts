// First party step counter, browser side (see docs/funnel-counter.md and
// netlify/functions/funnel.mts). Sends {f, s, e} to /api/f on this site with
// navigator.sendBeacon. Nothing else: no answers, no identifiers, no cookies, no storage.
// Each (form, event, step) is sent at most once per page load. Does nothing if
// sendBeacon is missing. No request goes to any other host.
type Form = 'estimate' | 'checklist' | 'readiness';
type Ev = 'view' | 'start' | 'finish' | 'submit';
const sent = new Set<string>();

export function count(f: Form, e: Ev, s = 0) {
  if (typeof navigator === 'undefined' || typeof navigator.sendBeacon !== 'function') return;
  const key = `${f}/${e}/${s}`;
  if (sent.has(key)) return;
  sent.add(key);
  try { navigator.sendBeacon('/api/f', JSON.stringify({ f, s, e })); } catch { /* never block the page */ }
}
