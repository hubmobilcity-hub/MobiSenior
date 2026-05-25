// ─────────────────────────────────────────────────────────
//  Placeholder screens para módulos de sprint 2+
// ─────────────────────────────────────────────────────────

interface PlaceholderProps {
  title: string
  color: string
  emoji: string
  description: string
  onBack: () => void
}

export function PlaceholderScreen({
  title,
  color,
  emoji,
  description,
  onBack,
}: PlaceholderProps) {
  return (
    <div className="screen-enter flex flex-col items-center justify-center h-full p-8 text-center gap-6">
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl"
        style={{ background: color, boxShadow: `0 8px 24px ${color}55` }}
      >
        {emoji}
      </div>
      <h1 className="text-4xl font-black" style={{ color }}>
        {title}
      </h1>
      <p className="text-xl text-gray-500 max-w-xs">{description}</p>
      <button
        onClick={onBack}
        className="mt-4 px-8 py-4 rounded-pill text-white text-xl font-bold"
        style={{ background: color }}
      >
        ← Volver
      </button>
    </div>
  )
}

export function SaludScreen({ onBack }: { onBack: () => void }) {
  return (
    <PlaceholderScreen
      title="Salud"
      color="#2d9e5f"
      emoji="💊"
      description="Medicación, citas y recordatorios. Próximamente disponible."
      onBack={onBack}
    />
  )
}

export function FamiliaScreen({ onBack }: { onBack: () => void }) {
  return (
    <PlaceholderScreen
      title="Familia"
      color="#e8a020"
      emoji="👨‍👩‍👧"
      description="Fotos y mensajes de tu familia. Próximamente disponible."
      onBack={onBack}
    />
  )
}

export function AyudaScreen({ onBack }: { onBack: () => void }) {
  return (
    <PlaceholderScreen
      title="Ayuda"
      color="#d93025"
      emoji="🚨"
      description="Sistema de emergencias SOS. Próximamente disponible."
      onBack={onBack}
    />
  )
}
