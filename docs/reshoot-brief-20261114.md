# Portfolio media re-shoot — handoff brief (2026-11-14)

Context: Preston wants more small-business projects like Ourco. A site audit
found the project media is the weakest part of preston-gray.com. This brief
hands the re-shoot to a Claude Code session running in this repo on the Mac.

## What is wrong with the current media (measured on the live site)
- Stills display at 260–406px wide in the proof panels (569px max), so page
  text is unreadable. Sources are ~1200px wide: too small for 2x screens once
  the display size goes up.
- Videos are over-compressed: summit-homepage-scroll-desktop is 1202x676,
  12s, ~460 KB. process-media.mjs uses CRF 28 (H.264) / CRF 36 (VP9).
- Raw screen recordings: black pillarbox bars, visible cursor, uneven crops.
- Ourco and ProSource each show the same homepage still twice.
- Ourco has only two stills and no video; copy still says "launches in early
  August". Ourco is now LIVE (confirmed by Preston 2026-11-13).

## Re-shoot plan
1. Capture from the LIVE sites with Playwright (playwright 1.61 is in
   node_modules; run `npx playwright install chromium` if needed):
   summitpharmacycolorado.com, rxbristolokc.com, pinnacle-rx.com, and the
   live Ourco domain (set LIVE_URLS.ourco in src/data/projects.js).
   ProSource is not live: capture from ~/pharmacy-sites local build.
2. Stills: deviceScaleFactor 2, desktop 1440x900 and mobile 390x844, clean
   viewport crops (no browser chrome, no cursor), cookie/chat widgets hidden.
3. Scroll videos: do not screen-record. Step window.scrollTo with an eased
   curve, screenshot each frame at 30fps, assemble with ffmpeg. Gives smooth,
   cursor-free, bar-free clips at exact dimensions.
4. Encode: 1600px-wide desktop clips, H.264 CRF ~21 and VP9 CRF ~30,
   keep ≤12s and under the 3 MB target in process-media.mjs.
5. Ourco as flagship: homepage hero, about, services, industrial gases,
   our-brands, mobile homepage, plus one homepage scroll video.
6. Wire into src/data/projects.js; raise panel display sizes so desktop
   stills render ≥720px wide; remove duplicate stills.
7. Verify with the existing visual harness (scripts/qa-sweep.mjs) and a
   production build.

## Hold / needs Preston
- CRM media: keep the synthetic-demo rule; the two "PENDING VERIFICATION"
  labels are live on the site and need his sign-off or removal.
- Work on a new branch off the current one
  (fix/contact-form-and-poster-bugs); do not push or deploy without asking.

## Later audit items (not part of the re-shoot)
- Homepage h1 is sr-only; visitors see unlabeled shapes.
- Placeholders live: "Screen captures coming" (ProSource), "More proofs to
  follow" (Ourco).
- Proofs end on "Return to the catalog" with no contact prompt.
- /#proof-<id> deep links from /work/ and /small-business/ land on the
  shapes without opening the proof.
- Ourco is missing from the proof list on /small-business/.
- No client quotes or outcomes on any proof.
