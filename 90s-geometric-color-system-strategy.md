# 90s Geometric Design System — Color Strategy & Implementation Plan

*A working strategy document for an 8-palette, 64-color system. Everything here is opinionated on purpose: adopt it as written, or treat each decision as a strong default to argue against. All contrast figures are computed WCAG 2.1 ratios, not estimates — the full 64-color matrix is in Appendix B.*

**Headline decisions, if you read nothing else:** Memphis Playroom is the core palette. Ink Black `#171717` on white is the universal type system, everywhere, in every theme. Saturday Morning Cartoon, 90s Windbreaker, and Retro Tech Lab are the three support palettes (product UI, editorial, and dark/technical registers respectively). Mall Food Court and Lisa Frank Lightning are campaign palettes. Neon Arcade and Nickelodeon Splash are experimental, gated to high-energy moments. One palette per surface, always. Structure never changes — color is the only variable.

---

## 1. Overall System Strategy

### 1.1 The core problem, and the thesis

Sixty-four colors is not a palette; it's an inventory. Systems like this don't fail because they have too many colors — they fail because colors mix at the wrong level. A page that pulls Acid Green, Cola Brown, and Cotton Candy into one composition isn't "vibrant," it's unread mail from eight different senders.

The fix is a single organizing principle: **structure is constant, color is the variable.** Every palette sits on the same white ground, uses the same black ink for reading text, obeys the same stroke weights, shadows, spacing, and shape grammar. The palettes are costumes; the skeleton never changes. When the skeleton is rigid, you can swap costumes as aggressively as you like and the brand still reads as one voice. This is exactly how the original Memphis Group got away with chaos — the shapes and compositional logic were disciplined even when the colors screamed.

### 1.2 Every palette has the same anatomy — so build role-based tokens

Look at the structure of your palettes: each one is six-to-seven brights plus one near-dark anchor. That's a gift. It means you can define **color roles once** and map every palette onto the same slots. In token terms: primitives (the 64 raw hexes) → roles (semantic slots) → themes (each palette = one mapping). For a Vite/React build, a theme swap becomes a single `data-theme` attribute.

| Role | Job | Memphis Playroom mapping (core theme) |
|---|---|---|
| **Ground** | Page/canvas background | White, or an 8% tint of the Lead |
| **Ink** | All body/reading text | `#171717` — global constant, never themed |
| **Anchor** | Outlines, dark fields, display type, shadows | Ink Black `#171717` |
| **Lead** | The theme's identity hue; largest bright area | Bubblegum Pink `#F85CA2` |
| **Support** | Second field color, opposite temperature from Lead | Pool Blue `#37C6F4` |
| **Flash** | The yellow: highlighter swipes, stickers, focus energy | Banana Yellow `#FFE156` |
| **Pop 1 / Pop 2** | Small-dose confetti, badges, icon fills | Spearmint `#63D471`, Tangerine `#FF9F1C` |
| **Signal** | Urgency, errors, sale flashes | Tomato Red `#F94144` |
| **Wildcard** | The deep bright; the only bright licensed for text on white | Grape Soda `#7B2CBF` (7.1:1) |

Every palette profile in Section 2 includes its role map. Designers think in roles ("give the card a Flash badge"), not hexes — that alone kills half the potential chaos.

### 1.3 The tier map

| Tier | Palettes | License |
|---|---|---|
| **Tier 1 — Core** | Memphis Playroom | Default for everything: site chrome, brand system, stationery, day-to-day content. When in doubt, Memphis. |
| **Tier 2 — Support registers** | Saturday Morning Cartoon (product/UI) · 90s Windbreaker (editorial/professional) · Retro Tech Lab (dark mode/technical) | Always-available, but each owns a *context*, not a season. |
| **Tier 3 — Campaign** | Mall Food Court (promos/seasonal) · Lisa Frank Lightning (social-native, sole gradient license) | Time-boxed. A campaign adopts one and retires it when the campaign ends. |
| **Tier 4 — Experimental / Limited drop** | Neon Arcade · Nickelodeon Splash | Moments only: launches, events, merch capsules, easter eggs. Gated by approval, never ambient. |

The tiers answer your "campaign vs. seasonal vs. page theme vs. component variant" question directly: **Tier 2 palettes are page/context themes. Tier 3 palettes are campaign and seasonal skins. Nothing is ever a per-component variant** — a button never wears a different palette than its page. Theming happens at the surface level (a page, a section, a post, a poster), never at the component level.

### 1.4 Why Memphis Playroom is the core

Five reasons, in order of weight:

1. **It's the palette the whole system is named after.** The visual language you're building — squiggles, confetti triangles, floating shapes — *is* Memphis. If the home palette of the aesthetic isn't the core, the system fights itself.
2. **Ink Black `#171717` is the best universal anchor in the set.** True neutral, 17.9:1 on white, and it doesn't tint the brights around it the way navy or brown anchors do.
3. **Its brights sit a half-step below neon,** which means they survive daily use on white grounds. Compare: Highlighter Yellow from Neon Arcade hits 1.17:1 on white — functionally invisible. Banana Yellow reads as a shape on white; the Arcade neons only exist on dark.
4. **It has a complete functional hue wheel:** Tomato (error), Spearmint (success), Banana (warning), Pool Blue (info), so product states don't have to borrow from other palettes.
5. **It's the saturation median of all eight palettes.** Every other palette reads as a louder or quieter sibling of Memphis, which is precisely what makes the tier system feel like one family.

The cost, stated honestly: only Grape Soda (7.1:1) and Ink Black pass AA for body-size text on white. So links and inline emphasis lean on Grape Soda, and colored body text is otherwise banned. That ban is a feature — it's the discipline that keeps the brights feeling special.

Runners-up, for the record: **Saturday Morning Cartoon** is the technically safest palette (best UI contrast behavior in the set) but reads slightly more "2016 flat design" than "1991 Memphis," so it serves better as the UI register than the identity. **90s Windbreaker** is the most adult but a notch too restrained to lead a system whose brief is *vibrant and fun*.

