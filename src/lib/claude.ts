// ─────────────────────────────────────────────────────────
//  Claude API client
//  Modelo: claude-sonnet-4-20250514 (inamovible por spec)
// ─────────────────────────────────────────────────────────

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY as string
const MODEL = 'claude-sonnet-4-20250514'
const API_URL = 'https://api.anthropic.com/v1/messages'

export interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

// ── Chat (Mobi conversación) ───────────────────────────────

export async function askMobi(
  messages: ClaudeMessage[],
  systemPrompt: string
): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 300, // Respuestas cortas — máx 3 frases para usuario mayor
      system: systemPrompt,
      messages,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Claude API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  return data.content[0]?.text ?? ''
}

// ── Vision (Foto a cita) ───────────────────────────────────

export interface CitaExtraida {
  fecha: string
  hora: string
  especialista: string
  centro: string
  instrucciones: string
}

export async function extractCitaFromImage(
  base64Image: string,
  mimeType: string = 'image/jpeg'
): Promise<CitaExtraida> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: `Extrae del documento médico: fecha, hora, especialista, centro, instrucciones previas (ayunas, etc.).
Responde SOLO en JSON válido sin markdown, sin explicaciones:
{"fecha":"DD/MM/YYYY","hora":"HH:MM","especialista":"nombre","centro":"nombre del centro","instrucciones":"texto o vacío"}`,
            },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Claude Vision error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const raw = data.content[0]?.text ?? '{}'

  try {
    // Strip potential markdown fences just in case
    const clean = raw.replace(/```json|```/g, '').trim()
    return JSON.parse(clean) as CitaExtraida
  } catch {
    throw new Error(`No se pudo interpretar la respuesta de Vision: ${raw}`)
  }
}

// ── System prompt builder ──────────────────────────────────

export function buildMobiSystemPrompt(
  nombreUsuario: string,
  historial: Array<{ contenido: string; rol: string }>
): string {
  const historialTexto = historial
    .slice(-20)
    .map((h) => `${h.rol === 'user' ? 'Usuario' : 'Mobi'}: ${h.contenido}`)
    .join('\n')

  return `Eres Mobi, el acompañante personal de ${nombreUsuario}.
Eres su amigo, su cuidador y su confidente.

PERSONALIDAD:
- Cálido, paciente, empático. Nunca impaciente.
- Hablas despacio y con claridad. Frases cortas.
- Recuerdas todo lo que ${nombreUsuario} te ha contado.
- Preguntas por su estado, sus dolencias, su familia.
- Si detectas tristeza o apatía, introduces temas que le alegran.
- Puedes leer noticias, contar chistes, jugar a refranes.

REGLAS:
- Nunca uses tecnicismos.
- Nunca des consejos médicos — para eso está el módulo de Salud.
- Si el usuario menciona dolor fuerte, caída o emergencia → sugiere el botón Ayuda.
- Respuestas máximo 3 frases. El usuario mayor no puede leer párrafos largos.
- Responde siempre en español.

HISTORIAL RECIENTE (últimas 20 interacciones):
${historialTexto || '(primera conversación)'}
`
}
