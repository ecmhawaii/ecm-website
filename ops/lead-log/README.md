# ECM lead log (Google Sheet + Apps Script)

Code only. Nothing here is deployed by the website build. No URLs, keys or lead data belong in this repo: the script's secrets live in its **Script Properties**, the relay's secrets live in **Netlify environment variables**, and leads live only in the Google Sheet.

What it does:

- **New leads.** Netlify posts each estimate, contact and checklist request to the site's relay (`/api/lead-hook`), which forwards it to the script (see "Netlify setup: the lead relay"). The subcontractor form is ignored. The script adds one row to the Leads tab and emails both teammates a Claim link, on any day and at any hour.
- **Claiming.** The Claim link opens a page with the lead's first name, project type and a Claim button.
  - Opening the link claims nothing, so email scanners that prefetch links can't claim a lead.
  - The first tap on Claim wins. The other person gets an email: "<name> claimed it".
  - Opening the link after that shows who already claimed it.
- **Touches.** Tick **Log touch** on a row after each call, text or email. The script counts the touch, stamps the time and sets **Next touch** from the Cadence tab.
- **Reminders.** Nudges and digests only go out on the **response days** set on the Settings tab (default Mon to Sat).
  - Every 5 minutes on response days, 7:00 to 19:00 Hawaii time: one nudge for any lead still New and unclaimed after 15 minutes. A lead that came in on Sunday gets its nudge Monday from 7:00.
  - 07:00 on response days: a digest of leads since the last response day's window closed (19:00), touches due today and overdue leads. With Mon to Sat, Monday's digest covers Saturday 19:00 to Monday 07:00.
  - Every Monday at 07:00: a weekly summary, including the website's step counts.
- **Flood cap.** If more leads arrive in an hour than "Max claim emails per hour" (default 10), the extra rows are still added but their claim emails stop. Both people get one alert, at most once an hour: "Unusual number of leads in the last hour, check the lead log". Each lead counts once, however many people it emails. Leads held back this way get the normal nudge later, once the hour's count drops, and the nudges count toward the cap too.

Files: `Code.gs` (the script), `appsscript.json` (time zone Pacific/Honolulu, V8, web app settings).

## Setup (account owner, about 20 minutes)

1. **Create the sheet.** In the Google account that should own the leads, create a new Google Sheet named "ECM lead log". Share it only with the two people who handle leads.
2. **Paste the code.**
   1. In the sheet, choose Extensions > Apps Script.
   2. Replace the contents of `Code.gs` with this folder's `Code.gs`.
   3. In Project Settings, tick "Show appsscript.json manifest file in editor", open `appsscript.json` and replace it with this folder's `appsscript.json`.
   4. Save.
3. **Set Script Properties.** Go to Project Settings > Script Properties and add these keys. Values never go in the code or on the sheet.

   | Key | Value |
   | --- | --- |
   | `WEBHOOK_KEY` | A long random string (40 or more letters and numbers). It goes at the end of `LEAD_LOG_URL` in Netlify as `?k=` |
   | `CLAIM_SECRET` | A different long random string |
   | `TEAM_1_NAME`, `TEAM_1_EMAIL` | First person's name and email |
   | `TEAM_2_NAME`, `TEAM_2_EMAIL` | Second person's name and email |
   | `SITE_URL` | The live site origin, for example the production address in `site.config.mjs` |
   | `FUNNEL_REPORT_TOKEN` | The same value Ellard sets as `FUNNEL_REPORT_TOKEN` in Netlify |
   | `WEB_APP_URL` | Optional. The web app URL from step 5, if Claim links ever point to the wrong deployment |

4. **Create the tabs.**
   1. In the editor, pick `setupSheet` in the function menu and click Run.
   2. Approve the permissions when Google asks. The spreadsheet permission should read "spreadsheets that this application has been installed in", not all of your spreadsheets (see "Access to this sheet only" below).
   3. This creates the Leads, Cadence and Settings tabs with headers, the Status dropdown and the date formats. Each new lead row gets its own Log touch checkbox when it arrives; empty rows have none.
5. **Deploy as a web app.**
   1. Deploy > New deployment > type Web app.
   2. Set Execute as to **Me** (the owner) and Who has access to **Anyone**.
   3. Click Deploy and copy the web app URL (it ends in `/exec`).
6. **Add the triggers.** Run `setupTriggers` once. This adds:
   - `nudgeUnclaimed`: every 5 minutes (it does nothing outside response days and 7:00 to 19:00)
   - `dailyDigest`: daily, 07:00 Hawaii time (it does nothing outside response days)
   - `weeklySummary`: Mondays, 07:00 Hawaii time

   Google runs hourly triggers some time within that hour, so a 07:00 trigger can arrive up to about 08:00.