### 1.5 How the system stays sane: five constants and two ratios

The anti-chaos framework, which everything in Sections 3–4 elaborates:

1. **One ink.** All reading text is `#171717` (or white on dark grounds). No exceptions, no themed body text.
2. **One ground logic.** Default ground is white; tinted grounds are 6–10% of a palette bright; full-saturation grounds are display surfaces only (posters, heroes, social).
3. **One shape grammar.** Stroke weights, hard shadows, rotation snaps, and corner logic are global (Section 5.1). A Memphis squiggle and an Arcade lightning bolt are drawn with the same pen.
4. **One palette per surface.** A page section, a social post, a poster, a card — each wears exactly one palette. Cross-palette contact happens only through the three legal mechanisms in Rule 12.
5. **The color budget.** Ground + anchor + a maximum of three brights per composition. UI screens: two brights. Posters may earn a fourth.

And two ratios: the **80/20 page rule** (at least 80% of any given page or feed is core-palette or neutral; themed moments are the ≤20% seasoning) and the **60-25-10-5 area logic** (ground ~60%, Lead ~25%, Pops ~10%, anchor accents ~5%, type excluded). Finally: whitespace is the ninth color. Memphis compositions work because shapes float in generous emptiness. If a layout feels chaotic, the first fix is never "fewer colors" — it's more air.

---
## 2. Palette Roles — the eight profiles

Each profile: tier, personality, best use, ideal applications, where to avoid it, role map, and watch-outs with computed contrast where it matters.

### 2.1 Memphis Playroom — **Tier 1 · Core**

**Personality.** Confident toy-shop brights a half-step below neon; friendly but unmistakably *designed*. The 1988 showroom, not the 1998 arcade.
**Best use.** The default for everything: brand identity, website chrome, patterns, packaging, day-to-day content.
**Ideal applications.** Logo lockups, hero sections, card systems, sticker sheets, stationery, the entire pattern library's home base.
**Avoid.** Nothing structurally — but in serious contexts (pricing, legal, checkout) run it anchor-heavy: mostly Ink Black + white with one bright accent.
**Role map.** Anchor **Ink Black** · Lead **Bubblegum Pink** · Support **Pool Blue** · Flash **Banana Yellow** · Pops **Spearmint, Tangerine** · Signal **Tomato Red** · Wildcard **Grape Soda**.
**Watch-outs.** Tomato Red is 3.6:1 on white — fine for large display type and UI elements, not for error *text*; use Cherry Slush `#E71D36` (4.5:1, borrowed as a system-level functional token) or a ~15% darkened Tomato for `--signal-text`. Grape Soda on Ink Black is 2.5:1 — the Wildcard never sits directly on the Anchor without a white keyline.

### 2.2 Saturday Morning Cartoon — **Tier 2 · Support: product & UI register**

**Personality.** Cel-animation flat: thick outlines, halftone dots, wholesome clarity. The most *legible* palette in the system.
**Best use.** App and product UI, documentation, onboarding, infographics, empty states — anywhere people read and click for minutes at a time.
**Ideal applications.** Dashboards, forms, help centers, explainer illustration, data-adjacent graphics.
**Avoid.** Nightlife, edgy, or high-hype campaigns — it's too sincere. Hand those to Arcade or Splash.
**Role map.** Anchor **Midnight Outline** · Lead **Cartoon Blue** · Support **Slime Green** *(see rename flag, 2.9)* · Flash **Pop Yellow** · Pops **Cotton Candy, Orange Blast** · Signal **Hero Red** · Wildcard **Bubble Purple**.
**Watch-outs.** Midnight Outline `#073B4C` (12.1:1 on white) is the system's *second ink* — the sanctioned dark for friendly UI headings and dark section fields in light mode. Cartoon Blue is 3.96:1 on white: legal for large text and UI components, **not** for body-size links — links here use Bubble Purple (8.6:1). Bubble Purple on Midnight is 1.4:1; never stack the two darks' neighbors without white between.

### 2.3 90s Windbreaker — **Tier 2 · Support: editorial & professional register**

**Personality.** Sporty color-block; the grown-up of the family. Reads "design studio that remembers 1994," not "kids' menu."
**Best use.** Case studies, about pages, decks, reports, B2B touchpoints, apparel and packaging.
**Ideal applications.** Long-form editorial layouts, portfolio spreads, conference materials, anything a client or executive reads.
**Avoid.** Kid-targeted moments and maximal collage — it deflates next to Splash or Lisa Frank.
**Role map.** Anchor **Charcoal Black** · Lead **Aqua Teal** · Support **Sport Blue** · Flash **Sunburst Yellow** · Pops **Neon Lime, Track Orange** · Signal **Magenta Stripe** · Wildcard **Royal Purple**.
**Watch-outs.** This is the only palette with *two* text-grade brights on white — Royal Purple (11.5:1) and Magenta Stripe (5.0:1) — which is exactly why it owns editorial: colored headlines and pull-quotes are actually safe here. Royal Purple on Charcoal is 1.4:1; the Wildcard lives on white grounds only.

### 2.4 Retro Tech Lab — **Tier 2 · Support: dark mode & technical register**

**Personality.** CRT phosphor, terminal type, pixel grids. Nostalgic-technical rather than cute.
**Best use.** Dark mode, developer docs, changelogs, code blocks, status pages, 404s and easter eggs.
**Ideal applications.** Anything on a Monitor Navy ground; syntax-highlight-adjacent graphics; scanline and dither treatments.
**Avoid.** Warm lifestyle content and anything printed small — phosphor colors die on white (CRT Green is 1.4:1 on white).
**Role map.** Anchor **Monitor Navy** · Lead **Terminal Blue** · Support **CRT Green** · Flash **Screen Yellow** · Pops **Cyber Purple, Pixel Orange** · Signal **Alert Red** · Utility **Floppy Disk Gray** — the only neutral gray in all 64 colors.
**Watch-outs.** Floppy Disk Gray is hereby licensed to *every* palette for hairline borders, disabled states, and secondary chrome — it's one of the three legal cross-palette elements (Rule 12). Note it's 2.9:1 on white, so it's decorative-only there; mint a darkened step (~`#6C7A93`) if you need AA-compliant functional borders. On Monitor Navy, CRT Green hits 11.7:1 — dark mode is this palette's native habitat.

