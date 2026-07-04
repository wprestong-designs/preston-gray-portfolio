# Media Manifest — V2 intake (selection + captions for review)

Source folders (raw, gitignored, never committed):
- `Media/Screencaptures/` — 40 MP4 screen recordings
- `Media/Screenshots/` — 45 stills
- `C:\Users\wpgra\OneDrive\Videos\Clipchamp\Video Project\Exports\crm-accountscroll-mobile.mp4` — one stray export outside the repo (move into `Media/Screencaptures/` before processing)

**PROCESSED ✓** — all 11 selected clips are encoded in `src/assets/media/`
(33 files: mp4 + webm + poster per clip) via `scripts/process-media.mjs`.
Real sizes are in the Budget section. **Nothing is wired into panels yet** —
edit selections/captions here, check off the CRM verification lines, then
approve the wiring pass.

Caption register: mono-face fragments, under ten words, noun-forward, no marketing
verbs. Edit freely — these are drafts.

---

## PG-01 · Summit Pharmacy

### Clips (4)

| # | File | Duration | Slot | Draft caption |
|---|------|----------|------|---------------|
| 1 | `summit-homepage-scroll-desktop.mp4` | 12.0s ✓ | desktop hero flow | Homepage — the full scroll |
| 2 | `summit-rxrefillrequest-scroll-mobile.mp4` | 5.6s ✓ | mobile flow | Rx refill, without the phone call |
| 3 | `summit-rxsubmission-scroll-desktop.mp4` | 12.0s ✓ | detail — provider tool | Provider Rx submission — one form |
| 4 | `summit-dermatology-desktop.mp4` | 12.0s ✓ | detail — specialty page | Dermatology — one of five specialty pages |

### Stills (5)

| File | Draft caption |
|------|---------------|
| `Summit homepage, hero section.png` | Homepage hero |
| `Summit-rx-refill-form-page.png` | The refill form |
| `Womens-health-page.png` | Women's health specialty page |
| `ophthalomology-page.png` (filename typo is in the source; caption spelled correctly) | Ophthalmology specialty page |
| `Summit-reviews.png` | Reviews, on the page |

---

## PG-06 · Summit Field Intel (CRM)

> ⚠ HOLD FOR YOUR VERIFICATION: every clip/still below must be confirmed as the
> synthetic-demo build before wiring. Standing constraint: no real provider,
> patient, prescription, revenue, or account data — ever.
>
> Check each line off before the wiring pass:
>
> - `crm-todaydashboard-scroll-desktop` — synthetic-demo verified: ☐
> - `crm-field-scroll-mobile` — synthetic-demo verified: ☐
> - `summit-crm-territorymap-zoom-desktop` — synthetic-demo verified: ☐
> - `crm-analytics-desktop` — synthetic-demo verified: ☐

### Clips (4)

| # | File | Duration | Slot | Draft caption |
|---|------|----------|------|---------------|
| 1 | `crm-todaydashboard-scroll-desktop.mp4` | 11.0s ✓ | desktop hero flow | Today dashboard — the day at a glance |
| 2 | `crm-field-scroll-mobile.mp4` | 8.3s ✓ | mobile field flow | Field view, one-handed |
| 3 | `summit-crm-territorymap-zoom-desktop.mp4` | 10.3s ✓ | feature — territory map | Territory map, zoomed to route |
| 4 | `crm-analytics-desktop.mp4` | 10.2s ✓ | detail — analytics | Analytics — demo data |

### Stills (4)

| File | Draft caption |
|------|---------------|
| `crm-fieldnotes+devicesync-desktop.png` | Field notes + device sync |
| `summit-crm-territorymap-screenshot-mobile.png` | Territory map, pocket-size |
| `Summit-crm-field-desktop.png` | Field list — demo data |
| `summit-crm-analytics-mobile-explorer.png` | Analytics explorer, mobile |

(The five CRM stills already wired in `src/assets/` are untouched by this pass.)

---

## PG-03 · Bristol Pharmacy  *(manifest v2 — network split into three proofs)*

### Clips (2)

| # | File | Duration | Slot | Draft caption |
|---|------|----------|------|---------------|
| 1 | `bristol-homepage-desktop.mp4` | 11.4s ✓ | desktop hero flow | Bristol Pharmacy — Oklahoma City |
| 2 | `bristol-about-mobile.mp4` | 10.6s ✓ | mobile / story detail | Bristol — the about page |

### Stills (1)

| File | Draft caption |
|------|---------------|
| `Bristol-pharmacy-homepage.png` | Homepage — Oklahoma City |

---

## PG-04 · Pinnacle Rx

### Clips (2)

| # | File | Duration | Slot | Draft caption |
|---|------|----------|------|---------------|
| 1 | `pinnacle-homepage-mobile.mp4` | 12.0s ✓ | mobile hero flow | Pinnacle Rx on a phone |
| 2 | `pinnacle-about-desktop.mp4` | 8.3s ✓ (promoted from archive, PROCESSED ✓) | desktop detail | Pinnacle — the about page |

### Stills (1)

| File | Draft caption |
|------|---------------|
| `pinnacle-rx-homepage.png` | Homepage — Little Rock |

---

## PG-05 · Prosource Pharmacy — STILLS ONLY (in progress)

**No clips.** Video slots read "Screen captures coming — form flow to
follow." Standing constraint: Prosource is never rendered as a live link;
captions carry "in progress." (`src/assets/prosource-home.jpg` was generated from the raw
still for the overlay/preview — 159 KB.)

| File | Draft caption |
|------|---------------|
| `Prosource-pharmacy-homepage.png` | Homepage — in progress |

