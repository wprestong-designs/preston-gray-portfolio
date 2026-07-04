/*
 * Single source of truth for the four proofs (spec §0).
 * Colors reference the existing design tokens — never new hex values —
 * so the hero, index, cursor card, and spreads can never drift from the
 * approved palette (spruce / burnt orange / steel / plum).
 */
import summitPreview from '../assets/summit-home.jpg'
import summitRefill from '../assets/summit-refill.png'
import ourcoPreview from '../assets/ourco-home.jpg'
import ourcoAbout from '../assets/ourco-about.jpg'
import bristolPreview from '../assets/bristol-home.jpg'
import pinnacleHome from '../assets/pinnacle-home.jpg'
import prosourceHome from '../assets/prosource-home.jpg'
import fieldIntelPreview from '../assets/crm-analytics-desktop.jpg'
import crmAccounts from '../assets/crm-accounts-desktop.jpg'
import crmTodayMobile from '../assets/crm-today-mobile.png'
import crmAccountsMobile from '../assets/crm-accounts-mobile.png'
import crmProfileMobile from '../assets/crm-account-profile-mobile.png'

/*
 * ============================================================
 * VIDEO CAPTURE CHECKLIST (Preston — per clip):
 *   · length  ≤ 12s (it loops — land on a clean loop point)
 *   · weight  ≤ 3MB per file
 *   · size    1080p max (720p is usually plenty at render size)
 *   · formats MP4 (H.264) + WebM pair — both required
 *   · poster  JPEG of the clip's first frame
 * Drop files in src/assets/, import them here, and fill the
 * srcMp4 / srcWebm / poster fields on the video items below.
 * Until then, video slots render their poster with a
 * "CLIP PENDING" mark and never mount a <video>.
 * ============================================================
 */

/**
 * @typedef {Object} Proof
 * @property {string} id        "summit" | "ourco" | "network" | "fieldintel"
 * @property {string} index     "01".."04"
 * @property {string} name      display name
 * @property {string} tag       mono-font metadata, e.g. "Houston industrial"
 * @property {string} color     project flood color (CSS var reference)
 * @property {string} colorFg   foreground that passes AA on `color` (CSS var)
 * @property {string} colorInk  darker shade for text on tinted surfaces (CSS var)
 * @property {string} colorDisplay poster-register fill for the composition
 *                               shapes only (display tier tokens)
 * @property {string} colorHover hover fill for composition shapes — the
 *                               shape "inks in" from display to flood
 *                               register (the "this shape is a door" signal)
 * @property {string} displayFg  T1 letterform color (display-tier fg token) —
 *                               verified on both the display fill (at rest)
 *                               and the flood fill (hover/armed ink-in)
 * @property {string} slug      in-page target: the spread id in FeaturedWork
 * @property {string} preview   image used in the cursor proof card
 * @property {OverlayPanel[]} panels 4–6 overlay panels, rendered in order.
 *                              Statements and points are PLACEHOLDER copy —
 *                              Preston finalizes in the voice pass (G2).
 */

/**
 * @typedef {Object} MediaItem
 * @property {'image' | 'video'} kind
 * @property {string} [src]      image source (kind: 'image')
 * @property {string} [srcMp4]   video MP4 source (kind: 'video')
 * @property {string} [srcWebm]  video WebM source (kind: 'video')
 * @property {string} [poster]   poster still — required for videos
 * @property {string} [caption]  mono caption under the frame
 * @property {'browser' | 'phone' | 'plain'} [frame] chrome style (default plain)
 * @property {string} [alt]      image alt (defaults to caption)
 */

/**
 * @typedef {Object} OverlayPanel
 * @property {'statement' | 'media' | 'points' | 'contact' | 'end'} type
 * @property {string} [statement]   types 'statement' and 'contact'
 * @property {MediaItem[]} [items]  type 'media' — 1 to 3, laid side-by-side
 * @property {string[]} [points]    type 'points' — short mono lines
 * @property {string} [label]       type 'points' — mono heading override
 */

