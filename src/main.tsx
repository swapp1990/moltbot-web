import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Remove loading placeholder after React mounts
const placeholder = document.querySelector('.loading-placeholder')
if (placeholder) {
  placeholder.remove()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
