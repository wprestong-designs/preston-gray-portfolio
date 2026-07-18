# Implementation Spec — Contact-form delivery + poster rendering fixes + site improvements

**Date:** 2026-07-18 · **Author:** diagnosis session with Claude Code
**Status:** Findings verified against live production + local dev. A reference
implementation of items A–C exists on branch `fix/contact-form-and-poster-bugs`
(commit `2792a09`, pushed to origin) — the implementor may adopt it, cherry-pick
it, or re-derive from this spec. Nothing is merged to `main`.

---

## 0. Ground rules (from CLAUDE.md — binding)

- Work on a **feature branch**; push freely; **merge to `main` only on Preston's
  explicit say-so** (main auto-deploys to production via Cloudflare Pages).
- Review surface is **localhost** (`git checkout <branch>` + `npm run dev`),
  never a preview URL.
- **Copy freeze:** `/work/` copy and all proof copy strings are frozen. None of
  the changes below may alter user-facing words.
- **Color governance:** `src/styles/tokens.css` is the only file allowed to
  contain hex. Components consume role/proof/chrome tokens only.
- After anything touching rendering: run the visual harness
  (`npm run dev` up, then `SEED=1 node scripts/visual-matrix.mjs`) and compare
  against the `main` baseline (see §A/C verification notes; baseline = 45
  pre-existing contrast-audit rows, `no starvation=true`).
- `npm run lint` and `npm run build` must stay clean.

---

## A. Contact form — silently broken for every visitor (CRITICAL)

### Root cause (verified, not hypothesis)

`src/components/ContactLayer.jsx` submits to Web3Forms with a JSON body:

- A `Content-Type: application/json` fetch is **not** a CORS "simple request",
  so the browser first sends a preflight `OPTIONS` to
  `https://api.web3forms.com/submit`.
- Web3Forms' Cloudflare bot protection now answers that preflight with
  **403 + `cf-mitigated: challenge`** and no `Access-Control-Allow-Origin`
  header. A preflight can never solve an interactive challenge, so **every
  submission from every real browser fails** with `TypeError: Failed to fetch`.
- The component correctly catches this and shows the error state with the
  mailto fallback — which is why the failure looked like "the form didn't work"
  rather than a crash.

Ruled out during diagnosis:

- **Missing env key** — `VITE_WEB3FORMS_KEY` is set in local `.env` AND baked
  into the live production bundle (verified by fetching
  `preston-gray.com/assets/main-*.js` and finding the key). Gate-1 was honored.
- **CSP blocking** — the CSP in `public/_headers` is still commented out; the
  live site sends no CSP header.

Evidence of the fix working: a **FormData** POST from a real-browser context on
the `preston-gray.com` origin returns `200 {"success":true}` with
`access-control-allow-origin: *`. FormData is a CORS simple request → no
preflight → the challenge never fires.

### Change specification

File: `src/components/ContactLayer.jsx`, inside `handleSubmit` (the
`fetch('https://api.web3forms.com/submit', …)` call):

1. Build a `FormData` from the exact same field set currently in the JSON body
   (`access_key`, `subject`, `from_name`, `replyto`, `name`, `email`,
   `business`, `needs` (joined with `', '`), `timeline`, `message`,
   `botcheck`). Do not drop `botcheck` — it is Web3Forms' server-side honeypot.
2. `fetch(url, { method: 'POST', body: formData })` with **no headers object at
   all**. Any custom header (including `Accept`) reintroduces preflight risk;
   the browser sets the multipart boundary itself.
3. Keep the existing response handling (`res.json()`, `json.success` check),
   error state, and mailto fallback unchanged.
4. Update the component's header comment (it currently says "POSTs JSON") so
   nobody "cleans it up" back to JSON later. This constraint is also recorded
   in the project memory (`web3forms-formdata-only`).

### Verification (implementor must do all three)

- **Cannot be tested with curl** — Web3Forms' free plan rejects all non-browser
  POSTs ("This method is not allowed…"). Test from a real browser or Playwright
  with a non-headless user agent.
- Local end-to-end: `npm run dev`, open Contact, submit a filled ticket →
  network tab shows a single `POST submit` (no OPTIONS) returning 200, and the
  UI stamps **"TICKET RECEIVED"**.
- Empty-key path must still short-circuit to the error state (don't regress the
  `if (!ACCESS_KEY)` guard).

