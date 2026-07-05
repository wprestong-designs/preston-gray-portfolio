# Video bandwidth diet — 2026-07-05

Branch: `feature/cloudflare-and-about-polish`. Re-encoded the shipped scroll
clips (audio stripped, downscaled to displayed width without upscaling, bitrate
capped) with `ffmpeg-static` 6.0 installed to an isolated scratchpad prefix (the
project's `node_modules` was **not** touched). Each encode was written to temp
and kept **only if smaller** than the original; validity re-checked by decoding
to null (all OK). Frame spot-check at 1200px confirmed UI text stays legible even
on the −64% clip.

## Recipe
- **Desktop** (`scale='min(1200,iw)'`): H.264 CRF 30 (maxrate 900k) · VP9 CRF 34 (b:v 700k, maxrate 900k)
- **Mobile** (`scale='min(600,iw)'` — sources are only 488–530px wide, so no upscale): H.264 CRF 31 (maxrate 600k) · VP9 CRF 36 (b:v 450k, maxrate 600k)
- All: `-an` (muted anyway), `+faststart` (mp4), lanczos scaling. Element attrs (muted/loop/playsinline/`preload="none"`+poster) unchanged — `ProofMedia.jsx` already lazy-loads.

## Per-file result (both encodes kept as sources; browser downloads one)
| Clip | mp4 before→after | webm before→after |
|---|---|---|
| summit-homepage-scroll-desktop | 1316K → **464K** (−64%) | 820K → 612K (−25%) |
| summit-rxsubmission-scroll-desktop | 524K → **252K** (−51%) | 584K → 476K (−18%) |
| summit-dermatology-desktop | 684K → **312K** (−54%) | 720K → 584K (−18%) |
| bristol-homepage-desktop | 1408K → **472K** (−66%) | 684K → 588K (−14%) |
| pinnacle-about-desktop | 448K → **216K** (−51%) | 388K → 348K (−10%) |
| summit-rxrefillrequest-scroll-mobile | 400K → 248K (−38%) | 204K → **204K** (kept — re-encode was larger) |
| bristol-about-mobile | 1052K → **556K** (−47%) | 820K → 652K (−20%) |
| pinnacle-homepage-scroll-mobile | 2052K → 608K (−70%) | 604K → **576K** (−4%) |

**Bold** = the file actually served per clip (the smaller of the two).

## `mp4First` flips (the important runtime change)
H.264 CRF 30 now beats the bitrate-capped VP9 for four clips that were webm-first,
so `mp4First: true` was added in `projects.js` to serve the smaller mp4:
**summit-homepage, bristol-homepage, pinnacle-about, bristol-about.**
(summit-rxsubmission + summit-dermatology were already mp4First; summit-rxrefillrequest
+ pinnacle-homepage stay webm-first — webm is smaller for those.)

## Shipped payload (served pick per clip, one file per clip downloads)
**Before ≈ 4.6 MB → after ≈ 3.0 MB — ~1.6 MB saved (~35%)**, on top of `preload="none"`
already fetching only near-viewport clips. Total on-disk repo reduction across all 16
re-encoded files ≈ **5.4 MB**.

---

## ✅ Done — pruned orphaned media (biggest DISK win, 0 shipped bytes)
Five clips were **not imported** anywhere (verified 0 refs in `src/`), so Vite never
bundled them and they never reached users. Removed all three files per clip
(mp4 + webm + the orphaned `-poster.jpg`) = **15 files, ~9 MB off the repo**:

```
summit-crm-territorymap-zoom-desktop.{mp4,webm,-poster.jpg}   # CRM data-safety unwire 2026-07-04
crm-field-scroll-mobile.{mp4,webm,-poster.jpg}                # same unwire
prosource-homepage-scroll-mobile.{mp4,webm,-poster.jpg}       # prosource ships poster-only
prosource-navigation-mobile.{mp4,webm,-poster.jpg}            # never imported
pinnacle-navigation-mobile.{mp4,webm,-poster.jpg}             # never imported
```
`src/assets/media/` went 20M → 11M (re-encode + prune). The territory-map clip was
the biggest *file* in the repo but a shipped no-op — already unwired, correcting the
"biggest lever" premise.

## Also not done — gated CRM clips
`crm-analytics-desktop` + `crm-todaydashboard-scroll-desktop` are wired but gated
(`crmVerified:false` → `ProofMedia` never emits their `<video>`), so they never
download at runtime. Re-encode them with the desktop recipe above **if/when** the
CRM flag flips; not touched now.
