# First party step counter

Status: **needs Ellard's approval in the pull request** (CLAUDE.md rule 8). Added 2026-11-25.

The counter tells ECM how many people reach each step of the estimate form, start and send a checklist request, and start and finish the project readiness check. It counts steps. It does not track people.

## What is collected

Each event is three values, sent by the browser to `/api/f` on the site itself:

| Value | Meaning | Allowed values |
| --- | --- | --- |
| `f` | Which form | `estimate`, `checklist`, `readiness` |
| `e` | What happened | `view`, `start`, `finish`, `submit` |
| `s` | Step number | Whole number 0 to 10 |

When each event is sent:

| Form | Event | Step value | When |
| --- | --- | --- | --- |
| Estimate | `view` | 1 to 6 | The first time each step of the form is shown on a page load |
| Estimate | `submit` | 6 | The form passes its checks and is sent |
| Checklist | `start` | 1 to 4 (which checklist) | First focus on a field of the checklist request form |
| Checklist | `submit` | 1 to 4 | The checklist request form is sent |
| Readiness | `start` | 0 | The first answer |
| Readiness | `finish` | 0 | The result is shown |

Checklist numbers: 1 hiring a general contractor, 2 cost to build a house, 3 bathroom remodel cost, 4 ADUs and ohana units (`src/content/checklists.ts`).

Each event is sent once per page load at most. The server stores it as one record in the Netlify Blobs store `funnel`:

- key: `CONTEXT/YYYY-MM-DD/f/e/s/random-id`, for example `production/2026-11-25/estimate/view/2/<random id>`
- value: `1`

`CONTEXT` is the Netlify deploy context (`production`, `deploy-preview` or `branch-deploy`), so preview testing never mixes with live counts. The date is the Hawaii date. The random id only keeps records apart; it is new for every event and is not linked to anything.

## What is not collected

- No IP address, user agent, referrer, page address or query string is stored or logged by the function.
- No cookie, local storage, session storage or other identifier is set or read for counting.
- No form answers. The readiness check sends no answers and no result; it only says that someone started and finished.
- No names, emails, phone numbers or anything a person types.
- No request goes to any host other than the site itself. No third party script, pixel or analytics service.

Netlify itself keeps standard platform request logs for its own operation, as it does for every page request. The counter adds nothing to them.

## How it works

- Browser: `src/scripts/funnel.ts` calls `navigator.sendBeacon('/api/f', '{"f":...,"s":...,"e":...}')`. If the browser has no `sendBeacon`, nothing is sent. It is a small same-origin script in the page bundle, not an inline script, so the Content-Security-Policy (`script-src 'self'`, `connect-src 'self'`) stays strict.
- Server: `netlify/functions/funnel.mts` (Netlify Functions v2, path `/api/f`). It rejects any body over 200 bytes, any value outside the lists above and any extra field, and answers 204 on success. It writes nothing to logs.

## Report

`GET /api/f/report?days=N` (N from 1 to 90, default 7) with the header `Authorization: Bearer <FUNNEL_REPORT_TOKEN>` returns JSON counts by Hawaii day, form, event and step:

```json
{ "context": "production", "timeZone": "Pacific/Honolulu", "days": 7, "from": "2026-11-19", "to": "2026-11-25",
  "rows": [ { "date": "2026-11-25", "f": "estimate", "e": "view", "s": 1, "count": 12 } ] }
```

- Works on the production site only (404 on previews). Counts production records only.
- 503 if `FUNNEL_REPORT_TOKEN` is not set, 401 if the token is missing or wrong.
- `FUNNEL_REPORT_TOKEN` is set by Ellard in Netlify's environment variables (Functions scope). It is never in the repo. The weekly lead log summary (`ops/lead-log`) reads the same token from its own Script Properties.

## Limits and costs

- Anyone can send a well formed event, so counts can be inflated on purpose. They are a guide, not an audit.
- Netlify Free plan (PM, 2026-11-25): web requests cost 2 credits per 10,000 and compute 10 credits per GB-hour. Each event is one small function call. Netlify Blobs limits on the Free plan were not checked.
- Not tested on a deploy preview from the build session (the preview host was not reachable). Test after deploy: open the estimate form on the preview, then check the Blobs store `funnel` in the Netlify UI for `deploy-preview/...` keys.

## Turning it off

Remove the `count(...)` calls (or `src/scripts/funnel.ts`) and the function file. Stored records can be deleted from the Netlify UI (Blobs, store `funnel`).
