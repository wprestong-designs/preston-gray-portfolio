# Decision log — overnight polish run, 2026-07-04

Branch `feature/overnight-polish` (from `feature/identity-and-roster`). Format:
**decision · one-line reasoning · REVERSAL handle**. Main untouched.

## Standing blockers (no `gh`, no `netlify` CLI, no token)
- **Cannot produce a deploy-preview URL** — need the `*.netlify.app` site name, or
  Preston opens the PR, or `gh` is authorized. Prod domain (preston-gray.com) is not
  the preview host. → Preston action; on the morning watch-list.
- **Cannot verify Netlify Forms detection / set email notification / submit a real
  test ticket / run Lighthouse on the preview** — all need the live deploy + the
  Netlify dashboard. Built to spec; verification is Preston's at the preview.

## CLAUDE.md
- **Rewrote CLAUDE.md as a terse operating manual** (repo/domain, never-touch-main
  branch workflow, color governance, CRM rule, copy freeze + rulebook location,
  harness usage, standing constraints). · so no future session re-derives this. ·
  REVERSAL: `git show HEAD~:CLAUDE.md` had the design-only version.

---

## §A / N2 — About fix + nav + portrait
- **About overlay rendered black-on-black** → root cause: migration set About's
  `color` (the overlay ground `--ov`) to `var(--flood-green-fg)` = `--ink` = black.
  Fixed to `var(--paper)` (white, ink text 10.4:1). · a token regression, not copy. ·
  REVERSAL: swap ground to `var(--bg-off)` for a warm cream if preferred.
- **Portrait wired into About.** `preston-portrait.jpg` (600×750) existed in
  src/assets and the `.about-portrait` taped-frame CSS existed, but was never
  rendered. Wired into the About statement panel + generated a 300w variant for
  srcset (frame is 300px). · the copy says "see portrait". · REVERSAL: remove the
  `{isAbout && <figure…>}` block in ProjectOverlay. Media/ has NO other headshot
  (only project screenshots) — this is the only candidate; no ambiguity.
- **About promoted to header nav**, order INDEX · ABOUT · FOR BUSINESS OWNERS ·
  CONTACT (identity → offer → intake). · matches the requested order. · KNOB:
  mobile wraps to brand + 2 util rows (CONTACT orphaned) because "For business
  owners" is long — shorten that label or drop it from the header (it's also in the
  Index) to get back to a 2-row band. All targets ≥44px, labels visible.
