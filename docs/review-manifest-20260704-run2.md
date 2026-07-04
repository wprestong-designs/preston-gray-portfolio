# Review manifest — run 2 (build-and-verify), 2026-07-04

Supersedes the run-1 manifest. Every planned workstream is now **built**; nothing
pushed. Build + lint green on every commit. Reasoning:
`docs/decision-log-20260704-run2.md`. Reshoots: `docs/recapture-list-20260704.md`.

## Status by section
| § | Scope | Status |
|---|---|---|
| 0 | ffmpeg + process 4 blocked clips | ✅ done (ffmpeg-static; clips encoded + **cropped to portrait**) |
| 1 | Amended novelty rule → final cycle order | ✅ done (logged; validator 0 fails) |
| 2 | §5 triangle true-morph | ✅ **BUILT** (self-verified: validator, stable keys, polygon math) |
| 3 | §4 media component + lightbox | ✅ **BUILT** — M1 `<picture>` + M2 lightbox (gesture math unit-tested); M3 wiring partial |
| — | Ornament tiles (from run 1) | ✅ done |
| 4 | This close-out | ✅ done |

**Shipped-pending-your-visual-pass:** the triangle morph and the lightbox are the two
that only your eyes/finger can finish verifying (animation smoothness; pinch feel).
Everything code-verifiable is verified (below).

## Run-2 commit map (newest→oldest, all unpushed)
- `2a22fee` §4 M3 — Pinnacle portrait clip (retire letterboxed) + ProSource home crop
- `13cfc60` §4 M1+M2 — responsive `<picture>` + pinch-zoom lightbox
- `fb8b9cb` §5 — triangle TRUE-MORPH (clip-path interpolation; blackout removed)
- (run-2 §0/§1/§6 land in the geometry + the two decision logs)

## Code-verified this run (no browser needed)
- **§5 validator:** `validateCycleMotion` returns **0 fails** in both orientations
  (ran in Node). Triangle/rect polygons **match at 24 vertices**; the sharp-rect and
  triangle polygons are structurally correct.
- **§5 identity:** shapes keep `key={shape.id}` across every boundary — **no remount**.
- **§5 cleanliness:** grep confirms **no `xfadePhase`/`XFADE_STATES`/`TRIANGLE_XFADE`/
  `comp-wipe`** anywhere — blackout + wipe fully gone.
- **§4 lightbox:** pinch reducer **unit-tested in Node (6/6 pass)**; dialog/focus/ESC/
  scroll-lock wiring by review; `touch-action:none` on the stage.
- Build + lint clean on every commit; `tokens.css` still the sole styling-hex home.

## Still mechanical, NOT wired (mechanism + assets ready)
The other 6 crop srcsets onto their stills; Pinnacle supporting stills; a ProSource
mobile-homepage clip panel; the 2 navigation clips. Per-proof data entry only — the
component consumes `item.mobile` and opens any image. Payload: `src/assets/mobile`
~9 MB now (screenshots + clips); trim JPEG quality if Netlify budget matters.

---

## Localhost watch-list — exactly what to do, ordered by deploy-blocking priority
`npm run dev`; mobile items in DevTools device mode @ 390 & 360px.

### BLOCKS a deploy
1. **Triangle morph (replaces the blackout — the big one).** Let the poster cycle; it
   now runs a FIXED order: registration → circles → columns → **triangle** → pillrhythm
   → quarters → swatches → tiles → pinwheel. **Watch the `columns→triangle` and
   `triangle→pillrhythm` boundaries:** each shape should *morph* (a corner collapses
   into / opens out of a triangle) continuously — no blank, no cover, no hard swap.
   **Watch for corner-pop** at the two snap edges: the instant columns settles (arm)
   and the instant pillrhythm settles (disarm) — corners must NOT visibly jump. Do this
   in **≥2 colorways (try Jazz Cup and Arcade)** and **both orientations**. Confirm the
   blackout is truly gone.
2. **CRM data safety.** Open Field Intel (proof 06): only the Today dashboard + Analytics
   clips + the empty fieldnotes render, and each shows **DEMO · SAMPLE DATA** (or is
   empty). The 4 unwired assets must be absent. No real names/notes/numbers anywhere.
3. **Live links.** Summit→summitpharmacycolorado.com, Bristol→rxbristolokc.com,
   Pinnacle→pinnacle-rx.com open new-tab (noopener). ProSource/Ourco show no live link.
4. **Lightbox gesture trap (named risk).** Open a proof overlay, tap an image → full
   screen. **Pinch to zoom and confirm the underlying PAGE never zooms** (the CRM-map
   trap). Then: swipe down dismisses, double-tap resets zoom, ESC closes, the ✕ button
   works, and focus returns to the image you opened. Reduced-motion: open/close instant.

### Verify before deploy (shipped features)
5. **Mobile media (M1).** At 390px: ProSource homepage shows the **crop** (hero + CTA),
   not the full desktop still (Network tab: a `mobile/prosource-home*` file loads, not
   the desktop `prosource-home.jpg`). Pinnacle homepage clip is **portrait** (not the
   old letterboxed one).
6. **Colorway coupling.** A shape changes color only as it morphs (never at rest), on
   the poster and `/work/`.
7. **Pinned proof colors.** Each overlay = real brand; poster/index stay themed; flip
   `data-theme` on `<html>` → proofs don't move.
8. **Mobile poster header** (390/360): two-row band, full "FOR BUSINESS OWNERS", ≥44px
   taps, no shape under the header, VoiceOver announces/acts.
9. **Perf.** With mobile-class CPU throttling (DevTools 4–6×), watch the **triangle
   morph** frame rate — clip-path animates on 6–8 shapes across that boundary. If it
   janks, the knob is `CLIP_K` (geometry, currently 6 → try 4) or shorten the morph.

### Dev-route only (not deploy-blocking)
10. **Ornament tiles** `/styleguide/` — 5 tiles × 8 themes; **flag any tile whose internal
    contrast collapses in a theme** (the auto-remap couldn't run headlessly).
11. **Triangle prototype + S2 placements** `/styleguide/` (unchanged from run 1).

### Then, if all green
Wire the remaining crop srcsets / supporting stills (mechanical), do a payload check,
and it's deploy-ready. Nothing is pushed — that's your call.
