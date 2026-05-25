import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LandingPage } from './components/LandingPage.tsx'

const path = window.location.pathname

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    {path.startsWith('/app') ? <App /> : <LandingPage />}
  </StrictMode>,
)
