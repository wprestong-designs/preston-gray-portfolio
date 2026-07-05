# Decision log — shared-element + About run, 2026-07-05

Branch `feature/shared-element-and-about` (from `feature/overnight-polish`). Main
untouched. Format: **decision · reasoning · REVERSAL**.

## Pre-flight reconciliation
- The "concurrent session" warning: at run start the tree was CLEAN on
  feature/overnight-polish @ 48faf6f — no other-session commits/uncommitted files
  on this branch. Proceeding on my known state.
- 5 Canva SVGs found in ~/Downloads/Geometric sequence graphics (1)/ (Phase C).
- **Machu Picchu photo: NOT FOUND** anywhere (repo/Downloads/temp). Phase B second
  photo is blocked — building the slot ready-to-wire, flagging, NOT substituting.

## Phase A — study of the CURRENT mechanism
Arm: shape floods pinned brand (N1) + `.comp-type` reveals a cropped title fragment
(die-cut, close to spec). Cycle pauses. Open: `.overlay__backdrop` (layoutId =
`proof-shape-{id}`, brand ground via --ov, **borderRadius:0**) shares layout with the
shape's **transparent** `.comp-morph-source` (inset:0) → framer grows the backdrop from
the shape rect. The monument title FLIPs SEPARATELY via monX/monY/**monScale**
(transform scale). Close: a SEPARATE `.overlay__backdrop--collapse` proxy authors the
contraction (scaleX/scaleY onto originRect).

**Discontinuities:** (1) the shared source is transparent + the target is a flat
rectangle → the brand GROUND "appears" rather than a rounded brand OBJECT growing/
relaxing (silhouette never morphs). (2) monScale = transform scale → the title
**blurs** mid-grow. (3) close is a **separately-authored** proxy with non-uniform
scaleX/scaleY — it doesn't match the open's layout projection → fails the governing
acceptance test ("close = open backward").

## Phase A — mechanism CHOICE: (a) Framer layoutId shared layout
Chosen over (b) FLIP promoted clone. **Why:** close-as-reverse is NATIVE to
AnimatePresence + layout animation (no separate authoring — the acceptance test);
framer animates **border-radius** in layout projection, so it composes with the
radius-morph system; works across the portal via the existing `<LayoutGroup>`; the
cycle is PAUSED during open/close so the shape is stationary (the W1a double-settle
was a *moving-cycle* artifact, not a paused-open one). **Runner-up (b) rejected:**
close must be hand-authored (reverse the FLIP), it duplicates the whole card into a
portal clone, and transform-scaling the clone blurs text — three strikes vs the test.

**Three coupled fixes (one coherent object):**
1. Make the shared `.comp-morph-source` VISIBLE (brand ground + the shape's border-
   radius) but only while armed/opening — so a rounded brand object grows and its
   silhouette relaxes to the panel; transparent during the cycle (no brand leak).
2. Title: animate **font-size** (fragment→masthead), not transform-scale → crisp.
3. Delete the collapse proxy; the visible shared element's AnimatePresence exit
   reverses the grow FOR FREE (close = open backward).

## Phase A — BUILT + verified
- Open **grows a rounded brand object** (radius relaxes into panel), title crisp,
  content fades in after; **close = open reversed** (panel contracts back into the
  shape's silhouette + title shrinks into the die-cut + content fades first), free via
  the layoutId handoff + `closingId` freeze. No collapse proxy. · verified on Ourco
  (hardest: dark panel/brick brand) + all 6 (correct pinned `--ov`, AA title, 0 blank
  cycle frames). · REVERSAL: the changes are in CompositionHero (morph-source visible),
  ProjectOverlay (backdrop layoutId + close-reverse effect, collapse retired),
  OverlayProvider (closingId).
- **Timing sheet** added to CLAUDE.md (DELIBERATE 0.5s tween / AMBIENT ~1s spring /
  MICRO 0.15–0.25s). · kept the cycle spring (Preston's approved calm glide) as its
  own register rather than forcing 0.5s — logged so it's a decision, not drift.
- **Watch on the preview (Preston tunes feel):** Ourco open/close on desktop AND phone;
  the 0.5s/ease and the content-fade overlap are the knobs. Keyboard/VoiceOver focus
  (into card on open, back to shape on close) is human-verify.

## Phase B — About narrative rebuild (BUILT)
- New structure: intro → **THE THREAD** → What I make → Off the press → contact.
  Removed "Where this comes from" (its story role is taken by THE THREAD, per the
  approved structure). · copy is verbatim (typographic apostrophes only). · REVERSAL:
  the old points panel is in git history.
- **THE THREAD** = a `thread` panel (new renderPanel case): mono label + the 3
  verbatim paragraphs + a **pasted-up photo board** — the taped portrait (moved out
  of the statement panel) + the NEW Machu Picchu photo, offset L/R + rotated (−3°/+2°),
  tape + hard shadow (design law), caption "MACHU PICCHU — OFF THE CLOCK", the personal
  line beside it. Machu Picchu = IMG_5444.heic → machu-picchu.jpg (900w) + 480w srcset.
- **CSS trap fixed:** grid items default to min-width:auto (= the image's 900px
  intrinsic width) → photos rendered full-size. Rebuilt as a flex column with
  min-width:0 + max-width:100% on the img chain. · verified mobile (portrait 298×364,
  clean scroll) + About a11y 0 violations.

## Phase C — DEFERRED (stretch, not started)
- Per the "start it or revert it" rule, I did NOT begin the 5 new compositions.
  A+B consumed the run. The 5 Canva SVGs are at ~/Downloads/Geometric sequence
  graphics (1)/; the completion plan is in the overnight decision log (T-pass method,
  new arrangement types, graph + coverage + contact sheet). · clean deferral, no
  half-integrated state on the branch.

---
# Focused pass: About desktop + close tuning (2026-07-05 pm)

## §0 — main drift reconciled
- Fetched: origin/main moved c2f4981 → **1b7c3b7** ("Add files via upload") = Preston's
  web upload of **Media/Screenshots/IMG_5444.heic** (2.45MB, the Machu Picchu original).
- **Merged origin/main INTO the branch** (merge, not rebase — the branch is pushed).
  Clean (disjoint: raw in Media/, my processed asset in src/assets/). Branch now
  contains main → future stacked merge is conflict-free.
- **Provenance confirmed:** md5 of the uploaded raw == md5 of the photo I processed from
  (`8fe646b5…`). The processed src/assets/machu-picchu.jpg derives from the RIGHT photo;
  raw stays in Media/ per convention.
- CLAUDE.md updated: review surface is LOCALHOST (checkout + npm run dev; no deploy-
  preview flagging ever again); every run fetches + reconciles main first; Netlify ref
  noted.
