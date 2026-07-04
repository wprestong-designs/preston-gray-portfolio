# Proof Catalog — Interactive Hero & Motion System

Claude Code implementation spec. Vite + React. Existing site: white base, deep spruce
green global accent, per-project hover color-flood, four editorial spreads
(Summit Pharmacy, Ourco, The Pharmacy Network, Summit Field Intel).

This spec adds five techniques adapted from reference portfolios
(karinasirqueira.com, nataliealmosa.ca, spencergabor.work, robin-noguier.com),
unified under the Print Shop × Editorial concept. Nothing here is decoration
borrowed for its own sake — every motion device is expressed in print-shop
vocabulary (ink swatches, registration marks, halftone dots, proof strips,
crop marks) so it reads as native to the concept.

---

## 0. Tech decisions (make these first)

- **Motion library:** `framer-motion` (now published as `motion`). One library for
  everything: hero shape choreography (`animate` + variants), shared-element
  transitions (`layoutId`), micro-interactions (`whileHover`), scroll reveals
  (`useInView`). Do NOT add GSAP, Three.js, or WebGL — out of scope by design.
- **Routing:** whatever the site already uses. Shared-element transitions require
  the hero shape and the spread hero to be mounted inside the same
  `<AnimatePresence>` / `LayoutGroup` boundary. If using React Router, wrap routes
  in `<AnimatePresence mode="wait">` at the layout level.
- **Reduced motion:** every animated component must check
  `useReducedMotion()` from framer-motion. Reduced-motion behavior is specified
  per feature below — it is not optional polish, build it alongside each feature.
- **Data model:** single source of truth `src/data/projects.ts`:

```ts
export type Proof = {
  id: string;            // "summit" | "ourco" | "network" | "field-intel"
  index: string;         // "01".."04"
  name: string;          // display name
  tag: string;           // mono-font metadata, e.g. "Houston industrial"
  color: string;         // project flood color
  colorInk: string;      // darker shade for text on tinted surfaces
  slug: string;          // route
  preview: string;       // image used in cursor proof card
};
```

Assign: Summit Pharmacy = spruce (site accent), Ourco = orange `#F79245`,
The Pharmacy Network = red `#D42B2B`, Summit Field Intel = ink `#2C4E51`.
Optionally add a 5th non-project shape (tan `#FAF5E0` outline) that routes to
About — gives the composition an odd count, which composes better.

---

## 1. The Composition Hero (Karina technique, print-shop vocabulary)

### Concept
A single fixed cast of 4–6 shapes, one per project (plus optional About shape),
each in its project color. The composition cycles between **three named states**
on a timer (~7s per state, with a 1.2s eased morph between). Shapes never enter
or leave; they re-choreograph. Each shape is a link to its project.

### The three states
Define each state as a keyed layout: every shape has `{ x, y, width, height,
borderRadius, rotate }` per state. Animate between them with springs
(`type: "spring", stiffness: 60, damping: 18` — slow, heavy, inky).

1. **Ink Swatches** — loose daubs. Rounded-rect blobs of varied size scattered
   with intentional overlap, like ink test daubs on a palette card. Border
   radius large and asymmetric per shape.
