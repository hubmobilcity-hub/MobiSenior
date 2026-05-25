import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

type Rol = 'familia' | 'institucion'
type FormState = 'idle' | 'loading' | 'success' | 'error'

export function LandingPage() {
  const [email, setEmail] = useState('')
  const [rol, setRol] = useState<Rol>('familia')
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const waitlistRef = useRef<HTMLElement>(null)

  useEffect(() => {
    document.body.style.overflowY = 'auto'
    document.body.style.height = 'auto'
    return () => {
      document.body.style.overflowY = ''
      document.body.style.height = ''
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setErrorMsg('Por favor introduce un email válido.')
      return
    }
    setFormState('loading')
    setErrorMsg('')

    const { error } = await supabase
      .from('lista_espera')
      .insert({ email: email.trim().toLowerCase(), rol, created_at: new Date().toISOString() })

    if (error) {
      if (error.code === '23505') {
        setFormState('success')
      } else {
        setFormState('error')
        setErrorMsg('Algo salió mal. Inténtalo de nuevo.')
      }
    } else {
      setFormState('success')
    }
  }

  function scrollToWaitlist() {
    waitlistRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div style={{ fontFamily: "'Afacad Flux', system-ui, sans-serif", color: '#0e1422', background: '#f4f6fa' }}>

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e8ecf3', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #125491, #389ecf)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🤖</div>
            <span style={{ fontWeight: 800, fontSize: 20, color: '#125491' }}>MobiSenior</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <a href="#como-funciona" style={{ color: '#2674a5', textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>Cómo funciona</a>
            <a href="#para-quien" style={{ color: '#2674a5', textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>Para quién</a>
            <button
              onClick={scrollToWaitlist}
              style={{ background: '#125491', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 20px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
            >
              Unirse a la lista
            </button>
            <a
              href="/app"
              style={{ color: '#2674a5', textDecoration: 'none', fontWeight: 600, fontSize: 15, padding: '8px 12px' }}
            >
              Abrir app →
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(150deg, #0a3361 0%, #125491 50%, #389ecf 100%)', color: '#fff', padding: '80px 24px 100px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 999, padding: '6px 16px', fontSize: 14, fontWeight: 600, marginBottom: 24, backdropFilter: 'blur(8px)' }}>
            <span>🚀</span> Fase de validación con usuarios reales
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-1px' }}>
            Tu familiar mayor,<br />
            <span style={{ color: '#7dd3fc' }}>siempre acompañado</span>
          </h1>
          <p style={{ fontSize: 'clamp(17px, 2.5vw, 22px)', color: 'rgba(255,255,255,0.85)', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.6 }}>
            Mobi es el asistente de IA que habla con tus mayores cada día, recuerda sus medicaciones, detecta emergencias y mantiene a la familia siempre informada.
          </p>

          {/* Hero CTA buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
            <button
              onClick={scrollToWaitlist}
              style={{ background: '#fff', color: '#125491', border: 'none', borderRadius: 14, padding: '16px 32px', fontWeight: 800, fontSize: 18, cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
            >
              Quiero acceso anticipado →
            </button>
            <a
              href="#como-funciona"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '2px solid rgba(255,255,255,0.3)', borderRadius: 14, padding: '16px 32px', fontWeight: 700, fontSize: 18, textDecoration: 'none', backdropFilter: 'blur(8px)' }}
            >
              Ver cómo funciona
            </a>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { num: '4', label: 'módulos integrados' },
              { num: '24/7', label: 'asistencia continua' },
              { num: '0€', label: 'para el usuario final' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: '#7dd3fc' }}>{s.num}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────── */}
      <section id="como-funciona" style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#389ecf', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>4 módulos, una sola app</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#0a3361', marginBottom: 16 }}>Todo lo que tu familiar necesita</h2>
            <p style={{ fontSize: 18, color: '#636d7e', maxWidth: 560, margin: '0 auto' }}>
              Interfaz diseñada para mayores: botones grandes, voz natural y sin complicaciones.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              {
                color: '#125491', shadow: 'rgba(18,84,145,0.25)', emoji: '🤖',
                title: 'Mobi Chat',
                desc: 'Conversaciones naturales con IA. Mobi recuerda el historial, detecta el estado emocional y responde con empatía las 24 horas.',
              },
              {
                color: '#2d9e5f', shadow: 'rgba(45,158,95,0.25)', emoji: '💊',
                title: 'Salud',
                desc: 'Gestión de medicaciones, recordatorios automáticos y digitalización de citas médicas con foto. Sin papel, sin olvidos.',
              },
              {
                color: '#e8a020', shadow: 'rgba(232,160,32,0.25)', emoji: '👨‍👩‍👧',
                title: 'Familia',
                desc: 'Canal directo con los hijos. Fotos, mensajes y actualizaciones del estado de bienestar, siempre accesibles para toda la familia.',
              },
              {
                color: '#d93025', shadow: 'rgba(217,48,37,0.25)', emoji: '🆘',
                title: 'Ayuda',
                desc: 'Botón SOS con un toque. Notificación instantánea a contactos de emergencia vía WhatsApp con localización incluida.',
              },
            ].map(f => (
              <div
                key={f.title}
                style={{ background: '#fff', borderRadius: 24, padding: '32px 28px', border: '2px solid #e8ecf3', boxShadow: `0 8px 32px ${f.shadow}`, transition: 'transform 0.2s', cursor: 'default' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = '')}
              >
                <div style={{ width: 64, height: 64, borderRadius: 16, background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 20, boxShadow: `0 6px 16px ${f.shadow}` }}>
                  {f.emoji}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: f.color, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 16, color: '#636d7e', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA QUIÉN ──────────────────────────────────── */}
      <section id="para-quien" style={{ padding: '80px 24px', background: '#f4f6fa' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#389ecf', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Para quién es</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#0a3361' }}>Diseñado para dos realidades</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 32 }}>

            {/* Familias */}
            <div style={{ background: '#fff', borderRadius: 28, padding: '40px 36px', boxShadow: '0 8px 32px rgba(18,84,145,0.10)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>👨‍👩‍👧‍👦</div>
              <h3 style={{ fontSize: 26, fontWeight: 900, color: '#125491', marginBottom: 12 }}>Para familias</h3>
              <p style={{ fontSize: 17, color: '#636d7e', lineHeight: 1.7, marginBottom: 24 }}>
                Sabes que tu madre o padre está solo gran parte del día. Con MobiSenior, Mobi le hace compañía, le recuerda tomar la pastilla y tú recibes un aviso si algo va mal.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Tranquilidad real sin depender de visitas constantes',
                  'Alertas inmediatas ante emergencias o caídas',
                  'Historial de bienestar y conversaciones',
                  'Fácil de usar para el mayor desde el primer día',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 16, color: '#2f3849' }}>
                    <span style={{ color: '#2d9e5f', fontSize: 18, flexShrink: 0, marginTop: 1 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instituciones */}
            <div style={{ background: 'linear-gradient(135deg, #0a3361, #125491)', borderRadius: 28, padding: '40px 36px', color: '#fff', boxShadow: '0 8px 32px rgba(18,84,145,0.30)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏛️</div>
              <h3 style={{ fontSize: 26, fontWeight: 900, color: '#7dd3fc', marginBottom: 12 }}>Para instituciones</h3>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 24 }}>
                Ayuntamientos, servicios sociales y residencias que quieren modernizar la atención a mayores con una solución escalable, sin infraestructura propia y con impacto medible.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Despliegue municipal sin coste para el usuario',
                  'Dashboard de seguimiento de bienestar',
                  'Integración con servicios de emergencias existentes',
                  'Métricas de impacto social para justificación de inversión',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 16, color: 'rgba(255,255,255,0.9)' }}>
                    <span style={{ color: '#7dd3fc', fontSize: 18, flexShrink: 0, marginTop: 1 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA TECH ──────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#389ecf', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Tecnología</div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 900, color: '#0a3361', marginBottom: 16 }}>
            IA avanzada, interfaz sencilla
          </h2>
          <p style={{ fontSize: 18, color: '#636d7e', maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.7 }}>
            MobiSenior usa Claude AI (Anthropic) para entender y responder con contexto real, ElevenLabs para voz natural en español, y Supabase para guardar el historial de forma segura.
          </p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { emoji: '🧠', label: 'Claude AI', sub: 'Comprensión contextual' },
              { emoji: '🎙️', label: 'Voz natural', sub: 'Síntesis en español' },
              { emoji: '🔒', label: 'Datos seguros', sub: 'GDPR compliant' },
              { emoji: '📱', label: 'PWA', sub: 'Sin instalar nada' },
            ].map(t => (
              <div key={t.label} style={{ background: '#f4f6fa', borderRadius: 16, padding: '20px 24px', minWidth: 140, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{t.emoji}</div>
                <div style={{ fontWeight: 800, color: '#125491', fontSize: 16 }}>{t.label}</div>
                <div style={{ fontSize: 13, color: '#636d7e', marginTop: 4 }}>{t.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAITLIST ────────────────────────────────────── */}
      <section ref={waitlistRef} id="waitlist" style={{ padding: '80px 24px', background: 'linear-gradient(150deg, #0a3361 0%, #125491 60%, #1a6bb5 100%)' }}>
        <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#fff', marginBottom: 16 }}>
            Únete a la lista de espera
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', marginBottom: 40, lineHeight: 1.6 }}>
            Estamos en fase de validación. Regístrate y te avisamos cuando abramos acceso en tu municipio o para tu institución.
          </p>

          {formState === 'success' ? (
            <div style={{ background: 'rgba(45,158,95,0.25)', border: '2px solid rgba(45,158,95,0.5)', borderRadius: 20, padding: '32px', backdropFilter: 'blur(8px)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>¡Apuntado con éxito!</h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, margin: 0 }}>
                Te avisaremos cuando lancemos en tu zona. Mientras tanto, comparte MobiSenior con quien creas que lo puede necesitar.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Rol selector */}
              <div style={{ display: 'flex', gap: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 6 }}>
                {[
                  { value: 'familia' as Rol, label: '👨‍👩‍👧 Soy familiar de un mayor' },
                  { value: 'institucion' as Rol, label: '🏛️ Represento una institución' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRol(opt.value)}
                    style={{
                      flex: 1, padding: '12px 8px', borderRadius: 10, border: 'none', cursor: 'pointer',
                      fontSize: 14, fontWeight: 700, transition: 'all 0.15s',
                      background: rol === opt.value ? '#fff' : 'transparent',
                      color: rol === opt.value ? '#125491' : 'rgba(255,255,255,0.75)',
                      boxShadow: rol === opt.value ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Email input */}
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                style={{
                  padding: '16px 20px', borderRadius: 14, border: '2px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 18,
                  outline: 'none', backdropFilter: 'blur(8px)',
                  fontFamily: 'inherit',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.2)')}
              />

              {errorMsg && (
                <div style={{ background: 'rgba(217,48,37,0.25)', borderRadius: 10, padding: '10px 16px', color: '#fff', fontSize: 15 }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={formState === 'loading'}
                style={{
                  padding: '18px 32px', borderRadius: 14, border: 'none',
                  background: formState === 'loading' ? 'rgba(255,255,255,0.5)' : '#fff',
                  color: '#125491', fontSize: 18, fontWeight: 800, cursor: formState === 'loading' ? 'default' : 'pointer',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)', transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                {formState === 'loading' ? 'Guardando...' : 'Quiero acceso anticipado →'}
              </button>

              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                Sin spam. Puedes darte de baja cuando quieras.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer style={{ background: '#0a1e38', color: 'rgba(255,255,255,0.6)', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #125491, #389ecf)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
            <span style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>MobiSenior</span>
          </div>
          <p style={{ fontSize: 14, margin: '0 0 16px' }}>
            Un producto de <a href="https://mobilcity.es" style={{ color: '#389ecf', textDecoration: 'none' }}>Mobilcity Hub</a>
          </p>
          <p style={{ fontSize: 13, margin: 0 }}>
            © {new Date().getFullYear()} MobiSenior · <a href="mailto:hubmobilcity@gmail.com" style={{ color: '#389ecf', textDecoration: 'none' }}>hubmobilcity@gmail.com</a>
          </p>
        </div>
      </footer>

    </div>
  )
}
