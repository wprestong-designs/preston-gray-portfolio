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
