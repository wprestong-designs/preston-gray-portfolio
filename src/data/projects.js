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
/* Re-shoot 2026-11-14 (scripts/reshoot-capture.mjs + compass-capture.mjs):
   2x viewport captures, WebP stills at 1920w (mobile 780w + 480w). */
import summitRefill from '../assets/shots/summit-refill-desktop.webp'
import summitWomens from '../assets/shots/summit-womenshealth-desktop.webp'
import summitOphtho from '../assets/shots/summit-ophthalmology-desktop.webp'
import summitReviews from '../assets/shots/summit-reviews-desktop.webp'
import ourcoHome from '../assets/shots/ourco-home-desktop.webp'
import ourcoHomeMobile from '../assets/shots/ourco-home-mobile.webp'
import ourcoGallery from '../assets/shots/ourco-gallery-desktop.webp'
import ourcoGases from '../assets/shots/ourco-gases-desktop.webp'
import ourcoBrandDirectory from '../assets/shots/ourco-branddirectory-desktop.webp'
import bristolRefill from '../assets/shots/bristol-refill-desktop.webp'
import bristolFaq from '../assets/shots/bristol-faq-desktop.webp'
import pinnacleWomens from '../assets/shots/pinnacle-womenshealth-desktop.webp'
import pinnacleRefillMobile from '../assets/shots/pinnacle-refill-mobile.webp'
import prosourceAbout from '../assets/shots/prosource-about-desktop.webp'
import prosourceDerm from '../assets/shots/prosource-dermatology-desktop.webp'
import prosourceFaq from '../assets/shots/prosource-faq-desktop.webp'
import prosourceRefillMobile from '../assets/shots/prosource-refill-mobile.webp'
import bristolHomeMobile from '../assets/shots/bristol-home-mobile.webp'
import pinnacleHome from '../assets/shots/pinnacle-home-desktop.webp'
import prosourceHome from '../assets/shots/prosource-home-desktop.webp'
// M1: mobile viewport capture for the ProSource homepage still (<700px).
import prosourceHomeMobileSm from '../assets/shots/prosource-home-mobile-480w.webp'
import prosourceHomeMobileLg from '../assets/shots/prosource-home-mobile.webp'
// Compass (Custom CRM) — captured ONLY from the fictional pilot demo, with the
// DEMO · SAMPLE DATA badge in-frame. Videos stay crmVerified:false (poster-only).
import crmToday from '../assets/shots/crm-today-desktop.webp'
import crmReports from '../assets/shots/crm-reports-desktop.webp'
import crmTeam from '../assets/shots/crm-team-desktop.webp'
import crmOffice from '../assets/shots/crm-office-desktop.webp'

/* Processed clip triplets (scripts/process-media.mjs output) — frame-by-frame
   captures, H.264 CRF 21–28 / VP9 CRF 30, all ≤12s and ≤3MB */