7. **Test the script directly with a fake lead.** This skips the relay and talks to the script itself. Replace the two `<...>` parts with your values (keep the URL only on your machine) and run:

   ```bash
   curl -L -X POST "<web app URL>?k=<WEBHOOK_KEY>" -H "Content-Type: application/json" -d '{"id":"test000000000001","form_name":"estimate","created_at":"2026-11-25T20:00:00Z","data":{"name":"Test Lead","phone":"0000000000","email":"test@example.org","project-type":"Kitchen remodel","island":"Oahu","timeline":"Just planning","lead-type":"estimate","source-page":"/test","form-version":"test"}}'
   ```

   Then check that:
   - The response is `ok`, and a second identical POST answers `duplicate`.
   - A Leads row appears on row 2 (the first row under the headers).
   - Both people get a Claim email, and the first tap on Claim wins.
   - The other person gets "<name> claimed it".

   Delete the test row afterwards.

## Netlify setup: the lead relay

Netlify can't post straight to the script. An Apps Script web app answers every POST with a 302 redirect, Netlify counts that as a failure, retries, and turns the webhook off after 6 failures (seen on 2026-11-26: one lead, 6 runs, webhook disabled). So Netlify posts to a small function on our own site, `netlify/functions/lead-hook.mts` at `/api/lead-hook`.

The relay:
1. Checks Netlify's signature on the request.
2. Forwards the submission to the script, following the redirect.
3. Answers Netlify with a plain 200 when the script says `ok`, `duplicate` or `ignored`. Otherwise it answers 502 and Netlify retries. Retries are safe: the script dedupes by Netlify ID.

### 1. Netlify environment variables (Ellard sets them)

In Netlify, go to Site configuration > Environment variables. Add both variables, marked **secret**, with the same value for **all deploy contexts**. Never put either value in the repo, the sheet, a chat or an email.

| Variable | Value |
| --- | --- |
| `LEAD_LOG_URL` | The web app URL (ends in `/exec`) + `?k=` + the `WEBHOOK_KEY` from Script Properties |
| `LEAD_HOOK_JWS_SECRET` | A new long random string (40 or more letters and numbers) |

Trigger a new deploy afterwards (for example push a commit, or Deploys > Trigger deploy), so the function picks the variables up. The relay answers 503 until both variables are set.

### 2. One outgoing webhook per form

In Netlify, go to Site configuration > Notifications > Emails and webhooks > Form submission notifications. For each of `estimate`, `contact` and `checklist-request`, add one **Outgoing webhook** with:

- Event: New form submission, for that form
- URL to notify: `https://<site>/api/lead-hook`
- JWS secret token: the same value as `LEAD_HOOK_JWS_SECRET`

Do not add one for `subcontractor` (the script ignores it anyway). Delete the old webhooks that pointed straight at the script, including the one Netlify turned off.

**Which `<site>`:**
- **Before launch:** the deploy preview, so the URL is `https://deploy-preview-2--ecmhawaii.netlify.app/api/lead-hook`.
- **At launch:** change all three URLs to `https://ecmhawaii.com/api/lead-hook`. If www is chosen as the primary domain, use `https://www.ecmhawaii.com/api/lead-hook` instead. The URL must be the primary domain itself, because a redirect makes Netlify count the delivery as failed. This step is in the launch runbook and in `npm run check:launch` notes.

### What Netlify sends, and what the relay checks

Each submission arrives as JSON with its `id`, `form_name`, `created_at` and `data`. The script keeps the fields listed under Tabs and drops the IP address, user agent and referrer that Netlify includes.

The relay accepts a request only when its `X-Webhook-Signature` header passes these checks:
- It is a JWS signed HS256 with `LEAD_HOOK_JWS_SECRET`.
- Its `iss` claim is `netlify`.
- Its `sha256` claim matches the SHA-256 of the exact body.

Anything else gets 401, and nothing is forwarded. The relay logs only status codes and timing.

Not verified from the build session: docs.netlify.com could not be opened, so this signature format comes from the PM brief and has not been checked against Netlify's docs. If Netlify's notification log shows 401 from `/api/lead-hook` for every delivery, the format differs. Turn the webhooks off and ask for the relay to be checked. Submissions stay in Netlify Forms either way, so no lead is lost.

### Rotating the WEBHOOK_KEY

No code change and no new deployment version:
1. In Apps Script, set a new `WEBHOOK_KEY` in Script Properties.
2. In Netlify, update `LEAD_LOG_URL` so it ends in `?k=` + the new key.
3. Trigger a new deploy so the relay picks up the new value.

Between steps 1 and 3 the script answers `forbidden`, the relay answers 502, and Netlify retries, so make the two changes close together. To rotate `LEAD_HOOK_JWS_SECRET`, change it in Netlify and in all three webhooks at the same time, then deploy.

## Tabs

**Leads.** One row per lead. The script fills these columns:
- Received (HST), Netlify ID, Form, Lead type
- Name, Phone, Email, Island, Project type, Details
- Heard about, Source page, Form version (which form and consent wording was shown, for example `v2-multistep+sms-2026-11-26`), Text OK, Email OK
- Owner, Claimed at, Minutes to claim
- Status (starts at New), Touches, Last touch, Next touch

