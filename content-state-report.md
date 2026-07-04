# Content State Report

Regenerated at the oneshot P5 (G2) pass. Sections 2, 4, and 6 reflect the
FINISHED reconciled state; §6 is Preston's red-pen queue.

## 1 · Media state
All manifest-v2 media is WIRED (12 clip triplets + processed stills), per
`media-manifest.md`. The four CRM clips render poster-only behind
`crmVerified: false` flags in `src/data/projects.js` — flip each after
checking its manifest box. DO-NOT-SHIP items untouched; the three ❓
graphics remain unwired. One trim: `crm-field-desktop.jpg` (manifest CRM
still #3) didn't fit the 3-items-per-panel cap — unwired, awaiting a call.

## 2 · Copy slot inventory (final-draft state)
- Poster: sr-only h1 (Preston-approved verbatim) · wordmark/Index/Contact.
- Overlays (per proof): statement lede · monument word(s) · eyebrow tag ·
  media captions (mono) · placard bodies (Y2) · points panels · return
  line "← Return to the catalog" (Preston-approved) · About panels.
- /work/: title/meta (draft-file) · h1 (Preston-approved verbatim) · lede ·
  4 service blurbs · 6 proof one-liners · contact block · footer tagline.
- Meta: poster title/description (Preston-era, kept — see §5) · og:image
  (generated) · sitemap (2 URLs, unchanged).
- Not built (no slot exists): stamp/badge microcopy candidates from the
  draft file — parked until a stamp treatment returns.

## 3 · Standing content constraints
- CRM: never real provider/patient/prescription/revenue/account data;
  demo build with synthetic sample data; `summit-crm-accountprofile-
  mobile1/2.png` excluded outright.
- Prosource: "in progress," NEVER a live link.
- Ourco: deliberate, client-led bold direction — never compromise language.
- No invented metrics; the "10+ prescription requests a day" claim is
  banned site-wide.

## 4 · Provenance registry (who wrote what, current state)
**Preston-authored (kept, authoritative):** poster title + description +
sr-only h1; /work/ h1; "← Return to the catalog"; "Oklahoma City" /
"Little Rock" location facts; Ourco bold-on-purpose framing; all standing
constraints.

**Draft-file adopted (site-copy-draft-v1.md — marked `bodyDraft`/comments,
awaiting red pen):** all six statement ledes except Ourco's; every media
placard body; all in-panel captions; points panels (details register);
About bio + What-I-make + Off-the-press + contact line; /work/ service
blurbs, proof one-liners, contact block, footer tagline, title/meta.

**Claude-only strings still live:** Ourco lede ("Bold on purpose…" —
encodes Preston's framing rule); prosource tag "Las Vegas · in progress"
(constraint outranked the draft tag); blended tags "Community pharmacy ·
Oklahoma City" and "Team-first · Little Rock"; pendingNote lines (from the
draft's pending copy); alt text set (extended from the draft's patterns).

## 5 · Reconciliation decisions (P5)
- Poster title: Preston's "Websites & Practical Marketing Help…" KEPT over
  the draft's "The Proof Catalog" (priority rule). Flagged in §6 in case
  the draft reflects a newer preference.
- Prosource tag keeps "in progress" (standing constraint > draft tag).
- Draft [VERIFY]-holed lines (RuneScape year, dog's name) keep the prior
  working copy instead of shipping a hole.
- "Zero phone-tag refills" (draft detail) WITHHELD pending claim comfort.
- OG image: generated (Registration/canonical, 1200×630, 25KB) via
  `scripts/capture-og.mjs`; wired on both pages. Rerun after any
  Registration or canonical-palette change.

## 6 · Open [VERIFY] queue (Preston's red pen)
Data-carried flags live on panels as `verify: [...]`; the full set:
1. Summit: "Centennial, Colorado" public description; refill "routes to
   the team, not an inbox."
2. Ourco: "supplies Houston's welders and fabricators"; site-build-in-
   progress framing (the /work/ card now says "(in progress)" too).
3. Bristol: called-by-name characterization.
4. Pinnacle: Arkansas/copy-pass framing; "locally operated" line.
5. Prosource: red-brand/Vegas-pace framing; withheld "zero phone-tag"
   claim; 12+ pages count.
6. About: RuneScape year, dog's name, English-lit line comfort.
7. Poster title: keep Preston's current vs draft's "The Proof Catalog"?
8. Every `bodyDraft: true` string in projects.js + the /work/ body copy
   (marked with an HTML comment at the top of the file).
