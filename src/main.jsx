import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initAnalytics } from './analytics.js'

// §H: privacy-friendly analytics, DEFAULT OFF (no-op unless VITE_ANALYTICS set).
initAnalytics()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