### 2.5 Mall Food Court — **Tier 3 · Campaign: promos & seasonal**

**Personality.** Appetizing, warm-dominant, "$1.99 slushie" energy. The only palette that smells like something.
**Best use.** Sales, promotions, summer campaigns, event and merch moments, anything coupon-shaped.
**Ideal applications.** Promo banners, price badges, seasonal landing sections, event food/drink graphics.
**Avoid.** Core UI and anything requiring gravitas — Cola Brown ink reads off-brand outside food contexts, and warm-heavy layouts fatigue fast at product scale.
**Role map.** Anchor **Cola Brown** · Lead **Nacho Cheese** · Support **Blue Raspberry** · Flash **Lime Freeze** · Pops **Teal Cup, Hot Dog Orange** · Signal **Cherry Slush** · Wildcard **Purple Punch**.
**Watch-outs.** Cherry Slush on Cola Brown is 2.7:1 and Purple Punch on Cola Brown is 2.2:1 — reds and purples never sit directly on the brown anchor; separate with white or Nacho Cheese. Cherry Slush (4.5:1 on white) doubles as the system's text-grade functional red.

### 2.6 Lisa Frank Lightning — **Tier 3 · Campaign: social-native**

**Personality.** Maximal magic, sticker culture, the cool-candy end of the spectrum. Born for motion and gradients.
**Best use.** Social — reels, stories, carousel covers — plus sticker packs, splash screens, celebration and milestone moments.
**Ideal applications.** Animated type, gradient fields, confetti bursts, merch drops aimed at delight rather than information.
**Avoid.** Information design, dashboards, data, anything where hierarchy must survive the sparkle.
**Role map.** Anchor **Cosmic Navy** · Lead **Rainbow Pink** · Support **Sky Pop** · Flash **Star Yellow** · Pops **Mermaid Teal, Electric Lime** · Signal **Sunset Orange** *(see flag, 2.9)* · Wildcard **Magic Violet**.
**Watch-outs.** This is the **only palette licensed for multi-stop gradients** (recipe in 3.8). Magic Violet on Cosmic Navy is 2.8:1 — lift it with a white keyline. Keep yellow *out* of the gradient runs; it muddies the pink→violet→blue→teal river. Yellow sits on top, as stars.

### 2.7 Neon Arcade — **Tier 4 · Experimental: high-energy, dark-ground-only**

**Personality.** After-dark arcade cabinet: laser light on deep indigo. The sleek loud one (Splash is the goofy loud one).
**Best use.** Launch heroes, countdowns, event nights, gaming content, big motion moments, 404 pages that want applause.
**Ideal applications.** Full-bleed dark heroes, animated CTAs, event posters, stream overlays.
**Avoid.** Anything on white — the palette bleaches to nothing (Highlighter Yellow 1.17:1, Acid Green 1.21:1 on white). Also avoid long reading, forms, and un-managed print (see Rule 13).
**Role map.** Anchor **Deep Indigo** · Lead **Electric Pink** · Support **Turbo Blue** · Flash **Highlighter Yellow** · Pops **Acid Green, Safety Orange** · Signal **Hot Coral** · Wildcard **Laser Purple**.
**Watch-outs.** On Deep Indigo the neons come alive — Highlighter Yellow hits 13.5:1, Acid Green 12.9:1. Laser Purple on Deep Indigo is 2.75:1: keyline it or reserve it for large shapes. Arcade holds the system's *only* glow license: a soft outer glow at 30–40% opacity is permitted here and nowhere else.

### 2.8 Nickelodeon Splash — **Tier 4 · Experimental: limited drops**

**Personality.** Gross-fun. Splats, drips, goo. The loudest and least house-trained palette — which is the point.
**Best use.** Stunts, product drops, April 1, community events, merch capsules, celebration blowouts.
**Ideal applications.** Splat badges, drip dividers, animated slime loaders, one-off social chaos.
**Avoid.** Anything requiring trust: checkout, settings, legal, error handling. Also ambient use of any kind — Splash on every page is Splash on no page.
**Role map.** Anchor **Deep Black** · Lead **Slime Green** · Support **Purple Goo** · Flash **Lemon Pop** · Pops **Aqua Splash, Bubble Pink** · Signal **Orange Splat** · Deep surface **Blueberry**.
**Watch-outs.** Grounds are white or Deep Black only; Blueberry is a *surface* dark (panels, type blocks), not a ground under other brights (1.6:1 vs. Deep Black). Maximum three splats per composition — past that it reads as noise, not energy.

### 2.9 Housekeeping flags in the palette data

Four things a token file will surface immediately, with recommendations:

1. **"Sunset Orange" `#F15BB5` is a pink,** not an orange — the palette actually ships three pinks and zero oranges. Recommendation: rename to **Sunset Pink** rather than re-speccing the hex. The all-cool-candy identity is a strength; let Star Yellow carry the palette's warmth.
2. **Two colors are named "Slime Green"** (Saturday Morning Cartoon `#06D6A0` and Nickelodeon Splash `#76FF03`). Real slime belongs to Nickelodeon; the Cartoon color is a mint-emerald anyway. Rename Cartoon's to **Mint Hero** (or similar) so human names stay unique even though tokens are namespaced.
3. **`#FF9F1C` appears twice** — Tangerine (Memphis) and Pixel Orange (Retro Tech Lab). Keep it: define one primitive and alias it into both themes. One shared orange quietly stitching the core to the tech register is elegant, not sloppy — just document it as intentional.
4. **The yellows nearly collide** (`#FFF200`, `#FFF500`, `#FFEA00`) and several blues sit close. This is expected across themes and *not* a problem — do not consolidate them, or the palettes lose their autonomy. Namespaced tokens (`arcade.flash` vs. `splash.flash`) prevent any confusion in code.

