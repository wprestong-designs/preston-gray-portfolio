/*
 * U1/P3 color measurement — the single source for ramp/colorway contrast
 * math. Rerun after any ramp tuning:  node scripts/color-matrix.mjs
 *
 * Verifies, per the U1 rules:
 *  · luminance floor: no ramp member darker than its family's display value
 *  · fgBody per member: white ONLY when L(bg) ≤ 0.1833 (the documented
 *    threshold where white hits AA 4.5); otherwise ink — both measured
 *  · fgAccent per member: cross-hue candidates at AA-large ≥3.0
 *  · per-colorway accent: must pass ≥3.0 on all six member backgrounds
 *  · ghost misregistration ratios (decorative — flag <1.3 as vanishing)
 */

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
  return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100
}

const WHITE_BODY_THRESHOLD = 0.1833 // L(bg) ≤ this ⇒ white ≥ 4.5

/* Ramp members — candy-tint → soft-bright → vivid → deep-bright.
   deep = the family's canonical display value (the darkness floor). */
const RAMPS = {
  green: { tint: '#b8f0cf', soft: '#5fd68f', vivid: '#00bf63', deep: '#059669' },
  orange: { tint: '#ffd6b3', soft: '#ffb37a', vivid: '#ff914d', deep: '#f79245' },
  sage: { tint: '#d9ecc8', soft: '#b5d698', vivid: '#9ccc70', deep: '#87b06a' },
  sky: { tint: '#bdeaff', soft: '#5fd0f5', vivid: '#22c8e6', deep: '#0ea5e9' },
  red: { tint: '#ffc2cf', soft: '#ff7a7a', vivid: '#ff5757', deep: '#d42b2b' },
  purple: { tint: '#ecc4ff', soft: '#e2a9f1', vivid: '#c353f0', deep: '#7c3aed' },
}

const INK = '#173b2f'
const WHITE = '#ffffff'

/* Cross-hue accent candidate pool (family listed so same-family pairs are
   excluded per the hue-identity rule) */
const ACCENTS = [
  ['lime', '#c1ff72', 'green-adjacent'],
  ['citrus', '#ffde59', 'yellow'],
  ['teal-svg', '#0097b2', 'sky'],
  ['plum-flood', '#5b21b6', 'purple'],
  ['spruce', '#1f5c43', 'green'],
  ['burnt', '#a84a0c', 'orange'],
  ['steel', '#075985', 'sky'],
  ['press-red-flood', '#a11e1e', 'red'],
  ['emerald', '#059669', 'green'],
  ['magenta', '#c353f0', 'purple'],
]

/* Accent PAIR per colorway: `onLight` colors display text on members
   lighter than the white-body threshold; `onDark` on members at or below
   it (only red/deep and purple/deep land there). The member's own
   luminance picks which applies — same rule the fgBody threshold uses. */
const COLORWAYS = {
  canonical: {
    members: { green: 'deep', orange: 'deep', sage: 'deep', sky: 'deep', red: 'deep', purple: 'deep' },
    accents: { onLight: 'plum-flood', onDark: 'lime', perFamily: { green: 'lime' } },
  },
  'jazz-cup': {
    members: { green: 'soft', orange: 'tint', sage: 'soft', sky: 'vivid', red: 'tint', purple: 'vivid' },
    accents: { onLight: 'plum-flood', onDark: 'citrus', perFamily: { purple: 'lime' } },
  },
  'mall-glow': {
    members: { green: 'soft', orange: 'soft', sage: 'soft', sky: 'soft', red: 'soft', purple: 'soft' },
    accents: { onLight: 'plum-flood', onDark: 'citrus' },
  },
  'memphis-pastel': {
    members: { green: 'tint', orange: 'tint', sage: 'tint', sky: 'tint', red: 'tint', purple: 'tint' },
    accents: { onLight: 'plum-flood', onDark: 'citrus' },
  },
  'dial-up-sunset': {
    members: { green: 'tint', orange: 'vivid', sage: 'tint', sky: 'soft', red: 'soft', purple: 'soft' },
    accents: { onLight: 'steel', onDark: 'citrus' },
  },
  'saturday-cartoon': {
    members: { green: 'vivid', orange: 'soft', sage: 'soft', sky: 'vivid', red: 'vivid', purple: 'soft' },
    accents: { onLight: 'press-red-flood', onDark: 'citrus', perFamily: { red: 'plum-flood' } },
  },
  'vhs-sunset': {
    members: { green: 'soft', orange: 'vivid', sage: 'tint', sky: 'tint', red: 'vivid', purple: 'deep' },
    accents: { onLight: 'steel', onDark: 'citrus', perFamily: { red: 'plum-flood' } },
  },
  'pool-party': {
    members: { green: 'soft', orange: 'tint', sage: 'tint', sky: 'vivid', red: 'tint', purple: 'tint' },
    accents: { onLight: 'steel', onDark: 'lime' },
  },
  arcade: {
    members: { green: 'vivid', orange: 'vivid', sage: 'vivid', sky: 'vivid', red: 'vivid', purple: 'vivid' },
    accents: { onLight: 'press-red-flood', onDark: 'lime', perFamily: { red: 'plum-flood', purple: 'steel' } },
  },
}

