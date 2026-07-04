# G3 Audit Report — oneshot P6

Build audited: `oneshot: P5 copy pass` + the P6 a11y contrast fix.
Everything below was machine-verified against the PRODUCTION build
(`vite preview`) unless marked otherwise. No deploy performed.

## 1 · Spec §7 acceptance checklist

- [x] **Hero cycles states; pause on hover; resume on idle** — now 7 states
      × 9 colorways, dual shuffle-no-repeat; hover/arm pause + 1.5s resume
      verified across B1a/U0c probes; single settle per transition
      (motion-episode trace: one episode per 2s tick, no double-settle).
- [x] **Every shape keyboard-reachable, labeled, focus-visible** — six real
      anchors with `Proof NN — Name, tag` labels; inset two-tone focus
      rings survive stage crop; `:focus-visible` gating keeps taps from
      stealing the hover (U0c).
- [x] **One flood context** shared across hero, index, overlays — colorways
      deliberately do NOT touch it (identity anchor).
- [x] **Cursor card lerps on fine pointers; absent on touch/coarse** —
      unchanged since R-era verification; rows now pointer-gated (B1a).
- [x] **Sticker lift = one component** (ProofLift) — untouched; composition
      shapes intentionally lost press shadows in X3 (design decision).
- [x] **layoutId transition forward AND back** — probe: open morph engages
      from every origin type (all six shapes incl. new proofs, index row,
      wordmark), backdrop collapses to the exact origin box on close, focus
      restores to the true origin. Hash arrivals fade by design.
- [x] **prefers-reduced-motion** — static Registration + canonical
      colorway; overlay fades, vertical stack, solid blocks (no wipes),
      poster-only video with tap-to-play, no ghost slide, art module never
      downloads on /work/ (entry code path checks matchMedia first).
- [x] **Mobile: index-driven nav + two-tap arming** — two-tap verified
      (arm→open), stack blocks verified, SR activation opens directly
      (pointerType-gated arming; real-device VoiceOver pass = Preston).
- [x] **No CLS from hero; transform-only cycle** — Lighthouse CLS **0** on
      the poster. (Width/height on shapes animate inside a FIXED stage
      that is itself transform-scaled — the accepted Appendix-A fallback;
      no document reflow, CLS confirms.)

## 2 · Accumulated audit additions

- **Two-tap semantics**: probe-verified (tap1 arms + triangle echo, tap2
  opens); arming never gates the accessible click.
- **Hash-arrival focus**: falls back to the Index utility (B1c) — verified.
- **Poster no-scroll**: `100dvh` + `overflow: clip`; `overscroll-behavior-y
  none`. iOS dvh toolbar-collapse refit relies on the ResizeObserver
  contain-fit — **needs Preston's real-device pass** (listed in punch list).
- **Orientation change mid-session**: debounced flip + hover-clear + settle
  gate re-arm; verified in R2/U0b probes (desktop resize); device rotation
  = Preston's pass.
- **Morph from all origin types**: see §1 layoutId line.
- **Wipe performance**: 4×-CPU-throttled scrub of the longest overlay:
  p50 16.8ms · p95 18.5–30.1ms · worst 50ms — above the 30fps floor
  throttled, ~60fps unthrottled. `WIPE_MODE='fade'` fallback knob in place;
  not needed on this evidence.
- **Type-layer morph perf**: settle-gated fades hide fontSize tweens
  (U0b/V1a); no LAYOUT-projection animations anywhere (W1a architecture,
  re-verified by episode trace).
- **sr-only volume**: one sentence on the poster — nowhere near cloaking
  territory; /work/ carries discoverability with real crawlable copy.

## 3 · Lighthouse (production build, headless; pre-Phase-4 baseline
     unavailable — that state predates the surviving git history, logged
     as an open item; absolute scores below)

| Entry | Perf | A11y | Best-Practices | SEO | FCP | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| `/` (poster) | 97 | 100 | 100 | 100 | 2.0s | 2.0s | **0** | 0ms |
| `/work/` | 91 | **100**¹ | 100 | 100 | 2.8s | 2.8s | 0.025² | 0ms |

¹ Was 95: `--ink-faint` (2.89:1) on card indices + footer — fixed to
`--ink-soft` (7.63:1) during this audit.
² Font-swap reflow on the h2 section (0.025 — well inside "good"; optional
`size-adjust` fallback listed on the punch list).

## 4 · Media weights (measured in dist)

| Project | Deploy (mp4+webm+posters) | Per-visitor (one format) | Budget |
|---|---|---|---|
| summit (4 clips) | 5.5 MB | ~2.8 MB + posters | ✓ far under 15MB |
| fieldintel (4 clips, poster-gated) | 8.2 MB | ~3.6 MB when verified; posters-only until then | ✓ |
| bristol (2 clips) | 4.1 MB | ~2.4 MB | ✓ |
| pinnacle (2 clips) | 2.1 MB | ~1.1 MB | ✓ |
| prosource / ourco | stills only | ~0.2 / ~2 MB | ✓ |
| **Total clips in dist** | **18.4 MB** | — | ✓ |

