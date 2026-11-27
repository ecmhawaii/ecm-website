# Launch runbook: ecmhawaii.com on Netlify

Document only. Nothing in this runbook has been done yet. Written 2026-11-24 against branch `build/site-v1` at `2f94e63`. Read it with the audit: `docs/prelaunch-audit-2026-11-24.md`.

## Who does what

| Who | Does |
| --- | --- |
| **Ellard** | Netlify, Hostinger, Search Console, merges pull requests |
| **Jesse** | Final sign-off and written OKs; brings the attorney items to the attorney |
| **Claude session** | Code changes on a branch, the build and checks, a pull request listing every change. Never merges, never logs in to anything, never submits a form |

## Rules for the whole launch

1. **DNS stays at Hostinger.** Never change nameservers. Never use Hostinger "Reset DNS records", "Import" with "Replace", or any setup wizard that rewrites the zone.
2. **Touch only the web records.** Change only the 2 or 3 records listed in step 4.2. Every email record and the Search Console TXT record must look exactly the same after as before.
3. **One test only.** The only form submission is the test in step 7.2.
4. **Jesse hears first.** If anything breaks, Jesse hears about it by text before any client does.

## Jesse's part (short version to text him)

1. Read the site on your phone when Ellard sends the preview link. Reply "OK to launch" or what to change.
2. Confirm in writing the items the audit lists (license number, client names, the service lines). One text is enough.
3. Ask the attorney about "fixed price contract" and "price is set up front" and the guides. Send Ellard the answer.

## Sources used

This session could not open these pages directly: its network policy blocks docs.netlify.com, support.hostinger.com and the other hosts. The facts below come from web search results drawn from these official pages on 2026-11-24. **Open each page and confirm the values on launch day**, especially the Netlify IP address and hostname.

**Netlify**

- Configure external DNS for a custom domain: https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/
- Manage multiple domains (primary domain, automatic www and bare redirect): https://docs.netlify.com/manage/domains/manage-domains/manage-multiple-domains/
- Add a domain alias: https://docs.netlify.com/manage/domains/configure-domains/add-a-domain-alias/
- Get started with domains: https://docs.netlify.com/manage/domains/get-started-with-domains/
- HTTPS (SSL): https://docs.netlify.com/manage/domains/secure-domains-with-https/https-ssl/
- Troubleshoot SSL and HTTPS: https://docs.netlify.com/manage/domains/troubleshooting/troubleshoot-ssl-and-https/
- DNS and HTTPS troubleshooting tips: https://docs.netlify.com/manage/domains/troubleshooting-tips/
- Redirect options (forcing with `!`, domain level rules): https://docs.netlify.com/manage/routing/redirects/redirect-options/
- Redirects and rewrites: https://docs.netlify.com/manage/routing/redirects/overview/
- Form notifications: https://docs.netlify.com/manage/forms/notifications/
- Forms setup: https://docs.netlify.com/manage/forms/setup/
- Production launch checklist: https://docs.netlify.com/resources/checklists/production-checklist/
- Community forum, not official: netlify.app to custom domain redirect, https://answers.netlify.com/t/redirect-netlify-app-to-custom-domain/16139
- Community forum, not official: "Verify DNS configuration" for stuck certificates, https://answers.netlify.com/t/support-guide-troubleshooting-ssl-certificate-errors/39865

**Hostinger**

- Manage DNS records: https://support.hostinger.com/en/articles/1583249-how-to-manage-my-dns-records-on-hpanel
- A records: https://support.hostinger.com/en/articles/4468886-how-to-manage-a-records
- CNAME records: https://support.hostinger.com/en/articles/4738777-how-to-manage-cname-records-on-hpanel
- ALIAS records: https://support.hostinger.com/en/articles/10067986-how-to-manage-alias-records
- Point a domain to external services: https://support.hostinger.com/en/articles/4737652-how-to-point-a-domain-to-external-services-at-hostinger
- Hostinger Email MX records: https://support.hostinger.com/en/articles/4407237-hostinger-email-mx-records
- SPF for Hostinger Email: https://support.hostinger.com/en/articles/1583673-how-to-add-spf-records-for-emails-at-hostinger
- DKIM for Hostinger Email: https://support.hostinger.com/en/articles/4456413-what-are-the-dkim-records-for-hostinger-email
- DMARC: https://support.hostinger.com/en/articles/8412851-how-to-add-a-dmarc-record
- Set up a domain for Hostinger Mail: https://support.hostinger.com/en/articles/8650765-set-up-a-domain-for-hostinger-email

