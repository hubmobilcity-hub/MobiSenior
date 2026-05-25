// ─────────────────────────────────────────────────────────
//  Web Speech API — Speech to Text
//  Entrada de voz nativa, sin coste
// ─────────────────────────────────────────────────────────

export interface SpeechOptions {
  onResult: (transcript: string, isFinal: boolean) => void
  onError?: (error: string) => void
  onEnd?: () => void
  continuous?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let recognition: any = null

export function isSTTSupported(): boolean {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
}

export function startListening(options: SpeechOptions): void {
  if (!isSTTSupported()) {
    options.onError?.('El reconocimiento de voz no está disponible en este navegador.')
    return
  }

  stopListening()

  const SpeechRecognitionAPI =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

  recognition = new SpeechRecognitionAPI()
  recognition!.lang = 'es-ES'
  recognition!.continuous = options.continuous ?? false
  recognition!.interimResults = true
  recognition!.maxAlternatives = 1

  recognition!.onresult = (event: SpeechRecognitionEvent) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i]
      const transcript = result[0].transcript.trim()
      options.onResult(transcript, result.isFinal)
    }
  }

  recognition!.onerror = (event: SpeechRecognitionErrorEvent) => {
    const messages: Record<string, string> = {
      'not-allowed':    'Permiso de micrófono denegado.',
      'no-speech':      'No se detectó voz. Intenta de nuevo.',
      'audio-capture':  'No se encontró micrófono.',
      'network':        'Error de red al reconocer voz.',
      'aborted':        '',
    }
    const msg = messages[event.error] ?? `Error de voz: ${event.error}`
    if (msg) options.onError?.(msg)
  }

  recognition!.onend = () => {
    options.onEnd?.()
  }

  recognition!.start()
}

export function stopListening(): void {
  if (recognition) {
    recognition.abort()
    recognition = null
  }
}

export function isListening(): boolean {
  return recognition !== null
}