import summitHomeMp4 from '../assets/media/summit-homepage-scroll-desktop.mp4'
import summitHomeWebm from '../assets/media/summit-homepage-scroll-desktop.webm'
import summitHomePoster from '../assets/media/summit-homepage-scroll-desktop-poster.jpg'
import summitRefillMp4 from '../assets/media/summit-rxrefillrequest-scroll-mobile.mp4'
import summitRefillWebm from '../assets/media/summit-rxrefillrequest-scroll-mobile.webm'
import summitRefillPoster from '../assets/media/summit-rxrefillrequest-scroll-mobile-poster.jpg'
import summitRxSubMp4 from '../assets/media/summit-rxsubmission-scroll-desktop.mp4'
import summitRxSubWebm from '../assets/media/summit-rxsubmission-scroll-desktop.webm'
import summitRxSubPoster from '../assets/media/summit-rxsubmission-scroll-desktop-poster.jpg'
import summitDermMp4 from '../assets/media/summit-dermatology-scroll-desktop.mp4'
import summitDermWebm from '../assets/media/summit-dermatology-scroll-desktop.webm'
import summitDermPoster from '../assets/media/summit-dermatology-scroll-desktop-poster.jpg'
import ourcoHomeMp4 from '../assets/media/ourco-homepage-desktop.mp4'
import ourcoHomeWebm from '../assets/media/ourco-homepage-desktop.webm'
import ourcoHomePoster from '../assets/media/ourco-homepage-desktop-poster.jpg'
import crmWeekMp4 from '../assets/media/crm-week-mobile.mp4'
import crmWeekWebm from '../assets/media/crm-week-mobile.webm'
import crmWeekPoster from '../assets/media/crm-week-mobile-poster.jpg'
import crmAnalyticsMp4 from '../assets/media/crm-analytics-scroll-desktop.mp4'
import crmAnalyticsWebm from '../assets/media/crm-analytics-scroll-desktop.webm'
import crmAnalyticsPoster from '../assets/media/crm-analytics-scroll-desktop-poster.jpg'
import bristolHomeMp4 from '../assets/media/bristol-homepage-scroll-desktop.mp4'
import bristolHomeWebm from '../assets/media/bristol-homepage-scroll-desktop.webm'
import bristolHomePoster from '../assets/media/bristol-homepage-scroll-desktop-poster.jpg'
import bristolAboutMp4 from '../assets/media/bristol-about-scroll-mobile.mp4'
import bristolAboutWebm from '../assets/media/bristol-about-scroll-mobile.webm'
import bristolAboutPoster from '../assets/media/bristol-about-scroll-mobile-poster.jpg'
import pinnacleHomeMp4 from '../assets/media/pinnacle-homepage-scroll-mobile.mp4'
import pinnacleHomeWebm from '../assets/media/pinnacle-homepage-scroll-mobile.webm'
import pinnacleHomePoster from '../assets/media/pinnacle-homepage-scroll-mobile-poster.jpg'
import pinnacleAboutMp4 from '../assets/media/pinnacle-about-scroll-desktop.mp4'
import pinnacleAboutWebm from '../assets/media/pinnacle-about-scroll-desktop.webm'
import pinnacleAboutPoster from '../assets/media/pinnacle-about-scroll-desktop-poster.jpg'
import prosourceRefillMp4 from '../assets/media/prosource-rxrefill-scroll-desktop.mp4'
import prosourceRefillWebm from '../assets/media/prosource-rxrefill-scroll-desktop.webm'
import prosourceRefillPoster from '../assets/media/prosource-rxrefill-scroll-desktop-poster.jpg'
/* Complete-proofs pass (2026-11-14) */
import ourcoAboutMp4 from '../assets/media/ourco-about-scroll-desktop.mp4'
import ourcoAboutWebm from '../assets/media/ourco-about-scroll-desktop.webm'
import ourcoAboutPoster from '../assets/media/ourco-about-scroll-desktop-poster.jpg'
import ourcoServicesMp4 from '../assets/media/ourco-services-scroll-desktop.mp4'
import ourcoServicesWebm from '../assets/media/ourco-services-scroll-desktop.webm'
import ourcoServicesPoster from '../assets/media/ourco-services-scroll-desktop-poster.jpg'
import ourcoQuoteMp4 from '../assets/media/ourco-gases-quote-mobile.mp4'
import ourcoQuoteWebm from '../assets/media/ourco-gases-quote-mobile.webm'
import ourcoQuotePoster from '../assets/media/ourco-gases-quote-mobile-poster.jpg'
import bristolDermMp4 from '../assets/media/bristol-dermatology-scroll-desktop.mp4'
import bristolDermWebm from '../assets/media/bristol-dermatology-scroll-desktop.webm'
import bristolDermPoster from '../assets/media/bristol-dermatology-scroll-desktop-poster.jpg'
import pinnacleRxSubMp4 from '../assets/media/pinnacle-rxsubmission-scroll-desktop.mp4'
import pinnacleRxSubWebm from '../assets/media/pinnacle-rxsubmission-scroll-desktop.webm'
import pinnacleRxSubPoster from '../assets/media/pinnacle-rxsubmission-scroll-desktop-poster.jpg'
import prosourceHomeMobMp4 from '../assets/media/prosource-homepage-scroll-mobile.mp4'
import prosourceHomeMobWebm from '../assets/media/prosource-homepage-scroll-mobile.webm'
import prosourceHomeMobPoster from '../assets/media/prosource-homepage-scroll-mobile-poster.jpg'
import crmAccountsMp4 from '../assets/media/crm-accounts-scroll-desktop.mp4'
import crmAccountsWebm from '../assets/media/crm-accounts-scroll-desktop.webm'
import crmAccountsPoster from '../assets/media/crm-accounts-scroll-desktop-poster.jpg'