/** @type {Proof[]} */
export const projects = [
  {
    id: 'summit',
    index: '01',
    name: 'Summit Pharmacy',
    tag: 'Website & marketing system',
    color: 'var(--accent)',
    colorFg: 'var(--flood-green-fg)',
    colorInk: 'var(--accent-deep)',
    colorDisplay: 'var(--display-green)',
    colorHover: 'var(--accent)',
    displayFg: 'var(--display-green-fg)',
    // P1.1 (oneshot): full-name monument, two staggered lines. Reversible:
    // a plain string renders single-line (renderer supports both).
    monument: ['Summit', 'Pharmacy'],
    slug: 'pg-01',
    preview: summitPreview,
    panels: [
      {
        type: 'statement',
        statement:
          'A pharmacy site that finally looks the way the pharmacists care.',
      },
      {
        type: 'media',
        items: [
          { kind: 'image', src: summitPreview, frame: 'browser', caption: 'Homepage · summitpharmacycolorado.com' },
          { kind: 'image', src: summitRefill, frame: 'browser', caption: 'Rx refill request flow' },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'video',
            srcMp4: null,
            srcWebm: null,
            poster: summitPreview,
            frame: 'browser',
            caption: 'Site walkthrough · clip pending',
          },
        ],
      },
      {
        type: 'points',
        points: [
          'Brand, site, print & provider tools — one system',
          'HIPAA-aware refill request flow',
          'The framework now powering three more pharmacies',
        ],
      },
      { type: 'end' },
    ],
  },
  {
    id: 'ourco',
    index: '02',
    name: 'Ourco',
    tag: 'Houston industrial',
    color: 'var(--flood-orange)',
    colorFg: 'var(--flood-orange-fg)',
    colorInk: 'var(--orange-deep)',
    colorDisplay: 'var(--display-orange)',
    colorHover: 'var(--flood-orange)',
    displayFg: 'var(--display-orange-fg)',
    monument: 'Ourco',
    slug: 'pg-02',
    preview: ourcoPreview,
    panels: [
      {
        type: 'statement',
        statement:
          'Bold on purpose — built around how this company actually wins work.',
      },
      {
        type: 'media',
        items: [
          { kind: 'image', src: ourcoPreview, frame: 'browser', caption: 'Homepage · bold metal-frame hero' },
          { kind: 'image', src: ourcoAbout, frame: 'browser', caption: 'About page · built in Houston' },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'video',
            srcMp4: null,
            srcWebm: null,
            poster: ourcoPreview,
            frame: 'browser',
            caption: 'Scroll-through · clip pending',
          },
        ],
      },
      {
        type: 'points',
        points: [
          'Full site design & build',
          'Art direction shaped with the owner',
          'Quote-first structure & local search presence',
        ],
      },
      { type: 'end' },
    ],
  },
  /* Y1: the Pharmacy Network split into its three brands — each a proof
     of its own. P1.2 families: bristol → sage, pinnacle → teal-adjacent
     (sky tier), prosource → press-red. All statements/points are
     PLACEHOLDER copy for G2. */
  {
    id: 'bristol',
    index: '03',
    name: 'Bristol Pharmacy',
    tag: 'Oklahoma City',
    /* P1.2 (oneshot): bristol reassigned sky -> SAGE per the run spec.
       Prior family preserved for reversal: sky (flood #075985 / display
       #0ea5e9). */
    color: 'var(--flood-sage)',
    colorFg: 'var(--flood-sage-fg)',
    colorInk: 'var(--sage-deep)',
    colorDisplay: 'var(--display-sage)',
    colorHover: 'var(--flood-sage)',
    displayFg: 'var(--display-sage-fg)',
    monument: 'Bristol',
    slug: 'pg-03',
    preview: bristolPreview,
    panels: [
      {
        type: 'statement',
        statement: 'The framework’s first expansion — Oklahoma City.',
      },
      {
        type: 'media',
        items: [
          { kind: 'image', src: bristolPreview, frame: 'browser', caption: 'Homepage · Bristol Pharmacy' },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'video',
            srcMp4: null,
            srcWebm: null,
            poster: bristolPreview,
            frame: 'browser',
            caption: 'Site tour · clip pending',
          },
        ],
      },
      {
        type: 'points',
        points: [
          'Built on the Summit framework',
          'Local search presence from day one',
          'Refill flows & provider tools',
        ],
      },
      { type: 'end' },
    ],
  },
  {
    id: 'pinnacle',
    index: '04',
    name: 'Pinnacle Rx',
    tag: 'Little Rock',
    /* P1.2 (oneshot): pinnacle takes the TEAL-ADJACENT family (existing
       sky tier, display #0ea5e9 reads cyan) — chosen over coral, which
       fails flood AA with white (3.09 best candidate) and sits in the
       warm band between ourco's orange and prosource's red. Prior
       assignment preserved for reversal: sage. */
    color: 'var(--flood-sky)',
    colorFg: 'var(--flood-sky-fg)',
    colorInk: 'var(--sky-deep)',
    colorDisplay: 'var(--display-sky)',
    colorHover: 'var(--flood-sky)',
    displayFg: 'var(--display-sky-fg)',
    monument: 'Pinnacle',
    slug: 'pg-04',
    preview: pinnacleHome,
    panels: [
      {
        type: 'statement',
        statement: 'Same press, new city — the framework tuned to Little Rock.',
      },
      {
        type: 'media',
        items: [
          { kind: 'image', src: pinnacleHome, frame: 'browser', caption: 'Homepage · Pinnacle Rx' },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'video',
            srcMp4: null,
            srcWebm: null,
            poster: pinnacleHome,
            frame: 'browser',
            caption: 'Site tour · clip pending',
          },
        ],
      },
      {
        type: 'points',
        points: [
          'The shared framework, tuned to the brand',
          'Little Rock, Arkansas',
          'Refill flows & provider tools',
        ],
      },
      { type: 'end' },
    ],
  },
  {
    id: 'prosource',
    index: '05',
    name: 'Prosource Pharmacy',
    // Standing constraint: Prosource is not live — 'in progress', NEVER a
    // live link anywhere on the site.
    tag: 'Las Vegas · in progress',
    color: 'var(--flood-red)',
    colorFg: 'var(--flood-red-fg)',
    colorInk: 'var(--red-deep)',
    colorDisplay: 'var(--display-red)',
    colorHover: 'var(--flood-red)',
    displayFg: 'var(--display-red-fg)',
    monument: 'Prosource',
    slug: 'pg-05',
    preview: prosourceHome,
    panels: [
      {
        type: 'statement',
        statement: 'The next press run — Prosource Pharmacy, Las Vegas.',
      },
      {
        type: 'media',
        items: [
          { kind: 'image', src: prosourceHome, frame: 'browser', caption: 'Homepage · in progress' },
        ],
      },
      {
        type: 'points',
        points: [
          'In progress — launching soon',
          'Las Vegas, Nevada',
          'Third brand on the framework',
        ],
      },
      { type: 'end' },
    ],
  },
  {
    id: 'fieldintel',
    index: '06',
    name: 'Summit Field Intel',
    tag: 'Custom CRM, designed & built',
    color: 'var(--flood-purple)',
    colorFg: 'var(--flood-purple-fg)',
    colorInk: 'var(--purple-deep)',
    colorDisplay: 'var(--display-purple)',
    colorHover: 'var(--flood-purple)',
    displayFg: 'var(--display-purple-fg)',
    monument: 'Field Intel',
    slug: 'pg-06',
    preview: fieldIntelPreview,
    panels: [
      {
        type: 'statement',
        statement: 'Built for a day in the field — and used every day.',
      },
      {
        type: 'media',
        items: [
          { kind: 'image', src: fieldIntelPreview, frame: 'browser', caption: 'Analytics · demo data' },
          { kind: 'image', src: crmAccounts, frame: 'browser', caption: 'Accounts · demo data' },
        ],
      },
      {
        // The reference's three-phone panel
        type: 'media',
        items: [
          { kind: 'image', src: crmTodayMobile, frame: 'phone', caption: 'Today' },
          { kind: 'image', src: crmAccountsMobile, frame: 'phone', caption: 'Accounts' },
          { kind: 'image', src: crmProfileMobile, frame: 'phone', caption: 'Office Rx detail' },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'video',
            srcMp4: null,
            srcWebm: null,
            poster: crmTodayMobile,
            frame: 'phone',
            caption: 'Mobile field flow · clip pending',
          },
        ],
      },
      {
        type: 'points',
        points: [
          'Territory mapping & weekly route planning',
          'Visit notes & follow-up tracking',
          'Demo build shown — synthetic data only',
        ],
      },
      { type: 'end' },
    ],
  },
]

