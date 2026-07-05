# Cloudflare Pages migration + host-agnostic contact form

**Branch:** `feature/cloudflare-and-about-polish` · **Date:** 2026-07-05
**Why:** Netlify free credits are nearly exhausted (a production deploy costs 15;
exhaustion pauses the site). Cloudflare Pages branch/preview + production builds
are free. This document is the runbook — do the steps in order. **Nothing here
deploys automatically; every step is yours to run in a dashboard.**

> **Credit freeze still in effect.** Do NOT deploy to Netlify, merge to `main`,
> or use Netlify's AI agent until the Cloudflare site is confirmed live. Branch
> and preview work is free. Keep Netlify running as the fallback until the very
> last step.

---

## 0. Root cause — why the Netlify contact form failed in production (for the log)

Diagnosed by reading `ContactLayer.jsx`, `index.html`, and the built
`dist/index.html`. **The code and the built artifact were all correct** — the
static form survived the Vite build with every field name matching the POST
(including `needs`/`timeline` collapsed to single text fields), the encoding was
textbook (`application/x-www-form-urlencoded`), the `form-name` was consistent
in all four places, the POST path (`/`) was un-intercepted (no `_redirects`
catch-all existed), and the honeypot did not drop legitimate submits.

**The single point of failure was Netlify's build-time form _registration_.**
Netlify's whole "hidden static form" scheme depends on Netlify's post-processing
bot parsing that form at deploy time and registering `contact-ticket` as a real
endpoint. Current Netlify ships **automatic form detection OFF by default** (a
per-site dashboard toggle) and there was no `netlify.toml` enabling it. With the
form never registered, a POST to `/` is served as a plain static request — it
either returns a non-2xx (tripping the mailto fallback) or, worse, a bare `200`
for the static page that **false-stamps "Ticket Received" while nothing is
recorded**. The client can't tell a real form-handler 200 from a static-asset 200.

**Fix (already done on this branch):** swapped to **Web3Forms** — a client-side
POST straight to `https://api.web3forms.com/submit`. No static form to detect, no
build-time registration, no `form-name` matching; the endpoint that records the
submission is the one you POST to, so its response is the real success/failure.
Fully host-agnostic (works identically on Netlify, Cloudflare, anywhere).

---

## 1. Cloudflare Pages build settings

| Setting | Value |
|---|---|
| Framework preset | **Vite** |
| Build command | **`npm run build`** |
| Build output directory | **`dist`** |
| Root directory | **`/`** (leave default) |
| Production branch | **`main`** |
| Node version | **`22.13.0`** — set build env var `NODE_VERSION=22.13.0` (Production **and** Preview) |

Node rationale: Vite 8 needs Node ≥20.19/22.12 and ESLint 10 needs `^22.13 || >=24`;
`22.13.0` is LTS and satisfies both. (A repo-root `.nvmrc` with `22.13.0` also works
and Cloudflare reads it automatically — the env var is the zero-file path.)

**Environment variable to add (both Production and Preview):**
- `NODE_VERSION` = `22.13.0`
- `VITE_WEB3FORMS_KEY` = _your Web3Forms access key_ (see §4)

---

## 2. Routing — no `_redirects` needed (do NOT add an SPA catch-all)

Cloudflare Pages serves `dist/` statically and reproduces every Netlify default
1:1 **with zero config**:
- `/work/`, `/small-business/`, `/colophon/` resolve to their `index.html`
  automatically (directory index); `/work` 308-redirects to `/work/`.
- Any unmatched path serves **`/404.html` with a real HTTP 404** automatically,
  because `dist/404.html` sits at the output root.

**⚠️ Do NOT add `/* /index.html 200`.** This is a no-router, multi-entry static
site — an SPA catch-all would shadow the real routes and turn every bad URL into
the homepage with a 200 instead of the real 404 page. There is intentionally no
`_redirects` file.

## 3. `_headers` (already added at `public/_headers`)

Security headers + a 1-year immutable cache for the content-hashed `/assets/*`.
A Content-Security-Policy is included **commented out** — enable it only after the
first `.pages.dev` deploy confirms all 5 routes render with fonts (it already
allow-lists Google Fonts and `api.web3forms.com`). Non-hashed root files
(`og.png`, icons, `favicon.svg`, manifest, `sitemap.xml`, `robots.txt`) are left
on Cloudflare's default revalidating cache so redeploys are picked up.

---

## 4. Web3Forms — create the key + wire it (contact form backend)