/* PANEL RULE (re-shoot 2026-11-14): at most ONE browser frame per media
   panel (a phone frame may ride beside it), so desktop stills render
   ≥720px wide at 1440 — see the P7 MEDIA SCALE PASS block in App.css.
   Captions marked `captionDraft: true` are Claude drafts awaiting Preston. */

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
 * null until launch per the standing never-a-live-link constraint; Custom CRM is an internal tool with no public URL).
 * ============================================================
 */
export const LIVE_URLS = {
  summit: 'https://summitpharmacycolorado.com',
  ourco: 'https://ourco.net', // live 2026-11 (confirmed by Preston 2026-11-13)
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
    preview: summitHomePoster,
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
        // C7: provider-materials line — a standalone note rendered under the body.
        bodyAdd:
          'Price sheets go out to every office that prescribes to Summit; Provider Access Reports go to the practices where the data earns a conversation.',
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
            srcWebm: summitRxSubWebm,
            poster: summitRxSubPoster,
            frame: 'browser',
            caption: 'Provider Rx submission — one form',
            alt: 'Scrolling Summit’s provider Rx submission form on desktop',
          },
        ],
      },
      {
        type: 'media',
        items: [
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
            srcWebm: summitDermWebm,
            poster: summitDermPoster,
            frame: 'browser',
            caption: 'Specialty pages: dermatology to women’s health',
            alt: 'Scrolling Summit’s dermatology specialty page',
          },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'image',
            src: summitWomens,
            frame: 'browser',
            caption: 'Women’s health specialty page',
            alt: 'Summit Pharmacy women’s health specialty page',
          },
        ],
      },
      {
        type: 'media',
        items: [
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
            alt: 'Summit Pharmacy patient reviews section: 4.9 stars from 1,032 Google reviews',
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
    preview: ourcoHome,
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
        // Launch line updated 2026-11-14 (Preston-approved wording).
        body: 'Ourco supplies industrial gas and welding equipment across Houston — a catalog of 4,500-plus products. The owners wanted the site to feel like the work itself: the welder and the Texas night sky. The brand runs on that — dark ground, starry-night fields, the classic welder as the central mark. The new site is live at ourco.net.',
        bodyDraft: true,
        verify: ['supplies industrial gas and welding equipment; 4,500-plus products'],
        items: [
          {
            kind: 'video',
            srcMp4: ourcoHomeMp4,
            mp4First: true, // mp4 < webm (measured)
            srcWebm: ourcoHomeWebm,
            poster: ourcoHomePoster,
            frame: 'browser',
            caption: 'Homepage — the hero in motion',
            captionDraft: true,
            alt: 'The Ourco homepage hero: a welder at work over Houston’s skyline and highway traffic, “Built to Weld”',
          },
        ],
      },
      {
        type: 'media',
        body: 'The build runs brand-first: identity system, then pages. Every page that ships already knows how it should look and sound.',
        bodyDraft: true,
        items: [
          {
            kind: 'image',
            src: ourcoHomeMobile,
            frame: 'phone',
            caption: 'Homepage on a phone',
            captionDraft: true,
            alt: 'Ourco homepage on a phone: the welder hero and “Built to Weld”',
          },
          {
            kind: 'image',
            src: ourcoHome,
            frame: 'browser',
            caption: 'Built to weld — the homepage says so',
            alt: 'Ourco industrial homepage hero: “Built to Weld”',
          },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'video',
            srcMp4: ourcoAboutMp4,
            srcWebm: ourcoAboutWebm,
            poster: ourcoAboutPoster,
            frame: 'browser',
            caption: 'About — the story and what they stand on',
            captionDraft: true,
            alt: 'Scrolling the Ourco about page: “Built in Houston”, the story, and the values',
          },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'image',
            src: ourcoGallery,
            frame: 'browser',
            caption: 'About page: the yard, the fleet, the counter',
            alt: 'Ourco about page gallery, “The shop, the floor, the yard”: the mural, showroom and customer counter',
          },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'video',
            srcMp4: ourcoQuoteMp4,
            srcWebm: ourcoQuoteWebm,
            poster: ourcoQuotePoster,
            frame: 'phone',
            caption: 'Pick the gases, build the quote',
            captionDraft: true,
            alt: 'On a phone, tapping acetylene, oxygen and argon on the Ourco gases page; a quote bar counts the picks',
          },
          {
            kind: 'image',
            src: ourcoGases,
            frame: 'browser',
            caption: 'Industrial gases',
            captionDraft: true,
            alt: 'Ourco industrial gases page: a worker wheeling orange cylinders to a delivery truck under a starry sky',
          },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'video',
            srcMp4: ourcoServicesMp4,
            srcWebm: ourcoServicesWebm,
            poster: ourcoServicesPoster,
            frame: 'browser',
            caption: 'Services — seven ways they earn the call',
            captionDraft: true,
            alt: 'Scrolling the Ourco services page from the hero into the seven services',
          },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'image',
            src: ourcoBrandDirectory,
            frame: 'browser',
            caption: 'Our brands',
            captionDraft: true,
            alt: 'Ourco brand directory: Lincoln Electric, Miller, ESAB, Hobart, DeWalt, Milwaukee and more, grouped by trade',
          },
        ],
      },
      {
        type: 'points',
        points: ['Brand + web, ground up', 'Live at ourco.net'],
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
    preview: bristolHomePoster,
    panels: [
      {
        type: 'statement',
        statement:
          'A neighborhood pharmacy’s site, rebuilt to feel like the counter.',
      },
      {
        type: 'media',
        body: 'Bristol is run by the same family that owns Summit — years behind the counter in Oklahoma City before Colorado. The site keeps that counter voice: plain language, the services patients actually use, and the insurance realities of OKC. No corporate gloss.',
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
            // Was a desktop still of the same page as the clip beside it —
            // now the phone view, so the pair shows two viewports.
            kind: 'image',
            src: bristolHomeMobile,
            frame: 'phone',
            caption: 'Homepage — Oklahoma City',
            alt: 'Bristol pharmacy homepage on a phone',
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
        type: 'media',
        items: [
          {
            kind: 'video',
            srcMp4: bristolDermMp4,
            srcWebm: bristolDermWebm,
            poster: bristolDermPoster,
            frame: 'browser',
            caption: 'Specialty pages — dermatology',
            captionDraft: true,
            alt: 'Scrolling Bristol’s dermatology specialty page on desktop',
          },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'image',
            src: bristolRefill,
            frame: 'browser',
            caption: 'The refill form',
            captionDraft: true,
            alt: 'Bristol pharmacy Rx refill request form on desktop',
          },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'image',
            src: bristolFaq,
            frame: 'browser',
            caption: 'FAQ — plain answers',
            captionDraft: true,
            alt: 'Bristol pharmacy FAQ page: common questions about prescriptions, delivery and costs',
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
        body: 'Pinnacle’s site said “locally owned.” The accurate claim is “locally operated” — the owners live in Colorado, but the pharmacy is staffed and run in Arkansas, and you can walk in and pick up in person. The Razorback red is the owner’s call, leaning into the culture. Under the shared framework, the language, FAQ, and logistics were rebuilt for Arkansas.',
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
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'image',
            src: pinnacleRefillMobile,
            frame: 'phone',
            caption: 'Rx refill, on a phone',
            captionDraft: true,
            alt: 'Pinnacle pharmacy Rx refill form on a phone',
          },
          {
            kind: 'image',
            src: pinnacleHome,
            frame: 'browser',
            caption: 'Homepage — Little Rock',
            alt: 'Pinnacle pharmacy homepage: refill, Rx status and contact buttons over a red Arkansas landscape',
          },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'video',
            srcMp4: pinnacleRxSubMp4,
            srcWebm: pinnacleRxSubWebm,
            poster: pinnacleRxSubPoster,
            frame: 'browser',
            caption: 'Provider Rx submission — one page',
            captionDraft: true,
            alt: 'Scrolling Pinnacle’s provider Rx submission page on desktop',
          },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'image',
            src: pinnacleWomens,
            frame: 'browser',
            caption: 'Women’s health specialty page',
            captionDraft: true,
            alt: 'Pinnacle pharmacy women’s health and OBGYN specialty page',
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
        body: 'ProSource red comes from their existing brand — the job was making it read against the Las Vegas landscape instead of fighting it. The site is built and ready; launch is on the owners’ timeline.',
        bodyDraft: true,
        verify: ['red-brand / Vegas-pace characterization'],
        items: [
          {
            kind: 'image',
            src: prosourceHome,
            mobile: { srcSet: `${prosourceHomeMobileSm} 480w, ${prosourceHomeMobileLg} 780w` },
            frame: 'browser',
            caption: 'Homepage — ProSource red',
            alt: 'ProSource Pharmacy homepage in brand red',
          },
          {
            kind: 'video',
            srcMp4: prosourceHomeMobMp4,
            srcWebm: prosourceHomeMobWebm,
            poster: prosourceHomeMobPoster,
            frame: 'phone',
            caption: 'Homepage on a phone',
            captionDraft: true,
            alt: 'Scrolling the ProSource Pharmacy homepage on a phone',
          },
        ],
      },
      {
        type: 'media',
        body: 'Behind the form: Google Apps Script routes each request straight into the pharmacy’s queue, and reCAPTCHA v3 keeps the bots out without ever asking a patient to click a crosswalk.',
        bodyDraft: true,
        items: [
          {
            // Captured from the LOCAL pharmacy-sites build — ProSource is not
            // public and never gets a live link.
            kind: 'video',
            srcMp4: prosourceRefillMp4,
            srcWebm: prosourceRefillWebm,
            poster: prosourceRefillPoster,
            frame: 'browser',
            caption: 'The refill form doing the heavy lifting',
            alt: 'Scrolling ProSource’s Rx refill request form on desktop',
          },
          {
            kind: 'image',
            src: prosourceRefillMobile,
            frame: 'phone',
            caption: 'The same form on a phone',
            captionDraft: true,
            alt: 'ProSource Pharmacy Rx refill form on a phone',
          },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'image',
            src: prosourceAbout,
            frame: 'browser',
            caption: 'About — built for Nevada',
            captionDraft: true,
            alt: 'ProSource Pharmacy about page: “Built for Nevada. Here for the Long Haul.”',
          },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'image',
            src: prosourceDerm,
            frame: 'browser',
            caption: 'Dermatology specialty page',
            captionDraft: true,
            alt: 'ProSource Pharmacy dermatology prescription support page',
          },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'image',
            src: prosourceFaq,
            frame: 'browser',
            caption: 'FAQ',
            captionDraft: true,
            alt: 'ProSource Pharmacy frequently asked questions page',
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
    name: 'Custom CRM',
    tag: 'Built for sales reps',
    color: 'var(--fieldintel-flood)', // PINNED brand
    colorFg: 'var(--fieldintel-flood-fg)',
    colorInk: 'var(--purple-deep)',
    colorDisplay: 'var(--display-purple)',
    colorHover: 'var(--flood-purple)',
    displayFg: 'var(--display-purple-fg)',
    liveUrl: LIVE_URLS.fieldintel,
    /* P7 — Custom CRM keeps its plum system (ink · orange · tan lives
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
    monument: 'Custom CRM',
    slug: 'pg-06',
    preview: crmToday,
    panels: [
      {
        type: 'statement',
        statement:
          'Before this, territory prep meant Portatour that worked half the time, then Salesforce, then a Google sheet. Now I search an office or a provider and get the whole picture — volume, history, what to talk about — before I walk in. I built it for my own work at Summit, and I use it every day.',
      },
      /* Re-shoot 2026-11-14: every Compass asset below comes from the
         FICTIONAL pilot demo (fictional offices/prescribers/reps, synthetic
         notes) with the DEMO · SAMPLE DATA badge in-frame. Videos stay
         crmVerified:false until Preston signs them off. */
      {
        type: 'media',
        body: 'Nothing off the shelf understood a day spent between dermatology offices. The Today dashboard shows the whole day in one view: visits, follow-ups, and what’s moving.',
        bodyDraft: true,
        items: [
          {
            kind: 'video',
            srcMp4: crmWeekMp4,
            mp4First: true, // mp4 < webm (measured)
            srcWebm: crmWeekWebm,
            poster: crmWeekPoster,
            frame: 'phone',
            caption: 'Today dashboard — the day at a glance',
            alt: 'Custom CRM Home on a phone, stepping through each day’s route (demo data)',
            crmVerified: false,
          },
          {
            kind: 'image',
            src: crmToday,
            frame: 'browser',
            caption: 'Home on desktop — the next stop first',
            captionDraft: true,
            alt: 'Custom CRM Home on desktop: the next stop, the day’s three stops and follow-ups due (demo data)',
          },
        ],
      },
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
            alt: 'Scrolling the Custom CRM analytics page: fills vs last month, what changed, this week’s focus (demo data)',
            crmVerified: false,
          },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'video',
            srcMp4: crmAccountsMp4,
            srcWebm: crmAccountsWebm,
            poster: crmAccountsPoster,
            frame: 'browser',
            caption: 'Accounts — every office, one search',
            captionDraft: true,
            alt: 'Scrolling the Custom CRM accounts list: offices with visit status, fills and next actions (demo data)',
            crmVerified: false,
          },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'image',
            src: crmReports,
            frame: 'browser',
            caption: 'Field notes + device sync',
            alt: 'Custom CRM visit reports with field notes and the “All saved” sync status (demo data)',
          },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'image',
            src: crmTeam,
            frame: 'browser',
            caption: 'Team — the week, rep by rep',
            captionDraft: true,
            alt: 'Custom CRM manager Team view: this week’s stops, conversations and reach by rep (demo data)',
          },
        ],
      },
      {
        type: 'media',
        items: [
          {
            kind: 'image',
            src: crmOffice,
            frame: 'browser',
            caption: 'Office page — before you walk in',
            captionDraft: true,
            alt: 'Custom CRM office page: last visit, cadence, recent attempts and quick actions (demo data)',
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
  monument: 'HELLO!',
  // N2 fix: `color` is the overlay ground (--ov). The migration left it as
  // --flood-green-fg (= --ink = black), so About rendered black-on-black. About
  // is a site-owned paper document: light ground, ink text (AA 10.4:1).
  color: 'var(--paper)',
  colorFg: 'var(--ink)',
  // P5: reconciled to site-copy-draft-v1.md (draft priority). Lines where
  // the draft left an open [VERIFY] hole (RuneScape year, dog's name)
  // keep the prior working copy — flagged in content-state-report §6.
  panels: [
    {
      // About v3: HELLO! + interleaved 5-beat scroll (monument → profile photo →
      // beat 1 → Machu photo → beat 2 → mono links), rendered by the statement
      // case's isAbout branch. Verbatim-approved copy.
      type: 'statement',
      beats: [
        'I’m Preston Gray, a designer and developer in Denver. I build websites, brands, and practical tools for small businesses — pharmacies in Oklahoma City, Little Rock, and Las Vegas, and an industrial supplier in Houston.',
        'I also work a sales territory, and when I couldn’t find a CRM that fit the way I do it, I built my own — I’ve used it every day since. Off hours, my wife and I are outside as much as we can be; that’s us at Machu Picchu. If your business needs a better website, email me.',
      ],
    },
  ],
}

/** @param {string} id */
export const getProof = (id) => projects.find((p) => p.id === id) ?? null

/** @param {string} slug spread id, e.g. "pg-01" */
export const getProofBySlug = (slug) =>
  projects.find((p) => p.slug === slug) ?? null
