// ─────────────────────────────────────────────────────────
//  MobiSenior — Shared Types
// ─────────────────────────────────────────────────────────

export type Screen = 'home' | 'mobi' | 'salud' | 'familia' | 'ayuda'

export interface AppState {
  screen: Screen
  usuarioId: string
  nombreUsuario: string
}

export type { Usuario, Conversacion, Cita, Medicacion, AlertaSOS } from '../lib/supabase'