### Open item for Preston (not the implementor)

The Web3Forms key delivers to the inbox it was created against, which we cannot
read from the API. Diagnostic emails (subjects starting **"Diagnostic test"**
and one **"Claude verification"**, sent 2026-07-18) should be sitting in that
inbox. **If they are NOT in w.preston.gray@gmail.com:** create a new key at
web3forms.com bound to that address, update `VITE_WEB3FORMS_KEY` in **Cloudflare
Pages env vars first** (Gate-1: Vite inlines at build time), then local `.env`.
No code change required either way.

---

## B. Hover label collides with the header nav

### Root cause

The poster's hover label renders in an over-layer (`.comp__stage--over`) that
**copies the stage's fit transform** (`stageTransform(fit)`) but is anchored at
the **frame's** top-left (`.comp__stage { top: 0 }`), while the real stage
lives inside `.comp--poster .comp__stage-wrap`, which is inset
`clamp(52px, 7vh, 76px) 0` (the letterbox clearance that keeps the composition
away from the floating wordmark/nav). The fit offsets are measured against the
**wrapper's** box (`useStageFit`), so the over-layer draws every label
52–76px too high. A label near the stage's top edge (`labelY` clamps to 8px)
lands exactly in the header band — under the utils nav (over-layer z-index 20
vs chrome 30), producing the unreadable text-on-text collision.

### Change specification

File: `src/App.css`. Make the clearance a single shared custom property so the
wrapper and over-layer can never disagree:

```css
.comp--poster { --poster-clearance: clamp(52px, 7vh, 76px); }

.comp--poster .comp__stage-wrap { inset: var(--poster-clearance) 0; }   /* was the literal clamp */

.comp--poster .comp__stage--over { top: var(--poster-clearance); }      /* NEW rule */

@media (max-width: 700px) {
  .comp--poster { --poster-clearance: 0px; }   /* replaces the literal inset: 0 override */
}
```

No JSX changes. Do not move the over-layer inside the wrapper — it lives
outside deliberately so labels never get clipped by the wrapper's
`overflow: hidden`.

### Verification

- Desktop viewport (e.g. 1440×900), `/?harness=1&state=registration`: hover
  each shape (especially `fieldintel`, top-right). Assert via devtools that
  `.comp-label`'s bounding rect is inside `.comp__stage-wrap`'s rect and does
  not intersect `.poster__utils` or `.poster__brand`.
- ≤700px viewport: labels unaffected (mobile has a structural header band;
  clearance is 0 by design).

---

## C. "Missing"/white shapes in some poster states

### Root cause

The poster keeps a **constant white ground** under all 8 cycling `data-theme`
palettes, but three themes are dark registers (`techlab`, `arcade`, `splash`)
that flip `--ink` → `#FFFFFF` (and `--paper` → dark) **inside the `.comp`
theme scope**. Two element groups still consumed those flipping tokens:

1. `.comp-ornament` (`background: var(--ink)`) — e.g. the third column of the
   `columns` state is the ornament `orn-a` with fill `ink`. Under a dark theme
   it painted white-on-white and vanished (this is the user's screenshot).
   `.comp-ornament--paper`'s `border: 2px solid var(--ink)` had the same fault.
2. `.comp-marks` (registration crop marks, `stroke: var(--ink)`) — invisible
   whenever registration wears a dark theme.

Precedent: the hover-label plate had this exact class of bug and was fixed with
the constant `--chrome-ink` / `--chrome-paper` tokens (see the B1 note in
`src/styles/tokens.css` — "NEVER override these in a theme block").

Note: `--bg` does **not** have this bug — it resolves `var(--paper)` once at
`:root` (white) and inherits down as a fixed color, which is why the hatch
pinstripes and header chips stay white. Only direct `var(--ink)` /
`var(--paper)` reads inside the theme scope flip.

### Change specification

File: `src/App.css`:

- `.comp-ornament` → `background: var(--chrome-ink);`
- `.comp-ornament--paper` → `background: var(--chrome-paper); border: 2px solid var(--chrome-ink);`
- `.comp-marks` → `stroke: var(--chrome-ink);`
- Leave `.comp-shape:focus-visible` (inset `--paper`/`--ink` ring) alone — it
  draws on the shape's colored fill, not the ground, and still reads in dark
  themes.

Do not touch theme role definitions in `tokens.css` — several dark-register
roles are intentionally low-contrast-flagged in the audit baseline (Preston's
approved system; color governance forbids re-tuning here).

### Verification

- `/?harness=1&state=columns&theme=splash` (and `techlab`, `arcade`): seven
  columns visible, third column solid near-black (`rgb(23,23,23)`).
- `/?harness=1&state=registration&theme=splash`: crop marks visible.
- Full harness: `SEED=1 node scripts/visual-matrix.mjs` with dev server up.
  **Green =** contrast-audit `fails` count identical to `main`'s baseline (45
  pre-existing tint/soft rows — confirmed identical before/after on the
  reference branch) and coverage `no starvation=true`.