1. Go to **https://web3forms.com** → create an access key (free). **Enter the
   inbox you want submissions delivered to.**
   - ⚠️ **Interim recipient (needs your call):** until `hello@preston-gray.com`
     forwarding is verified (§6), point the key at a **Gmail you definitely
     receive today**. Do NOT bind it to `hello@` until §6 passes a live test, or
     early enquiries bounce.
2. Locally: copy `.env.example` → `.env`, set `VITE_WEB3FORMS_KEY=<your key>`.
   (`.env` is gitignored; `.env.example` is committed as the template.)
3. In Cloudflare Pages → Settings → Environment variables, add
   `VITE_WEB3FORMS_KEY=<your key>` to **Production and Preview**, then redeploy.
4. The key is **public by design** (it ships in the client bundle) and only
   authorizes submissions to your inbox — this is expected and safe.

Spam mitigation: a honeypot (`botcheck`, dropped client-side + server-side) plus
Web3Forms' built-in filter. reCAPTCHA/hCaptcha can be added later if needed.

**Graceful degrade:** if the key is missing at runtime, the form skips the doomed
request and drops straight to the mailto fallback (nothing typed is lost).

---

## 5. Dashboard steps (in order)

1. **dash.cloudflare.com** → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**.
2. Authorize the Cloudflare GitHub app for **`wprestong-designs`** → select
   **`wprestong-designs/preston-gray-portfolio`** → **Begin setup**.
3. Set the build config from §1 (preset Vite, `npm run build`, output `dist`,
   production branch `main`) and add the env vars from §1/§4.
4. **Save and Deploy.** When the build finishes, open the generated
   `https://<project>.pages.dev` and smoke-test (see §7).
5. **Custom domains:** project → **Custom domains** → **Set up a custom domain**
   → `preston-gray.com`; repeat for `www.preston-gray.com`. Cloudflare
   auto-provisions SSL once DNS validates (see §6).
6. Only after apex + www serve over HTTPS and §7 passes → decommission Netlify (§8).

---

## 6. DNS + email — the domain is on WordPress.com, not Netlify

**Confirmed by live lookup:** registrar is **Automattic / WordPress.com** (expiry
2026-08-12), nameservers **`ns1/ns2/ns3.wordpress.com`**. Only the _records_ point
at Netlify today (apex `A 75.2.60.5`, `www CNAME → preston-gray-portfolio.netlify.app`).
So all DNS changes happen in the **WordPress.com** domain panel. **Confirm you
control that WordPress.com account and the domain is unlocked before touching
anything.**

### Path A — move nameservers to Cloudflare (RECOMMENDED)

The site's canonical is the **apex** (`https://preston-gray.com/`, matching
`<link rel="canonical">`, `og:url`, `sitemap.xml`, `robots.txt`). An apex can only
point cleanly at Pages via Cloudflare's **CNAME flattening**, which requires the
zone on Cloudflare. This keeps the canonical intact with **no code changes**.

1. Cloudflare → **Websites → Add a site** → `preston-gray.com` → Free plan →
   Cloudflare scans records and gives you **two nameservers** (`*.ns.cloudflare.com`).
2. At **WordPress.com**, change the domain's nameservers from `ns*.wordpress.com`
   to the two Cloudflare nameservers. Wait for activation (minutes–hours).
3. In the imported Cloudflare zone, **delete the leftover Netlify records**
   (apex `A 75.2.60.5`, `www CNAME → *.netlify.app`) if they were copied.
4. Pages → **Custom domains** → add `preston-gray.com` + `www.preston-gray.com`;
   Cloudflare auto-creates the records (apex via CNAME-flattening to
   `<project>.pages.dev`, `www` CNAME to it), proxied, SSL auto-issued.
5. SSL/TLS → enable **Always Use HTTPS**; add a `www → apex` redirect so
   everything lands on the canonical apex.

### Path B — records only, no nameserver move (fallback)

Cleanly covers **www** (replace the `www CNAME` at WordPress.com with
`<project>.pages.dev`) but **not the apex** — WordPress.com DNS has no ALIAS/ANAME
and Pages publishes no stable apex IPs for external domains. You'd have to forward
apex → `https://www.preston-gray.com/` and flip the canonical/og:url/sitemap to
**www** (a repo change). Only use if you can't move nameservers. **Path A is
strongly preferred.**

### Cloudflare Email Routing — `hello@preston-gray.com` → Gmail

(Requires Path A, i.e. the zone on Cloudflare.)
1. Cloudflare → select the `preston-gray.com` zone → **Email → Email Routing → Get started**.
2. **Destination addresses** → add your Gmail → open Cloudflare's verification
   email in Gmail and confirm. It must show **Verified**.