const FAMILY_OF_PROJECT = {
  summit: 'green', ourco: 'orange', bristol: 'sage',
  pinnacle: 'sky', prosource: 'red', fieldintel: 'purple',
}

/* Ghost misregistration pairs — display tone on the project's deep flood */
const GHOSTS = {
  summit: ['#059669', '#1f5c43'],
  ourco: ['#f79245', '#a84a0c'],
  bristol: ['#87b06a', '#46653f'],
  pinnacle: ['#0ea5e9', '#075985'],
  prosource: ['#d42b2b', '#a11e1e'],
  fieldintel: ['#7c3aed', '#5b21b6'],
}

let failures = 0

console.log('=== 1 · luminance floors (member must not be darker than deep) ===')
for (const [fam, ramp] of Object.entries(RAMPS)) {
  const floor = lum(ramp.deep)
  for (const [step, hex] of Object.entries(ramp)) {
    const l = lum(hex)
    const ok = l >= floor - 1e-9
    if (!ok) failures++
    console.log(`${fam}/${step} ${hex} L=${l.toFixed(4)} ${ok ? '' : '✗ DARKER THAN DEEP'}`)
  }
}

console.log('\n=== 2 · fg matrix per member (fgBody + passing fgAccents ≥3.0) ===')
console.log('    (fgBody "ART-ONLY" = neither ink nor white reaches AA 4.5 under')
console.log('     the threshold rule — the member may fill shapes but must never')
console.log('     sit behind reading text; U2 panel backgrounds must skip it)')
const artOnly = []
for (const [fam, ramp] of Object.entries(RAMPS)) {
  for (const [step, hex] of Object.entries(ramp)) {
    const l = lum(hex)
    const rInk = ratio(hex, INK)
    const rWhite = ratio(hex, WHITE)
    const whiteAllowed = l <= WHITE_BODY_THRESHOLD
    const bodyOk = whiteAllowed ? rWhite >= 4.5 : rInk >= 4.5
    const body = bodyOk ? (whiteAllowed ? `white ${rWhite}` : `ink ${rInk}`) : 'ART-ONLY'
    if (!bodyOk) artOnly.push(`${fam}/${step}`)
    const passing = ACCENTS.filter(([, aHex, aFam]) => aFam !== fam && ratio(hex, aHex) >= 3)
      .map(([name, aHex]) => `${name} ${ratio(hex, aHex)}`)
    console.log(
      `${(fam + '/' + step).padEnd(14)} ${hex}  fgBody=${body}  accents[${passing.slice(0, 4).join(' · ')}]${passing.length === 0 ? ' (none cross-hue — art-only surfaces)' : ''}`,
    )
  }
}
console.log(`art-only members: ${artOnly.join(', ')}`)

console.log('\n=== 3 · per-colorway accent validation (threshold-picked accent ≥3.0 per member) ===')
console.log('    Art-only members are EXEMPT: the fg matrix already bars text of')
console.log('    any kind on them, so no display string can ever sit there.')
for (const [name, cw] of Object.entries(COLORWAYS)) {
  const results = Object.entries(cw.members).map(([fam, step]) => {
    const bg = RAMPS[fam] ? RAMPS[fam][step] : null
    if (artOnly.includes(`${fam}/${step}`)) return [fam, 'art-only', null]
    const accentName =
      cw.accents.perFamily?.[fam] ??
      (lum(bg) <= WHITE_BODY_THRESHOLD ? cw.accents.onDark : cw.accents.onLight)
    const accent = ACCENTS.find(([n]) => n === accentName)
    return [fam, accentName, ratio(bg, accent[1])]
  })
  const fails = results.filter(([, , r]) => r !== null && r < 3)
  if (fails.length) failures++
  console.log(
    `${name.padEnd(17)} ${results.map(([f, a, r]) => (r === null ? `${f}:ART` : `${f}:${a.split('-')[0]}=${r}`)).join(' ')} ${fails.length ? '✗ FAILS ' + fails.map(([f]) => f).join(',') : '✓'}`,
  )
}

console.log('\n=== 4 · ghost misregistration (decorative; flag <1.3 as vanishing) ===')
for (const [proj, [ghost, flood]] of Object.entries(GHOSTS)) {
  const r = ratio(ghost, flood)
  console.log(`${proj.padEnd(11)} ghost ${ghost} on flood ${flood} = ${r}${r < 1.3 ? ' ⚠ vanishing' : ''}`)
}

console.log(failures ? `\n${failures} FAILURES` : '\nALL CHECKS PASS')
process.exit(failures ? 1 : 0)
