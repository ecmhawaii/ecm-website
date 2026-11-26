# ECM lead log (Google Sheet + Apps Script)

Code only. Nothing here is deployed by the website build. No URLs, keys or lead data belong in this repo: secrets live in the script's **Script Properties**, and leads live only in the Google Sheet.

What it does:

- **New leads.** Netlify posts each estimate, contact and checklist request to the script. The subcontractor form is ignored. The script adds one row to the Leads tab and emails both teammates a Claim link, on any day and at any hour.
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
   | `WEBHOOK_KEY` | A long random string (40 or more letters and numbers) |
   | `CLAIM_SECRET` | A different long random string |
   | `TEAM_1_NAME`, `TEAM_1_EMAIL` | First person's name and email |
   | `TEAM_2_NAME`, `TEAM_2_EMAIL` | Second person's name and email |
   | `SITE_URL` | The live site origin, for example the production address in `site.config.mjs` |
   | `FUNNEL_REPORT_TOKEN` | The same value Ellard sets as `FUNNEL_REPORT_TOKEN` in Netlify |
   | `WEB_APP_URL` | Optional. The web app URL from step 5, if Claim links ever point to the wrong deployment |

4. **Create the tabs.**
   1. In the editor, pick `setupSheet` in the function menu and click Run.
   2. Approve the permissions when Google asks.
   3. This creates the Leads, Cadence and Settings tabs with headers, the Status dropdown and the Log touch checkboxes.
5. **Deploy as a web app.**
   1. Deploy > New deployment > type Web app.
   2. Set Execute as to **Me** (the owner) and Who has access to **Anyone**.
   3. Click Deploy and copy the web app URL (it ends in `/exec`).
6. **Add the triggers.** Run `setupTriggers` once. This adds:
   - `nudgeUnclaimed`: every 5 minutes (it does nothing outside response days and 7:00 to 19:00)
   - `dailyDigest`: daily, 07:00 Hawaii time (it does nothing outside response days)
   - `weeklySummary`: Mondays, 07:00 Hawaii time

   Google runs hourly triggers some time within that hour, so a 07:00 trigger can arrive up to about 08:00.
7. **Test with a fake lead.** Replace the two `<...>` parts with your values (keep the URL only on your machine) and run:

   ```bash
   curl -L -X POST "<web app URL>?k=<WEBHOOK_KEY>" -H "Content-Type: application/json" -d '{"id":"test000000000001","form_name":"estimate","created_at":"2026-11-25T20:00:00Z","data":{"name":"Test Lead","phone":"0000000000","email":"test@example.org","project-type":"Kitchen remodel","island":"Oahu","timeline":"Just planning","lead-type":"estimate","source-page":"/test"}}'
   ```

   Then check that:
   - The response is `ok`, and a second identical POST answers `duplicate`.
   - A Leads row appears.
   - Both people get a Claim email, and the first tap on Claim wins.
   - The other person gets "<name> claimed it".

   Delete the test row afterwards.

## Netlify outgoing webhooks to add

In Netlify, go to Site configuration > Notifications > Emails and webhooks > Form submission notifications. Add one **Outgoing webhook** per form, with the event "New form submission":

| Form | URL to notify |
| --- | --- |
| `estimate` | `<web app URL>?k=<WEBHOOK_KEY>` |
| `contact` | `<web app URL>?k=<WEBHOOK_KEY>` |
| `checklist-request` | `<web app URL>?k=<WEBHOOK_KEY>` |

Do not add one for `subcontractor` (the script ignores it anyway). Netlify sends each submission as JSON with its `id`, `form_name`, `created_at` and `data`. The script keeps the fields listed below and drops the IP address, user agent and referrer that Netlify includes.

Not verified from the build session:
- **302 redirect:** Apps Script answers POSTs with a 302 redirect to Google's content server. The script still runs before the redirect. If Netlify's notification log shows failures but rows do appear, that is the reason.
- **Signatures:** the script cannot read request headers, so it checks `?k=` instead of Netlify's JWS signature.

## Tabs

**Leads.** One row per lead. The script fills these columns:
- Received (HST), Netlify ID, Form, Lead type
- Name, Phone, Email, Island, Project type, Details
- Heard about, Source page, Text OK, Email OK
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

No secrets go on this tab. Running `setupSheet` again adds any missing setting with its default and leaves the others alone. That's the way to add the two new rows to a sheet made before 2026-11-26.

## Privacy rules for this script

- Lead data is never written to Logger or console. The code has no Logger or console calls.
- Form text that starts with `=`, `+`, `-` or `@` is stored as plain text, so it can't run as a formula.
- Claim links are signed per lead and per person (HMAC with `CLAIM_SECRET`). Changing `CLAIM_SECRET` breaks all old links.
- Not checked: Apps Script quotas (emails per day, trigger runtime) for the owner's account type.