3. **Routes → Create address** → custom address `hello` → **Send to** your
   verified Gmail → Save.
4. Cloudflare adds the MX + SPF records automatically (if the zone is on
   Cloudflare): `MX @ route1/route2/route3.mx.cloudflare.net` + `TXT @ v=spf1
   include:_spf.mx.cloudflare.net ~all` (use the exact values the panel shows).
5. Send a test to `hello@` → confirm it lands in Gmail. **Only then** repoint the
   Web3Forms key (§4) at `hello@` if you want branded delivery.

---

## 7. Verify (on `.pages.dev` first, then the custom domain)

- [ ] `/`, `/work/`, `/small-business/`, `/colophon/` all render; `/styleguide/`
      loads (noindex, fine to leave reachable).
- [ ] Bad path (e.g. `/nope`) shows "PROOF NOT FOUND" **and returns HTTP 404**
      (`curl -I https://<host>/nope` → `HTTP/2 404`).
- [ ] **Contact form:** submit a real ticket → confirm it lands in the Web3Forms
      inbox. Then force the error path (temporarily unset the key) → confirm the
      mailto fallback appears with the message preserved.
- [ ] **OG unfurl:** paste `https://preston-gray.com/` into iMessage/Slack →
      card shows the registration image + title.
- [ ] `sitemap.xml` and `robots.txt` resolve over HTTPS.
- [ ] Console clean on every route; Lighthouse mobile spot-check.
- [ ] (If CSP enabled) all routes still render with fonts — no CSP console errors.

---

## 8. Decommission Netlify (LAST — only after §7 passes on the custom domain)

1. Confirm `preston-gray.com` + `www` serve from Cloudflare over HTTPS and the
   form + 404 + OG all pass on the **custom domain** (not just `.pages.dev`).
2. Netlify dashboard → the `preston-gray-portfolio` site → **Site settings →
   Danger zone → Delete site** (or just "Stop builds / unpublish" first if you
   want a grace period). The domain is **not** registered through Netlify, so
   deleting the site does not touch the domain.
3. Remove any leftover Netlify DNS records in Cloudflare (should already be gone
   from §6 step 3).

---

## 9. Bandwidth diet (videos) — see `docs/video-diet-20260705.md`

Re-encoded the shipped scroll clips (audio stripped, downscaled to displayed
width, VP9/H.264 capped) and pruned 5 orphaned clips. The territory-map clip that
looked like the biggest lever was already unwired (never shipped) — logged there.

---

## 10. MERGE CHECKLIST — do these IN ORDER before/at merge to `main`

> Merging `main` is what triggers Cloudflare's **production build**, and Vite
> **inlines `VITE_WEB3FORMS_KEY` at build time**. So the env var must already
> exist in Cloudflare Pages Production **before that build runs** — otherwise the
> deployed bundle ships with the key `undefined` and **the live form silently
> falls back to mailto** until the next rebuild.

### Gate 1 (BLOCKING) — set the Web3Forms key in Cloudflare Pages BEFORE merging
1. **dash.cloudflare.com → Workers & Pages →** the `preston-gray-portfolio` Pages
   project **→ Settings → Environment variables and secrets**.
2. Under **Production**, **Add variable**: Name `VITE_WEB3FORMS_KEY`, Value
   `8d71b09a-988c-4ec2-8c6f-3cbf7ff740c0` (or, later, your rotated key). **Save.**
   (Add it under **Preview** too if you want preview deploys to have a working form.)
3. Also confirm `NODE_VERSION` = `22.13.0` is set for Production (§1).
4. **Verify the value stuck** before merging — a build that ran before this was
   set will NOT pick it up retroactively; you'd need to re-deploy after setting it.

### ⚠ Gate 2 — email recipient sanity
The Web3Forms key currently delivers to **Preston's Gmail** (interim). Only
repoint delivery to `hello@preston-gray.com` after Cloudflare Email Routing is
verified (§6) — do not flip it as part of the merge.

### Gate 3 — merge + first production build
5. Merge the branch to `main` (Preston's action). Cloudflare auto-builds `main`.
6. On the resulting deployment, run the full §7 verification on the **custom
   domain**, and specifically **submit a real ticket and confirm it arrives in the
   Gmail inbox** (not the mailto fallback). If it falls back to mailto, Gate 1 was
   missed — set the env var and re-deploy.

### Gate 4 — after live + green
7. Decommission Netlify (§8). Then optionally repoint email to `hello@` (§6).