---

## D. Improvements found in the site-wide audit (NOT yet implemented)

Prioritized; each is an independent, small branch.

### D1. Image intrinsic dimensions (MED — CLS risk)

No `<img>` in `src/` carries `width`/`height` attributes:
`ProofMedia.jsx:81,88,97`, `About.jsx:58`, `FeaturedWork.jsx:356`,
`ProjectOverlay.jsx:155`, `SpecPanel.jsx:21,77`, `ProofIndex.jsx:144,169`,
`Lightbox.jsx:137`.

**Architecture:** read each referenced asset's real pixel dimensions at build
time is overkill here — instead add the dimensions to the existing data layer.
Proof media entries live in `src/data/projects.js`; extend each media entry
with `w`/`h` (measure once via `sips -g pixelWidth -g pixelHeight <file>`), and
have the render components pass them through as `width`/`height` attributes
(CSS continues to control display size; the attributes only reserve aspect
ratio). For one-off images (About portrait, specimens) hardcode the attributes
at the call site. Acceptance: Lighthouse CLS on `/work/` and an open proof
overlay reports no image-driven shifts; no visual change at any breakpoint.

### D2. Enable the prepared Content-Security-Policy (MED — security)

`public/_headers` line 22 contains a complete, commented-out CSP that already
allowlists Google Fonts and `https://api.web3forms.com` (both `connect-src`
and `form-action`). **Do this only after A ships**, and note the A fix does not
change the needed origins. Steps: uncomment (must stay one physical line),
deploy to a branch, verify on the `.pages.dev` preview build that all 5 routes
render with fonts and the contact form still submits, then include in the next
main merge. Rollback = re-comment. Console must show zero CSP violations.

### D3. Social/meta polish on sub-pages (LOW)

- `work/index.html`, `small-business/index.html`, `colophon/index.html`: add
  the same `twitter:card` / `twitter:image` / `twitter:image:alt` trio the
  homepage already has (`index.html:31-33`), pointed at each page's existing
  og:image.
- Same three files: add `viewport-fit=cover` to the viewport meta to match the
  homepage (iOS safe-area consistency).

### D4. Copy-freeze log (NO code action — Preston's red pen only)

- `src/data/projects.js:359` — "early August" Ourco line is now stale.
- `FeaturedWork.jsx:358` — "Screenshot coming soon" fallback renders when a
  work card lacks an image; wording is Preston's to keep or change.
- `src/data/projects.js:769` — comment flags placeholder statements for the G2
  pass.
  These belong in the pending copy-session worksheet, not an implementor branch.

### D5. Not bugs / already resolved (do not "fix")

- `LIVE_URLS` placeholders: **resolved** — real domains wired for
  summit/bristol/pinnacle; ourco/prosource/fieldintel are intentionally `null`
  (ProSource never gets a live link).
- CRM assets `crmVerified:false` + recapture list: frozen backlog, enforcement
  is intentional.
- Raw >1MB files under `Media/Screencaptures/` are unshipped sources (not
  referenced by any build) — repo bulk only.
- Videos in `src/assets/media/` top out ~1MB post-diet with `preload="none"`;
  acceptable, no action.

---

## E. Acceptance checklist (any branch touching A–C)

1. `npm run lint` clean, `npm run build` clean.
2. Visual harness green vs `main` baseline (§C verification).
3. Contact form: browser-context submit succeeds; no OPTIONS request appears.
4. Hover labels: no intersection with `.poster__brand` / `.poster__utils` at
   1440×900 and 1280×720.
5. Columns state renders 7 visible columns in all 8 themes.
6. Handoff message ends with: `git checkout <branch>` + `npm run dev` + the
   exact routes/interactions to review.
