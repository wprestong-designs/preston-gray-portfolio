# Content State Report

Living document for the G2 reconciliation pass. Sections 1–3 are pointers
until G2 fills them; **section 4 is the authoritative registry of every
string Claude has authored** (Z1c), so Preston's pass always sees both copy
sources side by side.

> Provenance flag: Z1c referenced "the content-state-report's section 4" —
> no such report existed in the conversation, so this file establishes it.
> Section numbering below is now canonical.

## 1 · Media state
See `media-manifest.md` (v2) — selections, captions, budget, CRM
verification checkboxes. Nothing wired into panels yet.

## 2 · Copy slot inventory
Produced at G2: every slot (masthead subhead, index tags, statements,
points, "Off the press", stamp badges, panel bodies per Y2) with its
current placeholder. Register note: project overlays may flex designerly;
About stays plainspoken.

## 3 · Standing content constraints
- CRM: never real provider/patient/prescription/revenue/account data; demo
  build with synthetic sample data; `summit-crm-accountprofile-mobile1/2.png`
  excluded outright.
- Prosource: "In Progress / Coming Soon," never a live link.
- Ourco: deliberate, client-led bold direction — never compromise language.
- No invented metrics; the "10+ prescription requests a day" claim is
  banned site-wide.

## 4 · Authored-draft registry (Claude drafts awaiting Preston's pass)

All strings below are **Claude drafts** unless marked otherwise. Location
key: P = `src/data/projects.js`, W = `work/index.html`, M = `media-manifest.md`,
UI = component strings.

### Statements / ledes (P)
- summit: "A pharmacy site that finally looks the way the pharmacists care."
- ourco: "Bold on purpose — built around how this company actually wins work." *(framing direction is Preston's standing rule; sentence is a draft)*
- bristol: "The framework's first expansion — Oklahoma City."
- pinnacle: "Same press, new city — the framework tuned to Little Rock."
- prosource: "The next press run — Prosource Pharmacy, Las Vegas."
- fieldintel: "Built for a day in the field — and used every day."
- about (statement): "Websites, customer handouts, social posts, brand basics, and simple follow-up systems — practical pieces, built well, that make your business easier to find, easier to trust, and easier to choose."
- about (contact): "Tell me what's not working — I'll bring back a clear plan and pieces you can actually use."

### Tags / eyebrows (P)
- summit "Website & marketing system" · bristol "Oklahoma City" ·
  pinnacle "Little Rock" · prosource "Las Vegas · in progress" ·
  fieldintel "Custom CRM, designed & built" · about "Denver, Colorado"
- ourco "Houston industrial" *(early-era, treat as draft)*

### Points panels (P)
- summit: "Brand, site, print & provider tools — one system" / "HIPAA-aware refill request flow" / "The framework now powering three more pharmacies"
- ourco: "Full site design & build" / "Art direction shaped with the owner" / "Quote-first structure & local search presence"
- bristol: "Built on the Summit framework" / "Local search presence from day one" / "Refill flows & provider tools"
- pinnacle: "The shared framework, tuned to the brand" / "Little Rock, Arkansas" / "Refill flows & provider tools"
- prosource: "In progress — launching soon" / "Las Vegas, Nevada" / "Third brand on the framework"
- fieldintel: "Territory mapping & weekly route planning" / "Visit notes & follow-up tracking" / "Demo build shown — synthetic data only" *(last one is constraint-mandated phrasing)*
- about "What I make": "Websites & landing pages" / "Customer handouts & print pieces" / "Getting found locally — Google Business & reviews" / "Simple follow-up systems & internal tools"
- about "Off the press": "Woodworking projects that outgrow the garage" / "Old School RuneScape — patience training" / "A very good dog (see portrait)"
- Default points label: "What carried the proof"

### In-panel media captions (P — current placeholders, superseded at wiring by M)
- "Homepage · summitpharmacycolorado.com" / "Rx refill request flow" / "Site walkthrough · clip pending"
- "Homepage · bold metal-frame hero" / "About page · built in Houston" / "Scroll-through · clip pending"
- "Homepage · Bristol Pharmacy" / "Site tour · clip pending" (bristol)
- "Homepage · Pinnacle Rx" / "Site tour · clip pending" (pinnacle)
- "Homepage · in progress" (prosource)
- "Analytics · demo data" / "Accounts · demo data" / "Today" / "Accounts" / "Office Rx detail" / "Mobile field flow · clip pending"

### Manifest draft captions (M)
All caption drafts in `media-manifest.md` are Claude drafts, already marked
there for editing.

### /work/ page (W — flagged for G2 since S1)
Headline, lede, four service items, contact section, and the six proof-card
blurbs incl. "The pharmacy framework's first expansion…", "The same proven
framework tuned to a Little Rock brand…", "Las Vegas — the third brand on
the framework, on the press now.", CTAs "See the proof →" / "In progress —
coming soon" / "The full portfolio →".

### UI strings (components)
- "← Return to the catalog" *(Preston-approved verbiage — not a draft)*
- Poster sr-only h1: "I help small businesses look as good as the work they
  do." *(derived from the retired masthead copy — confirm at G2)*
- IndexLayer: "Index of Proofs" section label, "Index" mark, About/Contact
  row labels (structural).
- Monument words: Summit / Ourco / Bristol / Pinnacle / Prosource /
  Field Intel / About *(derived from project names)*
