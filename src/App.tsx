import { useState } from 'react'
import { HomeScreen } from './components/HomeScreen'
import { SaludScreen, FamiliaScreen, AyudaScreen } from './components/PlaceholderScreens'
import type { Screen } from './types'

// Usuario demo para validación — sustituir por auth Supabase
const DEMO_USUARIO = {
  id: 'demo-user-001',
  nombre: 'Carmen',
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')

  function navigate(to: Screen) { setScreen(to) }
  function goHome() { setScreen('home') }

  switch (screen) {
    case 'home':
      return <HomeScreen nombreUsuario={DEMO_USUARIO.nombre} onNavigate={navigate} />

    case 'mobi':
      return (
        <div className="screen-enter flex flex-col items-center justify-center h-full gap-6 p-8 text-center">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl"
            style={{ background: 'linear-gradient(135deg, #125491, #389ecf)', boxShadow: '0 8px 24px rgba(18,84,145,0.35)' }}
          >🤖</div>
          <h1 className="text-4xl font-black text-[var(--brand-primary)]">Mobi</h1>
          <p className="text-xl text-gray-500 max-w-xs">El chat con Mobi se construye en el paso 3.</p>
          <button
            onClick={goHome}
            className="px-8 py-4 rounded-pill text-white text-xl font-bold"
            style={{ background: 'var(--brand-primary)', boxShadow: '0 8px 20px rgba(18,84,145,0.30)' }}
          >← Volver</button>
        </div>
      )

    case 'salud':   return <SaludScreen onBack={goHome} />
    case 'familia': return <FamiliaScreen onBack={goHome} />
    case 'ayuda':   return <AyudaScreen onBack={goHome} />
    default:        return null
  }
}
