# Motion & Choreography pass — acceptance rules (RECORDED, not yet implemented)

Deferred work. The triangle true-morph (2.5b) and the poster cycle-order are
resolved **together** in this dedicated pass, which runs **after** Phase 4
(mobile media) and Workstream S (ornament tiles) — so the choreography is
designed once against the *final* shape inventory, not twice.

Status of prior artifacts:
- The 2.5b clip-path morph **prototype** is committed and lives on `/styleguide/`
  (top section). It stays as-is. It is NOT yet built across states.
- The previously-proposed cycle order (registration → swatches → tiles → columns
  → triangle → quarters → circles → pinwheel → pillrhythm) is **NOT approved** —
  it predates the novelty rules below and must be re-derived against them.

## Acceptance rules for the pass

1. **Triangle true-morph across all states** per the approved 2.5b prototype
   approach: equal-vertex clip-path interpolation, same node, no cover, no
   visibility gap; drop the clip and return to border-radius at rest in
   non-triangle states so the currently-perfect rect↔rect transitions are
   untouched. Sharp triangle corners are acceptable; no corner-pop.

2. **Morph-compatible adjacency:** any triangle-bearing state may be cycle-adjacent
   only to rect-family states (rect / rounded-rect / pill / quarter-round) — never
   circles. Enforced by routing, not by math.

3. **Novelty rules for the cycle order:**
   a. **No repeated dominant family adjacent.** Classify every state by dominant
      silhouette family (rect / round / triangle / mixed) AND arrangement type
      (grid / stack / radial / scatter / …). Adjacent states must differ in family,
      and ideally in arrangement. A round-dominant state followed by another
      round-dominant state is prohibited — recoloring is NOT novelty.
   b. **Minimum-motion rule.** Every transition must visibly re-choreograph the
      composition. Define a measurable threshold (propose exact numbers — e.g.
      ≥4 of 6 shapes change position and/or scale beyond a meaningful delta) and
      **enforce it in the validator**, so low-motion pairs (the known tiles↔quarters
      case: 5/6 shapes static, only radii tween) fail loudly. Any pair that can't
      satisfy it is recomposed or made non-adjacent.
   c. **The order comes to the gate as choreography:** the full state list, the
      family/arrangement classification per state, and one line of reasoning per
      adjacency. Preston judges the cycle as a *watched sequence*, not a constraint
      solution.

4. **Standing constraints ride along:** colorway re-ink coupling (stagger + matched
   duration) through every transition including triangle boundaries; stable node
   identity; the per-state composition validator remains authoritative; reduced
   motion stays static; arming/hover untouched; perf check at mobile-class CPU
   throttling with reported frame rates.