**Google**

- Sitemaps report: https://support.google.com/webmasters/answer/7451001
- Build and submit a sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Site moves with URL changes: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- Redirects and Google Search: https://developers.google.com/search/docs/crawling-indexing/301-redirects
- Change of Address tool (says it is not for www to bare moves): https://support.google.com/webmasters/answer/9370220
- Verify your site ownership (keep the TXT record): https://support.google.com/webmasters/answer/9008080

**IndexNow**

- Documentation: https://www.indexnow.org/documentation
- FAQ: https://www.indexnow.org/faq
- Bing, how to add IndexNow: https://www.bing.com/indexnow/getstarted

What those pages say, in short:

- **Netlify DNS records.** With DNS outside Netlify, point the bare domain at Netlify with an ALIAS, ANAME or flattened CNAME to `apex-loadbalancer.netlify.com` (preferred), or an A record to `75.2.60.5` (fallback). Point `www` with a CNAME to `<site-name>.netlify.app`.
- **Netlify primary domain.** With external DNS, Netlify recommends `www` as the primary domain, because an apex primary can hurt performance with outside DNS. Whichever name is primary, Netlify redirects the other one to it automatically.
- **Record cleanup.** Remove leftover AAAA records (Netlify's load balancer has no IPv6) and keep only one A record on the bare domain.
- **Certificates.** Netlify issues a free Let's Encrypt certificate once DNS points at it. It retries every 10 minutes for 24 hours, then hourly for two days. A CAA record that does not allow Let's Encrypt blocks the certificate.
- **Hostinger.** DNS records live under Domains, the domain, DNS / Nameservers. The zone can be exported first, and there is a DNS history tab. An ALIAS record is supported for the root. Changing the `www` CNAME can affect Hostinger CDN if it is on. Allow up to 24 hours for changes to spread.
- **Hostinger Email records.**

  | Record | Value |
  | --- | --- |
  | MX | `mx1.hostinger.com` (priority 5) and `mx2.hostinger.com` (priority 10) |
  | SPF (TXT on root) | includes `_spf.mail.hostinger.com` |
  | DKIM | 3 CNAMEs, `hostingermail-a/b/c._domainkey`, pointing to `dkim.mail.hostinger.com` hosts |
  | DMARC | TXT on `_dmarc` |

- **Google, sitemaps.** Submitting a sitemap needs Owner permission in Search Console.
- **Google, www to bare.** A www to bare move on the same domain does not use the Change of Address tool; use 301 redirects and correct canonicals, and keep redirects at least a year.
- **Google, verification.** Removing the verification TXT record makes Search Console verification expire.

## 0. Decide first: www or bare domain (Ellard decides)

Facts today:

- **Google has the old site indexed on www.** The old builder site's sitemap lists 3 URLs on `www`: `https://www.ecmhawaii.com`, `/start-your-project` and `/portfolio`.
- **The new site is set to the bare domain.** `SITE` in `site.config.mjs` is `https://ecmhawaii.com`. Canonicals, the sitemap, the share image URLs, the IndexNow script and the Sitemap line in `robots.launch.txt` all follow it.
- **The old paths still exist.** `/start-your-project` and `/portfolio` are on the new site at the same paths, so only the host name can change. No page addresses change.
- **DNS and email stay at Hostinger.**

| | Option A: www is primary | Option B: bare domain is primary |
| --- | --- | --- |
| Address people see | `https://www.ecmhawaii.com` | `https://ecmhawaii.com` |
| Hostinger records | ALIAS `@` to `apex-loadbalancer.netlify.com` (or A `@` to `75.2.60.5`); CNAME `www` to `<site-name>.netlify.app` | The same two records |
| Netlify primary domain | `www.ecmhawaii.com` (bare redirects to it) | `ecmhawaii.com` (www redirects to it) |
| Code changes | 2 lines: `SITE` in `site.config.mjs`, and the Sitemap line in `public/robots.launch.txt` | None |
| The 3 indexed URLs | Unchanged, same host and same paths. No redirect needed | Each 301s from www to the same path on the bare domain |
| Netlify's advice for outside DNS | Followed | Not followed (apex primary served through a single load balancer address) |
| Search effect | None: Google keeps the same URLs | A host move: Google re-processes the URLs through 301s. Small with 3 URLs, but a few days of churn are normal |

**Recommendation: Option A, www as primary.** It keeps the URLs Google already has and follows Netlify's advice for DNS outside Netlify, for the cost of two one-line code changes. Ellard decides; everything below gives both options.

## 1. Before launch day

1. **Clear the audit blockers.** (Jesse, Ellard)
   - Get Jesse's written OKs for the unsourced claims (audit finding 5).
   - Get the attorney's answer on findings 3 and 4, or remove those lines.
   - **Verify:** the launch pull request description lists each blocker and how it was closed.
2. **Fix the "fix before launch" items.** (Claude session) Put audit findings 6 to 17 in the launch pull request, or record why one waits.
   - **Verify:** `npm run build` passes, and the pull request lists every change (CLAUDE.md rule 10).
3. **Record the DNS zone before anything changes.** (Ellard) In Hostinger (Domains, ecmhawaii.com, DNS / Nameservers):
   - Take a full page screenshot of every record.
   - Export the zone file.
   - Save both somewhere private, not in this public repo.
   - Note the exact current values of: A `@`, AAAA `@` (if any), CNAME or A `www`, and any CAA records.
   - **Verify:** you can open the export and the screenshot shows MX, TXT and CNAME rows.
4. **Check Hostinger CDN.** (Ellard) If Hostinger CDN is on for this domain, plan to turn it off at step 4.2. Hostinger warns that changing the `www` CNAME with its CDN on affects the site.
5. **Lower the TTL (optional, recommended).** (Ellard) At least a day before launch, set the TTL of only the web records (A or ALIAS `@`, CNAME `www`) to the lowest value Hostinger allows, for example 300 seconds. This makes both the cutover and any rollback fast.
   - **Verify:** the screenshot taken after shows the new TTL on those rows only.
6. **Check form notifications.** (Ellard) In Netlify, open Forms, then Submission notifications.
   - Website leads go to Ellard and Bleys, not Jesse (ECM Standing Decision 2026-11-25). The `estimate`, `contact` and `checklist-request` forms should email `ellard@ecmhawaii.com` and `bleys@ecmhawaii.com`.
   - Only the `subcontractor` form emails `info@ecmhawaii.com`.
   - The `estimate`, `contact` and `checklist-request` forms also post to `/api/lead-hook` (the relay), which writes each lead into the lead log (see the lead relay item below and `ops/lead-log/README.md`).
   - Netlify only emails a recipient outside the Netlify team after that address confirms. Check that the confirmation was clicked.
   - **Verify:** the notification is listed and not marked pending.
   - **Lead relay webhooks (at launch).** The three outgoing webhooks (`estimate`, `contact`, `checklist-request`) point at the deploy preview before launch: `https://deploy-preview-2--ecmhawaii.netlify.app/api/lead-hook`. At launch, change all three to `https://ecmhawaii.com/api/lead-hook`, or `https://www.ecmhawaii.com/api/lead-hook` if www is the primary domain (the URL must not redirect). Keep the JWS secret token. See `ops/lead-log/README.md`.
7. **Check Search Console access.** (Ellard)
   - Confirm you are an **Owner** of the ecmhawaii.com property; submitting a sitemap needs it.
   - Note whether it is a Domain property (verified by the DNS TXT record) or a URL prefix property for `https://www.ecmhawaii.com/`.
   - A Domain property covers www and bare, http and https. With a URL prefix property and option B, add a URL prefix property for `https://ecmhawaii.com/` too, so both are verified.

## 2. Pre-launch code (Claude session on a branch; Ellard reviews and merges)

1. **Final preview sign-off.** (Ellard, then Jesse)
   - Open the deploy preview of the launch pull request on a phone and a computer.
   - Click through all 14 sitemap pages and the 3 guides, the phone link and the photo galleries.
   - Do not submit the forms on the preview.
   - Send Jesse the link.
   - **Verify:** Jesse's "OK to launch" text is saved.
2. **Option A only: switch to www.**
   - In `site.config.mjs`, set `SITE = 'https://www.ecmhawaii.com'`.
   - In `public/robots.launch.txt`, change the last line to `Sitemap: https://www.ecmhawaii.com/sitemap-index.xml`.
   - **Verify:** `check:launch` (step 2.6) passes. It fails if the robots Sitemap line does not match `SITE`.
3. **Turn off noindex.** In `site.config.mjs`, set `SITE_NOINDEX = false`.
4. **Swap robots.txt.** Copy the launch file over the blocking one:

   ```bash
   cp public/robots.launch.txt public/robots.txt
   ```

   Then edit the comment lines at the top of `public/robots.txt` (they say "Not live yet"). Keep `public/robots.launch.txt`, because `check:launch` reads it.
5. **Add `public/_redirects`.**
   - Use the lines for the chosen option from section 6.
   - Leave out the `netlify.app` line; it comes later in step 7.7.
6. **Build and run the launch gate.**

   ```bash
   npm ci && npm run check:launch
   ```

   - **Verify:** the last line is `READY: no launch blockers found.`
   - The only pages still carrying a robots meta tag should be `/thank-you` (if audit finding 10 was fixed) and `/404`:

     ```bash
     grep -l 'name="robots"' dist/*.html dist/guides/*.html
     ```

   - `dist/sitemap-0.xml` should list 14 URLs, all on the primary host.
7. **Open the pull request to `main`.**
   - The description lists every change.
   - Claude never merges.
   - Ellard reviews the deploy preview: view the page source of the home page (no `name="robots"`), and open `/robots.txt` (allows all) and `/sitemap-index.xml` (right host).
   - **Do not merge yet.** The merge is step 4.1, in the launch window.

## 3. Netlify: add the custom domain (Ellard; can be done before launch day)

Adding the domain in Netlify changes nothing for visitors until DNS points to Netlify.

1. In the Netlify site, go to Domain management, then Production domains, and add a domain. Enter `www.ecmhawaii.com` (option A) or `ecmhawaii.com` (option B). Netlify adds the other name for you.
2. **If Netlify offers to set up Netlify DNS or to change nameservers, decline.** That would move the whole zone, email included, away from Hostinger.
3. Next to the chosen name, open Options and choose "Set as primary domain".
4. Write down the site's Netlify address, `<site-name>.netlify.app`, from the site overview. It is the `www` CNAME target in step 4.2.

**Verify:** both names are listed, the chosen one is marked primary, and the status says it is waiting for external DNS.

## 4. Launch window (Ellard)

Pick a quiet weekday morning, Hawaii time, when Ellard can watch for 2 hours. Text Jesse that the launch is starting.

1. **Merge the launch pull request.**
   - Wait until the production deploy shows Published.
   - **Verify:** `https://<site-name>.netlify.app/` shows the new site, its page source has no `name="robots"`, and `/robots.txt` allows all.
2. **Change the web records at Hostinger.** Domains, ecmhawaii.com, DNS / Nameservers, DNS records.
   1. If Hostinger CDN is on for the domain, turn it off first.
   2. **Bare domain (`@`):**
      - Delete the existing A record or records for `@` (the old website address).
      - Delete any AAAA record for `@`.
      - Add **one** of these:
        - ALIAS, name `@`, target `apex-loadbalancer.netlify.com` (preferred, Hostinger supports ALIAS)
        - A, name `@`, value `75.2.60.5`
      - **When deleting A or AAAA rows, do not touch the TXT or MX rows that also have the name `@`.**
   3. **`www`:**
      - Edit the CNAME `www` so it points to `<site-name>.netlify.app`.
      - If `www` is an A record instead, delete it, then add the CNAME.
   4. Use TTL 300, or the lowest Hostinger offers.
3. **Records that must not change.**

   Before and after, as Hostinger normally shows them. These are typical values, not read from the live zone: this session did not log in, and its network could not look up the domain. **Where your screenshot differs, your screenshot is right.** Only the "Change" rows may differ after the launch.

   | Type | Name | Before (typical) | After | Change? |
   | --- | --- | --- | --- | --- |
   | A | `@` | Old website address (Hostinger) | ALIAS `@` to `apex-loadbalancer.netlify.com`, or A `@` `75.2.60.5`; only one | **Change** |
   | AAAA | `@` | Hostinger IPv6 address, if present | Deleted | **Change** |
   | CNAME | `www` | `ecmhawaii.com` or a Hostinger CDN or builder host | `<site-name>.netlify.app` | **Change** |
   | MX | `@` | `mx1.hostinger.com`, priority 5 | Same | **Do not touch** |
   | MX | `@` | `mx2.hostinger.com`, priority 10 | Same | **Do not touch** |
   | TXT (SPF) | `@` | `v=spf1 include:_spf.mail.hostinger.com ~all` | Same | **Do not touch** |
   | CNAME (DKIM) | `hostingermail-a._domainkey` | `hostingermail-a.dkim.mail.hostinger.com` | Same | **Do not touch** |
   | CNAME (DKIM) | `hostingermail-b._domainkey` | `hostingermail-b.dkim.mail.hostinger.com` | Same | **Do not touch** |
   | CNAME (DKIM) | `hostingermail-c._domainkey` | `hostingermail-c.dkim.mail.hostinger.com` | Same | **Do not touch** |
   | TXT (DMARC) | `_dmarc` | `v=DMARC1; p=none; ...` (if present) | Same | **Do not touch** |
   | TXT (Search Console) | `@` | `google-site-verification=...` | Same | **Do not touch** |
   | CNAME | `autodiscover`, `autoconfig` | `autodiscover.mail.hostinger.com`, `autoconfig.mail.hostinger.com` (if present) | Same | **Do not touch** |
   | CAA | `@` | Hostinger defaults, if present | Same (see step 4.4) | Do not touch, unless step 4.4 says so |
   | A, other names | `ftp` and similar | Hostinger address | Same | **Do not touch** |
   | NS | `@` | Hostinger nameservers, for example `ns1.dns-parking.com`, `ns2.dns-parking.com` | Same | **Do not touch** |

4. **CAA check.**
   - If there are no CAA records, do nothing.
   - If there are CAA records and one of them says `letsencrypt.org`, do nothing.
   - If there are CAA records and none says `letsencrypt.org`, Netlify cannot get a certificate. Add one record, CAA `@` `0 issue "letsencrypt.org"`, and delete nothing.
5. **Verify DNS.** Run this before step 4.2 and save the output. Run it again after, and compare.

   ```bash
   for q in "ecmhawaii.com A" "ecmhawaii.com AAAA" "www.ecmhawaii.com CNAME" "ecmhawaii.com MX" "ecmhawaii.com TXT" "_dmarc.ecmhawaii.com TXT" "hostingermail-a._domainkey.ecmhawaii.com CNAME" "ecmhawaii.com CAA" "ecmhawaii.com NS"; do echo "== $q"; dig +short $q; done
   ```

   Expected after:
   - `ecmhawaii.com A` shows `75.2.60.5` (A record) or Netlify load balancer addresses (ALIAS).
   - AAAA is empty.
   - `www` CNAME shows `<site-name>.netlify.app.`
   - **MX, TXT, DMARC, DKIM, CAA and NS are identical to the before output.**

   If `dig` is not available, use any public DNS lookup website for the same names.

## 5. Netlify HTTPS (Ellard)

1. **Wait for the certificate.** In Netlify, Domain management, HTTPS: wait for the Let's Encrypt certificate to cover both `ecmhawaii.com` and `www.ecmhawaii.com`. It usually appears soon after DNS updates; Netlify keeps retrying for up to 3 days.
2. **If it is stuck after an hour:**
   1. Check step 4.5 again: no AAAA on `@`, only one A on `@`, CAA allows Let's Encrypt, Hostinger CDN off.
   2. Click "Verify DNS configuration", then provision or renew the certificate.
3. **Force HTTPS.** Netlify serves the site over HTTPS and redirects plain HTTP once the certificate is live. This session could not confirm the current screen wording in the docs. If the HTTPS panel shows a Force HTTPS option, turn it on. Either way, the curl check below must show a 301 from `http://` to `https://`.
4. **HSTS.** `public/_headers` already sends `Strict-Transport-Security: max-age=31536000`. After a visitor loads the HTTPS site once, their browser refuses plain HTTP for this domain for a year. That is fine while HTTPS works. It matters only in a rollback (section 8). Do not add `preload`.

**Verify:**

```bash
for u in http://ecmhawaii.com/ https://ecmhawaii.com/ http://www.ecmhawaii.com/ https://www.ecmhawaii.com/ https://www.ecmhawaii.com/start-your-project https://www.ecmhawaii.com/portfolio https://www.ecmhawaii.com/portfolio/ https://ecmhawaii.com/sitemap.xml; do echo "== $u"; curl -sI "$u" | grep -iE '^(HTTP|location|server)'; done
```

Expected:

- Every `http://` address returns 301 to `https://`.
- Option A:
  - `https://www.ecmhawaii.com/`, `/start-your-project` and `/portfolio` return 200 with `server: Netlify`.
  - `https://ecmhawaii.com/` returns 301 to `https://www.ecmhawaii.com/`.
- Option B:
  - `https://ecmhawaii.com/` returns 200.
  - Every `www` address returns 301 to the same path on `https://ecmhawaii.com`.
- The browser shows the lock icon on both names.

## 6. Redirects

**Netlify does the host redirect on its own.** Once one name is primary, Netlify redirects the other name to it with the path kept. The old pages keep their paths, so the 3 old URLs need nothing more than that host redirect.

**The lines below are optional.** They write the same thing down explicitly. They must match the primary domain chosen in Netlify: if someone later flips the primary in Netlify without changing this file, visitors get a redirect loop. When in doubt, leave the host lines out.

- Netlify reads `_redirects` top to bottom and uses the first match.
- `!` forces a rule even when a file exists at that path.
- Netlify cannot add or remove a trailing slash with a rule. A rule from `/portfolio/` to `/portfolio` loops. The curl check in section 5 includes `/portfolio/` so you can see how Netlify answers it. If it returns 404 and the old site used trailing slashes, ask a Claude session for a fix that is not a `_redirects` rule.

**Option A: www primary** (file `public/_redirects`):

```
# Bare domain to www. Netlify also does this automatically while www is the primary domain.
http://ecmhawaii.com/*    https://www.ecmhawaii.com/:splat    301!
https://ecmhawaii.com/*   https://www.ecmhawaii.com/:splat    301!

# Old builder sitemap address to the new sitemap index.
/sitemap.xml    /sitemap-index.xml    301
```

The 3 old URLs stay exactly where they are:

| Old URL | Result |
| --- | --- |
| `https://www.ecmhawaii.com` | 200 |
| `https://www.ecmhawaii.com/start-your-project` | 200 |
| `https://www.ecmhawaii.com/portfolio` | 200 |

**Option B: bare primary** (file `public/_redirects`):

```
# The 3 URLs Google has indexed for the old site (www) to the same path on the bare domain.
https://www.ecmhawaii.com/                      https://ecmhawaii.com/                      301!
https://www.ecmhawaii.com/start-your-project    https://ecmhawaii.com/start-your-project    301!
https://www.ecmhawaii.com/portfolio             https://ecmhawaii.com/portfolio             301!

# Everything else on www, https and http, to the bare domain.
# Netlify also does this automatically while the bare domain is primary.
https://www.ecmhawaii.com/*    https://ecmhawaii.com/:splat    301!
http://www.ecmhawaii.com/*     https://ecmhawaii.com/:splat    301!

# Old builder sitemap address to the new sitemap index.
/sitemap.xml    /sitemap-index.xml    301
```

**Netlify address to the primary.** Add this only after launch, in step 7.7. Before DNS moves, it would send the preview address to the old site.

```
# Option A
https://<site-name>.netlify.app/*    https://www.ecmhawaii.com/:splat    301!
# Option B
https://<site-name>.netlify.app/*    https://ecmhawaii.com/:splat    301!
```

Deploy previews use other addresses (`deploy-preview-N--<site-name>.netlify.app`), so this line does not affect them.

Keep the redirects for at least a year (Google's site move guidance).

## 7. After launch (same day unless noted)

1. **Smoke test.** (Claude session or Ellard; use the primary host)
   - Every sitemap page should return 200:

     ```bash
     curl -s https://www.ecmhawaii.com/sitemap-0.xml | grep -o '<loc>[^<]*' | sed 's/<loc>//' | while read u; do printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' "$u")" "$u"; done
     ```

   - The home page should carry no robots tag:

     ```bash
     curl -s https://www.ecmhawaii.com/ | grep -c 'name="robots"'
     ```

   - **Verify:** 14 lines starting with `200`, then `0`. For option B, use `https://ecmhawaii.com` in both commands.
2. **One form test.** (Ellard; the only form submission in this runbook)
   1. Tell Bleys first that a test lead is coming, so nobody calls it. Website leads go to Ellard and Bleys.
   2. On the live site, submit the estimate form once. Use your own details and "TEST launch check, please ignore" in the notes.
   3. **Verify:**
      - The submission shows in Netlify under Forms, `estimate`.
      - The notification reaches `ellard@ecmhawaii.com` and `bleys@ecmhawaii.com` within a few minutes (check spam).
      - Reply-To is the address you entered.
      - A row for the test lead appears in the lead log, and both of you get a Claim email.
   4. Delete the test submission in Netlify and the test row in the lead log.
3. **Email check.** (Ellard)
   1. From an outside address (a personal Gmail), email `info@ecmhawaii.com`.
   2. Reply from `info@ecmhawaii.com`.
   3. **Verify:** both messages arrive and neither lands in spam. This proves MX, SPF and DKIM were not touched.
4. **Search Console.** (Ellard, as Owner)
   1. **Sitemaps report.** If the old builder's sitemap is listed (for example `https://www.ecmhawaii.com/sitemap.xml`), remove it. Add `https://www.ecmhawaii.com/sitemap-index.xml` (option A) or `https://ecmhawaii.com/sitemap-index.xml` (option B) and submit.
      - **Verify:** status Success; 14 discovered pages after it is processed.
   2. **URL Inspection.** Inspect the home page, run Test live URL, then Request indexing. Repeat for `/portfolio` and `/start-your-project`.
   3. **Do not use** the Change of Address tool. Google says it is not for www to bare moves.
   4. **Do not delete** the verification TXT record.
   5. **One week later:** check the Page indexing report. Option B shows the old www URLs as "Page with redirect", which is expected.
5. **IndexNow ping.** (Claude session or Ellard, from a machine that can reach `api.indexnow.org`; this audit session's network could not)
   1. Check that the key file is live. Use the primary host; the page should print the same 32 characters:

      ```bash
      curl -s https://www.ecmhawaii.com/794f74e3511706b94bd9cfa9eda798f2.txt
      ```

   2. From an up to date `main`, send the ping:

      ```bash
      npm ci && npm run build && node scripts/indexnow-submit.mjs --yes
      ```

   3. **Verify:** it prints `submitting 14 URLs for <host>` and then `HTTP 200` or `HTTP 202`. The script refuses to run while noindex is on or robots.txt blocks crawlers. Any other status usually means the key file is not reachable or `SITE` does not match the host that is live.
   4. Ping again only when pages change.
6. **Old builder site.** (Ellard)
   1. **Launch day:** confirm both names now answer with `server: Netlify` (the curl check in section 5). Also check from a phone on cellular data, which uses different DNS caches. Leave the builder site itself alone today.
   2. **After 7 stable days:** unpublish the builder site in Hostinger, or disconnect the domain from it. If it has its own temporary or preview address, make sure that is not public either, so no copy of the old site stays online.
   3. **Right after that:** run the DNS check from step 4.5 again and compare it with the saved output. Removing a website or disconnecting a domain in Hostinger may rewrite DNS records; this session could not confirm either way.
      - If the A or CNAME rows changed, put the Netlify values back.
      - If an email or TXT row changed, restore it from the export.
7. **Netlify address redirect.** (Claude session pull request; Ellard merges) Add the `netlify.app` line from section 6.
   - **Verify:** `curl -sI https://<site-name>.netlify.app/` shows 301 to the primary.
8. **Text Jesse.** (Ellard) Short: "Website is live at [address]. Form test and email OK. Nothing for you to do."
9. **Watch for 7 days.** (Ellard) Leads in Netlify Forms, the lead emails to Ellard and Bleys, and the lead log; email working; and Search Console with no new errors. Delays or problems go to Jesse by text.
10. **Optional.** (Jesse or Ellard) Update the website link on ECM's Google Business Profile and anywhere else that lists the old address.

## 8. Rollback

Pick the smallest step that fixes the problem.

1. **A page or wording is wrong, but the site works.**
   - In Netlify Deploys, open the last good production deploy and publish it again, or revert the pull request.
   - DNS is not touched.
2. **The site must leave search results quickly.**
   - Revert the launch pull request. Noindex and the blocking robots.txt come back on the next deploy.
3. **The new site is broken for visitors** (no HTTPS, blank pages, redirect loop that cannot be fixed fast).
   1. In Hostinger, put back the web records exactly as in the before screenshot: A or AAAA on `@`, and the `www` record.
   2. Change nothing else. Do not use DNS history restore unless your web record edits are the only changes since that version, because it restores the whole zone.
   3. Leave the Netlify domain settings as they are; they do nothing while DNS points elsewhere.
   4. With TTL 300, most visitors see the old site again within minutes to an hour.
   5. Text Jesse.
4. **HSTS and rollback.** Browsers that already loaded the new site will insist on HTTPS for this domain for a year. Rolling back is safe only if the old builder site serves HTTPS on both names. Check the lock icon on the old site before launch day.

## 9. What can go wrong and how to undo it

### Email first

| Problem | How you notice | Likely cause | Undo |
| --- | --- | --- | --- |
| Mail to info@ecmhawaii.com stops arriving | Test email in step 7.3 bounces or never arrives | An MX row was deleted or edited, the nameservers were changed, or the zone was reset or imported with Replace | Restore the MX rows (`mx1.hostinger.com` priority 5, `mx2.hostinger.com` priority 10, or whatever the export shows) from the export. If the nameservers changed, set them back to the ones in the screenshot. Senders usually retry for a few days, so mail is delayed, not lost, if this is fixed the same day. Hostinger Email's domain settings page shows which records it expects |
| Mail from info@ecmhawaii.com goes to spam or bounces | Reply in step 7.3 lands in spam | The SPF TXT or a DKIM CNAME was deleted, or a second SPF record was added | Restore exactly one SPF record and the 3 DKIM CNAMEs from the export |
| Search Console says verification is failing | Email from Google, or a warning in Search Console | The `google-site-verification` TXT record was deleted with the old A rows | Add it back with the same value. Search Console shows it under Settings, Ownership verification. Do not change the value |

### Website

| Problem | How you notice | Likely cause | Undo |
| --- | --- | --- | --- |
| No certificate after an hour | Netlify HTTPS panel still waiting; browser warning | AAAA left on `@`, two A rows on `@`, CAA without Let's Encrypt, Hostinger CDN on | Fix the record, then "Verify DNS configuration" and provision or renew the certificate |
| "Too many redirects" | Browser error | A host line in `_redirects` points the other way from the Netlify primary | Remove the host lines (Netlify's automatic redirect is enough), or make the primary match |
| Some people still see the old site | Reports from people, or a different answer on cellular | DNS caches | Wait out the old TTL. Check with the step 4.5 command |
| One name works and the other does not | curl check in section 5 | Only one of the two web records was changed | Add the missing record |
| No lead emails | Test in step 7.2 shows in Netlify but no email arrives | Recipient not confirmed, or the mail is in spam | Confirm the recipient in Netlify Forms notifications; check spam. Submissions are still stored in Netlify Forms, so check there and call those leads |
| Rankings wobble for a few days | Search Console | The host changed (option B) | Expected. Keep the redirects, change nothing else, and check again in two weeks |
| Old builder removal changes DNS | Step 7.6 check differs | A Hostinger tool rewrote records | Put the Netlify values back; restore email rows from the export |
