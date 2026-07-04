/*
 * Constrained-random cycle engine (run-2 R2). Pure + seedable — the poster,
 * the harness coverage proof, and the Node unit test all import this. No React,
 * no DOM, no Math.random(): every draw comes from a seeded RNG so live (time-
 * seeded), harness (fixed-seed), and reduced-motion (static) runs are all
 * reproducible.
 *
 *  · makeRng(seed)         mulberry32 → () => [0,1)
 *  · THEMES                the palette axis (8 data-themes = the 64-color system)
 *  · makeShuffleBag(items) deal-all-then-reshuffle, no immediate repeat
 *  · makeWalk(graph, rng)  random walk: legal neighbor, excl. last N, LRU-weighted
 *  · coverageProof(...)    run a walk/bag N steps, return visit counts (starvation)
 */

export function makeRng(seed) {
  let t = (seed >>> 0) || 1
  return () => {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

/* The palette axis. Order is irrelevant — the shuffle-bag randomizes it. */
export const THEMES = [
  'memphis', 'cartoon', 'windbreaker', 'techlab',
  'foodcourt', 'lisafrank', 'arcade', 'splash',
]

/* Shuffle-bag: deal every item in a random order, reshuffle when the bag is
   empty, and never immediate-repeat across the reshuffle seam. Guarantees each
   item appears exactly once per bag (uniform coverage, no starvation). */
export function makeShuffleBag(items, rng) {
  let bag = []
  let last = null
  const refill = () => {
    bag = items.slice()
    for (let i = bag.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1))
      const tmp = bag[i]
      bag[i] = bag[j]
      bag[j] = tmp
    }
    if (last !== null && bag[0] === last && bag.length > 1) {
      const tmp = bag[0]
      bag[0] = bag[1]
      bag[1] = tmp
    }
  }
  return {
    next() {
      if (!bag.length) refill()
      const v = bag.shift()
      last = v
      return v
    },
  }
}

/* Random walk on the legal-adjacency graph. Each step: neighbors of the current
   state, minus the last `avoidLast` visited, weighted toward least-recently-seen
   so coverage doesn't rut. Falls back gracefully if every neighbor is banned. */
export function makeWalk(graph, rng, { start, avoidLast = 3 } = {}) {
  const first = start ?? Object.keys(graph)[0]
  const history = [first]
  const seenStep = new Map([[first, 0]])
  let step = 0
  const advance = () => {
    step += 1
    const current = history[history.length - 1]
    const banned = new Set(history.slice(-avoidLast))
    const all = graph[current] || []
    let pool = all.filter((s) => !banned.has(s))
    if (!pool.length) pool = all.filter((s) => s !== current)
    if (!pool.length) return current
    // LRU weight — larger gap since last seen ⇒ heavier
    const weights = pool.map((s) => step - (seenStep.get(s) ?? -1000))
    const total = weights.reduce((a, b) => a + b, 0) || pool.length
    let r = rng() * total
    let pick = pool[pool.length - 1]
    for (let i = 0; i < pool.length; i += 1) {
      r -= weights[i]
      if (r <= 0) {
        pick = pool[i]
        break
      }
    }
    history.push(pick)
    seenStep.set(pick, step)
    return pick
  }
  return { advance, history }
}

/* Run the walk `steps` times from a fixed seed and tally state visits — the
   coverage proof (evidence the whole roster gets traversed, no starvation). */
export function walkCoverage(graph, seed, steps, start = 'registration') {
  const rng = makeRng(seed)
  const walk = makeWalk(graph, rng, { start })
  const counts = {}
  for (const k of Object.keys(graph)) counts[k] = 0
  counts[start] = 1
  for (let i = 0; i < steps; i += 1) counts[walk.advance()] += 1
  return counts
}

/* Same for the palette shuffle-bag — every theme should land ~steps/8 times. */
export function bagCoverage(items, seed, steps) {
  const bag = makeShuffleBag(items, makeRng(seed))
  const counts = {}
  for (const k of items) counts[k] = 0
  for (let i = 0; i < steps; i += 1) counts[bag.next()] += 1
  return counts
}
