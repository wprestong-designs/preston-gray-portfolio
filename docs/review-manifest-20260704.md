# Review manifest — one-shot autonomous run, 2026-07-04

One place to review the whole run. Nothing was pushed. Build + lint are green on
every commit. Full reasoning: `docs/decision-log-20260704.md`. Assets to (re)shoot:
`docs/recapture-list-20260704.md`.

## Status by section
| § | Scope | Status |
|---|---|---|
| 0 | Pre-flight (pull/rebase, build, lint, ffmpeg) | ✅ done · **ffmpeg absent** → video steps skipped |
| 1 | M0 rulings (CRM safety unwire, mp4-first, manifest) | ✅ done |
| 2 | New media integration | ⚠️ **partial** — 17 stills processed + sets decided; 4 mp4 clips **ffmpeg-blocked**; JSX wiring rides §4 |
| 3 | Crops | ✅ done — 8 mobile crops (2 widths) generated |
| 4 | M1–M4 responsive media + lightbox | ⛔ **BUILD DEFERRED** (decisions done; needs a browser/device to build safely) |
| 5 | Triangle true-morph + cycle order | ⚠️ **DECISIONS done** (classification, cycle order, min-motion numbers logged); **BUILD DEFERRED** |
| 6 | Ornament tiles (S-pre/S0/S1 + S2 proposals) | ✅ done |
| 7 | This document | ✅ done |

**Why §4/§5 builds are deferred, not attempted blind:** both are
animation/gesture/media-critical and this environment has **no browser and no
ffmpeg**. I can't verify morph quality, pinch-zoom gesture ownership, or mobile
spread rendering headlessly; committing large unverified builds of them risks
shipping broken behavior. The approaches are fully recorded
(`motion-choreography-spec.md` for §5; the brief's M1–M4 for §4), the §5
choreography decisions are made (below/decision log), and all §4 mobile assets are
generated and ready — so the next run is a build-and-verify pass, not a redesign.

## Hard rules — honored
- **CRM data safety:** viewed every wired CRM frame. Unwired 4 badge-less assets
  (territorymap-zoom-desktop, field-scroll-mobile, territorymap-mobile,
  analytics-mobile-explorer) → recapture list. Kept only badge-visible / provably-empty.
- **/work/ copy + pinned proof tokens:** untouched (only `.example` href swaps +
  `rel` on the work/small-business pages, no copy or token changes).

## Commit map (oldest→newest; all ahead of origin/main, unpushed)
Rebased phase history (pre-run, replayed onto the media commit): `phase 0…5`,
`external session G1/U1/U2`, `phase 2.5 / revert / 2.5b`, `phase 3 copy+links`,
`record motion spec`. **This run's new commits:**
- `ffd7806` §1 — CRM badge unwire + mp4-first
- `3e99eaf` §2–3 — mobile crop + still assets, sets decided
- `fdcedd5` §6 S-pre — SVGs into the kit
- `c452593` §6 S0/S1/S2 — tiles tokenized/componentized/styleguided

## Classification + cycle-order tables (§5)
See `docs/decision-log-20260704.md` §5: the state fine-family/arrangement table, the
finding that novelty-A needs fine-family classification (5 coarse-rects can't be kept
non-adjacent in a 9-cycle), the proposed cycle order with one line per adjacency, and
the min-motion validator numbers (≥4/6 shapes move ≥8% short-side OR ≥25% area OR ≥15°).

## Could NOT self-verify (no browser / no ffmpeg)
1. Any visual/animation behavior: colorway coupling, triangle transition, mobile header,
   proof colors, ornament cross-theme contrast, S2 previews, the morph prototype.
2. Ornament per-tile contrast across all 8 themes → the "auto-remap contrast-collapse"
   step could not run; needs your eyes on `/styleguide/`.
3. Video re-encodes (Pinnacle portrait) + processing the 4 new mp4 clips → recapture list.
4. `src/assets/mobile/` payload (~7.2 MB) vs Netlify budget.

## ⚠ Deploy-relevant state you should know
- The **live poster triangle transition is the reverted BLACKOUT** (the jarring one you
  vetoed). The true-morph is deferred, so **the homepage still shows the blackout** until
  §5 is built. This is the biggest "known-bad but shipped" item.
- **No new mobile media renders yet** (component deferred) — the mobile assets exist but
  aren't wired; the site's mobile media is unchanged from before this run.

---

## Consolidated visual QA checklist — ordered by what would block a deploy
Run at `npm run dev`; mobile checks in DevTools device mode @ 390 & 360px.

### Would BLOCK a deploy
1. **CRM data safety.** Open the Field Intel proof: confirm only the Today dashboard +
   Analytics clips + the empty fieldnotes still render, and each shows **DEMO · SAMPLE
   DATA** (or is empty). Confirm the 4 unwired assets are gone. No real names/notes anywhere.
2. **Live links.** Summit→summitpharmacycolorado.com, Bristol→rxbristolokc.com,
   Pinnacle→pinnacle-rx.com open in a new tab (noopener). ProSource/Ourco show no live link.
3. **Triangle transition (known-bad).** Confirm you accept the **blackout** shipping until
   §5 lands — or hold the deploy for the morph. (Prototype to approve: `/styleguide/` top.)

### Should verify before deploy (shipped features)
4. **Pinned proof colors.** Each proof overlay = real brand (Summit spruce, Pinnacle
   razorback, Bristol brick, ProSource red, Ourco weld, Field Intel plum). Poster + index
   stay themed. Flip `data-theme` on `<html>` → proofs do NOT move; chrome does.
5. **Mobile poster header (390/360).** Two-row paper band, full "FOR BUSINESS OWNERS",
   ≥44px taps, no shape under the header, all portrait states read. VoiceOver announces/acts.
6. **Colorway coupling.** Poster through several cycles — a shape changes color only as it
   morphs (never at rest). Same on `/work/` ambient.
7. **mp4-first.** (Network tab) crm-today / summit-dermatology / summit-rxsubmission serve
   mp4; others serve webm.

### Dev-route only (not deploy-blocking)
8. **Ornament tiles** `/styleguide/` — all 5 across 8 themes; **flag any tile whose internal
   contrast collapses in a theme** (auto-remap couldn't run). Two scales legible.
9. **S2 placements** `/styleguide/` — proofstrips divider / burst corner / arch backdrop.
10. **Triangle morph prototype** `/styleguide/` top — the clip-morph + no-pop swatch.
11. Pinned-proof-tokens + shape kit + component specimens across all 8 themes (backlog).

### Deferred — not built this run (build + verify next)
12. §4 responsive media component + pinch-zoom lightbox + mobile spread wiring.
13. §5 triangle true-morph across all states + the reordered validator.
14. Process the 4 new Pinnacle/ProSource mobile mp4s + Pinnacle portrait re-encode (ffmpeg).