---
## 3. Applying Color Across the Geometric System

### 3.1 Geometric background patterns

Three density levels, defined by area coverage, and named so people actually use them:

- **Whisper (≤8% coverage).** Sparse confetti — a squiggle, two triangles, a dot cluster — on white or an 8% tint ground. The only density allowed behind or near UI.
- **Chatter (15–20%).** Editorial and marketing sections. Shapes in two to three brights with anchor outlines. Text over Chatter requires a solid white or anchor panel — never set type directly on the pattern.
- **Shout (≥35%).** Posters, social, hero moments only. Full pattern fields, full-saturation grounds permitted.

Build patterns as 240px repeating tiles on the 8pt grid so they drop into any surface. Each pattern uses one palette: shapes in Lead + Support + one Pop, outlines in Anchor, ground in white or tint.

### 3.2 Cards and content blocks

Default card: white surface, 2px Anchor keyline, hard 4px Anchor offset shadow (no blur, no opacity — flat or nothing), and exactly one accent element — an 8px Lead top bar, a corner triangle, or a Flash badge. Hover: shadow steps 4px→6px, or the surface floods to the 8% Lead tint. Inverted card (dark palettes and heroes only): Anchor surface, white text, one neon Pop element. Never two accent colors on one card; the card is a sentence, not a paragraph.

### 3.3 Buttons and CTAs

- **Primary:** Anchor fill, white label (17.9:1 in the core theme — safe in every palette), hard offset shadow in the **Lead** color. The black button with the colored shadow is a signature move — ownable, and it survives every theme swap.
- **Secondary:** White fill, 2px Anchor keyline, Anchor label. Hover floods a 15% Lead tint.
- **Loud CTA (marketing surfaces only):** Flash yellow fill, Anchor label, Anchor offset shadow.
- Never a bright fill with white text unless the pair clears 4.5:1 — per the matrix, only the deep purples and Magenta Stripe qualify.
- **Focus state:** 2px white gap + 3px Anchor ring. Visible on any ground, in any theme.

### 3.4 Icons

Two colors maximum per icon: 2px Anchor stroke plus one bright fill (or a duotone offset-fill for the cartoon look — fill shifted 2px from its outline). On dark grounds, the stroke goes white. One consistent stroke weight per size tier; never mix filled-solid and outlined icons in the same set.

### 3.5 Borders and dividers

Functional dividers: 1–2px in Anchor or Floppy Disk Gray. Decorative dividers: zigzag, squiggle, or scallop strips ≤12px tall in a single bright, used *between* sections, maximum one decorative divider per viewport. A decorative divider is punctuation; two in view is a stutter.

### 3.6 Section headers

Display type is set in Anchor (or the palette Wildcard where it passes — see matrix), then energized with exactly one device: a Flash-yellow highlighter swipe behind the key phrase, a hard offset shadow in Lead, or a small confetti cluster off the left edge. Display type may be set *in* a bright only at ≥24px and only if the bright clears 3:1 on its ground.

### 3.7 Stickers and badges

Sticker DNA: any shape + 3–4px white keyline + optional thin Anchor outline outside that, rotated −8° to +8°. Badges take Signal or Flash fills with Anchor text. The white keyline is what makes stickers the system's diplomatic passports — it optically isolates them, which is why a sticker is one of only three elements allowed to cross palettes onto a foreign layout (Rule 12).

### 3.8 Gradients

Banned system-wide, with two licensed exceptions and one loophole:

- **Lisa Frank Lightning:** multi-stop analogous runs — Rainbow Pink → Magic Violet → Sky Pop → Mermaid Teal — three or four stops, vertical or 45°. Keep yellow out of the run; Star Yellow sits on top as sparkles.
- **Neon Arcade:** two-stop neon glows on Deep Indigo — Electric Pink → Laser Purple, or Turbo Blue → Acid Green — optionally with the palette's 30–40% outer-glow license.
- **Retro Tech Lab loophole:** no smooth gradients, but ordered dither and halftone ramps between two palette colors give the *feeling* of a gradient in native pixel language.

Everything else stays flat. Flatness is the cohesion glue of the whole system; guard it jealously.

### 3.9 Motion and animation moments

Shapes animate; text doesn't (text may fade or slide as a block, never letter-effects). Staggered pop-ins at 40–60ms offsets; UI transitions 150–250ms; hero choreography 400–700ms. Hover states transform geometry — a triangle tips 15°, a dot scales 1.15×, a squiggle draws on. Section transitions can be palette-swap wipes: an Anchor bar sweeps across and colors have changed behind it. Loaders per register: squiggle draw-on (Memphis), pixel progress bar (Tech Lab), slime drip fill (Splash), gradient shimmer (Lisa Frank). Always honor `prefers-reduced-motion`, and never flash more than three times per second — scanline and arcade effects are the risk zone here.

### 3.10 Social media templates

Four locked master layouts where the palette is the only variable: **Announcement**, **Quote/POV**, **Educational carousel**, **Story/Reel cover**. One palette per post; one palette per entire carousel; a series keeps one palette for its whole run. Feed rhythm: every third or fourth post inverts to a dark-Anchor ground so the grid breathes. Lisa Frank owns animated/reels formats; Food Court owns sale and promo posts. Caption and body text on graphics obeys the same ink law as everything else — 4.5:1 minimum, which in practice means Ink/Anchor on light, white on dark, always.

### 3.11 Website sections

Map zones to registers and keep the chrome neutral:

| Zone | Palette |
|---|---|
| Global nav + footer | Anchor + white only — palette-neutral, never themed |
| Homepage hero | Themable (core by default; campaign palettes when live) |
| Product/app UI, docs, help | Saturday Morning Cartoon |
| About, case studies, editorial | 90s Windbreaker |
| Changelog, dev docs, status | Retro Tech Lab (and it defines dark mode site-wide) |
| Promo banners, seasonal sections | Mall Food Court / Neon Arcade |

Two structural rules: the **80/20 page rule** (≥80% of any page is core or neutral), and adjacent sections in different palettes must be separated by a ≥64px white gutter or a full-width Anchor band. Sections may neighbor; they may not touch.

---

## 4. Rules & Constraints — the House Rules

Thirteen rules. The first eight govern composition, the rest govern the system.

**Rule 1 — One palette per surface.** A section, post, poster, card, or screen wears exactly one palette. No exceptions at the component level, ever.

**Rule 2 — The color budget.** Ground + Anchor + a maximum of three brights per composition. UI screens: two brights. Posters and Shout-density work may earn a fourth. Count before you ship.

**Rule 3 — Area logic: 60-25-10-5.** Ground ~60%, Lead ~25%, Pops ~10%, Anchor accents ~5% (type excluded). Yellow always gets the *large* areas; hot pink and red get the *small* ones — perceptual weight, not square footage, is what balances a layout.

**Rule 4 — The ink law.** All reading text is `#171717` on light grounds or white on dark grounds. Midnight Outline `#073B4C` is the one sanctioned alternate dark for headings in the Cartoon register. Colored *body* text: only the active palette's Wildcard, only for links and inline emphasis, only where the matrix says ≥4.5:1.

**Rule 5 — The ground law.** Default white. Tints at 6–10% of a bright (e.g., core tint `#FEF2F8` = Bubblegum at 8%). Full-saturation grounds are display surfaces only. Neons are never grounds in light themes — they're 1.2–1.4:1 against white type *and* against ink; nothing survives on them at reading size.

**Rule 6 — The keyline law.** Any two brights that touch get separated by a 2px+ Anchor or white line. This is the single most important clash-prevention rule in the system, and it's historically accurate: 90s graphics outlined everything precisely because outlines make any two colors compatible. When in doubt, outline it.

**Rule 7 — The temperature law.** Every composition contains at least one cool color. All-warm layouts (the Food Court risk) vibrate and fatigue; one Blue Raspberry or Teal Cup element resets the eye.

**Rule 8 — The vibration law.** Equal-brightness saturated complements — red/green, pink/lime, orange/blue at matched value — never share an edge. Give them a keyline, a white gap, or a lightness step. (Bubblegum Pink next to Spearmint: fine, values differ. Electric Pink flush against Acid Green: migraine.)

**Rule 9 — One dark per composition, chosen deliberately.**

| Dark | Use it for |
|---|---|
| Ink Black `#171717` | Default everywhere: type, outlines, shadows, Memphis anchor |
| Midnight Outline `#073B4C` | Friendly UI darks and Cartoon-register fields in light mode |
| Monitor Navy `#14213D` | Dark-mode surfaces, site-wide |
| Deep Indigo / Cosmic Navy | Neon and gradient grounds (Arcade, Lisa Frank) |
| Charcoal `#1E1E24` | Windbreaker editorial, photography-adjacent layouts |
| Cola Brown `#4B2E2B` | Food Court campaigns only — nowhere else |

Never two different darks in one composition; nothing says "unfinished system" faster than mismatched blacks.

**Rule 10 — The accessibility floor.** AA: 4.5:1 for body text, 3:1 for large text (≥24px) and meaningful UI elements. The computed reality of this system:

- **Text-grade on white (≥4.5:1), 19 of 64 colors:** all eight anchors, the entire purple family (Royal 11.5, Blueberry 11.9, Bubble 8.6, Grape Soda 7.1, Laser 5.7, Punch 5.6, Magic Violet 5.5, Goo 5.5, Cyber 4.6), plus Magenta Stripe (5.0) and Cherry Slush (4.5). Purple is, quietly, this system's workhorse text accent — lean into that.
- **Display-grade on white (3:1–4.5:1), 11 colors:** the strong reds, oranges, Sport Blue, Cartoon Blue, Rainbow Pink. Headlines and UI chrome yes; paragraphs no.
- **Shapes-only on white, 34 colors:** every yellow, lime, neon green, light blue, teal, and light pink. On dark anchors these same colors are the stars — Highlighter Yellow is 1.2:1 on white and 13.5:1 on Deep Indigo. That inversion *is* the light-theme/dark-theme strategy.
- **The purple-on-dark trap:** each palette's deepest bright fails on its own anchor (Royal Purple on Charcoal 1.4:1, Bubble Purple on Midnight 1.4:1, Blueberry on Deep Black 1.6:1, Grape on Ink 2.5:1). Wildcards live on light grounds or behind white keylines — bake this into the pattern library so nobody rediscovers it in production.
- Never encode meaning in color alone — with red/green pairs in all eight palettes, every status gets an icon or label twin.
- Functional text tokens: `--signal-text` = Cherry Slush `#E71D36` (or Tomato darkened ~15%); success/warning text stays Ink on a tinted chip, because no green or yellow in the system reaches text grade and darkening them costs their identity.

**Rule 11 — The pairing formula (within a palette).** Anchor + one warm bright + one cool bright + Flash yellow as seasoning. For the two brights, pick a visible lightness gap (roughly two steps apart); temperature contrast plus value contrast is what makes a pair sing instead of buzz. Reliable core trios: Bubblegum + Pool + Banana; Spearmint + Tangerine + Ink; Pool + Tomato + Banana.

**Rule 12 — Cross-palette mixing: three legal mechanisms, nothing else.**
1. **Shared neutrals:** white, Ink Black, and the Floppy Disk Gray utility loan travel everywhere.
2. **Stickers:** a white-keylined sticker from any palette may guest on any layout — the keyline optically quarantines it. Limit one foreign sticker per composition.
3. **Section adjacency:** different palettes may occupy neighboring sections separated per 3.11. If a campaign lockup ever genuinely requires blending two palettes, match saturation tiers (never neon-tier next to mid-tier) and treat it as a one-off requiring sign-off — not a precedent.

