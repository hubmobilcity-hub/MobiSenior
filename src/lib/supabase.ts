import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Missing env vars: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
}

// ÚNICA instancia de createClient en todo el proyecto — regla crítica
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Types ──────────────────────────────────────────────────

export interface Usuario {
  id: string
  nombre: string
  fecha_nacimiento?: string
  telefono?: string
  contacto_emergencia?: string
  creado_en?: string
}

export interface Conversacion {
  id?: string
  usuario_id: string
  rol: 'user' | 'assistant'
  contenido: string
  timestamp?: string
}

export interface Cita {
  id?: string
  usuario_id: string
  fecha_cita: string
  especialista: string
  centro: string
  instrucciones?: string
  imagen_url?: string
  recordatorios_enviados?: number
  creado_en?: string
}

export interface Medicacion {
  id?: string
  usuario_id: string
  nombre: string
  dosis?: string
  horarios: string[]
  activo?: boolean
}

export interface AlertaSOS {
  id?: string
  usuario_id: string
  timestamp?: string
  confirmado?: boolean
  notificado?: boolean
}
