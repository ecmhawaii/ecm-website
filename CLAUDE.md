# Rules for every session in this repo

1. This repository is public. Never commit passwords, API keys, tokens, .env files, client answers, estimates, homeowner names, street addresses, phone numbers other than ECM's business line, or anything from the ECM Answers sheet that is not already approved website copy.
2. Secrets (form keys and similar) go only in Netlify's environment settings, never in code.
3. Never push to main. Work on a branch and open a pull request. Never merge your own pull request.
4. Website copy: only claims Jesse has confirmed in writing. Anything marked CONFIRM in the draft copy stays off the site.
5. No testimonials, ratings, logos, client names, project addresses or job photos without the owner's written OK.
6. Never use em dashes or en dashes in any visible text.
7. Business name, address and phone must be identical on every page.
8. Do not add analytics, tracking, chat widgets or third party scripts without Ellard's approval in the pull request.
9. Never touch DNS or email settings. Email stays on Hostinger Mail.
10. Before finishing any session: run the production build, confirm it passes, and list what changed in the pull request.