**Rule 13 — Print reality check.** The neons (Acid Green, CRT Green, Highlighter Yellow, Electric Pink, Slime Green, Lemon Pop and friends) exceed the CMYK gamut and will shift dull in standard four-color print. For print that matters: spot inks, or design the piece from the mid-tier palettes (Memphis, Windbreaker, Cartoon) which convert gracefully. Always proof Arcade and Splash work before committing a run.

---
## 5. Shape Language

### 5.1 The universal grammar (constant across all palettes)

Geometry is part of the skeleton, so these specs never theme:

- **Strokes:** 2px (UI/icons), 3px (illustration/patterns), 4px (sticker keylines). Nothing in between, nothing outside.
- **Shadows:** hard offset only — 4px (components) or 6px (display), 100% Anchor, zero blur, zero opacity tricks.
- **Rotation snaps:** ±8° for stickers, 15° or 45° for pattern elements. Arbitrary angles read as accidents.
- **Corners:** 0 radius or full pill/circle. The timid 4–8px radius is the fastest way to make this look like a generic SaaS site; 90s geometry is decisive.
- **Grid:** 8pt base; pattern tiles at 240px.
- **Density:** the Whisper / Chatter / Shout scale from 3.1 applies to all shape work.

### 5.2 Shape ↔ palette pairings

| Shape family | Strongest palettes | Notes |
|---|---|---|
| Squiggles | Memphis, Splash, Lisa Frank | The system's signature mark; Splash draws them gooier, Lisa Frank draws them as ribbons |
| Triangles / confetti | Memphis, Cartoon, Windbreaker | The most universal filler shape in the kit |
| Circles / half-circles | Memphis, Cartoon | Half-circle "sunrise" stacks are peak Memphis |
| Stars / sparkles | Lisa Frank, Arcade, Cartoon | 4-point sparkle = Lisa Frank; starburst "POW" = Cartoon |
| Checkerboards | Windbreaker, Arcade, Memphis | Two colors only, ever; the universal 90s connector |
| Dots / halftone | Cartoon (halftone), Memphis (confetti), Tech Lab (dither) | Same dot, three dialects |
| Zigzags / rickrack | Memphis, Windbreaker, Food Court | Food Court's zigzag doubles as a cup-pattern reference |
| Grids | Tech Lab (pixel grid), Arcade (perspective laser grid) | Flat grid = terminal; vanishing grid = arcade floor |
| Lines / speed lines | Windbreaker (racing stripes), Cartoon (motion lines) | Diagonal slash sets are Windbreaker's identity |
| Abstract color-block panels | Windbreaker, Food Court | The editorial layout engine |
| Memphis blobs / terrazzo | Memphis, Food Court | Terrazzo chips make excellent Whisper-density texture |
| Pixel / 8-bit shapes | Tech Lab, Arcade | Sprites, dither ramps, scanlines |
| Splats / drips | **Splash only** | Exclusive — this is what makes a drop feel like a drop |
| Rainbow arcs / lightning bolts | Lisa Frank (arcs), Arcade + Splash (bolts) | Arcs never appear outside Lisa Frank |

### 5.3 Signature shapes — one per palette

Lock a shape to each palette so a theme is recognizable before a single hex registers: **Memphis** → squiggle · **Cartoon** → starburst + halftone · **Windbreaker** → diagonal slash · **Tech Lab** → pixel cluster + scanline · **Lisa Frank** → 4-point sparkle + rainbow arc · **Arcade** → perspective grid + lightning bolt · **Food Court** → coupon starburst + rickrack zigzag · **Splash** → splat/drip.

Universal connectors available to everyone: two-color checkerboard, dots, triangle confetti, straight rules. Exclusives that never travel: splats, dither, laser grids, rainbow arcs. Shape exclusivity is enforced with the same seriousness as color rules — it's half of what makes theme-swapping legible.

---

## 6. Implementation Tiers — Phased Rollout

**Phase 1 — Core palette & foundational rules** *(≈1–2 weeks)*
Deliverables: token file (primitives → roles → themes, per Appendix A), ink/ground constants, functional color set with text-grade variants, the contrast matrix adopted as law (Appendix B), and a one-page do/don't sheet built from the House Rules. **Done when:** a developer can build a page using only tokens — zero raw hexes in components — and the do/don't page fits on one screen.

**Phase 2 — Pattern library** *(≈2 weeks)*
Deliverables: SVG shape kit (~20 shapes at the three stroke weights), signature-shape assignments, per-palette pattern tiles at all three densities, and text-safe panel rules baked into the tile templates. **Done when:** any hero or section background can be assembled from stock tiles with no custom design.

**Phase 3 — Component styling** *(≈2–3 weeks)*
Deliverables: buttons (three variants, all states), cards (default + inverted), badges/stickers, form inputs, nav/footer, dividers — all consuming role tokens; Storybook stories and Figma variants; a full state-level contrast audit. **Done when:** switching `data-theme` restyles the entire component set correctly and every interactive state passes the floor.

**Phase 4 — Marketing & social templates** *(≈1–2 weeks)*
Deliverables: the four master social layouts with palette-as-variable, OG image / banner / email header set, and a campaign calendar assigning Tier 3–4 palettes to upcoming moments so experimental use is planned, not improvised. **Done when:** a non-designer ships an on-brand post in under ten minutes.

**Phase 5 — Motion & advanced visuals** *(ongoing)*
Deliverables: motion tokens (durations, easings, stagger values), a Lottie/animated shape pack, the palette-swap wipe, per-register loaders, dark mode via Retro Tech Lab, and the Splash drop kit — with `prefers-reduced-motion` and flash-safety built in from the first file. **Done when:** motion adds energy without ever breaking flatness, timing rules, or accessibility.

