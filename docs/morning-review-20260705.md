# Morning review — shared-element + About, 2026-07-05

Branch **`feature/shared-element-and-about`** @ `1799834`, fully pushed. **`main`
untouched** (`c2f4981`). Tree clean, build + lint green, harness green (coverage no-
starvation, 0 blank frames), axe 0 violations. Main is Preston's to merge.

## ⚠️ Deploy preview URL — still can't produce it myself
No `gh` / `netlify` CLI / token here. Your preview is
**`https://feature-shared-element-and-about--<your-netlify-site>.netlify.app`** —
give me the `*.netlify.app` site name (or open a PR) and it resolves. All feel-tuning
below happens on that preview.

## Watch-list (your pass — feel first)
1. **Ourco open/close on desktop AND phone** (the thing you'll tune). Arm Ourco →
   die-cut "OURCO" fragment in the shape → tap: a **rounded brick object grows** and
   its radius relaxes into the panel, title crisp, content fades in after. Close: the
   panel **contracts back into the shape** (brand held), title shrinks into the die-cut,
   content fades first. **Knobs:** `EXPAND_TRANSITION` (0.5s, ease `cubic-bezier(0.32,
   0.72,0,1)`) in ProjectOverlay; the content-fade overlap. Documented in CLAUDE.md's
   motion scale.
2. **All 6 projects** — correct pinned brand (verified: spruce/brick/Razorback/red/
   purple), AA title, 0 blank cycle frames. Keyboard/VoiceOver focus (into card on open,
   back to the shape on close) is human-verify.
3. **About** — read THE THREAD narrative; check the **pasted-up photo board** (portrait
   + Machu Picchu, offset/rotated) on desktop AND phone; the personal line + caption.

## What shipped
- **Phase A — shared-element open/close (flagship).** Mechanism = framer **layoutId**
  shared layout (chosen over a FLIP clone because **close = open reversed comes free**,
  the governing acceptance test). The shape's morph-source is now VISIBLE (brand +
  silhouette) so open GROWS one object; a `closingId` freezes the shape brand-visible
  through the exit so the layoutId handoff shrinks the panel back into it + the title
  FLIP reverses. Collapse proxy retired. Reduced-motion instant + truthful. Study +
  full reasoning + runner-up in the decision log.
- **Motion scale** added to CLAUDE.md (DELIBERATE 0.5s / AMBIENT ~1s spring / MICRO
  0.15–0.25s). Kept the cycle spring as its own register (your approved calm glide),
  logged as a decision.
- **Phase B — About narrative.** New structure (intro → THE THREAD → What I make → Off
  the press → contact); verbatim copy; THE THREAD storyboard with both taped photos.

## Blocked / deferred (honest)
- Deploy preview URL / interactive feel-tuning / VoiceOver walk — need the preview +
  you.
- **Phase C (5 new compositions): NOT started** (stretch; A+B took the run). SVGs are in
  `~/Downloads/Geometric sequence graphics (1)/`; completion plan in the overnight log.
  No half-integrated state on the branch (per your "start it or revert it" rule).

## Decision digest (full: `docs/decision-log-20260705-shared-element.md`)
- Mechanism: layoutId (free reverse) over FLIP clone. ↺ documented.
- morph-source visible + `closingId` freeze → grow + free close. ↺ 3 files, revertible.
- Reduced-motion: deliberate beat instant. Cycle spring kept distinct (a decision).
- About: removed "Where this comes from"; storyboard flex-column (fixed grid min-width
  trap). ↺ git history.

## MERGE CHECKLIST (yours)
1. Open the preview (resolve the URL above).
2. Tune Ourco open/close feel (desktop + phone) — the 0.5s/ease + fade overlap.
3. Walk the 6 projects + About; veto/tune (each item has a reversal handle).
4. Approve → **merge `feature/shared-element-and-about` → main** (your action).
5. Verify production; if Phase C is wanted, it's the next branch.
