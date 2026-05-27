import { HAPTIC } from '../lib/haptic'
import type { Screen } from '../types'

interface HomeScreenProps {
  nombreUsuario: string
  onNavigate: (screen: Screen) => void
}

const buttons = [
  {
    id: 'mobi' as Screen,
    label: 'Mobi',
    emoji: null as string | null,
    image: '/Mobisenior_avatar.svg',
    description: 'Tu asistente',
    className: 'btn-mobi',
  },
  {
    id: 'salud' as Screen,
    label: 'Salud',
    emoji: '💊' as string | null,
    image: null as string | null,
    description: 'Citas y pastillas',
    className: 'btn-salud',
  },
  {
    id: 'familia' as Screen,
    label: 'Familia',
    emoji: '👨‍👩‍👧' as string | null,
    image: null as string | null,
    description: 'Fotos y mensajes',
    className: 'btn-familia',
  },
  {
    id: 'ayuda' as Screen,
    label: 'Ayuda',
    emoji: '🆘' as string | null,
    image: null as string | null,
    description: 'Llama al socorro',
    className: 'btn-ayuda',
  },
]

export function HomeScreen({ nombreUsuario, onNavigate }: HomeScreenProps) {
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches'

  function handlePress(screen: Screen) {
    HAPTIC.tap()
    onNavigate(screen)
  }

  return (
    <div className="screen-enter flex flex-col h-full bg-[var(--bg)]">
      {/* Header */}
      <header className="flex flex-col items-center pt-8 pb-6 px-6">
        <img
          src="/Mobisenior_avatar.svg"
          alt="Mobi"
          className="w-16 h-16 mb-4"
          style={{ objectFit: 'contain' }}
        />
        <p className="text-[var(--fg-3)] text-xl">{greeting},</p>
        <h1
          className="text-4xl font-black text-[var(--brand-primary)] leading-tight"
          style={{ letterSpacing: '-0.02em' }}
        >
          {nombreUsuario}
        </h1>
      </header>

      {/* 4 Botones — cuadrícula 2×2 */}
      <main className="flex-1 grid grid-cols-2 gap-4 px-4 pb-6">
        {buttons.map((btn) => (
          <button
            key={btn.id}
            className={`btn-senior ${btn.className}`}
            onClick={() => handlePress(btn.id)}
            aria-label={`${btn.label} — ${btn.description}`}
          >
            {btn.image
              ? <img src={btn.image} alt={btn.label} className="w-12 h-12" style={{ objectFit: 'contain' }} aria-hidden="true" />
              : <span className="text-5xl leading-none" aria-hidden="true">{btn.emoji}</span>
            }
            <span className="font-black tracking-tight">
              {btn.label}
            </span>
            <span
              className="text-base font-medium opacity-80 leading-tight text-center px-2"
              style={{ fontSize: '16px' }}
            >
              {btn.description}
            </span>
          </button>
        ))}
      </main>

      {/* Footer */}
      <footer className="text-center pb-6 text-[var(--fg-3)]" style={{ fontSize: '16px' }}>
        MobiSenior · Mobilcity Hub
      </footer>
    </div>
  )
}