Largest single encode 2.34MB (territory-map webm) — under the 3MB spec.

## 5 · Keyboard-only walkthrough script (for Preston to execute)

1. Load `/`. **Tab** → wordmark "About Preston" (paper chip focus ring).
   **Tab** ×2 → Index, Contact. **Tab** again → first composition shape;
   confirm the label + type reveal on focus and the inset two-tone ring.
2. **Tab** through all six shapes (01→06; order follows DOM). **Enter** on
   Proof 03 (Bristol) → overlay morphs from the shape; focus lands on the
   ✕ close button.
3. **Tab** → the scroller (ring inset). **PageDown / ↓** through panels:
   monument → media (clip plays; captions/bodies read) → points → return
   panel. Confirm the wipes scrub with scroll and reverse on **PageUp**.
4. **Tab** to "← Return to the catalog", **Enter** → overlay collapses back
   into the Bristol shape; focus returns to that shape.
5. **Enter** on Proof 06 (Field Intel) → every clip shows a poster with
   "Pending verification" (no video elements — this is correct until the
   CRM flags flip).
6. **Esc** closes; focus restores. Open the Index (**Enter** on Index) →
   rows Tab-navigable; **Enter** a row → morph from the row; close → focus
   back on the row; **Esc** closes the Index; focus returns to the Index
   button.
7. Wordmark **Enter** → About overlay (fade-in title is correct — no
   fragment exists); contact mailto reachable; return line closes.
8. With VoiceOver/TalkBack on a phone: activate a shape directly — it must
   OPEN (not arm) on first activation.

## 6 · Adversarial review findings (three-lens workflow, 20 agents, every
     finding independently verified against the code before acceptance)

**Fixed during P6 (re-probed on the prod build after fixing):**
- HIGH · Overlay chrome (eyebrow + ✕) kept the flood fg over light U2
  surfaces (~1.5:1) → chrome now follows the ACTIVE panel's surface fg
  with a 300ms color ease. Probe: cream→ink flip confirmed.
- HIGH · Two-line monument FLIP scaled the whole block to the one-line
  fragment (SUMMIT popped at half glyph size) → FLIP measures the FIRST
  LINE. Probe: enters at fragment scale.
- MED · `.ov-mono` opacity 0.8 blended labels below AA on ramp surfaces →
  full opacity (matrix was measured at full opacity).
- MED · Hatch bars shipped with a 92% color-mix alpha (stained-glass law
  breach) → solid `--bg`.
- MED · Mid-wipe seam overlaps could park wrong-fg text (white on
  lavender ≈1.5) + the diagonal's skew wedge exposed flood behind ink →
  purple/deep removed from TEXT_SAFE_STEPS (one fg polarity per family)
  AND surfaced cells now paint their own base background.
- MED · WipeBg read viewport metrics up to ~16×/frame → module-cached
  vw/vh with one resize listener.
- MED · Colorway repaint landed on the morph's heaviest frames → colorway
  advance offset half a cycle (reads as a between-morphs re-ink).
- MED · Validator couldn't survive the pinnacle/prosource area tie and
  rule-4 text contradicted pinwheel's 12px → tie-safe comparison checks;
  rule text codifies the 12px exception. (Machine gutter check = punch
  list.)
- LOW · `.ov-tri` 0.85 opacity → 1 · raw `#ffffff` in the fg pipeline →
  `--fg-white` token · `resolveAccent` art-only guard + DARK_MEMBERS
  derived from measured data · reduced-motion now honors a static
  `?colorway=` pin · `og:image:alt`/`twitter:image:alt` added.

**Punch-listed (not fixed in-run):** letterform displayFg under the
`?type=anchor|all` composer override isn't colorway-aware (shipping mode
NONE is unaffected); validator gutter machine-check; ambient same-tick
colorway advance (cheap surface, 5.5s cadence).

**Verified-clean (for the record):** CRM poster-only gate in every
input/motion mode; alt completeness (26/26, CRM demo-tagged); aria on all
new decorative layers; reduced-motion branches across wipes/ghost/ambient
/hero; two-tap + SR-activation semantics untouched; computeSurfaces memo
and WipeBg closures safe.

## 7 · Regression probe suite (all green on the final build)

morphs-all-origins ✓ · close-collapse-to-origin ✓ · focus-restore ✓ ·
monument FLIP (fragment→monument, incl. two-line SUMMIT PHARMACY) ✓ ·
single-settle episodes ✓ · opaque fills under dim ✓ · type contract
(computed-style equality incl. WONK/opsz) ✓ · CRM gate (0 video elements,
4 "Pending verification") ✓ · alt completeness (0 missing; CRM
demo-tagged) ✓ · colorway pin + dual-axis cycle + 9 composer options ✓ ·
wipes scrubbed/reversible/opaque + matrix fg ✓ · mobile stack solid ✓ ·
two-tap arming ✓ · legacy #proof-network → bristol (hash stripped) ✓ ·
grammar validator SILENT (7 states × 2 orientations, in Node AND
in-browser) ✓ · color matrix ALL CHECKS PASS ✓
