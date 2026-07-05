/*
 * Analytics stub (§H) — Plausible, privacy-friendly (no cookies, GDPR-safe),
 * behind an env flag, DEFAULT OFF. Nothing loads unless VITE_ANALYTICS is
 * explicitly set at build time.
 *
 * To turn ON (Preston's action):
 *   1. Create a Plausible account + add the site `preston-gray.com`.
 *   2. In Netlify → Site config → Environment variables, set
 *      VITE_ANALYTICS = plausible  (production context).
 *   3. Redeploy. The script tag below then loads on every route.
 * No account exists yet — this ships dormant.
 */
export function initAnalytics() {
  if (import.meta.env.VITE_ANALYTICS !== 'plausible') return
  const s = document.createElement('script')
  s.defer = true
  s.setAttribute('data-domain', 'preston-gray.com')
  s.src = 'https://plausible.io/js/script.js'
  document.head.appendChild(s)
}
