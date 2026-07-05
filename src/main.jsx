import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initAnalytics } from './analytics.js'
import { initCircleCursor } from './cursor.js'

// §H: privacy-friendly analytics, DEFAULT OFF (no-op unless VITE_ANALYTICS set).
initAnalytics()
// A-pass: site-wide desktop-only circle cursor (no-op on touch / reduced-motion).
initCircleCursor()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