Unassigned network graphic: `our-brands-title-wide.png` ❓ confirm whether
the umbrella "our brands" graphic still has a home now that the trio are
separate proofs (candidate: a shared points-panel deco) — or archive it.

---

## PG-02 · Ourco

**Stills only for now — video slots flagged `pending — project in progress`.**

| File | Draft caption |
|------|---------------|
| `Ourco-homepage-hero.png` | Homepage hero — bold on purpose |
| `Ourco-about-page.png` | About — built in Houston |
| `about-delivery-fleet.png` ❓ | The delivery fleet |
| `about-warehouse-inventory.png` ❓ | Warehouse inventory |
| `about-counter-inside-sales.png` ❓ | Counter sales |

❓ The three `about-*` photos read as industrial-distribution imagery — confirm
they're Ourco's before wiring.

---

## Excluded — DO NOT SHIP (standing constraint, not archive)

- `summit-crm-accountprofile-mobile1.png` — visit note pending recapture
- `summit-crm-accountprofile-mobile2.png` — visit note pending recapture

---

## Archive (not shipped)

Clips: `bristol-about-desktop` 7s · `bristol-homepage-mobile` 14s ·
`crm-accounts-nav-desktop` 17s · `crm-accounts-nav-mobile` 16s ·
`crm-accountscroll-desktop` 6s · `crm-accountscroll-mobile` (Clipchamp) 11s ·
`crm-analytics-mobile (2)` 11s · `crm-field-scroll-desktop` 7s ·
`crm-todaydashboard-accountnav-desktop` 10s · `crm-todaydashboard-scroll-mobile (2)` 12s ·
`pinnacle-about-mobile` 12s ·
`pinnacle-homepage-desktop` 14s · `summit-checkrxstatus-scroll-desktop` 8s ·
`summit-checkrxstatus-scroll-mobile` 11s · `summit-crm-homepage-scroll-mobile` 12s ·
`summit-crm-mininav-mobile` 6s · `summit-crm-territorymap-zoom-mobile` 11s ·
`summit-generalrx-desktop` 10s · `summit-generalrx-mobile` 13s ·
`summit-homepage-nav-desktop` 7s · `Summit-homepage-nav-mobile` 8s ·
`summit-homepage-scroll-mobile` 19s · `summit-ophthalmology-desktop` 14s ·
`summit-ophthalmology-mobile` 18s · `summit-rxrefillrequest-scroll-desktop` 6s ·
`summit-rxsubmission-scroll-mobile` 13s · `summit-womenshealth-desktop` 13s ·
`summit-womenshealth-mobile` 17s

Stills: `about-outside-sales` · `about-warehouse-delivery` ·
`crm-territorymap-screenshot-desktop` · `dermatology-page` · `General-rx-page1` ·
`our-brands-title-portrait` · `preston-profilephoto.JPG` (About overlay candidate —
hold for the G2/About pass) · `service+care=breathoffreshair-graphic` ❓ (brand
unclear) · `Summit-accountprofile-desktop` · `summit-crm-accountprofile-mobile3` ·
`summit-crm-accounts-desktop/mobile` · `Summit-crm-analytics-desktop/mobile` ·
`summit-crm-analytics-screenshot` · `summit-crm-fieldnotes+devicesync-mobile` ·
`summit-crm-more-desktop/mobile` · `summit-crm-today-desktop/mobile` ·
`Summit-ethics-graphic` · `summit-footer` · `summit-logo-horizontal/vertical` ·
`Summit-reviews` (shipped above) · `Bristol/Ourco/pinnacle/Prosource` homepage
shots (shipped above where selected)

---

## Trim list — RESOLVED

All selected clips were retimed at the source to ≤12s (ffprobe-verified at
processing: max 12.0s). Nothing needed inline trimming. If an archive clip is
ever promoted, the script still enforces the 12s spec and trims via
`--ss <start> --t <duration>`.

---

## Netlify budget — measured (encoded output, per project)

| Project | mp4 total | webm total | posters | Per-visitor* | Deploy total |
|---|---|---|---|---|---|
| summit (4 clips) | 2.85 MB | 2.27 MB | 0.42 MB | **≈3.3 MB** | 5.5 MB |
| fieldintel (4 clips) | 3.59 MB | 3.90 MB | 0.60 MB | **≈4.2 MB** | 8.1 MB |
| bristol (2 clips) | 2.40 MB | 1.47 MB | 0.19 MB | **≈2.6 MB** | 4.1 MB |
| pinnacle (2 clips) | 1.07 MB | 0.83 MB | 0.16 MB | **≈1.2 MB** | 2.1 MB |
| prosource (stills only) | — | — | — | ≈0.2 MB still | — |
| ourco (stills only) | — | — | — | ≈2 MB stills | — |

\* one format downloads per clip (browser picks) + posters.

Every project lands far under the ~15MB flag line; total deploy media
**≈19.8 MB** (12 clips after the pinnacle promotion). Largest single encode:
`summit-crm-territorymap-zoom-desktop.webm` at 2.34 MB — under the 3 MB
target, no CRF changes needed.

---

## Processing

ffmpeg 8.1.2 installed via `winget install Gyan.FFmpeg` (restart the shell for
PATH, or use the winget Links alias).

```
node scripts/process-media.mjs Media/Screencaptures/<file>.mp4 [more files...] [--ss 2 --t 10]
```

Per input, emits into `src/assets/media/`:
- `name.mp4` — H.264, CRF 28, ≤1080p, faststart, audio stripped (slots are muted)
- `name.webm` — VP9, audio stripped
- `name-poster.jpg` — first meaningful frame (0.5s in)

The script refuses clips over 12s unless `--ss/--t` trim flags are given, prints
every output size, and warns on any encode over 3MB.
