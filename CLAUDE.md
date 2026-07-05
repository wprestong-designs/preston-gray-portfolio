# CLAUDE.md — Preston Gray Portfolio (operating manual)

Vite + React "Proof Catalog": poster homepage (`/`), plainspoken work index
(`/work/`), owner-facing services page (`/small-business/`) — three static Vite
entries, no router (+ dev-only `/styleguide/`). Overlay-driven: proofs, About,
Index, and Contact are layers/overlays, not pages.

- **Repo:** https://github.com/wprestong-designs/preston-gray-portfolio (origin)
- **Canonical domain:** https://preston-gray.com
- **Commands:** `npm run dev` · `npm run build` · `npm run lint`

## Branch workflow — main IS production (Cloudflare Pages), merge only on Preston's say-so
`main` builds + deploys to production via **Cloudflare Pages** (project
`preston-gray-portfolio`, domain `preston-gray.com` + `www`, auto-SSL). Do all work on
**feature branches**, push them to origin freely, and **merge to `main` ONLY when Preston
explicitly says so** — the merge is his call, not yours. If you think main must change,
log it and STOP that item.

- **Netlify is STOPPED** (builds disabled; the old site is pending §8 decommission —
  `docs/cloudflare-migration.md`). **Never re-enable Netlify builds** — a second host on
  `main` would fight Cloudflare and burn the exhausted credits.
- **Gate-1 (env before build):** any change to `VITE_WEB3FORMS_KEY` (contact form) must
  be set in the Cloudflare Pages env vars BEFORE the build that ships it — Vite inlines it
  at build time, so a late var means the live form silently falls back to mailto.
- **REVIEW SURFACE = LOCALHOST.** Preston reviews every branch with `git checkout <branch>`
  then `npm run dev`. Cloudflare **branch/preview builds are free** if ever needed, but are
  NOT the review path — never gate a handoff on a preview URL. **End every handoff** with
  those two commands + the exact routes/interactions to look at.
- **Main drifts via GitHub web uploads** (Preston uploads raw assets straight to main —
  they land as "Add files via upload" commits). **Every run starts with `git fetch` and
  reconciles `origin/main` into the branch** (merge, not rebase) before reporting state,
  so stacked merges stay conflict-free. Raw uploaded assets live in `Media/`; the
  processed web derivatives live in `src/assets/`.

## Color governance (the ruling)
- **Site-owned surfaces** (poster, index, chrome, headers) wear the **Memphis 8-theme
  system** — `data-theme` on the surface, role tokens only (`--lead`,`--pop-2`,…).
  The poster cycles all 8 themes on a constant white ground; shapes read role tokens
  directly (`POSTER_ROLE`), never the `:root`-resolved `--display-*` tier.
- **Client proof surfaces** (overlays, `/work/` cards, dots) wear **pinned real-brand
  tokens** (`--proof-*`, mapped in `index.css` to `--{project}-flood` etc.). These are
  FIXED — never live inside a `[data-theme]` block, never re-rooted.
- **Armed shapes flood the project's PINNED brand color** + title in the brand's AA
  fg, so poster→overlay is one continuous object.
- Full law: `90s-geometric-color-system-strategy.md`. Tokens: `src/styles/tokens.css`
  is the SOLE home for hex. Components consume role/proof tokens only.

## Hard rules
- **CRM data safety:** no CRM asset renders without a visible **DEMO / SAMPLE-DATA**
  badge (or provably-empty state). Enforcement, not judgment — real visit notes once
  leaked. Video CRM assets stay `crmVerified:false` (poster-only) until badge-verified.
- **Copy freeze:** `/work/` copy and ALL proof copy strings are FROZEN. The rulebook /
  drafts live in `site-copy-draft-v1.md`. Mechanical markup fixes around copy are fine;
  words are Preston's. (SEO meta, colophon, and release notes are logged exceptions.)
