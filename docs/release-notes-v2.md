# Release notes — v2.0.0

Everything since the last production deploy (`c2f4981`). Shipped by merging
`feature/shared-element-and-about` (the full stack) → `main`.

## Shared-element open/close (the flagship)
- Tapping a shape now **grows one rounded brand object** into the overlay — the
  silhouette relaxes into the panel, the title settles into the masthead, the flood
  becomes the panel ground — and **close is the open played backward** (the panel
  contracts back into the shape), via a framer `layoutId` handoff + a `closingId`
  freeze. No separate collapse animation.
- **Motion scale** codified (CLAUDE.md): OPEN 0.5s deliberate; RETURN 1.0s linear +
  `resumeHold` 200ms; a dev-only `?tune=1` panel for re-tuning the close.

## About — narrative
- Rebuilt as a story: intro → **THE THREAD** (English-lit → design → Summit → building
  the CRM → now Ourco) → a **pasted-up photo board** (taped portrait + Machu Picchu,
  offset/rotated) → What I make → Off the press → contact. Desktop two-region cluster;
  mobile stack.

## Design system
- **90s Geometric color system** — 8 Memphis themes × role tokens, `tokens.css` the
  sole hex home. Hybrid governance: site-owned surfaces themed; client proof surfaces
  wear pinned real-brand tokens (never re-rooted).

## Poster / motion
- Poster now **cycles all 8 data-themes** (the 64-color system) on a constant white
  ground, via a **seeded constrained-random walk** (legal-adjacency graph, no last-3
  repeat, LRU-weighted) + an 8-theme shuffle-bag — no fixed loop.
- **Clip-path morphs removed** (they self-intersected → blank/double-morph); every
  silhouette morphs via border-radius + rotate. Literal triangle retired.
- **Roster of 13 states**, incl. 5 from Preston's ornament designs (blocks,
  proofstrips, vortex, burst, arch). Reduced-motion static; validated by the harness.

## Identity (N1)
- **Armed shapes flood the project's pinned brand color + title**, and hold it into
  the overlay — poster→overlay is one continuous colored object. Titles AA on brand.

## About (N2)
- Fixed the **black-on-black About overlay** (migration regression); wired the
  **taped portrait**; promoted **About into the header** (INDEX · ABOUT · FOR BUSINESS
  OWNERS · CONTACT).

## Contact (§C)
- **Job-ticket form** (Netlify Forms): chips, validation, success (stamped ticket),
  error/mailto fallback, honeypot; all contact affordances route to it. *(Needs
  Netlify dashboard: confirm form detection + email notification.)*

## SEO / sharing / discoverability (§B, §D)
- Per-route meta + canonical; **OG image regenerated from the poster**; crawlable
  homepage skeleton; sitemap + robots; **designed 404**; touch icons + webmanifest.

## Performance / QA (§E, §F)
- **Mobile stills recompressed 7.2M → 4.4M**; lazy-load + preload=none + srcset in place.
- axe-core: **0 violations** across all routes; 0 console errors; harness green.

## Known / deferred (see morning-review watch-list)
- N3 (5 *additional* original compositions) deferred — roster is 13 & functional.
- Netlify Forms live-test, email notification, Lighthouse-on-preview, deploy-preview
  URL — all need the deploy + dashboard (tooling gap).
- Video assets (25M) not re-encoded (lazy-loaded); colophon route + testimonial
  component ship dormant; analytics OFF; music toggle deliberately skipped.