Sequencing logic: each phase consumes the previous one's output, and Phases 1–2 are deliberately front-loaded — the token architecture and pattern kit are where 80% of the cohesion lives.

---

## 7. Final Recommendations

| Question | Answer |
|---|---|
| **Core palette** | **Memphis Playroom** — the aesthetic's home palette, best universal anchor, complete functional hue wheel, saturation median of the whole set |
| **Support palettes (2–3)** | **Saturday Morning Cartoon** (product/UI), **90s Windbreaker** (editorial/professional), **Retro Tech Lab** (dark mode/technical — and the system's only gray) |
| **High-energy moments** | **Neon Arcade**, always on Deep Indigo or Ink Black grounds — it's the only palette that gets *louder* in the dark |
| **Readable UI** | **Saturday Morning Cartoon** in light mode; **Retro Tech Lab** in dark mode |
| **Social/media graphics** | **Lisa Frank Lightning** (feed-native, sole gradient license), with **Mall Food Court** for sale and promo posts |
| **Experimental/limited use** | **Nickelodeon Splash** — drops, stunts, and celebrations, gated and time-boxed |

**If you only do five things:** adopt the ink/ground constants and the role-token architecture (1.2); lock Memphis as core and publish the one-page do/don't sheet; build the shape kit with signature-shape assignments; ship the button/card/badge set with the black-button-colored-shadow signature; and produce the four social masters. Everything else in this document compounds on those five.

---

## Appendix A — Token starter (CSS custom properties)

```css
:root {
  /* ---- constants: never themed ---- */
  --ink: #171717;
  --paper: #FFFFFF;
  --gray-utility: #8D99AE;   /* decorative only on white (2.9:1); darken to ~#6C7A93 for functional borders */
  --signal-text: #E71D36;    /* system-level text-grade red, 4.5:1 on white */

  /* ---- role tokens: Memphis Playroom (core theme) ---- */
  --anchor:  #171717;
  --lead:    #F85CA2;
  --support: #37C6F4;
  --flash:   #FFE156;
  --pop-1:   #63D471;
  --pop-2:   #FF9F1C;
  --signal:  #F94144;
  --wildcard:#7B2CBF;        /* the only bright licensed for text on white here (7.1:1) */
  --ground-tint: #FEF2F8;    /* lead @ 8% over white */
}

[data-theme="cartoon"] {
  --anchor:  #073B4C;
  --lead:    #118AB2;        /* UI/large text only on white (3.96:1) — links use wildcard */
  --support: #06D6A0;
  --flash:   #FFD166;
  --pop-1:   #FF70A6;
  --pop-2:   #F77F00;
  --signal:  #EF233C;
  --wildcard:#7209B7;
}

[data-theme="arcade"] {
  /* dark register: ground and ink invert */
  --paper:   #24135F;
  --ink:     #FFFFFF;
  --anchor:  #24135F;
  --lead:    #FF2FA7;
  --support: #00AEEF;
  --flash:   #FFF200;        /* 13.5:1 on this ground */
  --pop-1:   #B6FF00;
  --pop-2:   #FF6B00;
  --signal:  #FF4F5E;
  --wildcard:#8A2BEF;        /* 2.8:1 here — keyline required */
}
```

Pattern: primitives live in one namespaced file (`memphis.pool-blue`, `arcade.flash`); components consume only role tokens; each palette is a theme block. Adding the remaining five themes is mechanical from the role maps in Section 2.

---

## Appendix B — Full contrast matrix (all 64 colors, computed)

WCAG 2.1 relative-luminance contrast. "Vs. own anchor" pairs each color against its palette's dark. Verdicts: **Body + display text** ≥4.5:1 on white · **Display ≥24px / UI only** 3.0–4.5:1 · **Shapes only** <3.0:1 (these are your dark-ground stars instead).

| Palette | Color | Hex | vs. white | vs. own anchor | Verdict on white |
|---|---|---|---|---|---|
| Neon Arcade | Electric Pink | `#FF2FA7` | 3.4:1 | 4.7:1 | Display >=24px / UI only |
| Neon Arcade | Laser Purple | `#8A2BEF` | 5.7:1 | 2.8:1 | Body + display text |
| Neon Arcade | Turbo Blue | `#00AEEF` | 2.5:1 | 6.2:1 | Shapes only |
| Neon Arcade | Acid Green | `#B6FF00` | 1.2:1 | 13.0:1 | Shapes only |
| Neon Arcade | Highlighter Yellow | `#FFF200` | 1.2:1 | 13.5:1 | Shapes only |
| Neon Arcade | Safety Orange | `#FF6B00` | 2.9:1 | 5.5:1 | Shapes only |
| Neon Arcade | Hot Coral | `#FF4F5E` | 3.2:1 | 4.9:1 | Display >=24px / UI only |
| Neon Arcade | Deep Indigo | `#24135F` | 15.7:1 | — | Body + display text |
| Memphis Playroom | Bubblegum Pink | `#F85CA2` | 3.0:1 | 6.0:1 | Shapes only |
| Memphis Playroom | Pool Blue | `#37C6F4` | 2.0:1 | 9.0:1 | Shapes only |
| Memphis Playroom | Banana Yellow | `#FFE156` | 1.3:1 | 13.8:1 | Shapes only |
| Memphis Playroom | Spearmint | `#63D471` | 1.9:1 | 9.5:1 | Shapes only |
| Memphis Playroom | Tangerine | `#FF9F1C` | 2.1:1 | 8.7:1 | Shapes only |
| Memphis Playroom | Grape Soda | `#7B2CBF` | 7.1:1 | 2.5:1 | Body + display text |
| Memphis Playroom | Tomato Red | `#F94144` | 3.6:1 | 5.0:1 | Display >=24px / UI only |
| Memphis Playroom | Ink Black | `#171717` | 17.9:1 | — | Body + display text |
| Mall Food Court | Cherry Slush | `#E71D36` | 4.5:1 | 2.7:1 | Body + display text |
| Mall Food Court | Blue Raspberry | `#2EC4FF` | 2.0:1 | 6.1:1 | Shapes only |
| Mall Food Court | Lime Freeze | `#A7F432` | 1.3:1 | 9.1:1 | Shapes only |
| Mall Food Court | Nacho Cheese | `#FFB703` | 1.7:1 | 7.0:1 | Shapes only |
| Mall Food Court | Purple Punch | `#8338EC` | 5.6:1 | 2.2:1 | Body + display text |
| Mall Food Court | Teal Cup | `#00B4A6` | 2.6:1 | 4.7:1 | Shapes only |
| Mall Food Court | Hot Dog Orange | `#FB5607` | 3.3:1 | 3.7:1 | Display >=24px / UI only |
| Mall Food Court | Cola Brown | `#4B2E2B` | 12.2:1 | — | Body + display text |
| Lisa Frank Lightning | Rainbow Pink | `#FF1493` | 3.6:1 | 4.2:1 | Display >=24px / UI only |
| Lisa Frank Lightning | Magic Violet | `#A100F2` | 5.5:1 | 2.8:1 | Body + display text |
| Lisa Frank Lightning | Sky Pop | `#00BBF9` | 2.2:1 | 6.9:1 | Shapes only |
| Lisa Frank Lightning | Mermaid Teal | `#00F5D4` | 1.4:1 | 11.0:1 | Shapes only |
| Lisa Frank Lightning | Star Yellow | `#FEE440` | 1.3:1 | 12.0:1 | Shapes only |
| Lisa Frank Lightning | Sunset Orange | `#F15BB5` | 3.0:1 | 5.1:1 | Display >=24px / UI only |
| Lisa Frank Lightning | Electric Lime | `#9BFF00` | 1.3:1 | 12.2:1 | Shapes only |
| Lisa Frank Lightning | Cosmic Navy | `#1B1B5E` | 15.4:1 | — | Body + display text |
| 90s Windbreaker | Aqua Teal | `#00A6A6` | 3.0:1 | 5.5:1 | Shapes only |
| 90s Windbreaker | Magenta Stripe | `#D90368` | 5.0:1 | 3.3:1 | Body + display text |
| 90s Windbreaker | Royal Purple | `#541388` | 11.5:1 | 1.4:1 | Body + display text |
| 90s Windbreaker | Sport Blue | `#2E86DE` | 3.8:1 | 4.4:1 | Display >=24px / UI only |
| 90s Windbreaker | Neon Lime | `#C7F464` | 1.3:1 | 13.1:1 | Shapes only |
| 90s Windbreaker | Sunburst Yellow | `#F9DC5C` | 1.4:1 | 12.2:1 | Shapes only |
| 90s Windbreaker | Track Orange | `#F46036` | 3.2:1 | 5.2:1 | Display >=24px / UI only |
| 90s Windbreaker | Charcoal Black | `#1E1E24` | 16.6:1 | — | Body + display text |
| Saturday Morning Cartoon | Hero Red | `#EF233C` | 4.2:1 | 2.9:1 | Display >=24px / UI only |
| Saturday Morning Cartoon | Cartoon Blue | `#118AB2` | 4.0:1 | 3.0:1 | Display >=24px / UI only |
| Saturday Morning Cartoon | Slime Green | `#06D6A0` | 1.9:1 | 6.4:1 | Shapes only |
| Saturday Morning Cartoon | Pop Yellow | `#FFD166` | 1.4:1 | 8.4:1 | Shapes only |
| Saturday Morning Cartoon | Bubble Purple | `#7209B7` | 8.6:1 | 1.4:1 | Body + display text |
| Saturday Morning Cartoon | Orange Blast | `#F77F00` | 2.6:1 | 4.6:1 | Shapes only |
| Saturday Morning Cartoon | Cotton Candy | `#FF70A6` | 2.6:1 | 4.7:1 | Shapes only |
| Saturday Morning Cartoon | Midnight Outline | `#073B4C` | 12.1:1 | — | Body + display text |
| Retro Tech Lab | CRT Green | `#39FF14` | 1.4:1 | 11.8:1 | Shapes only |
| Retro Tech Lab | Terminal Blue | `#00B2FF` | 2.4:1 | 6.7:1 | Shapes only |
| Retro Tech Lab | Cyber Purple | `#9D4EDD` | 4.6:1 | 3.5:1 | Body + display text |
| Retro Tech Lab | Floppy Disk Gray | `#8D99AE` | 2.9:1 | 5.6:1 | Shapes only |
| Retro Tech Lab | Alert Red | `#FF006E` | 3.8:1 | 4.2:1 | Display >=24px / UI only |
| Retro Tech Lab | Pixel Orange | `#FF9F1C` | 2.1:1 | 7.8:1 | Shapes only |
| Retro Tech Lab | Screen Yellow | `#FFEA00` | 1.2:1 | 12.9:1 | Shapes only |
| Retro Tech Lab | Monitor Navy | `#14213D` | 16.0:1 | — | Body + display text |
| Nickelodeon Splash | Slime Green | `#76FF03` | 1.3:1 | 14.5:1 | Shapes only |
| Nickelodeon Splash | Orange Splat | `#FF7A00` | 2.6:1 | 7.2:1 | Shapes only |
| Nickelodeon Splash | Purple Goo | `#9B00FF` | 5.5:1 | 3.5:1 | Body + display text |
| Nickelodeon Splash | Aqua Splash | `#00E5FF` | 1.5:1 | 12.3:1 | Shapes only |
| Nickelodeon Splash | Bubble Pink | `#FF4ECD` | 2.9:1 | 6.5:1 | Shapes only |
| Nickelodeon Splash | Lemon Pop | `#FFF500` | 1.1:1 | 16.5:1 | Shapes only |
| Nickelodeon Splash | Blueberry | `#3A0CA3` | 11.9:1 | 1.6:1 | Body + display text |
| Nickelodeon Splash | Deep Black | `#111111` | 18.9:1 | — | Body + display text |

