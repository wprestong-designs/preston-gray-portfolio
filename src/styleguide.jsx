/* /styleguide/ entry — mounts the design-system proof sheet. */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styleguide.css'
import Styleguide from './components/Styleguide.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Styleguide />
  </StrictMode>,
)
