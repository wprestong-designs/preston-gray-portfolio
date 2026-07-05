# Morning review — overnight polish, 2026-07-04

Branch **`feature/overnight-polish`** @ `71198dd`, fully pushed. **`main` untouched**
(`c2f4981`). Tree clean, build + lint green, harness green, axe 0 violations.

---

## ⚠️ DEPLOY PREVIEW URL — the one thing I couldn't produce
No `gh`, no `netlify` CLI, no token in this environment, so I **cannot open a PR or
build/fetch the Netlify preview URL myself**. The branch is pushed and ready. Your
preview is almost certainly:

> **`https://feature-overnight-polish--<your-netlify-site>.netlify.app`**

To make it resolve, do ONE of: (a) tell me the `*.netlify.app` site name and I'll
confirm it, (b) open a PR from the branch — Netlify auto-posts the preview + a Forms
tab, or (c) it's already live if branch deploys are on. **Everything below assumes you
open that preview.**

---

## Watch-list (deploy-blockers first)
1. **Identity flow (N1)** — arm any shape: it should flood the project's real brand
   color + title, and stay that color as the overlay opens (one continuous object).
   All 6 projects, a few themes. Titles are AA-verified on brand.
2. **New compositions likeness** — the 13-state roster incl. blocks/proofstrips/
   vortex/burst/arch. **N3 (5 *more*) is DEFERRED** — see below; not a regression,
   an unbuilt addition.
3. **Contact test ticket** — ⛔ I can't submit one (no live deploy). On the preview:
   Contact → fill → send → confirm it lands in Netlify **Forms tab** + your inbox
   (after you set the email notification: Netlify → Forms → notifications). Verify the
   form is *detected* (SPA gotcha — static def is in `dist/index.html`, confirmed).
4. **OG unfurl** — paste the preview URL into iMessage/Slack/Twitter; confirm the new
   poster OG card (registration×memphis, wordmark legible) + per-route titles.
5. **Payload** — mobile stills 7.2M→4.4M (−40%); videos still 25M (lazy). **Lighthouse
   mobile must be run on the preview** (I can't reach it) — perf/a11y/SEO.
6. **About** — overlay now renders (was black-on-black); taped portrait; ABOUT is in
   the header. Mobile header wraps to 3 rows (CONTACT orphaned) — a knob, not a bug.

## Everything done tonight (all on the branch)
- **CLAUDE.md** → operating manual (repo/domain, never-touch-main, governance, CRM,
  copy freeze, harness, constraints).
- **N2:** About black-on-black fixed · portrait wired (taped frame + srcset) · About
  promoted to header.
- **§B SEO:** OG regenerated from the poster · crawlable homepage skeleton · sitemap
  /robots/canonical confirmed.
- **§D:** designed 404 (PROOF NOT FOUND) · apple-touch + 192/512 icons + webmanifest.
- **§E:** stills recompressed (mobile −40%) · lazy/preload/srcset confirmed.
- **§F:** axe-core **0 violations** all routes (fixed contact em-contrast) · 0 console
  errors · harness green · all routes/assets 200.
- **§H (dormant/prep):** `/colophon/` route (draft copy) · dormant `<Quote>` + slot ·
  Plausible stub (OFF) · v2.0.0 release notes · music toggle skipped.
- **§C Contact** (from the prior branch, on this one): job-ticket form, all states,
  all affordances routed.

## Attempted-but-blocked (honest)
- Deploy-preview URL, Netlify Forms detection/email/real-ticket, Lighthouse-on-preview
  — all need the deploy + your Netlify dashboard. Tooling gap, not skipped.
- **N3 deferred** — 5 *additional* compositions. Time went to shippability-critical
  work. Completion plan is in the decision log (reuse the T-pass method, new
  arrangement types, re-run graph + coverage + contact sheet).
- Videos not re-encoded (lazy); true prerender is static-skeleton only (logged gap).

## §H artifacts to read
- `docs/release-notes-v2.md` (for your v2.0.0 tag) · `docs/testimonial-candidates.md`
  (**no real quotes found — none published**) · colophon **draft copy** at `/colophon/`
  (every line flagged; note it says Archivo not Fraunces — Fraunces is retired) ·
  analytics setup note in `src/analytics.js`.

## Decision-log digest (full: `docs/decision-log-20260704-overnight.md`, all reversible)
- About ground `--flood-green-fg`→`--paper` (regression). ↺ `--bg-off` for cream.
- OG = registration×memphis. ↺ `scripts/og-capture.mjs` renders alternates.
- Contact em `--gray-utility`→`--ink-soft` (AA). Chip selected-state = ink-on-paper. ↺ flip in CSS.
- Header order INDEX·ABOUT·FOR BUSINESS OWNERS·CONTACT. ↺ shorten "For business owners" to fix the mobile 3-row wrap.
- Stills q82 recompress. ↺ originals in git history.

## MERGE CHECKLIST (your sequence)
1. Open the deploy preview (resolve the URL per the top of this doc).
2. Walk the watch-list 1–6; veto/tune anything (each has a reversal handle).
3. Set the Netlify **Forms email notification**; send a real test ticket; confirm it lands.
4. Run **Lighthouse mobile** on the preview; note any perf/a11y/SEO gaps.
5. Approve → **merge `feature/overnight-polish` → `main`** (your action; I never touch main).
6. Verify **production** (preston-gray.com): identity flow, About, Contact, OG unfurl, 404.
7. **Tag `v2.0.0`** using `docs/release-notes-v2.md`.
8. (Optional) flip analytics on: set `VITE_ANALYTICS=plausible` after creating the account.

**End state:** branch fully pushed, deploy preview ready to build, CLAUDE.md committed,
main untouched, tree clean.
