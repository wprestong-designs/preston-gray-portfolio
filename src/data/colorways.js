/*
 * U1/P3 — the colorway system. Eight named 90s colorways plus the
 * canonical display set, over four-member ramps per project hue family.
 *
 * LAW (measured in scripts/color-matrix.mjs — rerun after ANY tuning):
 *  · every ramp member is SOLID hex (opaque fills, never alpha)
 *  · no member darker than its family's canonical display value
 *  · hue drifts only WITHIN family bounds (identity rule)
 *  · fgBody: white only where L(bg) ≤ 0.1833 (AA 4.5 threshold), else ink;
 *    members where neither passes are ART-ONLY — shapes yes, text never
 *  · colorway accents: AA-large ≥3.0 on every text-bearing member, picked
 *    onLight/onDark by the same luminance threshold (perFamily overrides
 *    are the measured nearest-passing substitutes)
 *  · deep flood tier + overlay backdrops NEVER change with colorway
 *
 * The COLORWAY DEFINITIONS are Claude proposals (the names arrived without
 * definitions) — tune members freely in the composer; ratios re-verify via
 * the script.
 */

export const PROJECT_FAMILY = {
  summit: 'green',
  ourco: 'orange',
  bristol: 'sage',
  pinnacle: 'sky',
  prosource: 'red',
  fieldintel: 'purple',
}

/* Ramp steps resolve to :root tokens (see index.css ramp block for the
   measured matrix). 'canonical' resolves to the display tier. */
const STEP_TOKEN = (family, step) =>
  step === 'canonical' ? `var(--display-${family})` : `var(--ramp-${family}-${step})`

/* fgBody per member — null = ART-ONLY (no text of any kind on this fill).
   Values are the measured picks: ink on light members, white on the two
   dark deeps. */
export const MEMBER_FG = {
  'green/tint': 'ink', 'green/soft': 'ink', 'green/vivid': 'ink', 'green/deep': null,
  'orange/tint': 'ink', 'orange/soft': 'ink', 'orange/vivid': 'ink', 'orange/deep': 'ink',
  'sage/tint': 'ink', 'sage/soft': 'ink', 'sage/vivid': 'ink', 'sage/deep': 'ink',
  'sky/tint': 'ink', 'sky/soft': 'ink', 'sky/vivid': 'ink', 'sky/deep': null,
  'red/tint': 'ink', 'red/soft': 'ink', 'red/vivid': null, 'red/deep': 'white',
  'purple/tint': 'ink', 'purple/soft': 'ink', 'purple/vivid': null, 'purple/deep': 'white',
}

/* Accent name → token (all pre-existing tokens or the two new U1 accents) */
const ACCENT_TOKEN = {
  lime: 'var(--accent-lime)',
  citrus: 'var(--accent-citrus)',
  'plum-flood': 'var(--flood-purple)',
  spruce: 'var(--green)',
  burnt: 'var(--flood-orange)',
  steel: 'var(--flood-sky)',
  'press-red-flood': 'var(--flood-red)',
}

/* Luminance side per member for the accent pick — mirrors the measured
   threshold (only the red/purple deeps sit on the dark side). */
const DARK_MEMBERS = new Set(['red/deep', 'purple/deep'])

export const COLORWAYS = {
  canonical: {
    label: 'Canonical',
    members: { green: 'canonical', orange: 'canonical', sage: 'canonical', sky: 'canonical', red: 'canonical', purple: 'canonical' },
    accents: { onLight: 'plum-flood', onDark: 'lime', perFamily: { green: 'lime' } },
  },
  'jazz-cup': {
    label: 'Jazz Cup',
    members: { green: 'soft', orange: 'tint', sage: 'soft', sky: 'vivid', red: 'tint', purple: 'vivid' },
    accents: { onLight: 'plum-flood', onDark: 'citrus', perFamily: { purple: 'lime' } },
  },
  'mall-glow': {
    label: 'Mall Glow',
    members: { green: 'soft', orange: 'soft', sage: 'soft', sky: 'soft', red: 'soft', purple: 'soft' },
    accents: { onLight: 'plum-flood', onDark: 'citrus' },
  },
  'memphis-pastel': {
    label: 'Memphis Pastel',
    members: { green: 'tint', orange: 'tint', sage: 'tint', sky: 'tint', red: 'tint', purple: 'tint' },
    accents: { onLight: 'plum-flood', onDark: 'citrus' },
  },
  'dial-up-sunset': {
    label: 'Dial-Up Sunset',
    members: { green: 'tint', orange: 'vivid', sage: 'tint', sky: 'soft', red: 'soft', purple: 'soft' },
    accents: { onLight: 'steel', onDark: 'citrus' },
  },
  'saturday-cartoon': {
    label: 'Saturday Cartoon',
    members: { green: 'vivid', orange: 'soft', sage: 'soft', sky: 'vivid', red: 'vivid', purple: 'soft' },
    accents: { onLight: 'press-red-flood', onDark: 'citrus', perFamily: { red: 'plum-flood' } },
  },
  'vhs-sunset': {
    label: 'VHS Sunset',
    members: { green: 'soft', orange: 'vivid', sage: 'tint', sky: 'tint', red: 'vivid', purple: 'deep' },
    accents: { onLight: 'steel', onDark: 'citrus', perFamily: { red: 'plum-flood' } },
  },
  'pool-party': {
    label: 'Pool Party',
    members: { green: 'soft', orange: 'tint', sage: 'tint', sky: 'vivid', red: 'tint', purple: 'tint' },
    accents: { onLight: 'steel', onDark: 'lime' },
  },
  arcade: {
    label: 'Arcade',
    members: { green: 'vivid', orange: 'vivid', sage: 'vivid', sky: 'vivid', red: 'vivid', purple: 'vivid' },
    accents: { onLight: 'press-red-flood', onDark: 'lime', perFamily: { red: 'plum-flood', purple: 'steel' } },
  },
}

export const COLORWAY_ORDER = Object.keys(COLORWAYS).filter((k) => k !== 'canonical')

/* /work/ ambient whispers: the three calmest colorways only */
export const CALM_COLORWAYS = ['memphis-pastel', 'dial-up-sunset', 'pool-party']

/** Shape fill for a project under a colorway (CSS var string). */
export function resolveFill(colorwayName, projectId) {
  const cw = COLORWAYS[colorwayName] ?? COLORWAYS.canonical
  const family = PROJECT_FAMILY[projectId]
  if (!family) return `var(--display-green)`
  return STEP_TOKEN(family, cw.members[family] ?? 'canonical')
}

/** The colorway's display accent for a project's current member. */
export function resolveAccent(colorwayName, projectId) {
  const cw = COLORWAYS[colorwayName] ?? COLORWAYS.canonical
  const family = PROJECT_FAMILY[projectId]
  const step = cw.members[family] ?? 'canonical'
  const memberKey = `${family}/${step === 'canonical' ? 'deep' : step}`
  const name =
    cw.accents.perFamily?.[family] ??
    (DARK_MEMBERS.has(memberKey) ? cw.accents.onDark : cw.accents.onLight)
  return ACCENT_TOKEN[name]
}

/** fgBody token for a member (U2 panel backgrounds) — null = art-only. */
export function memberBodyFg(family, step) {
  const key = `${family}/${step === 'canonical' ? 'deep' : step}`
  const pick = MEMBER_FG[key]
  if (pick === 'ink') return 'var(--ink)'
  if (pick === 'white') return '#ffffff'
  return null
}

export function isValidColorway(name) {
  return Object.prototype.hasOwnProperty.call(COLORWAYS, name)
}
