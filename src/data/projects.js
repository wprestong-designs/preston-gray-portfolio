/*
 * Single source of truth for the six proofs (spec §0, Y1 cast).
 * Colors reference the existing design tokens — never new hex values —
 * so the hero, index, cursor card, and overlays can never drift from the
 * approved palette.
 *
 * COPY PROVENANCE (Z1c/P2): statements, bodies, points, and captions are
 * reconciled from (1) Preston-authored strings > (2) site-copy-draft-v1.md
 * > (3) Claude drafts. Panels carry `bodyDraft: true` and `verify: [...]`
 * markers wherever the string is not Preston-final — the registry in
 * content-state-report.md §4 mirrors them.
 */
import summitPreview from '../assets/summit-home.jpg'
import summitRefill from '../assets/summit-refill.png'
import summitWomens from '../assets/summit-womens-health.jpg'
import summitOphtho from '../assets/summit-ophthalmology-page.jpg'
import summitReviews from '../assets/summit-reviews.jpg'
import ourcoPreview from '../assets/ourco-home.jpg'
import ourcoAbout from '../assets/ourco-about.jpg'
import bristolPreview from '../assets/bristol-home.jpg'
import pinnacleHome from '../assets/pinnacle-home.jpg'
import prosourceHome from '../assets/prosource-home.jpg'
// M1: mobile CROP (hero headline + CTA) for the ProSource homepage still.
import prosourceHomeCropSm from '../assets/mobile/prosource-home-480w.jpg'
import prosourceHomeCropLg from '../assets/mobile/prosource-home.jpg'
import fieldIntelPreview from '../assets/crm-analytics-desktop.jpg'
import crmFieldnotesDesktop from '../assets/crm-fieldnotes-desktop.jpg'
// crm-territorymap-mobile + analytics-explorer imports removed — CRM data-safety unwire (2026-07-04)
// crm-field-desktop.jpg (manifest still #3) is trimmed from wiring: the
// panel-size rule caps media panels at 3 items and both CRM media panels
// are full — logged in oneshot-report.md Open Items.

/* Processed clip triplets (scripts/process-media.mjs output — manifest v2) */
import summitHomeMp4 from '../assets/media/summit-homepage-scroll-desktop.mp4'
import summitHomeWebm from '../assets/media/summit-homepage-scroll-desktop.webm'
import summitHomePoster from '../assets/media/summit-homepage-scroll-desktop-poster.jpg'
import summitRefillMp4 from '../assets/media/summit-rxrefillrequest-scroll-mobile.mp4'
import summitRefillWebm from '../assets/media/summit-rxrefillrequest-scroll-mobile.webm'
import summitRefillPoster from '../assets/media/summit-rxrefillrequest-scroll-mobile-poster.jpg'
import summitRxSubMp4 from '../assets/media/summit-rxsubmission-scroll-desktop.mp4'
import summitRxSubWebm from '../assets/media/summit-rxsubmission-scroll-desktop.webm'
import summitRxSubPoster from '../assets/media/summit-rxsubmission-scroll-desktop-poster.jpg'
import summitDermMp4 from '../assets/media/summit-dermatology-desktop.mp4'
import summitDermWebm from '../assets/media/summit-dermatology-desktop.webm'
import summitDermPoster from '../assets/media/summit-dermatology-desktop-poster.jpg'
import crmTodayMp4 from '../assets/media/crm-todaydashboard-scroll-desktop.mp4'
import crmTodayWebm from '../assets/media/crm-todaydashboard-scroll-desktop.webm'
import crmTodayPoster from '../assets/media/crm-todaydashboard-scroll-desktop-poster.jpg'
// crm field-scroll-mobile + territorymap-zoom-desktop imports removed — CRM data-safety unwire (2026-07-04)
import crmAnalyticsMp4 from '../assets/media/crm-analytics-desktop.mp4'
import crmAnalyticsWebm from '../assets/media/crm-analytics-desktop.webm'
import crmAnalyticsPoster from '../assets/media/crm-analytics-desktop-poster.jpg'
import bristolHomeMp4 from '../assets/media/bristol-homepage-desktop.mp4'
import bristolHomeWebm from '../assets/media/bristol-homepage-desktop.webm'
import bristolHomePoster from '../assets/media/bristol-homepage-desktop-poster.jpg'
import bristolAboutMp4 from '../assets/media/bristol-about-mobile.mp4'
import bristolAboutWebm from '../assets/media/bristol-about-mobile.webm'
import bristolAboutPoster from '../assets/media/bristol-about-mobile-poster.jpg'
// §1.2: the letterboxed pinnacle-homepage-mobile is retired for the native
// PORTRAIT capture (cropped 520×1080 from the new push).
import pinnacleHomeMp4 from '../assets/media/pinnacle-homepage-scroll-mobile.mp4'
import pinnacleHomeWebm from '../assets/media/pinnacle-homepage-scroll-mobile.webm'
import pinnacleHomePoster from '../assets/media/pinnacle-homepage-scroll-mobile-poster.jpg'
import pinnacleAboutMp4 from '../assets/media/pinnacle-about-desktop.mp4'
import pinnacleAboutWebm from '../assets/media/pinnacle-about-desktop.webm'
import pinnacleAboutPoster from '../assets/media/pinnacle-about-desktop-poster.jpg'

