# Recapture / re-process list — 2026-07-04

Assets that need Preston's action before they can (re)ship.

## CRM data-safety unwires — recapture WITH a visible "DEMO · SAMPLE DATA" badge
Removed from the Field Intel proof (no visible badge; bright-line rule, no benefit of the doubt):
1. `summit-crm-territorymap-zoom-desktop` (clip) — desktop territory map; recapture with the sidebar DEMO badge present (it predates the badge).
2. `crm-field-scroll-mobile` (clip) — mobile field view; mobile layout hides the sidebar badge → recapture with an on-screen DEMO/sample marker.
3. `crm-territorymap-mobile.jpg` (still) — same (mobile, no badge).
4. `crm-analytics-mobile-explorer.png` (still) — same (mobile, no badge).
5. `crm-fieldnotes` **populated** view (demo data, badge visible) — the wired shot is an empty state; a populated demo (with badge) would restore the "field notes" story. (Kept the empty one as a provably-empty marker.)

When recaptured with the badge, re-wire Field Intel panel 3 (the mobile field narrative copy is preserved in git: commit before this run).

## Needs ffmpeg (blocked here — run `scripts/process-media.mjs` locally)
6. `pinnacle-homepage-scroll-mobile.mp4` — process to mp4/webm/poster; this is the **native portrait** Pinnacle homepage capture that REPLACES the letterboxed `pinnacle-homepage-mobile` (retire the letterboxed one after).
7. `pinnacle-navigation-mobile.mp4` — process (optional supporting clip).
8. `prosource-homepage-scroll-mobile.mp4` — process (ProSource mobile homepage lead).
9. `prosource-navigation-mobile.mp4` — process (optional supporting clip).

Raw files are in `Media/Screencaptures/`. Until processed, the ProSource/Pinnacle mobile sets lead with **still** screenshots (see decision log §2).
