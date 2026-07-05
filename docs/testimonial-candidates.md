# Testimonial candidates — repo sweep, 2026-07-04

**PUBLISH NONE.** The `<Quote>` component + per-proof slot ship dormant (render
nothing until a quote is wired in `projects.js`). This is the candidate list only.

## Result: NO client testimonials found in the repo
Swept: `docs/`, all root `.md` (copy drafts, review-reply drafts, content reports),
component copy, `site-copy-draft-v1.md`. Every "quote" hit was either a design-system
*pull-quote layout* reference or **Preston's own** copy about a project (e.g.
"Pinnacle's site said 'locally owned'…" — his line, not the client's). No first-party
client statements exist to quote.

## Per-candidate format (for when real quotes arrive)
| quote | attribution (name · role · business) | source | permission |
|-------|--------------------------------------|--------|------------|
| _(none)_ | — | — | ⚠ permission-needed |

**How to wire one (dormant → live):** add `quote: { text, name, role }` to a proof in
`src/data/projects.js`; the proof overlay's `<Quote>` slot renders it in the pull-quote
(proof-annotation) treatment. Nothing renders while `quote` is absent.

## Action for Preston
Real testimonials need collection + written permission per person. None are inferable
from the tree — do not fabricate. When you have them, drop them in with the format above.
