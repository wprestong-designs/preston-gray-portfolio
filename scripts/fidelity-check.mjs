/*
 * F1 numeric acceptance — svg-fidelity-spec.md tables vs the generated
 * LAYOUTS, both orientations, tolerance ±0.5% of stage dimensions.
 * The tables below are transcribed INDEPENDENTLY from the spec (not
 * imported from the generator's NORM) so transcription/generator bugs
 * can't cancel out. Also asserts: pinwheel z smalls>bigs, triangle
 * clip-path polygons, pill caps = w/2, ornament fills.
 *
 *   node scripts/fidelity-check.mjs
 */
import {
  LAYOUTS,
  STAGES,
  Z,
} from '../src/components/composition-geometry.js'

const SPEC = {
  pinwheel: [
    ['summit', 5.15, 5.44, 43.68, 43.68],
    ['fieldintel', 51.16, 5.44, 43.68, 43.68],
    ['bristol', 5.15, 50.88, 43.68, 43.68],
    ['ourco', 51.16, 50.88, 43.68, 43.68],
    ['pinnacle', 30.8, 31.28, 16.01, 16.01],
    ['orn-a', 52.93, 31.28, 16.01, 16.01, 'ink'],
    ['orn-b', 30.8, 52.81, 16.01, 16.01, 'paper'],
    ['prosource', 52.93, 52.81, 16.01, 16.01],
  ],
  pillrhythm: [
    ['fieldintel', 9.68, 6.57, 8.84, 86.87],
    ['pinnacle', 21.65, 50.0, 9.19, 27.76],
    ['bristol', 33.96, 6.57, 9.19, 51.13],
    ['summit', 46.27, 31.91, 8.76, 45.85],
    ['prosource', 58.13, 6.57, 8.76, 37.73],
    ['ourco', 70.04, 18.69, 8.76, 62.68],
    ['orn-a', 81.91, 40.64, 8.41, 52.79, 'ink'],
  ],
  columns: [
    ['summit', 4.87, 13.85, 9.89, 71.84],
    ['ourco', 18.25, 14.25, 10.27, 71.44],
    ['orn-a', 32.01, 14.25, 10.27, 71.44, 'ink'],
    ['fieldintel', 45.77, 14.25, 9.79, 71.44],
    ['bristol', 59.07, 13.85, 9.79, 71.84],
    ['pinnacle', 72.35, 13.85, 9.79, 71.84],
    ['prosource', 85.63, 14.25, 9.79, 71.44],
  ],
  triangle: [
    ['summit', 3.04, 4.56, 46.61, 45.16, null, 'polygon(0% 0%, 100% 0%, 100% 100%)'],
    ['fieldintel', 50.28, 4.56, 46.69, 45.16, null, 'polygon(0% 0%, 100% 0%, 0% 100%)'],
    ['bristol', 3.04, 50.28, 46.69, 45.16, null, 'polygon(100% 0%, 100% 100%, 0% 100%)'],
    ['ourco', 50.35, 50.28, 46.61, 45.16, null, 'polygon(0% 0%, 100% 100%, 0% 100%)'],
    ['pinnacle', 31.97, 5.85, 16.33, 17.07, null, 'polygon(0% 0%, 100% 0%, 100% 100%)'],
    ['orn-a', 51.59, 5.85, 17.83, 17.07, 'ink', 'polygon(0% 0%, 100% 0%, 0% 100%)'],
    ['orn-b', 29.71, 76.41, 18.61, 17.83, 'paper', 'polygon(100% 0%, 100% 100%, 0% 100%)'],
    ['prosource', 51.97, 76.41, 17.07, 17.83, null, 'polygon(0% 0%, 100% 100%, 0% 100%)'],
  ],
}

let failures = 0
const fail = (msg) => {
  failures += 1
  console.log(`  ✗ ${msg}`)
}

for (const [state, rows] of Object.entries(SPEC)) {
  for (const orientation of ['landscape', 'portrait']) {
    const stage = STAGES[orientation]
    const tol = 0.005
    const layout = LAYOUTS[state][orientation]
    console.log(`${state}/${orientation}:`)
    let stateOk = true
    for (const [id, x, y, w, h, fill, clip] of rows) {
      const e = layout[id]
      if (!e) {
        fail(`${id} missing`)
        stateOk = false
        continue
      }
      const checks = [
        ['x', (x / 100) * stage.w, e.x, stage.w],
        ['y', (y / 100) * stage.h, e.y, stage.h],
        ['w', (w / 100) * stage.w, e.w, stage.w],
        ['h', (h / 100) * stage.h, e.h, stage.h],
      ]
      for (const [axis, expected, actual, dim] of checks) {
        if (Math.abs(expected - actual) > tol * dim) {
          fail(`${id}.${axis}: expected ${expected.toFixed(1)}, got ${actual} (>±0.5%)`)
          stateOk = false
        }
      }
      if (fill && e.fill !== fill) {
        fail(`${id}.fill: expected ${fill}, got ${e.fill}`)
        stateOk = false
      }
      if (clip && e.clip !== clip) {
        fail(`${id}.clip: expected ${clip}, got ${e.clip}`)
        stateOk = false
      }
      if (state === 'pillrhythm') {
        const cap = parseFloat(e.r)
        if (Math.abs(cap - e.w / 2) > 0.6) {
          fail(`${id}: pill cap ${cap} ≠ w/2 (${e.w / 2})`)
          stateOk = false
        }
      }
    }
    // pinwheel z: smalls above bigs
    if (state === 'pinwheel') {
      const bigs = ['summit', 'fieldintel', 'bristol', 'ourco'].map((id) => Z[id])
      const smalls = ['pinnacle', 'prosource', 'orn-a', 'orn-b'].map((id) => Z[id])
      if (Math.min(...smalls) <= Math.max(...bigs)) {
        fail('z-order: smalls not strictly above bigs')
        stateOk = false
      }
    }
    if (stateOk) console.log('  ✓ all elements within ±0.5%; fills/clips/z per spec')
  }
}

console.log(failures ? `\n${failures} FAILURES` : '\nFIDELITY ACCEPTANCE: ALL PASS')
process.exit(failures ? 1 : 0)