- **Pinned proof brand tokens never re-root.** Ornament S2 placements stay preview-only
  (`Ornaments.jsx` is styleguide-only; never mount on live routes).
- **No new motion / roster / choreography** beyond a task's spec. No redesigns.

## Visual harness (motion/visual work is verified against it)
`node scripts/visual-matrix.mjs` (needs `npm run dev` up; pass `BASE_URL`). Forces
every geometry state × every theme via `?harness=1&state=&theme=` (dev-only control
surface `window.__comp`), both orientations, screenshots the matrix + transition
frames, runs the analytic contrast-vs-ground audit + a walk/bag **coverage proof**.
`SEED=n` for deterministic runs. `scripts/live-cycle-capture.mjs` records the real
cycle. **Keep it green (zero blank / low-contrast frames) after anything that could
touch rendering.**

## Standing constraints
- **Reduced-motion + keyboard/VoiceOver parity in-phase** (not a later pass).
- **Framer Motion only** for animation (`motion/react`). No clip-path morphs (they
  self-intersect); every silhouette morphs via `border-radius + rotate`.
- **~44px minimum tap targets**; inputs ≥16px font (no iOS zoom-trap).
- Shape grammar (strokes 2/3/4px, hard shadows 4/6px zero-blur, ±8/15/45° rotation
  snaps, 0-radius-or-pill corners, 8pt grid): see the strategy doc §5.1.

## Motion scale (one instrument — everything conforms)
Two registers by intent, three shared micro-timings:
- **DELIBERATE — OPEN**: the shared-element grow (poster shape → overlay): **0.5s**
  tween, ease **`cubic-bezier(0.32, 0.72, 0, 1)`** (`EXPAND_TRANSITION`). The signature
  grow; the title FLIP + panel share it. The "one object" beat.
- **DELIBERATE — RETURN (close)**: locked 2026-07-05 via the `?tune=1` panel →
  **closeDuration 1.0s · linear · contentFadeOut 0.16s · geometryDelay 100ms ·
  resumeHold 200ms** (in `motion-tune.js`; the dev panel stays for re-tuning). The
  close is the open reversed but slower + linear — a deliberate, unhurried retreat.
- **AMBIENT** — the idle cycle geometry morph: spring **`{stiffness:50, damping:17}`**
  (≈1s settle), **45ms** ripple stagger, **3s** dwell (`MORPH`/`STAGGER_MS`/`CYCLE_MS`).
  A calm glide — deliberately slower/springier than the open (a click is decisive; the
  cycle breathes). Kept as-is (Preston's approved feel); do not chase it to 0.5s.
- **MICRO** (conform here): content in/out fade **0.2s**, hover/arm ink-in **0.25s**,
  chip/press feedback **0.15s**. Reduced motion → the deliberate beat is **instant**
  (duration 0) but colour/position-truthful.
Rule: new motion picks ONE of these; don't introduce a fourth duration/ease.

## Backlog (post-v2.1.0)
- **CRM recaptures (list + capture protocol)** — CRM assets stay unwired until reshot
  WITH a visible **DEMO / SAMPLE-DATA** badge in-frame (hard rule), then re-wired and
  flipped to `crmVerified:true` only after badge-verification. Several source clips were
  pruned 2026-07-05 (territory-map zoom, field/analytics mobiles), so these need FRESH
  captures, not just re-wiring. List/protocol: `docs/recapture-list-*` / projects.js
  unwire comment.
- **Copy pass (awaiting Preston's worksheet)** — `/work/` + all proof copy stay FROZEN
  until Preston's copy-session worksheet lands; scope includes the **Field Intel CRM
  rename**. Rulebook/drafts: `site-copy-draft-v1.md`.
- **Phase C** — 5 new original compositions (roster 13→18). SVGs in `~/Downloads/
  Geometric sequence graphics (1)/`; method: T-pass (border-radius+rotate, validator +
  transition graph + coverage + contact sheet).
