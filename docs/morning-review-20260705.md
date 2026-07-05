# SHIPPED — v2.0.0 in production, 2026-07-05

**`main@defe50b` is live** (`preston-gray.com` / `preston-gray-portfolio.netlify.app`),
tagged **`v2.0.0`**. The full stack merged (fast-forward): 90s color system + poster
random-walk + 13-state roster, N1 identity, shared-element open/close, About narrative,
Contact job-ticket form, SEO/OG/404/icons, payload + a11y. Feature branches deleted
(local + origin). Merged by Preston's explicit authorization.

## Production verification (code-verifiable — all PASS)
- Routes **200**: `/`, `/work/`, `/small-business/`, `/colophon/`; unique titles + OG +
  h1 each. Bad paths → **404 page served** ("PROOF NOT FOUND", status 404).
- **Netlify form definition present** in the served HTML (build-bot can detect it).
- **0 console errors** across all routes. Crawlable homepage skeleton + webmanifest +
  touch icons live. Dev `?tune=1` panel confirmed **stripped from the prod build**.

## PRODUCTION CHECKLIST — the human items (yours)
1. **Netlify Forms (dashboard):** confirm the `contact-ticket` form shows in **Forms
   tab** (build-detected); set the **email notification** to your address; **submit a
   real test ticket** on production and confirm it lands in your inbox. *(I can't reach
   the dashboard or your email.)*
2. **Shared-element close feel on your phone:** the locked values (1.0s / linear /
   resumeHold 200ms) are baked — confirm they feel right on a real device; re-tune any
   time with `?tune=1` on localhost.
3. **Lighthouse mobile** on `preston-gray.com` (perf / a11y / SEO) — note any gaps.
4. **VoiceOver / keyboard** walk: nav → poster → arm/open a proof → close → About →
   Contact (focus into card on open, back to the shape on close).
5. Eyeball on production: poster cycling (64-color range), About narrative + photo
   cluster (desktop + phone), OG unfurl (paste the URL into iMessage/Slack). *(Minor:
   `/colophon/` has a description meta but no `og:image` — global card only.)*

## Backlog (also in CLAUDE.md)
Phase C (5 new compositions) · CRM recaptures (badge-less assets, reshoot w/ DEMO badge)
· testimonials (dormant, pending real quotes + permission) · analytics (Plausible OFF,
needs account) · videos (~25M, lazy, un-re-encoded).

## Reference
- Review = **localhost** (`git checkout <branch> && npm run dev`); no deploy previews.
- Reasoning: `docs/decision-log-20260705-shared-element.md`; notes: `docs/release-notes-v2.md`.