2. **Registration** — the tight state. Shapes snap to a strict grid, become
   quarter-rounds and squares locking together (closest to Karina's image 1).
   Render thin crop marks (SVG lines) at the composition corners in this state
   only — fade them in/out with the state.
3. **Proof Strip** — vertical pills of varying heights in a row (Karina's
   image 3), reading as a printer's test strip. Baseline-aligned bottoms,
   staggered tops.

Implementation: `const STATES = { swatches: {...}, registration: {...},
strip: {...} }` keyed by shape id. A `useInterval` cycles an index; each shape
is a `motion.div` (or `motion.a`) whose `animate` prop reads
`STATES[current][shape.id]`. Framer interpolates border-radius strings — keep
the same format ("40% 60% 55% 45%") across states so it tweens cleanly.

### Interaction
- **Hover a shape:** pause the cycle timer. The hovered shape scales to 1.04
  and lifts (2px offset shadow — Spencer's sticker shadow, see §3). Siblings
  drop to 45% opacity. A typographic label sets in beside the shape in mono:
  `PROOF 02 — OURCO` with a hairline underline drawing in left-to-right
  (scaleX 0→1, transform-origin left, 300ms).
- **Hover also floods:** the page accent (masthead rules, index hover states)
  transitions to the project color over 400ms — reuse the existing global
  color-flood mechanism; drive it from a `useFloodColor()` context so hero,
  index, and spreads share one system.
- **Click:** navigate to the spread via shared-element transition (§4).
- **Mouse leave:** resume cycle after 1.5s idle.

### Accessibility / fallbacks
- Shapes are `<a>` elements with `aria-label="Proof 02 — Ourco, Houston
  industrial"`. Keyboard focus behaves exactly like hover (focus-visible ring
  in the project color).
- `prefers-reduced-motion`: composition renders in the Registration state,
  static. Hover still dims siblings and shows labels (opacity/color only, no
  movement).
- The hero is never the only navigation — the typographic index (§2) sits
  directly below the fold.
- Mobile/touch: hide the cycling hero below ~768px OR render the Registration
  state static as a banner graphic. Shapes on touch should not be links
  (no hover affordance = mystery meat); the index is the nav.

---

## 2. Typographic Index with cursor proof card (Karina technique #2)

Directly below the hero. A ledger of the four projects:

```
INDEX OF PROOFS
01  Summit Pharmacy        Provider access & field ops
02  Ourco                  Houston industrial
03  The Pharmacy Network   Bristol · Pinnacle · Prosource
04  Summit Field Intel     Custom CRM, designed & built
```

- Large display type for names (site's editorial face, ~clamp(28px, 4vw, 44px)),
  mono for numbers and tags, hairline rules between rows.
- **Hover a row:** name color → project color; row indents 10px (250ms ease);
  the shared flood context fires.
- **Cursor proof card:** a fixed-position card (~180×140px) that lerps toward
  the cursor (`x += (targetX - x) * 0.12` per frame via rAF, or framer
  `useSpring` on `useMotionValue`s — prefer the latter, less code). Card =
  project preview image inside a 1px border in the project color, white
  matte padding, rotated -2°, mono caption `PROOF 03`. Card only exists while
  hovering the index (`AnimatePresence` fade+scale in/out).
- Pointer check: only render the cursor card when
  `window.matchMedia('(pointer: fine)').matches`. On touch, rows show a small
  inline thumbnail on the right instead.
- Reduced motion: card appears/disappears with a fade, pinned to a fixed
  position beside the list rather than following the cursor.

---

## 3. Sticker micro-interactions (Spencer technique)

A single reusable treatment applied consistently — not scattered effects.

- **The "proof lift":** on hover, interactive artifacts (spread images, preview
  cards, buttons) translate -2px/-2px and gain a hard offset shadow:
  `box-shadow: 3px 3px 0 <projectColor>` (or ink for neutral elements). No blur —
  hard shadow reads as a paper layer, which is the print-shop version of
  Spencer's sticker shadow. 150ms ease-out in, 250ms out.
- **Rubber-stamp accents:** small mono badges ("APPROVED", "PROOF No. 002",
  date stamps) on spreads get a `whileHover={{ rotate: -3, scale: 1.05 }}`
  wobble with a stiff spring.
- Build as one component/utility (`<ProofLift color={...}>`) so the treatment
  stays identical everywhere. Resist adding variants.

---

## 4. Shared-element transitions (Robin technique)

The seamless index→spread feel, without WebGL.

- Wrap the app in `<LayoutGroup>`. Each hero shape and each spread's hero block
  share `layoutId={`proof-${project.id}`}`.
- Click path: shape (or index row's thumbnail) → route change → spread mounts →
  the shape morphs into the spread's hero color block / image container.
  Framer handles the FLIP; your job is keeping both elements simple
  (a colored container with an image inside, `layout` on the image too).
- Route transitions: `<AnimatePresence mode="wait">`, outgoing page fades to
  the project color at 8% tint (the "ink wash"), incoming spread content
  staggers in (masthead → image → body, 60ms stagger).
- Reduced motion: instant route change with a 150ms crossfade only.
- Known gotcha: layoutId animations break if the source unmounts before the
  target mounts. Keep both routes inside the same AnimatePresence boundary and
  test back-navigation specifically.

---

## 5. Voice layer (Natalie technique — content, not code)

Write during implementation, not after:

- Masthead line under "The Proof Catalog" in editorial voice, first person,
  specific: what a proof is and why the portfolio is organized as one.
- Each index row's mono tag doubles as personality real estate — keep them
  concrete ("Bristol · Pinnacle · Prosource"), never generic ("Web Design").
- A short "Off the press" section near the footer: 3–4 non-work items
  (woodworking, OSRS, the dog) set as small classified-ad style boxes in the
  mono face. Humanizes without a whole About page rewrite.
- Rubber-stamp badges (§3) carry voice too: "SET IN COLORADO",
  "PROOFED BY HAND".

---

## 6. Build order (phased; each phase ships independently)

1. **Phase 1 — Foundation:** `projects.ts` data model, `useFloodColor()`
   context wired into existing accent system, install `motion`.
2. **Phase 2 — Typographic index + cursor proof card** (highest
   value-to-effort; works standalone even if the hero slips).
3. **Phase 3 — Sticker lift treatment** across spreads and index.
4. **Phase 4 — Composition hero:** build Registration state static first, then
   add the other two states + cycle, then hover choreography.
5. **Phase 5 — Shared-element transitions** index/hero → spreads.
6. **Phase 6 — Voice pass + reduced-motion/keyboard/touch audit.**

## 7. Acceptance checklist

- [ ] Hero cycles 3 states; pause on hover; resume on idle
- [ ] Every shape reachable by keyboard, labeled, focus-visible in project color
- [ ] Flood color system shared across hero, index, spreads (one context)
- [ ] Cursor card lerps smoothly at 60fps; absent on touch/coarse pointers
- [ ] Sticker lift identical on all interactive artifacts (one component)
- [ ] layoutId transition works forward AND on back-navigation
- [ ] prefers-reduced-motion: static hero, no cursor-follow, crossfade routes
- [ ] Mobile: index-driven nav, inline thumbnails, no hover-dependent paths
- [ ] Lighthouse: no CLS from hero; shapes are transform-only animations
      (never animate top/left/width in the cycle — use transforms + a fixed
      container to keep layout stable)

---

## Appendix A — Art-directed state layouts (starting compositions)

Canvas: normalized 1200 × 600 design space. Render the hero as a fixed-aspect
container (e.g. `aspect-ratio: 2 / 1; max-width: 1200px`) and position shapes
with percentage transforms derived from these values, so the composition
scales as one piece. All values are the shape's bounding box: `x, y` =
top-left; `r` = border-radius string; `rot` = rotation in degrees.

These are starting points, not final art. Preston will nudge values by eye.
Build a dev-only "composer" toggle (querystring `?compose=1`) that renders
each state statically with shape ids labeled, so tuning is fast.

Cast:

| id         | color               | role            |
|------------|---------------------|-----------------|
| summit     | spruce (site accent)| Summit Pharmacy |
| ourco      | #F79245             | Ourco           |
| network    | #D42B2B             | Pharmacy Network|
| fieldintel | #2C4E51             | Field Intel     |
| about      | #EFE6C8 fill, 1.5px ink outline | About (optional 5th) |

### State 1 — Ink Swatches (loose daubs, overlapping, rotated)

| id         | x   | y   | w   | h   | r                     | rot |
|------------|-----|-----|-----|-----|-----------------------|-----|
| summit     | 130 | 90  | 300 | 220 | 46% 54% 60% 40%       | -6  |
| ourco      | 380 | 250 | 240 | 240 | 50% 50% 50% 50%       | 0   |
| network    | 560 | 70  | 280 | 200 | 58% 42% 45% 55%       | 4   |
| fieldintel | 760 | 220 | 330 | 280 | 42% 58% 52% 48%       | -3  |
| about      | 300 | 380 | 150 | 150 | 50% 50% 50% 50%       | 8   |

Overlap is intentional (ourco tucks under summit's corner; about kisses
network's edge). z-order: fieldintel lowest, about highest.

### State 2 — Registration (tight grid, quarter-rounds locking; crop marks on)

| id         | x   | y   | w   | h   | r                     | rot |
|------------|-----|-----|-----|-----|-----------------------|-----|
| summit     | 140 | 60  | 210 | 250 | 0 0 105px 105px       | 0   |
| ourco      | 360 | 60  | 230 | 230 | 50% 50% 50% 50%       | 0   |
| network    | 140 | 320 | 270 | 220 | 0 135px 135px 0       | 0   |
| fieldintel | 600 | 60  | 460 | 480 | 0 0 0 230px           | 0   |
| about      | 880 | 360 | 180 | 180 | 50% 50% 50% 50%       | 0   |

fieldintel is the big ink anchor (Karina's black block); about overlaps its
lower-right corner (z-order above). Gaps between grid neighbors: exactly 10px.
Crop marks: 4 SVG corner marks at (100,40) (1100,40) (100,560) (1100,560),
ink color, fade in only in this state.

### State 3 — Proof Strip (vertical pills, common baseline y=540)

| id         | x   | y   | w   | h   | r     | rot |
|------------|-----|-----|-----|-----|-------|-----|
| summit     | 150 | 250 | 100 | 290 | 50px  | 0   |
| ourco      | 270 | 130 | 170 | 410 | 85px  | 0   |
| network    | 460 | 210 | 140 | 330 | 70px  | 0   |
| about      | 620 | 400 | 80  | 140 | 40px  | 0   |
| fieldintel | 840 | 90  | 230 | 450 | 115px | 0   |

Bottoms all land on y=540 (y + h = 540). The gap between about and
fieldintel is deliberate breathing room — don't close it.

### Morph notes

- Keep border-radius strings in a consistent 4-value format per shape across
  all states so Framer tweens them smoothly (write circles as
  "50% 50% 50% 50%", pills as px values on all four corners).
- Animate via transform (`x`, `y`, `scaleX`, `scaleY` from a common base size)
  rather than width/height, to stay compositor-only. Simplest approach: give
  every shape a base 100×100 box, position/scale it per state, and let
  border-radius carry the shape identity. If non-uniform scale distorts
  border-radius unacceptably, animating width/height is an accepted fallback —
  the hero is a fixed-size layer, so no CLS either way; test both.
- Stagger the morph start per shape by 40–70ms (summit first → about last) so
  states hand off with a ripple instead of a lockstep snap.

