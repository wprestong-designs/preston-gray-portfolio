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
import fieldIntelPreview from '../assets/crm-analytics-desktop.jpg'
import crmFieldnotesDesktop from '../assets/crm-fieldnotes-desktop.jpg'
import crmTerritoryMobile from '../assets/crm-territorymap-mobile.jpg'
import crmAnalyticsExplorer from '../assets/crm-analytics-mobile-explorer.png'
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
import crmFieldMp4 from '../assets/media/crm-field-scroll-mobile.mp4'
import crmFieldWebm from '../assets/media/crm-field-scroll-mobile.webm'
import crmFieldPoster from '../assets/media/crm-field-scroll-mobile-poster.jpg'
import crmMapMp4 from '../assets/media/summit-crm-territorymap-zoom-desktop.mp4'
import crmMapWebm from '../assets/media/summit-crm-territorymap-zoom-desktop.webm'
import crmMapPoster from '../assets/media/summit-crm-territorymap-zoom-desktop-poster.jpg'
import crmAnalyticsMp4 from '../assets/media/crm-analytics-desktop.mp4'
import crmAnalyticsWebm from '../assets/media/crm-analytics-desktop.webm'
import crmAnalyticsPoster from '../assets/media/crm-analytics-desktop-poster.jpg'
import bristolHomeMp4 from '../assets/media/bristol-homepage-desktop.mp4'
import bristolHomeWebm from '../assets/media/bristol-homepage-desktop.webm'
import bristolHomePoster from '../assets/media/bristol-homepage-desktop-poster.jpg'
import bristolAboutMp4 from '../assets/media/bristol-about-mobile.mp4'
import bristolAboutWebm from '../assets/media/bristol-about-mobile.webm'
import bristolAboutPoster from '../assets/media/bristol-about-mobile-poster.jpg'
import pinnacleHomeMp4 from '../assets/media/pinnacle-homepage-mobile.mp4'
import pinnacleHomeWebm from '../assets/media/pinnacle-homepage-mobile.webm'
import pinnacleHomePoster from '../assets/media/pinnacle-homepage-mobile-poster.jpg'
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
        body: 'Dermatology, ophthalmology, women’s health, general Rx: each specialty got its own page, written for the providers who prescribe and the patients who ask. Same system, different doors.',
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
          'Refill form routes to the team, not an inbox',
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
        // Preston's standing framing (bold on purpose, client-led) outranks
        // the draft file's lede here — decision logged in oneshot-report.
        type: 'statement',
        statement:
          'Bold on purpose — built around how this company actually wins work.',
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
        statement:
          'Same pharmacy, clearer story — the people put front and center.',
      },
      {
        type: 'media',
        body: 'Pinnacle’s site said “locally owned”; the truth was better — locally operated, by a team patients actually know. The copy pass rebuilt the story around them: who’s behind the counter, what they handle, and why that matters in a town where the pharmacist knows your name.',
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
        statement: 'A refill request that takes a minute, not a phone call.',
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
            frame: 'browser',
            caption: 'Homepage — red, and not sorry',
            alt: 'ProSource Pharmacy homepage in brand red',
          },
        ],
      },
      {
        type: 'media',
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
        statement: 'A CRM designed from the passenger seat of the job it serves.',
      },
      {
        type: 'media',
        body: 'Field Intel is the CRM I built for my own provider-relations work — because nothing off the shelf understood a day spent between dermatology offices. The Today dashboard is the whole job at a glance: visits, follow-ups, and what’s moving.',
        bodyDraft: true,
        items: [
          {
            kind: 'video',
            srcMp4: crmTodayMp4,
            srcWebm: crmTodayWebm,
            poster: crmTodayPoster,
            frame: 'browser',
            caption: 'Today dashboard — the day at a glance',
            alt: 'Field Intel CRM Today dashboard listing visits and follow-ups (demo data)',
            crmVerified: false,
          },
        ],
      },
      {
        type: 'media',
        body: 'The real interface is a phone in a parking lot. Field notes sync between visits, account profiles load in a tap, and the map knows the territory — Denver to Colorado Springs — better than I do.',
        bodyDraft: true,
        items: [
          {
            kind: 'video',
            srcMp4: crmFieldMp4,
            srcWebm: crmFieldWebm,
            poster: crmFieldPoster,
            frame: 'phone',
            caption: 'Field notes sync from the passenger seat',
            alt: 'Scrolling Field Intel’s mobile field view (demo data)',
            crmVerified: false,
          },
          {
            kind: 'image',
            src: crmTerritoryMobile,
            frame: 'phone',
            caption: 'Territory, mapped',
            alt: 'Field Intel territory map on a phone (demo data)',
          },
          {
            kind: 'image',
            src: crmAnalyticsExplorer,
            frame: 'phone',
            caption: 'The whole CRM, pocket-sized',
            alt: 'Field Intel analytics explorer on a phone (demo data)',
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
            srcMp4: crmMapMp4,
            srcWebm: crmMapWebm,
            poster: crmMapPoster,
            frame: 'browser',
            caption: 'Territory, mapped',
            alt: 'Zooming a territory map of provider accounts in Field Intel (demo data)',
            crmVerified: false,
          },
          {
            kind: 'video',
            srcMp4: crmAnalyticsMp4,
            srcWebm: crmAnalyticsWebm,
            poster: crmAnalyticsPoster,
            frame: 'browser',
            caption: 'Analytics — windshield time, measured',
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
        'I’m Preston Gray — a designer and builder in Denver. Days, I grow a pharmacy’s business face to face; nights and weekends, I design and build the websites, brands, and tools that make small businesses easier to find, easier to trust, and easier to choose.',
      bodyDraft: true,
    },
    {
      type: 'points',
      label: 'What I make',
      points: [
        'Websites that do the front-counter job',
        'Customer materials — flyers, handouts, service sheets',
        'Getting found locally',
        'Simple follow-up systems',
      ],
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
        'Have a business that deserves better materials? Let’s talk.',
      bodyDraft: true,
    },
  ],
}

/** @param {string} id */
export const getProof = (id) => projects.find((p) => p.id === id) ?? null

/** @param {string} slug spread id, e.g. "pg-01" */
export const getProofBySlug = (slug) =>
  projects.find((p) => p.slug === slug) ?? null
