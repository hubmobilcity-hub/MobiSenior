// ─────────────────────────────────────────────────────────
//  ElevenLabs TTS
//  Voz cálida en español para Mobi
// ─────────────────────────────────────────────────────────

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY as string
const VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID as string

let currentAudio: HTMLAudioElement | null = null

export async function speakText(text: string): Promise<void> {
  if (!ELEVENLABS_API_KEY || !VOICE_ID) {
    console.warn('[TTS] Missing ElevenLabs env vars — using browser fallback')
    return speakBrowserFallback(text)
  }

  // Stop any ongoing speech
  stopSpeaking()

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.65,
            similarity_boost: 0.80,
            style: 0.20,
            use_speaker_boost: true,
          },
        }),
      }
    )

    if (!response.ok) {
      console.warn('[TTS] ElevenLabs error, using browser fallback')
      return speakBrowserFallback(text)
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    currentAudio = new Audio(url)
    currentAudio.onended = () => URL.revokeObjectURL(url)
    await currentAudio.play()
  } catch (err) {
    console.warn('[TTS] Error:', err, '— using browser fallback')
    return speakBrowserFallback(text)
  }
}

export function stopSpeaking(): void {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
  // Also stop browser speech synthesis if active
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

export function isSpeaking(): boolean {
  return (
    (currentAudio !== null && !currentAudio.paused) ||
    ('speechSynthesis' in window && window.speechSynthesis.speaking)
  )
}

// ── Browser fallback (sin coste) ──────────────────────────
function speakBrowserFallback(text: string): void {
  if (!('speechSynthesis' in window)) return

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'es-ES'
  utterance.rate = 0.85  // Más lento para personas mayores
  utterance.pitch = 1.0
  utterance.volume = 1.0

  // Prefer a Spanish voice if available
  const voices = window.speechSynthesis.getVoices()
  const spanishVoice = voices.find(
    (v) => v.lang.startsWith('es') && !v.name.includes('Google')
  ) ?? voices.find((v) => v.lang.startsWith('es'))

  if (spanishVoice) utterance.voice = spanishVoice
  window.speechSynthesis.speak(utterance)
}