/*
 * ============================================================
 * VIDEO SPEC (per clip — enforced by scripts/process-media.mjs):
 *   ≤12s · ≤3MB encoded · 1080p max · MP4 (H.264) + WebM + poster JPEG
 * P2 HARD BLOCK: the four CRM clips carry `crmVerified: false` and render
 * POSTER-ONLY until Preston verifies the synthetic-demo build and flips
 * the flags (checkboxes live in media-manifest.md).
 * ============================================================
 */

/*
 * ============================================================
 * LIVE SITE LINKS (P7) — the ONE place to add or update real URLs.
 * Everything React-rendered (overlay statement meta, overlay end
 * panels) reads from here via each proof's `liveUrl`. The two static
 * pages (/work/ and /small-business/) mirror these hrefs by hand —
 * update them together when a URL changes.
 *
 * Live client domains. `null` = no link renders ANYWHERE (ProSource stays
 * null until launch per the standing never-a-live-link constraint; Ourco
 * is still in build; Field Intel is an internal tool with no public URL).
 * ============================================================
 */
export const LIVE_URLS = {
  summit: 'https://summitpharmacycolorado.com',
  ourco: null, // build in progress — flip when the site ships
  bristol: 'https://rxbristolokc.com',
  pinnacle: 'https://pinnacle-rx.com',
  prosource: null, // standing constraint: never a live link until launch
  fieldintel: null, // internal tool — no public URL
}

/**
 * @typedef {Object} ProofPalette
 * P7 — the project's REAL brand palette, expressed as CSS var
 * references into the per-project token blocks in index.css (the one
 * place hex values live; all pairings AA-verified there). Cards and
 * proof overlays consume this; the poster composition keeps its own
 * display/colorway system.
 * @property {string} flood     overlay backdrop / card flood
 * @property {string} floodFg   AA body text on `flood`
 * @property {string} accent    brand accent for rules/hovers on the flood
 * @property {string} accentInk accent that passes AA on the site base
 * @property {string} ghost     misregistration ghost tone behind monuments
 * @property {{bg: string, fg: string}[]} surfaces overlay panel surfaces,
 *   cycled in order past the statement panel. LAW: keep one fg polarity
 *   per list — adjacent surfaces sweep under each other's text mid-wipe.
 */

/**
 * @typedef {Object} Proof
 * @property {string} id        one of the six cast ids
 * @property {string} index     "01".."06"
 * @property {string} name      display name
 * @property {string} tag       mono-font metadata
 * @property {string} color     project flood color (CSS var reference)
 * @property {string} colorFg   foreground that passes AA on `color` (CSS var)
 * @property {string} colorInk  darker shade for text on tinted surfaces (CSS var)
 * @property {string} colorDisplay poster-register fill (display tier token)
 * @property {string} colorHover ink-in fill — display → flood register
 * @property {string} displayFg  T1 letterform color (display-tier fg token)
 * @property {string|null} liveUrl public URL (LIVE_URLS entry) — null hides
 *                               every live-site affordance for the proof
 * @property {ProofPalette} [palette] real brand palette (P7)
 * @property {string|string[]} monument overlay monument word(s); an array
 *                               renders staggered lines (P1.1)
 * @property {string} slug      legacy spread id (dormant FeaturedWork)
 * @property {string} preview   image used in the cursor proof card
 * @property {OverlayPanel[]} panels rendered in order
 */

