# Media re-shoot — report (2026-11-14)

Branch `media/reshoot-20261114` (off `fix/contact-form-and-poster-bugs`). Not committed, pushed or deployed.

## What changed
- **Captures:** 17 stills + 12 clips, all new. Stills are 2x viewport crops (1440×900 / 390×844), served as WebP (1920w desktop; 780w + 480w mobile). Clips are frame-by-frame (eased `scrollTo` + screenshots at 30 fps → ffmpeg), no cursor/chrome/widgets, ≤12s, ≤3 MiB.
- **Encoder:** `scripts/process-media.mjs` takes frame folders, starts at H.264 CRF 21 / VP9 CRF 30 and only steps up to fit the 3 MiB budget. Final: 10 of 12 MP4s at CRF 21–24; Summit's long homepage scroll needed CRF 28 for the MP4 (its WebM fits at CRF 30 and is served first).
- **Ourco is the flagship:** hero clip, homepage (desktop + phone), about, services, industrial gases, our brands. `LIVE_URLS.ourco = https://ourco.net`, live link on `/work/`, copy updated with Preston's approved wording.
- **Duplicates gone:** Ourco/ProSource no longer repeat the homepage; Bristol's second homepage still is now the phone view. ProSource gets a real refill-form clip (from the local pharmacy-sites build; still no live link).
- **Panel sizes:** one browser frame per panel (a phone may sit beside it). At 1440×900 desktop frames render 749–1066 px wide (was 260–406). Also fixed: `.pm` is a `<figure>` and kept its UA 40px margins, which pushed every solo frame's placard underneath it below ~1900 px wide.
- **Compass (Custom CRM):** captured ONLY from the fictional pilot demo (`pilot-demo.sh`: fictional offices/prescribers/reps, synthetic notes, throwaway store, requests outside 127.0.0.1 blocked), with a **DEMO · SAMPLE DATA** badge injected into every frame.

## CRM assets that need Preston's verification
| Asset | Kind | State |
|---|---|---|
| `crm-week-mobile` | clip (phone) | `crmVerified:false` → poster + "Pending verification" |
| `crm-analytics-scroll-desktop` | clip | `crmVerified:false` → poster + "Pending verification" |
| `crm-today-desktop.webp` | still | wired, badge in frame |
| `crm-reports-desktop.webp` | still | wired, badge in frame |
| `crm-team-desktop.webp` | still | wired, badge in frame |

Old CRM clips (`crm-todaydashboard-scroll-desktop`, `crm-analytics-desktop`) were removed. The old stills `crm-analytics-desktop.jpg` and `crm-fieldnotes-desktop.jpg` are no longer wired; the files stay because the dormant `FeaturedWork.jsx` still imports them.

## Open for Preston
- **Draft captions** (`captionDraft: true` in projects.js): Ourco "Homepage — the hero in motion", "Homepage on a phone", "Services", "Industrial gases", "Our brands"; CRM "Home on desktop — the next stop first", "Team — the week, rep by rep".
- **Frozen caption now off:** Ourco "About page: the yard, the fleet, the counter". The new About page opens on the "Built in Houston" skyline.
- **Frozen `/work/` blurb:** Ourco card still says "site on the press now".
- **ourco.net bug:** no `body { margin: 0 }`, so a white 8 px frame shows around every page. Zeroed for the captures only; fix belongs in `ourco-website`.
- **Summit live refill form:** on desktop the "Last name" field sits lower than "First name" (visible in `summit-refill-desktop`).

## Reproduce
```
npx playwright install chromium            # once
node scripts/reshoot-capture.mjs all       # needs ProSource on :8091 (pharmacy-sites: node tooling/serve.mjs --brand prosource --port 8091)
COMPASS_STORE=<store> node scripts/compass-capture.mjs   # needs compass-hosted: zsh apps/compass/scripts/pilot-demo.sh
node scripts/process-media.mjs Media/reshoot/frames/<name>-desktop --width 1600
node scripts/process-media.mjs Media/reshoot/frames/<name>-mobile
```
Raw PNG masters and frames live in the gitignored `/Media/reshoot/`.

## Complete-proofs pass (same day)
Standard for a complete proof: **5–7 media panels, 3+ videos and 3+ stills**, at least one desktop scroll-through and one phone clip, at least three different pages, and stills framed on each page's most telling section (not just the top).

| Proof | Videos | Stills | Media panels |
|---|---|---|---|
| Summit | 4 | 4 | 7 (unchanged) |
| Ourco | 4 (hero, About scroll, Services scroll, Gases quote taps on a phone) | 5 | 7 |
| Bristol | 3 | 3 | 5 |
| Pinnacle | 3 | 3 | 5 |
| ProSource | 2 | 5 | 5 |
| Compass | 3 (all `crmVerified:false`) | 4 | 6 |

- Ourco's About still is now the "The shop, the floor, the yard" gallery, which matches the frozen caption. The services and brands hero stills were replaced by a Services scroll-through and the brand directory.
- The Ourco scroll clips cover only the strongest stretch of each page (`scrollMax`): full-page passes of the painted art came out at 8.5 and 6.3 MB as MP4.
- The gases clip is a new `taps` capture mode: CSS animations are slowed to 1/10 through CDP and sampled against page time. Nothing is submitted.
- New captions are drafts (`captionDraft: true`); no new body copy.
- Also seen, not changed: on phones, the small "PROOF 0X" label in the overlay chrome keeps its colour while a different-coloured panel scrolls under it (axe color-contrast, e.g. 1.56:1 on Summit's green). It's already live and predates this pass.
