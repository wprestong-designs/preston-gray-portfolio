# One-Shot Completion Run — Final Report

Run executed under converted decision authority (decide + document +
reversible). No deploy, no push, no Netlify changes. Every phase committed
after green lint + build + probes.

## 1 · Phases completed

| Phase | Commit | Scope |
|---|---|---|
| P0 checkpoint | (tree was clean — no commit needed; lint/build green verified) | — |
| P1 six-cast re-pack | `7fbef27` | exact pinwheel, color swap, monuments, triangle accents, hatching, crops, legacy warn |
| P2 media wiring | `207dff5` | Y2 body slots, 12 clip triplets, CRM gates, alt text |
| P3 colorways | `ce49976` | ramps + matrix, 8 colorways, dual cycle, off-register type |
| P4 wipes | `90c6c4a` | scroll-scrubbed geometric seams, panel surfaces |
| P5 copy pass | `01498e6` | G2 reconciliation, meta, OG image |
| P6 audit + review fixes | (this commit) | Lighthouse, probes, 20-agent adversarial review, 13 fixes |

## 2 · Decisions under converted authority (rationale + reversal knob)

1. **Pinnacle → teal-adjacent (existing sky tier), not coral.** Coral's
   best flood candidate fails AA with white (3.09) and sits in the warm
   band between ourco's orange and prosource's red; sky's display already
   reads cyan and keeps six maximally-separated display hues. *Reverse:*
   family assignments are per-proof token refs in projects.js (old
   assignments preserved in comments).
2. **Bristol → sage** (run spec directive; prior sky preserved in
   comments). Same reversal path.
3. **SUMMIT PHARMACY two-line monument** via `monument: string|string[]`
   — renderer supports both. *Reverse:* set the field back to a string.
4. **Triangle = accents, not a state (P1.4 default taken).** Polygon-state
   migration risks re-platforming seven working states for one (W1a
   showed the morph pipeline punishes mechanism changes); crossfade entry
   breaks the continuous-morph covenant. Echo accents never tween-morph,
   so clip-path is safe there. *Reverse:* `ECHO` table (old silhouettes in
   comment) + `MONUMENT_DECO='none'` + the documented polygon-state stub.
5. **Hatching lives on strip (P1.5 default), live** behind
   `HATCH_STATES=['strip']` — semantically the printer's test strip;
   reassignable by editing the array.
6. **Fragment crops** — decisive baselines (30–50% mass) per shape per
   orientation; all knobs composer-editable.
7. **Wipe declaration** — per-seam `wipe:` field in panels data
   (exemplified on summit) with a documented rotation default; declaring
   all 25 seams explicitly was skipped for knob-parity (rotation IS the
   declaration-by-convention).
8. **Colorway definitions are my proposals** (the 8 names arrived without
   definitions — flagged repeatedly). Members/accents are data; tune in
   the composer, re-verify via `scripts/color-matrix.mjs`.
9. **Accent PAIRS (onLight/onDark) + perFamily substitutes** instead of
   one accent per colorway — one hue cannot pass 3.0 across candy-tints
   AND deep purples; the threshold rule picks per member; all measured.
10. **Art-only members** (green/deep, sky/deep, red/vivid, purple/vivid):
    where neither ink nor white reaches AA, the member may fill shapes but
    never sits behind text — encoded in MEMBER_FG/TEXT_SAFE_STEPS.
11. **purple/deep also excluded from text surfaces** (P6): text-safe alone
    but its white fg fails against adjacent tint surfaces mid-wipe; one fg
    polarity per family keeps scrubbed seams AA. *Reverse:* re-add to
    TEXT_SAFE_STEPS if wipes ever gain a text-exclusion zone.
12. **Ghost register at small scale**: spec's 6px ghost on 12px mono
    overwhelms the glyphs — eyebrows/return take 2px (CSS override knob).
13. **WONK loaded via the Google Fonts axis** (+1KB across all Fraunces
    subsets, measured) instead of a self-hosted display subset.
14. **Colorway advance offset half a cycle** from the geometry morph (P6
    review) — repaint leaves the heaviest frame window; reads as a
    between-impressions re-ink. *Reverse:* inline in the cycle interval.
15. **Poster title kept Preston's current** ("Websites & Practical
    Marketing Help…") over the draft's "The Proof Catalog" — priority
    rule; flagged in the punch list as a taste call.
16. **Prosource tag keeps "in progress"** (standing constraint outranks
    the draft's tag).
17. **"Zero phone-tag refills" withheld** (claim-comfort flag adjacent to
    the no-invented-metrics law).
18. **Pill-bar SVG → strip state attribution** (arrived mid-run): the
    reference's ~66px pills sit under the 110px tappable minimum and
    can't reach coverage on a 2:1 stage — current strip stays the lawful
    adaptation; slimming is a composer pass within the bounds.

## 3 · Skipped / blocked items

- **CRM clips remain poster-only** (hard block — awaiting the four ☐
  verifications in media-manifest.md → flip `crmVerified` in projects.js).
- **DO-NOT-SHIP + the three ❓ graphics** untouched (hard block).
- **`crm-field-desktop.jpg`** (manifest CRM still #3) unwired — both CRM
  media panels hit the 3-item cap; needs a slotting call.
- **Pre-Phase-4 Lighthouse baseline** unrecoverable — that state predates
  surviving git history; absolute scores reported instead.
- **Validator machine gutter-check** — logged gap; gutters hand-audited.
- **P5 stamp/badge microcopy** — no stamp treatment exists to hold it.
- **Letterform fg × colorway** under the composer-only `?type=` override —
  shipping NONE mode unaffected; punch-listed.

## 4 · PRESTON'S PUNCH LIST

1. **Composer pass** (`/?compose=1`): 14 comps × 9 colorways, uppercase
   fragment crops (LETTERFORMS knobs), hatch look on strip, triangle echo
   rotations, pinwheel seams — everything is knobs.
2. **CRM verification**: check the four ☐ boxes in media-manifest.md, then
   flip the four `crmVerified: false` in src/data/projects.js.
3. **❓ graphics calls**: our-brands-title-wide (home or archive?), the
   three about-* Ourco photos, breath-of-fresh-air graphic; plus the
   unwired crm-field-desktop still.
4. **Copy red pen**: everything in content-state-report §6 — all
   `bodyDraft`/`verify` strings, the /work/ body, the About lines with
   held [VERIFY] holes (RuneScape year, dog's name), the poster-title
   taste call, "zero phone-tag" comfort.
5. **Real-device pass**: iOS VoiceOver first-activation on shapes; dvh
   toolbar collapse; device rotation mid-session; the keyboard walkthrough
   script in audit-report §5.
6. **OG image**: current capture is Registration/canonical (auto-generated
   — rerun `node scripts/capture-og.mjs` after any comp/palette tuning).
7. **Deploy decision** (nothing was pushed or deployed).

## 5 · Riskiest change of the run (reviewer flag)

**The U2 panel-surface system (P4) interacting with everything above it.**
It repaints formerly-constant deep-flood real estate with light ramp
members, which silently invalidated three older assumptions — chrome fg,
label opacity whisper, and cross-seam fg polarity. The adversarial review
caught all three (HIGH/MED) and they're fixed + re-probed, but any FUTURE
element floated over the panel region (badges, page dots, captions
outside cells) must read its fg from the surface system, not the overlay
root. Second flag: the composition now runs three stacked per-shape
layers (hatch texture, letterform, echo) over colorway-driven fills —
per-frame cost is probe-clean today (p95 18.5ms at 4× throttle), but it
is the place to look first if a weak device ever stutters.