/* Y1: the about SHAPE is retired from the composition — About opens from
   the wordmark and the Index row. The About OVERLAY below is unchanged. */

/*
 * About overlay (R5) — a non-proof entry on the same panel system.
 * Cream backdrop with ink text (10.43:1). Excluded from the Next-proof
 * ring by design; reachable from the about shape, the index layer, and
 * PG–04's end-panel link. Voice register: plainspoken, owner-friendly —
 * statements/points are PLACEHOLDER copy for the G2 pass.
 */
export const aboutOverlay = {
  id: 'about',
  index: '—',
  name: 'About Preston',
  tag: 'Denver, Colorado',
  monument: 'About',
  color: 'var(--flood-green-fg)',
  colorFg: 'var(--ink)',
  panels: [
    {
      type: 'statement',
      statement:
        'Websites, customer handouts, social posts, brand basics, and simple follow-up systems — practical pieces, built well, that make your business easier to find, easier to trust, and easier to choose.',
    },
    {
      type: 'points',
      label: 'What I make',
      points: [
        'Websites & landing pages',
        'Customer handouts & print pieces',
        'Getting found locally — Google Business & reviews',
        'Simple follow-up systems & internal tools',
      ],
    },
    {
      type: 'points',
      label: 'Off the press',
      points: [
        'Woodworking projects that outgrow the garage',
        'Old School RuneScape — patience training',
        'A very good dog (see portrait)',
      ],
    },
    {
      type: 'contact',
      statement:
        'Tell me what’s not working — I’ll bring back a clear plan and pieces you can actually use.',
    },
  ],
}

/** @param {string} id */
export const getProof = (id) => projects.find((p) => p.id === id) ?? null

/** @param {string} slug spread id, e.g. "pg-01" */
export const getProofBySlug = (slug) =>
  projects.find((p) => p.slug === slug) ?? null
