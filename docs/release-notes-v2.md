# Release notes — v2.0.0 (DRAFT, for Preston to tag after merge)

Everything since the last production deploy. Tag `v2.0.0` after reviewing +
merging `feature/overnight-polish` → `main`.

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
