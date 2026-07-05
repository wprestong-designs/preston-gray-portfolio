# Review — About desktop + close tuning, 2026-07-05

Branch **`feature/shared-element-and-about`** @ `d644c9a`, fully pushed. **`main`
untouched** by me (`c2f4981` locally; production is `origin/main@1b7c3b7`, reconciled
INTO this branch — merges cleanly). Build + lint + harness green, axe 0. Merging to
main is yours.

## Review on LOCALHOST (this is the surface now — no deploy previews)
```
git checkout feature/shared-element-and-about
npm run dev
```
Then look at:
- **`/`** — arm a shape → tap to open → close. **Ourco first** (dark panel/brick brand,
  desktop AND phone): open grows one rounded brand object; close is the reverse.
- **`/?tune=1`** — the **close-feel tuner** (bottom-right). Arm → open → close, drag the
  sliders (they drive the REAL close), **Copy Values**, and reply — I'll bake them in.
- **About** (wordmark or the header ABOUT) — THE THREAD narrative + the photo cluster.

## This pass
- **§0 — main drift reconciled.** Production had moved to `1b7c3b7` ("Add files via
  upload" = your Machu Picchu original in `Media/Screenshots/IMG_5444.heic`). Fetched +
  **merged origin/main into the branch** (clean; branch now contains main so the stacked
  merge is conflict-free). Confirmed my processed `machu-picchu.jpg` derives from the
  same photo (md5 match). CLAUDE.md updated: **review = localhost; every run reconciles
  main first; no more deploy-preview flagging.**
- **§1 — About desktop repaired (GATE).** Desktop (≥900px) is now a **two-region
  storyboard** — THE THREAD text left (≤62ch) + an **overlapping photo cluster** right
  (portrait −4°, Machu +3°, caption + personal line with it). Mobile keeps the stack.
  CSS consolidated to **one ruleset, single media split** (deleted the 3 layered blocks +
  orphan comment). Screenshots: **`scratchpad/about-widths/about-{1440,1024,768,390}.png`**
  (1440/1024 = cluster, 768/390 = stack). axe 0.
- **§2 — close-feel tuner (GATE).** `?tune=1` panel drives the real close via a
  `motion-tune` store: **closeDuration, closeEase (incl. strong-decel), contentFadeOut,
  overlap (geometryDelay), resumeHold**. Open stays fixed at 0.5s. Defaults = the
  starting values you gave (0.7s / strong-decel / fade 0.2s / resumeHold 200ms). Panel
  is dev-gated (stripped from prod). Lives in `src/components/MotionTunePanel.jsx`
  (mounted in `App.jsx` behind `import.meta.env.DEV && ?tune=1`).

## What I need back
- **§2:** your locked close values (Copy Values → paste). I'll set them as the
  `motion-tune` defaults + record them in CLAUDE.md's motion scale, keep the panel
  dev-flagged, and update this doc + the merge checklist.
- **§1:** any tuning on the desktop cluster (offsets/rotations/sizes — all in the one
  `.about-thread` ruleset in App.css).

## Decision digest (full: `docs/decision-log-20260705-shared-element.md`)
- main merged into branch; provenance md5-confirmed. ↺ n/a.
- About desktop: two-region cluster; one consolidated CSS ruleset. ↺ git history.
- Close params moved to `motion-tune` store (dev-tunable); resumeHold in finalizeClose.
  ↺ defaults are the current shipped values.

## MERGE CHECKLIST (yours — stacked merge)
1. `git checkout feature/shared-element-and-about && npm run dev`.
2. Tune Ourco close at `/?tune=1` (desktop + phone) → Copy Values → reply.
3. Review About at desktop + phone; the 6 projects' open/close; veto/tune.
4. I bake the close values → you re-review → **merge to main** (your action).
5. (Phase C — 5 new compositions — remains the next branch when you want it.)
