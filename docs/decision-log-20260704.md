# Decision log — one-shot autonomous run, 2026-07-04

Every judgment call, its reasoning, and how to reverse it. Reviewed once at end.

## Section 0 — Pre-flight
- **Tree clean**, `git fetch` brought `origin/main` to `4a67966` (2 uploads rebased in +
  the 21-capture media commit). **Rebased** my 15 phase commits onto `origin/main`
  (linear history, zero conflicts) — the expected reconciliation. Reverse: `git reflog`
  / `git reset --hard <pre-rebase sha>`.
- **ffmpeg GENUINELY ABSENT** in this environment (not in `/opt/homebrew/bin`,
  `/usr/local/bin`; `brew` not on PATH). Per instruction: log + **skip video-encode
  steps**, do not sips-hack around them. Blocked: §1.2 Pinnacle re-encode, §2 processing
  of the 4 new mp4 clips. STILL processing (sips) proceeds normally. Reverse: n/a (env).
- Build + lint pass post-rebase.
- 21 new raw captures = **17 stills** (8 Pinnacle + 9 ProSource mobile page shots) +
  **4 mp4 clips** (pinnacle/prosource × homepage-scroll + navigation), in `Media/`.

## Section 1 — M0 rulings
- **mp4-first list, derived by size** (mp4 < webm ⇒ serve mp4 first): `crm-todaydashboard-scroll-desktop`, `summit-dermatology-desktop`, `summit-rxsubmission-scroll-desktop` (the 4th size-match, `summit-crm-territorymap-zoom-desktop`, was unwired below). Added `mp4First: true` to those items; `ProofMedia` orders sources by the flag. Reverse: drop the flag → webm-first.
- **CRM badge enforcement (hard rule).** Viewed every wired CRM frame:
  - KEEP: `crm-todaydashboard` (badge ✓), `crm-analytics-desktop` (badge ✓), `crm-fieldnotes-desktop` (no badge but an EMPTY state — "nothing comes from Rx data", 0 rows — accepted as the rule's "equivalent provable synthetic marker"; flagged borderline).
  - **UNWIRE + recapture** (no badge, no provable marker): `summit-crm-territorymap-zoom-desktop`, `crm-field-scroll-mobile`, `crm-territorymap-mobile.jpg`, `crm-analytics-mobile-explorer.png`. Mobile layouts hide the sidebar badge; the territory-map zoom predates it. Removed items + dead imports; dropped Field-Intel panel 3 whole (no dead slot); panel 4 lost the map clip, kept analytics clip + fieldnotes still. Reverse: `git revert` this commit / re-wire from the recapture list.
- **Pinnacle re-encode: BLOCKED** (no ffmpeg). On the recapture list (§6).
- **Manifest** stale "nothing wired yet" note brought current.

## Section 3 — Crops
- CRM today re-cropped **taller** (1195×290 @ 310,58 — now includes the "Today's
  field day" card below the stat row, per ruling). Other 6 approved as generated;
  CRM fieldnotes kept as the sidebar+sync interim (populated view on recapture list).
- All 8 crops generated final into `src/assets/mobile/` at 2 widths each (native
  ≤960w + 480w) for srcset. Reverse: delete `src/assets/mobile/*`.

## Section 2 — New media integration (stills processed; clips blocked)
- 17 new Pinnacle/ProSource page stills → `src/assets/mobile/` at 587w native +
  360w (portrait phone shots). The 4 mp4 clips are **ffmpeg-blocked** → recapture list.
- **Payload note:** `src/assets/mobile/` is ~7.2 MB (screenshots are detailed). If it
  matters for Netlify, re-encode at lower JPEG quality or drop the unused expansion
  stills. Flagged for M4 QA.
- **Decided mobile sets** (restraint: lead + ≤3 supporting collapsed; rest in Full
  Spec expansion; nothing dead):
  - **Pinnacle** — lead `homepage` (native portrait clip is the intended lead but
    ffmpeg-blocked; still leads for now). Supporting: `about` (the people story),
    `rxsubmission` (tool), `womenshealth` (specialty). Expansion: `dermatology`,
    `ophthalmology`, `generalrx`, `rxdatabase`.
  - **ProSource** — lead `rxrefillrequest` (its proof statement is the refill form).
    Supporting: `about`, `rxsubmission`, `womenshealth`. Expansion: `dermatology`,
    `ophthalmology`, `generalrx`, `rxdatabase`, `FAQ`.
  - Reasoning: each lead = the proof's headline story; supporting = story + a tool +
    one specialty; the remaining specialty pages are repetitive, so they earn only
    expansion slots. Reverse: edit the set arrays in projects.js.
- **JSX wiring of these sets depends on the M1 responsive component (§4)** — assets
  + decisions are ready; wiring status is in the close-out.

## Section 6 — Ornament tiles (S-pre, S0, S1, S2)
- **S-pre:** `git mv` 5 root SVGs → `src/components/shapes/ornaments/` (6→blocks,
  7→vortex, 8→burst, 9→arch, long-name→proofstrips). No svgr in the project → tiles
  inline via Vite `?raw` + `dangerouslySetInnerHTML`.
- **S0 hex→role map** (by hue; light purples → --lead to stay distinct from deep
  wildcard, so internal contrast survives): yellow `#ffde59`→--flash · greens/lime
  `#c1ff72 #8fff00 #00bf63`→--pop-1 · teals `#0097b2 #51efff`→--support · purples
  `#5e17eb #7e00b2 #1800ad`→--wildcard · light purples `#e2a9f1 #ecc4ff`→--lead ·
  reds `#ff5757 #ff7a7a`→--signal · oranges `#ff751f #ff914d`→--pop-2 · white→--paper.
  Root width/height stripped (viewBox kept); IDs namespaced `${tile}-…` at build +
  uniquified per instance via useId (multi-inline safe). 0 raw hex remain.
  **COULD NOT auto-remap contrast-collapse pairs** — needs rendering (no browser); the
  per-tile cross-theme contrast is on the QA checklist. Same-hue collisions exist by
  design (3 greens→pop-1, 3 purples→wildcard) and are intentional (system uses few roles).
  proofstrips had no white FILL in source — its "white bars" read as ground gaps.
- **S1:** `Ornament` component (decorative, aria-hidden, non-interactive, no handlers);
  styleguide "Ornament tiles" per theme, all 5 at two scales (110/190px).
- **S2 proposals (styleguide preview ONLY, never live):** proofstrips → section divider
  (recommended); burst → corner accent; arch → quiet backdrop. vortex intentionally
  omitted (most dominant, needs caution). Reverse: delete the S2 styleguide section.

## Section 5 — Triangle morph: DECISIONS logged; BUILD deferred (see close-out)
**Build deferred** — the clip-morph across all states + validator changes are
animation-critical and I have no browser to verify morph quality/perf this run;
committing them blind risks shipping a broken cycle. Approach is recorded in
`motion-choreography-spec.md`; the decisions it needs are made here.

**State classification (dominant fine-family + arrangement):**
| State | fine-family | arrangement | round-dominant? |
|---|---|---|---|
| swatches | blob (organic rounded) | scatter | yes |
| registration | mixed (arches+circle+rects) | grid | — |
| columns | sharp-rect | vertical stack | no |
| circles | circle | scatter | yes |
| tiles | rounded-rect | grid | no |
| quarters | quarter-round | radial | no |
| pinwheel | quarter-ellipse | radial | no |
| pillrhythm | pill | horizontal rows | no |
| triangle | triangle | grid | no |

**Finding:** with only the coarse families (rect/round/triangle/mixed), 5 states
are "rect" — in a 9-cycle you CANNOT keep all 5 non-adjacent (4 non-rects → only
4 gaps). So novelty-A must be judged on the **fine** family (sharp-rect vs
rounded-rect vs pill vs quarter-round vs quarter-ellipse are distinct), which is
also what the morph-adjacency rule already uses. Round-dominant pair (swatches,
circles) kept non-adjacent per the spec's explicit example.

**Proposed cycle order** (fine-family differs every adjacency; triangle only
touches rect-family; the known low-motion tiles↔quarters pair is NOT adjacent):
`registration → circles → columns → triangle → quarters → swatches → pillrhythm → pinwheel → tiles →` (wrap)
- reg(mixed)→circles(circle): mixed→round, big change ✓
- circles(circle)→columns(sharp-rect): round→hard rect ✓
- columns(sharp-rect)→triangle: cleanest morph (near-sharp collapse) ✓ rect neighbor
- triangle→quarters(quarter-round): rect neighbor; shared sharp-corner language ✓
- quarters(quarter-round)→swatches(blob): angular→organic ✓
- swatches(blob)→pillrhythm(pill): scatter→rows ✓
- pillrhythm(pill)→pinwheel(quarter-ellipse): rows→radial ✓
- pinwheel(quarter-ellipse)→tiles(rounded-rect): radial→grid ✓
- tiles→registration (wrap): family differs (rounded-rect vs mixed); both grid — the
  one arrangement repeat, acceptable under "ideally" (soft). Swap candidate if disliked.

**Min-motion threshold (novelty-B), my numbers to enforce in the validator:** a
transition PASSES iff **≥4 of the 6 project shapes** each change beyond a meaningful
delta, where meaningful = centre shift ≥8% of the stage's short side, OR area (scale)
change ≥25%, OR rotation ≥15°. A pair failing this is recomposed or made non-adjacent
(tiles↔quarters is the known failure — already routed non-adjacent here).

## Section 4 — M1–M4 media: DECISIONS done; BUILD deferred (see close-out)
Assets generated (§2/§3), per-proof mobile sets decided (§2), mp4-first ordering
shipped (§1). The responsive-select component + pinch-zoom lightbox + spread wiring
are **deferred** — pinch-zoom gesture ownership and the mobile spreads need device
testing I can't do headlessly; the M1–M4 spec is intact in the brief. Reverse: n/a.

## Other decisions