/**
 * @typedef {Object} MediaItem
 * @property {'image' | 'video'} kind
 * @property {string} [src]        image source (kind: 'image')
 * @property {string} [srcMp4]     video MP4 source (kind: 'video')
 * @property {string} [srcWebm]    video WebM source (kind: 'video')
 * @property {string} [poster]     poster still — required for videos
 * @property {string} [caption]    mono caption under the frame
 * @property {'browser' | 'phone' | 'plain'} [frame] chrome style
 * @property {string} [alt]        REQUIRED in practice — every wired item
 *                                 carries alt; CRM items end "(demo data)"
 * @property {boolean} [crmVerified] false = poster-only hard block (P2)
 * @property {string} [pendingNote] wording for a source-less video slot
 */

/**
 * @typedef {Object} OverlayPanel
 * @property {'statement' | 'media' | 'points' | 'contact' | 'end'} type
 * @property {string} [statement]   types 'statement' and 'contact'
 * @property {MediaItem[]} [items]  type 'media' — 1 to 3, laid side-by-side
 * @property {string} [body]        Y2 placard: 2–3 sentences beside/below
 *                                  the media, reading face
 * @property {boolean} [bodyDraft]  true = not Preston-final
 * @property {string[]} [verify]    open [VERIFY] flags from the draft file
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
    color: 'var(--summit-flood)', // PINNED brand (proof surfaces); composition uses colorDisplay
    colorFg: 'var(--summit-flood-fg)',
    colorInk: 'var(--accent-deep)',
    colorDisplay: 'var(--display-green)',
    colorHover: 'var(--accent)',
    displayFg: 'var(--display-green-fg)',
    liveUrl: LIVE_URLS.summit,
    /* P7 — deep spruce anchor, panels ride a sunny sunset ramp
       (yellow tint → sunny yellow → orange) */
    palette: {
      flood: 'var(--summit-flood)',
      floodFg: 'var(--summit-flood-fg)',
      accent: 'var(--summit-accent)',
      accentInk: 'var(--summit-accent-ink)',
      ghost: 'var(--summit-ghost)',
      surfaces: [
        { bg: 'var(--summit-surface-1)', fg: 'var(--summit-surface-1-fg)' },
        { bg: 'var(--summit-surface-2)', fg: 'var(--summit-surface-2-fg)' },
        { bg: 'var(--summit-surface-3)', fg: 'var(--summit-surface-3-fg)' },
      ],
    },
    // P1.1 (oneshot): full-name monument, two staggered lines. Reversible:
    // a plain string renders single-line (renderer supports both).
    monument: ['Summit', 'Pharmacy'],
    slug: 'pg-01',
    preview: summitPreview,
    panels: [
      {
        type: 'statement',
        statement:
          'A pharmacy site that finally shows how much the pharmacists care.',
      },
      {
        type: 'media',
        wipe: 'diagonal', // U2: seam geometry INTO this panel (data-declared)
        body: 'Summit is an independent compounding pharmacy in Centennial, Colorado. The site rebuild gave it a front door to match the counter: calm type, honest copy, and navigation that gets a patient or a provider where they’re going in one move.',
        bodyDraft: true,
        verify: ['Centennial, Colorado — public description'],
        items: [
          {
            kind: 'video',
            srcMp4: summitHomeMp4,
            srcWebm: summitHomeWebm,
            poster: summitHomePoster,
            frame: 'browser',
            caption: 'Homepage — the full scroll',
            alt: 'Scrolling the Summit Pharmacy homepage: hero, services, and specialty links',
          },
        ],
      },
      {
        type: 'media',
        wipe: 'half-circle',
        body: 'Refills and status checks used to mean a phone call. Now they’re a short form that routes straight to the pharmacy team — built to be filled out one-handed, on a phone, in under a minute.',
        bodyDraft: true,
        items: [
          {
            kind: 'video',
            srcMp4: summitRefillMp4,
            srcWebm: summitRefillWebm,
            poster: summitRefillPoster,
            frame: 'phone',
            caption: 'Rx refill, without the phone call',
            alt: 'Filling out Summit’s online Rx refill form on a phone',
          },
          {
            kind: 'video',
            srcMp4: summitRxSubMp4,
            mp4First: true, // mp4 < webm (measured) — serve mp4 first
            srcWebm: summitRxSubWebm,
            poster: summitRxSubPoster,
            frame: 'browser',
            caption: 'Provider Rx submission — one form',
            alt: 'Scrolling Summit’s provider Rx submission form on desktop',
          },
          {
            kind: 'image',
            src: summitRefill,
            frame: 'browser',
            caption: 'The refill form',
            alt: 'Summit Pharmacy Rx refill request form page',
          },
        ],
      },
      {
        type: 'media',
        wipe: 'quarter-round',
        body: 'Dermatology, ophthalmology, women’s health, general Rx: each specialty got its own page, written for the providers who prescribe and the patients who ask.',
        bodyDraft: true,
        items: [
          {
            kind: 'video',
            srcMp4: summitDermMp4,
            mp4First: true,
            srcWebm: summitDermWebm,
            poster: summitDermPoster,
            frame: 'browser',
            caption: 'Specialty pages: dermatology to women’s health',
            alt: 'Scrolling Summit’s dermatology specialty page',
          },
          {
            kind: 'image',
            src: summitWomens,
            frame: 'browser',
            caption: 'Women’s health specialty page',
            alt: 'Summit Pharmacy women’s health specialty page',
          },
          {
            kind: 'image',
            src: summitOphtho,
            frame: 'browser',
            caption: 'Ophthalmology specialty page',
            alt: 'Summit Pharmacy ophthalmology specialty page',
          },
        ],
      },
      {
        type: 'media',
        body: 'Patient reviews sit up front, the ethics statement is in plain language, and the fine print is rewritten until a person in a hurry can read it.',
        bodyDraft: true,
        items: [
          {
            kind: 'image',
            src: summitReviews,
            frame: 'browser',
            caption: 'Reviews, ethics, and the fine print — made readable',
            alt: 'Summit Pharmacy reviews section',
          },
        ],
      },
      {
        type: 'points',
        // Draft-file details (bodyDraft register); third line carries a
        // [VERIFY] on the routing claim.
        points: [
          'Design, build, and copy — one hand',
          'Built on the pharmacy’s real workflows',
          'Refill form routes straight to the pharmacy team',
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
    color: 'var(--ourco-flood)', // PINNED brand
    colorFg: 'var(--ourco-flood-fg)',
    colorInk: 'var(--orange-deep)',
    colorDisplay: 'var(--display-orange)',
    colorHover: 'var(--flood-orange)',
    displayFg: 'var(--display-orange-fg)',
    liveUrl: LIVE_URLS.ourco,
    /* P7 — burnt-orange flood; panels keep the measured orange ramp */
    palette: {
      flood: 'var(--ourco-flood)',
      floodFg: 'var(--ourco-flood-fg)',
      accent: 'var(--ourco-accent)',
      accentInk: 'var(--ourco-accent-ink)',
      ghost: 'var(--ourco-ghost)',
      surfaces: [
        { bg: 'var(--ourco-surface-1)', fg: 'var(--ourco-surface-1-fg)' },
        { bg: 'var(--ourco-surface-2)', fg: 'var(--ourco-surface-2-fg)' },
        { bg: 'var(--ourco-surface-3)', fg: 'var(--ourco-surface-3-fg)' },
      ],
    },
    monument: 'Ourco',
    slug: 'pg-02',
    preview: ourcoPreview,
    panels: [
      {
        // Preston's standing framing (bold on purpose, client-led) outranks
        // the draft file's lede here — decision logged in oneshot-report.
        type: 'statement',
        statement:
          'Bold on purpose — built around how this company wins work.',
      },
      {
        type: 'media',
        body: 'Ourco supplies Houston’s welders and fabricators. The identity leans into it — steel blues, hot orange, and type with shoulders. Site build in progress; these are the first proofs off the press.',
        bodyDraft: true,
        verify: ['supplies Houston’s welders and fabricators', 'site-build-in-progress framing'],
        items: [
          {
            kind: 'image',
            src: ourcoPreview,
            frame: 'browser',
            caption: 'Built to weld — the homepage says so',
            alt: 'Ourco industrial homepage hero: “Built to Weld”',
          },
          {
            kind: 'image',
            src: ourcoAbout,
            frame: 'browser',
            caption: 'About page: the yard, the fleet, the counter',
            alt: 'Ourco about page with photos of the yard and fleet',
          },
        ],
      },
      {
        type: 'media',
        body: 'The build runs brand-first: identity system, then pages. Every page that ships already knows how it should look and sound. More proofs land here as the site comes off the press.',
        bodyDraft: true,
        items: [
          {
            kind: 'video',
            srcMp4: null,
            srcWebm: null,
            poster: ourcoPreview,
            frame: 'browser',
            caption: 'Scroll-through',
            pendingNote: 'Full build in progress — more proofs to follow.',
            alt: 'Ourco homepage preview still',
          },
        ],
      },
      {
        type: 'points',
        points: ['Brand + web, ground up', 'In progress — launching soon'],
      },
      { type: 'end' },
    ],
  },
  /* Y1: the Pharmacy Network split into its three brands — each a proof
     of its own. P1.2 families: bristol → sage, pinnacle → teal-adjacent
     (sky tier), prosource → press-red. */
  {
    id: 'bristol',
    index: '03',
    name: 'Bristol Pharmacy',
    // "Oklahoma City" is Preston-era copy (approved network points);
    // blended with the draft file's characterization.
    tag: 'Community pharmacy · Oklahoma City',
    /* P7: bristol moves to its REAL brand palette — warm brick red on
       light tan (red/white/black/tan, healthcare-friendly register).
       The poster shape keeps the sage display family (colorDisplay
       below) — the studio's own colorway art — but arming ink-in and
       the overlay land on the brand red. Prior tier preserved for
       reversal: flood-sage / sage-deep. */
    color: 'var(--bristol-flood)',
    colorFg: 'var(--bristol-flood-fg)',
    colorInk: 'var(--bristol-accent-ink)',
    colorDisplay: 'var(--display-sage)',
    colorHover: 'var(--bristol-flood)',
    displayFg: 'var(--display-sage-fg)',
    liveUrl: LIVE_URLS.bristol,
    palette: {
      flood: 'var(--bristol-flood)',
      floodFg: 'var(--bristol-flood-fg)',
      accent: 'var(--bristol-accent)',
      accentInk: 'var(--bristol-accent-ink)',
      ghost: 'var(--bristol-ghost)',
      surfaces: [
        { bg: 'var(--bristol-surface-1)', fg: 'var(--bristol-surface-1-fg)' },
        { bg: 'var(--bristol-surface-2)', fg: 'var(--bristol-surface-2-fg)' },
        { bg: 'var(--bristol-surface-3)', fg: 'var(--bristol-surface-3-fg)' },
      ],
    },
    monument: 'Bristol',
    slug: 'pg-03',
    preview: bristolPreview,
    panels: [
      {
        type: 'statement',
        statement:
          'A neighborhood pharmacy’s site, rebuilt to feel like the counter.',
      },
      {
        type: 'media',
        body: 'Bristol is a community pharmacy that runs on familiarity — people walk in and get called by name. The site needed to do the same job online: clear services, real faces, and no corporate gloss between the pharmacy and its patients.',
        bodyDraft: true,
        verify: ['called-by-name characterization'],
        items: [
          {
            kind: 'video',
            srcMp4: bristolHomeMp4,
            srcWebm: bristolHomeWebm,
            poster: bristolHomePoster,
            frame: 'browser',
            caption: 'Homepage — the counter, online',
            alt: 'Scrolling the Bristol pharmacy homepage on desktop',
          },
          {
            kind: 'image',
            src: bristolPreview,
            frame: 'browser',
            caption: 'Homepage — Oklahoma City',
            alt: 'Bristol pharmacy homepage on desktop',
          },
        ],
      },
      {
        type: 'media',
        body: 'The about page carries the real pitch: the pharmacists, the techs, and the years behind the counter. On a phone, where most patients will meet it, the team shows up before the second scroll.',
        bodyDraft: true,
        items: [
          {
            kind: 'video',
            srcMp4: bristolAboutMp4,
            srcWebm: bristolAboutWebm,
            poster: bristolAboutPoster,
            frame: 'phone',
            caption: 'About — the team, front and center',
            alt: 'Scrolling Bristol’s about page on a phone',
          },
        ],
      },
      {
        type: 'points',
        points: ['Part of a three-pharmacy build system', 'Shared bones, its own personality'],
      },
      { type: 'end' },
    ],
  },
  {
    id: 'pinnacle',
    index: '04',
    name: 'Pinnacle Rx',
    // "Little Rock" is Preston-era copy; blended with the draft file's tag.
    tag: 'Team-first · Little Rock',
    /* P7: pinnacle moves to its REAL brand palette — Razorback Red
       with Apple Blossom white and Neutral Black, restrained. Under the
       90s Geometric system its role is Support (Pool Blue); the actual
       brand hexes are documented as content in the SpecPanel swatches.
       The poster shape keeps the sky display family (the
       studio colorway art); arming ink-in and the overlay land on
       Razorback. Prior tier preserved for reversal: flood-sky /
       sky-deep. */
    color: 'var(--pinnacle-flood)',
    colorFg: 'var(--pinnacle-flood-fg)',
    colorInk: 'var(--pinnacle-accent-ink)',
    colorDisplay: 'var(--display-sky)',
    colorHover: 'var(--pinnacle-flood)',
    displayFg: 'var(--display-sky-fg)',
    liveUrl: LIVE_URLS.pinnacle,
    palette: {
      flood: 'var(--pinnacle-flood)',
      floodFg: 'var(--pinnacle-flood-fg)',
      accent: 'var(--pinnacle-accent)',
      accentInk: 'var(--pinnacle-accent-ink)',
      ghost: 'var(--pinnacle-ghost)',
      surfaces: [
        { bg: 'var(--pinnacle-surface-1)', fg: 'var(--pinnacle-surface-1-fg)' },
        { bg: 'var(--pinnacle-surface-2)', fg: 'var(--pinnacle-surface-2-fg)' },
        { bg: 'var(--pinnacle-surface-3)', fg: 'var(--pinnacle-surface-3-fg)' },
      ],
    },
    monument: 'Pinnacle',
    slug: 'pg-04',
    preview: pinnacleHome,
    panels: [
      {
        type: 'statement',
        statement:
          'Same pharmacy, told through its people.',
      },
      {
        type: 'media',
        body: 'Pinnacle’s site said “locally owned.” The accurate claim is “locally operated” — by a team patients know.',
        bodyDraft: true,
        verify: ['Arkansas / copy-pass framing'],
        items: [
          {
            kind: 'video',
            srcMp4: pinnacleHomeMp4,
            srcWebm: pinnacleHomeWebm,
            poster: pinnacleHomePoster,
            frame: 'phone',
            caption: 'Homepage — team-first, jargon-free',
            alt: 'Scrolling the Pinnacle pharmacy homepage on a phone',
          },
        ],
      },
      {
        type: 'media',
        body: 'The about page does the selling a homepage can’t: names, faces, and plain answers about transfers, refills, and delivery. A first-time patient knows exactly what happens next.',
        bodyDraft: true,
        items: [
          {
            kind: 'video',
            srcMp4: pinnacleAboutMp4,
            srcWebm: pinnacleAboutWebm,
            poster: pinnacleAboutPoster,
            frame: 'browser',
            caption: 'The about page that does the selling',
            alt: 'Scrolling Pinnacle’s about page highlighting the team',
          },
          {
            kind: 'image',
            src: pinnacleHome,
            frame: 'browser',
            caption: 'Homepage — Little Rock',
            alt: 'Pinnacle pharmacy homepage highlighting the team',
          },
        ],
      },
      {
        type: 'points',
        points: ['Copy and messaging overhaul', '“Locally owned” → “locally operated” — and meant'],
      },
      { type: 'end' },
    ],
  },
  {
    id: 'prosource',
    index: '05',
    name: 'Prosource Pharmacy',
    // Standing constraint outranks the draft tag: Prosource is not live —
    // 'in progress', NEVER a live link anywhere on the site.
    tag: 'Las Vegas · in progress',
    color: 'var(--prosource-flood)', // PINNED brand
    colorFg: 'var(--prosource-flood-fg)',
    colorInk: 'var(--red-deep)',
    colorDisplay: 'var(--display-red)',
    colorHover: 'var(--flood-red)',
    displayFg: 'var(--display-red-fg)',
    liveUrl: LIVE_URLS.prosource,
    /* P7 — white/black/red, bolder and more industrial: panels alternate
       vivid red and near-black, both white-fg (single polarity holds:
       white passes on BOTH members, so mid-wipe overlaps stay legible) */
    palette: {
      flood: 'var(--prosource-flood)',
      floodFg: 'var(--prosource-flood-fg)',
      accent: 'var(--prosource-accent)',
      accentInk: 'var(--prosource-accent-ink)',
      ghost: 'var(--prosource-ghost)',
      surfaces: [
        { bg: 'var(--prosource-surface-1)', fg: 'var(--prosource-surface-1-fg)' },
        { bg: 'var(--prosource-surface-2)', fg: 'var(--prosource-surface-2-fg)' },
      ],
    },
    monument: 'Prosource',
    slug: 'pg-05',
    preview: prosourceHome,
    panels: [
      {
        type: 'statement',
        statement: 'The refill phone call is now a one-minute form.',
      },
      {
        type: 'media',
        body: 'ProSource Pharmacy runs bold — red brand, Vegas pace. Behind the 12-plus pages sits the piece that earns its keep: a refill request form wired straight to the pharmacy’s workflow, with spam protection that patients never see and the team never thinks about.',
        bodyDraft: true,
        verify: ['red-brand / Vegas-pace characterization'],
        items: [
          {
            kind: 'image',
            src: prosourceHome,
            mobile: { srcSet: `${prosourceHomeCropSm} 480w, ${prosourceHomeCropLg} 640w` },
            frame: 'browser',
            caption: 'Homepage — ProSource red',
            alt: 'ProSource Pharmacy homepage in brand red',
          },
        ],
      },
      {
        type: 'media',
        body: 'Behind the form: Google Apps Script routes each request straight into the pharmacy’s queue, and reCAPTCHA v3 keeps the bots out without ever asking a patient to click a crosswalk.',
        bodyDraft: true,
        items: [
          {
            kind: 'video',
            srcMp4: null,
            srcWebm: null,
            poster: prosourceHome,
            frame: 'browser',
            caption: 'The refill form doing the heavy lifting',
            pendingNote: 'Screen captures coming — form flow to follow.',
            alt: 'ProSource Pharmacy homepage preview still',
          },
        ],
      },
      {
        type: 'points',
        // Draft's "Zero phone-tag refills" withheld pending Preston's
        // claim-comfort call (no-invented-metrics adjacency).
        points: ['12+ page build', 'Refill form: Google Apps Script + reCAPTCHA v3'],
      },
      { type: 'end' },
    ],
  },
  {
    id: 'fieldintel',
    index: '06',
    name: 'Summit Field Intel',
    tag: 'Custom CRM, designed & built',
    color: 'var(--fieldintel-flood)', // PINNED brand
    colorFg: 'var(--fieldintel-flood-fg)',
    colorInk: 'var(--purple-deep)',
    colorDisplay: 'var(--display-purple)',
    colorHover: 'var(--flood-purple)',
    displayFg: 'var(--display-purple-fg)',
    liveUrl: LIVE_URLS.fieldintel,
    /* P7 — Field Intel keeps its plum system (ink · orange · tan lives
       in the product; the portfolio treatment stays plum) */
    palette: {
      flood: 'var(--fieldintel-flood)',
      floodFg: 'var(--fieldintel-flood-fg)',
      accent: 'var(--fieldintel-accent)',
      accentInk: 'var(--fieldintel-accent-ink)',
      ghost: 'var(--fieldintel-ghost)',
      surfaces: [
        { bg: 'var(--fieldintel-surface-1)', fg: 'var(--fieldintel-surface-1-fg)' },
        { bg: 'var(--fieldintel-surface-2)', fg: 'var(--fieldintel-surface-2-fg)' },
      ],
    },
    monument: 'Field Intel',
    slug: 'pg-06',
    preview: fieldIntelPreview,
    panels: [
      {
        type: 'statement',
        statement: 'Field Intel is the CRM I built for my own provider-relations work — days spent between dermatology offices.',
      },
      {
        type: 'media',
        body: 'Nothing off the shelf understood a day spent between dermatology offices. The Today dashboard shows the whole day in one view: visits, follow-ups, and what’s moving.',
        bodyDraft: true,
        items: [
          {
            kind: 'video',
            srcMp4: crmTodayMp4,
            mp4First: true,
            srcWebm: crmTodayWebm,
            poster: crmTodayPoster,
            frame: 'browser',
            caption: 'Today dashboard — the day at a glance',
            alt: 'Field Intel CRM Today dashboard listing visits and follow-ups (demo data)',
            crmVerified: false,
          },
        ],
      },
      /* CRM DATA-SAFETY UNWIRE (2026-07-04): the mobile field/territory/
         analytics-explorer captures and the desktop territory-map zoom were
         removed — none carry a visible "DEMO · SAMPLE DATA" badge (mobile
         layouts hide the sidebar badge; the territory-map zoom predates it),
         so they fail the standing badge rule. On the recapture list. Panel 3
         (mobile field narrative) is dropped whole rather than left an empty
         slot; its copy returns when the assets are recaptured with the badge. */
      {
        type: 'media',
        body: 'Every visit becomes data: territory coverage, account activity, momentum by practice. The analytics view turns a season of windshield time into a plan for next week.',
        bodyDraft: true,
        items: [
          {
            kind: 'video',
            srcMp4: crmAnalyticsMp4,
            srcWebm: crmAnalyticsWebm,
            poster: crmAnalyticsPoster,
            frame: 'browser',
            caption: 'Analytics — a season, measured',
            alt: 'Field Intel analytics charts of visit activity (demo data)',
            crmVerified: false,
          },
          {
            kind: 'image',
            src: crmFieldnotesDesktop,
            frame: 'browser',
            caption: 'Field notes + device sync',
            alt: 'Field Intel field notes and device sync view on desktop (demo data)',
          },
        ],
      },
      {
        type: 'points',
        points: [
          'Designed and built solo, for daily real use',
          'Demo shown with synthetic data',
          'Web + iOS design system (ink · orange · tan)',
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
 * ring by design; reachable from the wordmark, the index layer, and
 * PG–06's end-panel link. Voice register: plainspoken, owner-friendly —
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
  // P5: reconciled to site-copy-draft-v1.md (draft priority). Lines where
  // the draft left an open [VERIFY] hole (RuneScape year, dog's name)
  // keep the prior working copy — flagged in content-state-report §6.
  panels: [
    {
      type: 'statement',
      statement:
        'I’m Preston Gray — a designer and builder in Denver. Days, I grow a pharmacy’s business face to face. Nights and weekends, I design and build the websites, brands, and tools that make small businesses easier to find, easier to trust, and easier to choose.',
      bodyDraft: true,
    },
    {
      type: 'points',
      label: 'What I make',
      points: [
        'Websites that do the front-counter job',
        'Customer materials — flyers, handouts, service sheets',
        'Getting found locally — maps, profiles, the basics done right',
        'Simple follow-up systems, sized for small teams',
        'Rewrites of confusing sites people already have',
      ],
    },
    {
      // G2/P7: the background panel — why the work reads the way it does.
      type: 'points',
      label: 'Where this comes from',
      points: [
        'I write the copy myself — words first, layout second',
        'Business development for a pharmacy — outreach, reporting, growth',
        'Marketing for real storefronts',
        'I use the tools I build — including my own CRM, daily',
      ],
      bodyDraft: true,
    },
    {
      type: 'points',
      label: 'Off the press',
      points: [
        'Woodworking — sawdust as therapy',
        'Old School RuneScape — patience training',
        'A very good dog (see portrait)',
        'English lit degree, recovering nicely',
      ],
    },
    {
      type: 'contact',
      statement:
        'If your business needs better materials, tell me what you’re trying to fix. A plain description in your own words is the perfect starting point.',
      bodyDraft: true,
    },
  ],
}

/** @param {string} id */
export const getProof = (id) => projects.find((p) => p.id === id) ?? null

/** @param {string} slug spread id, e.g. "pg-01" */
export const getProofBySlug = (slug) =>
  projects.find((p) => p.slug === slug) ?? null