People fill:
- **Status** (New, Contacted, Site visit booked, Proposal sent, Won, Lost, Nurture)
- **Log touch** (tick it, and the script unticks it)
- **Outcome reason** (for Lost)
- **Notes**
- **First contact at** is stamped on the first Log touch

**Cadence.** When the next touch falls, by status. Editable. Defaults:

| Status | Touches |
| --- | --- |
| New or Contacted | Day 0, 1, 3 (useful email with a guide or checklist link), 5, 7 (close the loop), then monthly for 3 months, then the status moves to Nurture. Counted from when the lead came in. |
| Proposal sent | Day 2, 5, 10, then every 14 days. Counted from when the status changed. |
| Nurture | A personal email within one business day (`1b`), day 7, then monthly. |
| Site visit booked, Won, Lost | No automatic touches. |

Changing a row's Status starts that status's cadence. The weekly summary counts site visits, proposals and wins from each lead's current status.

**Settings.** Edit the Value column; the script reads it on every run.

| Setting | Default | Meaning |
| --- | --- | --- |
| Nudge after (minutes) | 15 | How long a lead can sit New and unclaimed before the nudge |
| Nudge window start (hour, HST) | 7 | Nudges start, and the digest's window ends, at this hour |
| Nudge window end (hour, HST) | 19 | Nudges stop, and the next digest's window starts, at this hour |
| Response days | Mon to Sat | Days nudges and digests run. Write a range ("Mon to Sat"), a list ("Mon, Wed, Fri") or both ("Mon to Fri, Sun"). Blank or unreadable means Mon to Sat |
| Max claim emails per hour | 10 | Flood cap, counted in leads per rolling hour |

No secrets go on this tab. Running `setupSheet` again adds any missing setting with its default and leaves the others alone. That's the way to add the two new rows to a sheet made before 2026-11-26. It also adds any missing Leads column (such as Form version) at the end of an older Leads tab; the script finds columns by header name, so the position does not matter.

## Access to this sheet only

The first line of `Code.gs` is `/** @OnlyCurrentDoc */`. It limits the script to the spreadsheet it is installed in, the lead log, and no other file in the owner's Google Drive. The script only ever opens that sheet (`SpreadsheetApp.getActive`), so nothing else needs access.

When you approve the script, the spreadsheet permission should read "spreadsheets that this application has been installed in". If it asks for access to all your spreadsheets, the first line is missing: paste the full `Code.gs` again.

## Updating the deployed code

When `Code.gs` changes in the repo:

1. Open the lead log sheet, then Extensions > Apps Script.
2. Select everything in `Code.gs`, paste the new `Code.gs` from this folder over it, and click Save.
3. Deploy > Manage deployments. Click the pencil icon on the existing **active** web app deployment, set Version to **New version**, and click Deploy.

   Never use Deploy > New deployment for an update. It creates a new web app URL, and the old one can end up archived and stop working, while `LEAD_LOG_URL` in Netlify and old Claim links still point to it. Editing the active deployment keeps the same URL, so nothing in Netlify changes.
4. If the update added Settings rows or Leads columns, run `setupSheet` once more. It only adds what is missing and leaves your data alone.

**Update of 2026-11-26 (row 1001 fix).** The first setup pre-filled empty Log touch checkboxes down the whole Leads tab. An unticked checkbox holds FALSE, which Sheets counts as content, so new leads were written near row 1001 instead of under the headers. After pasting the new code and redeploying:
- Run `setupSheet` once. It removes the blank checkboxes from rows that have no Netlify ID and keeps the ones on real leads.
- Move or delete the test lead that landed near row 1001. If you keep it, cut the whole row and paste it on row 2.

New leads are now written right under the last row that has a Netlify ID.

## If lead log emails go to spam

The claim, nudge, digest and summary emails are sent by Google from the script owner's ecmhawaii.com address. Email for ecmhawaii.com is forwarded by Hostinger, and that forwarding can make Gmail distrust those messages. If they land in spam, each person adds a Gmail filter once:

1. In Gmail, open Settings > See all settings > Filters and blocked addresses > Create a new filter.
2. In From, enter `ellard@ecmhawaii.com` (the address the lead log emails come from).
3. Click Create filter, tick **Never send it to Spam**, and click Create filter again.

This changes nothing in the email settings for ecmhawaii.com. It only tells each person's Gmail to trust these messages.

## Privacy rules for this script

- Lead data is never written to Logger or console. The code has no Logger or console calls.
- Form text that starts with `=`, `+`, `-` or `@` is stored as plain text, so it can't run as a formula.
- Claim links are signed per lead and per person (HMAC with `CLAIM_SECRET`). Changing `CLAIM_SECRET` breaks all old links.
- Not checked: Apps Script quotas (emails per day, trigger runtime) for the owner's account type.
