# R2 shipped — phone watch-list (2026-07-04)

Diagnosis: `docs/R1-diagnosis-20260704.md`. Evidence: `scratchpad/visual-matrix/`
(state×theme grid `index.html`), `scratchpad/live-cycle/`, `scratchpad/prod-cycle/`.
**T (five new states) is NOT in this deploy** — it's gated with expected vetoes, so it
stays for your return.

## What changed (the regression trio + the engine)
- **64-color system is live**: the poster now cycles all 8 data-themes (scoped to the
  poster; the rest of the page stays memphis), on a constant white ground. The old
  "~8 colors" was the theme being stuck on memphis.
- **No more wash-out**: the all-tint colorways that vanished the cast into the ground
  ("circles gone / near-blank / white flash") are gone — shapes use full role colors.
- **Constrained-random cycle**: no fixed loop; a seeded random walk (legal neighbours,
  no last-3 repeat, coverage-weighted) + an 8-theme shuffle-bag, advancing together at
  each geometry boundary.
- **Triangle morph preserved**, now armed by lookahead so it clips correctly from ANY
  neighbour (verified: quarters→triangle→tiles).
- **Header clearance** (triangle no longer collides), **hatch toned** to a whisper
  pinstripe, **contrast-vs-ground** now a permanent validator check.

## Watch on your phone (live site)
1. **Let it cycle ~30s.** Every state should be fully colored — NO washed-out/near-white
   frames, no white flash. Colors should visibly change theme-to-theme (you'll see very
   different palettes — memphis pink vs splash lime vs arcade neon, etc.).
2. **Triangle boundary**: when the pinwheel-of-triangles appears, the morph in/out should
   be continuous (no blank, no hard swap). Watch for a corner-pop at the very start/end
   of the tween.
3. **Header**: no shape should collide with "Preston · Gray" / the nav at the top.
4. **Columns state**: the diagonal stripes should now be a faint pinstripe, not bold
   candy-cane. (Judgment call — tell me if you want it gone entirely or restored.)
5. **Portrait**: rotate the phone — same behavior, portrait geometry.
6. **Proof overlays** (tap a shape): brand colors still pinned/correct; lightbox pinch
   still traps page-zoom (M2, unchanged).

## Known minor items (flag, not blockers) — for your call on return
- **Dark themes on white ground**: 6 of 48 theme×family fills are faint on white
  (lisafrank orange, windbreaker/arcade sage, techlab sky, splash green — all ~1.2–1.4:1).
  One large shape looks slightly pale on those themes; never the whole cast. Options:
  a hairline anchor keyline on shapes (very 90s, House Rule 6), nudge those role tokens,
  or drop the dark themes from the poster pool. The validator logs them.
- **Registration crop-marks / hover labels under dark themes**: use `--ink`, which flips
  to white in dark themes → faint on the white ground. Decorative; easy to pin if you want.
- **Ground stays white** (not the dark theme grounds). This keeps the "same white ground"
  law + header legibility. If you'd rather the poster go full dark-register on dark themes,
  that's a deliberate switch I can flip.

## Deferred (your gates)
- **T**: translate blocks / proofstrips / vortex / burst / arch into 5 new cycle states.
- Remaining mobile-crop wiring + the ~9MB `src/assets/mobile` payload optimization.
