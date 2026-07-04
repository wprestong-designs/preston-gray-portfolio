import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Three static entries, no router (Phase-1 decision stands):
      // the poster at /, the work index at /work/, and the
      // owner-facing services page at /small-business/ (P7). Plus the
      // dev-only /styleguide/ route (noindex) — the design-system proof
      // sheet; kept a build input so it compiles under CI.
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        work: fileURLToPath(new URL('./work/index.html', import.meta.url)),
        smallBusiness: fileURLToPath(
          new URL('./small-business/index.html', import.meta.url),
        ),
        styleguide: fileURLToPath(
          new URL('./styleguide/index.html', import.meta.url),
        ),
      },
    },
  },
})
