# CONTEXT_MobiSenior.md
> Documento de arranque para desarrollo en proyecto Claude independiente.  
> Arquitecto: Roberto — Mobilcity Hub · hub@mobilcity.es

---

## 1. Qué es MobiSenior

PWA diseñada para personas mayores. Interfaz de 4 botones grandes, accesible, con navegación por voz y texto. El núcleo es **Mobi**, un asistente IA con memoria persistente que actúa como acompañante, amigo y cuidador del anciano.

**Objetivo inmediato:** validar con ancianos reales esta semana.  
**Objetivo estratégico:** presentar a la Concejalía de Asuntos Sociales del Ayuntamiento de Laredo.

---

## 2. Stack (inamovible)

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| IA conversacional | Claude API — Sonnet (claude-sonnet-4-20250514) |
| IA visión (OCR) | Claude API — Vision (mismo modelo) |
| Voz entrada | Web Speech API (nativa, sin coste) |
| Voz salida | ElevenLabs TTS |
| Backend / automación | n8n self-hosted |
| Base de datos | Supabase |
| Servidor | Hetzner CPX21 · Docker · puerto 3007 |
| Subdominio | mobisenior.mobilcity.es |
| Alertas SOS | n8n → WhatsApp (número validación: 691 025 645) |
| Notificaciones | Telegram Bot (chat ID: 7586872984) |

---

## 3. Interfaz: La Regla de los 4 Botones

Pantalla principal: cuadrícula 2×2, botones enormes, alto contraste, icono + texto grande.

| Botón | Color | Icono | Función |
|-------|-------|-------|---------|
| **Mobi** | Azul (`--brand-primary`) | Robot / chat | Conversación con IA |
| **Salud** | Verde (`#2d9e5f`) | Corazón / pastilla | Medicación y citas |
| **Familia** | Amarillo (`#e8a020`) | Personas | Comunicación familiar |
| **Ayuda** | Rojo (`#d93025`) | SOS / campana | Emergencia |

**Reglas de accesibilidad obligatorias:**
- Fuente mínima 24px en botones, 18px en el resto
- Botones mínimo 120×120px, mejor 160×160px
- Vibración háptica en cada pulsación (`navigator.vibrate(50)`)
- Todo navegable por voz (Web Speech API)
- Confirmación por voz antes de acciones críticas (SOS)

---

## 4. Módulo MOBI — Conversación

### Flujo
1. Usuario pulsa botón Mobi → pantalla de chat full-screen
2. Puede escribir texto O pulsar micrófono (Web Speech API → texto)
3. Mensaje va a Claude API con system prompt de Mobi Senior
4. Respuesta se muestra en pantalla Y se lee en voz alta (ElevenLabs)
5. Historial guardado en Supabase por `usuario_id`

### System prompt de Mobi Senior
```
Eres Mobi, el acompañante personal de [NOMBRE_USUARIO]. 
Eres su amigo, su cuidador y su confidente.

PERSONALIDAD:
- Cálido, paciente, empático. Nunca impaciente.
- Hablas despacio y con claridad. Frases cortas.
- Recuerdas todo lo que [NOMBRE_USUARIO] te ha contado.
- Preguntas por su estado, sus dolencias, su familia.
- Si detectas tristeza o apatía, introduces temas que le alegran.
- Puedes leer noticias, contar chistes, jugar a refranes, poner música.

REGLAS:
- Nunca uses tecnicismos.
- Nunca des consejos médicos — para eso está el módulo de Salud.
- Si el usuario menciona dolor fuerte, caída o emergencia → sugiere el botón Ayuda.
- Respuestas máximo 3 frases. El usuario mayor no puede leer párrafos largos.

CONTEXTO DEL USUARIO:
[HISTORIAL_RECIENTE — últimas 20 interacciones desde Supabase]
```

### Memoria persistente
- Tabla `conversaciones` en Supabase
- Se inyectan las últimas 20 interacciones en cada llamada a Claude
- Se guardan: `usuario_id`, `rol` (user/assistant), `contenido`, `timestamp`

---

## 5. Módulo SALUD

### Funcionalidades
1. **Control de medicación** — el cuidador configura pastillas + horarios; Mobi avisa por voz
2. **Foto a cita** — usuario fotografía volante médico; Claude Vision extrae datos; se agenda recordatorio

### Flujo "Foto a cita"
1. Usuario pulsa Salud → opción "Tengo una cita"
2. Abre cámara nativa (`<input type="file" capture="environment">`)
3. Imagen → Claude API Vision con prompt:
   ```
   Extrae del documento médico: fecha, hora, especialista, centro, instrucciones previas (ayunas, etc.).
   Responde SOLO en JSON: { fecha, hora, especialista, centro, instrucciones }
   ```
4. Claude devuelve JSON → se muestra resumen al usuario con confirmación por voz
5. Se guarda en tabla `citas` de Supabase
6. n8n programa recordatorios: 48h, 24h y 3h antes → notificación push + voz

### Flujo medicación
- Cuidador configura en panel (fase posterior) o Roberto lo configura manualmente en Supabase
- n8n Schedule trigger → a la hora programada → webhook → PWA muestra alerta + Mobi habla

### Tablas Supabase (Salud)
```sql
citas (
  id uuid primary key,
  usuario_id uuid references usuarios(id),
  fecha_cita timestamptz,
  especialista text,
  centro text,
  instrucciones text,
  imagen_url text,
  creado_en timestamptz default now()
)

medicacion (
  id uuid primary key,
  usuario_id uuid references usuarios(id),
  nombre text,
  dosis text,
  horarios text[], -- ['08:00', '14:00', '22:00']
  activo boolean default true
)
```

---

## 6. Módulo AYUDA (SOS)

### Flujo
1. Usuario pulsa botón Ayuda (rojo, grande)
2. Confirmación por voz: *"¿Necesitas ayuda? Pulsa de nuevo para avisar"* + cuenta atrás 5s
3. Si confirma → n8n webhook → WhatsApp al 691 025 645
4. Mensaje WhatsApp: *"🚨 ALERTA SOS — [NOMBRE] necesita ayuda. [timestamp]"*
5. Pantalla muestra: "Aviso enviado. Alguien viene a ayudarte."
6. Mobi habla: *"Ya he avisado. Quédate tranquilo, enseguida llega alguien."*

### n8n workflow SOS
```
Webhook POST /sos
  → Code node (preparar mensaje)
  → WhatsApp node (número: 691 025 645)
  → Telegram node (notificar a Roberto: 7586872984)
  → Respond to Webhook
```

**Número de emergencia durante validación:** 691 025 645  
*(Actualizar a contactos reales antes de producción)*

---

## 7. Módulo FAMILIA

> **Alcance pendiente de definir con Roberto.**  
> Placeholder para fase posterior. La pantalla mostrará: fotos/mensajes enviados por familiares.  
> El panel de cuidadores se diseñará en sprint 2.

---

## 8. Estructura del proyecto

```
src/
├── components/
│   ├── HomeScreen.tsx         — Pantalla 4 botones
│   ├── MobiChat.tsx           — Módulo conversación
│   ├── SaludScreen.tsx        — Módulo salud
│   ├── FamiliaScreen.tsx      — Módulo familia (placeholder)
│   ├── AyudaScreen.tsx        — Módulo SOS
│   ├── VoiceButton.tsx        — Botón micrófono reutilizable
│   └── VoiceReader.tsx        — Lector TTS ElevenLabs reutilizable
├── lib/
│   ├── supabase.ts            — UN ÚNICO createClient() aquí
│   ├── claude.ts              — Llamadas Claude API
│   ├── elevenlabs.ts          — TTS
│   └── speech.ts              — Web Speech API (STT)
├── hooks/
│   ├── useConversation.ts     — Historial + llamadas Claude
│   ├── useVoice.ts            — STT input
│   └── useTTS.ts              — ElevenLabs output
├── App.tsx                    — Router principal
└── main.tsx
```

---

## 9. Esquema Supabase completo

```sql
-- Usuarios (ancianos)
usuarios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  fecha_nacimiento date,
  telefono text,
  contacto_emergencia text,  -- número SOS real en producción
  creado_en timestamptz default now()
)

-- Conversaciones Mobi
conversaciones (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references usuarios(id),
  rol text check (rol in ('user', 'assistant')),
  contenido text not null,
  timestamp timestamptz default now()
)

-- Citas médicas
citas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references usuarios(id),
  fecha_cita timestamptz,
  especialista text,
  centro text,
  instrucciones text,
  imagen_url text,
  recordatorios_enviados int default 0,
  creado_en timestamptz default now()
)

-- Medicación
medicacion (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references usuarios(id),
  nombre text not null,
  dosis text,
  horarios text[],
  activo boolean default true
)

-- Alertas SOS
alertas_sos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references usuarios(id),
  timestamp timestamptz default now(),
  confirmado boolean default false,
  notificado boolean default false
)
```

**RLS:** todas las tablas con RLS. Políticas leen rol desde `app_metadata` del JWT. Un solo nivel de subquery.

---

## 10. Variables de entorno

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CLAUDE_API_KEY=
VITE_ELEVENLABS_API_KEY=
VITE_ELEVENLABS_VOICE_ID=        # voz cálida en español
VITE_N8N_WEBHOOK_SOS=https://n8n.mobilcity.es/webhook/mobisenior-sos
VITE_N8N_WEBHOOK_CITA=https://n8n.mobilcity.es/webhook/mobisenior-cita
```

---

## 11. Despliegue

**Puerto:** 3007  
**Subdominio:** mobisenior.mobilcity.es  
**Repo:** hubmobilcity-hub/mobisenior

```bash
# Primer despliegue
ssh root@178.104.248.4
cd /root/mobilcity
git clone https://github.com/hubmobilcity-hub/mobisenior.git mobisenior
cd mobisenior
nano .env
docker compose up -d --build
```

Nginx + SSL + Cloudflare: seguir patrón estándar de INFRASTRUCTURE.md.

---

## 12. Reglas críticas heredadas

- `createClient()` solo en `src/lib/supabase.ts`
- Dockerfile declara todas las `VITE_` vars como `ARG` y `ENV`
- RLS policies desde `app_metadata`, nunca desde tablas con RLS activo
- n8n: `_ruta` + Switch node, nunca array-of-arrays en Code node
- Gmail adjuntos: propiedad binaria = `"data"`

---

## 13. Sistema de diseño

Seguir `SKILL.md` + `colors_and_type.css` del proyecto Mobilcity.

**Paleta MobiSenior** (extensión para módulos senior):
| Módulo | Color | Hex |
|--------|-------|-----|
| Mobi | Brand primary | `#125491` |
| Salud | Verde | `#2d9e5f` |
| Familia | Amarillo | `#e8a020` |
| Ayuda | Rojo | `#d93025` |

**Tipografía senior:**
- Body mínimo: 18px
- Botones: 24px bold
- Títulos: 32px+
- Fuente: Afacad Flux (heredada del sistema Mobi)

---

## 14. Orden de construcción recomendado

1. **Scaffold** — Vite + React + TS + Tailwind + Supabase init
2. **HomeScreen** — 4 botones accesibles con vibración háptica
3. **MobiChat** — conversación texto con Claude + historial Supabase
4. **VoiceInput** — Web Speech API STT
5. **VoiceTTS** — ElevenLabs respuesta en voz
6. **AyudaScreen** — SOS con confirmación + n8n webhook
7. **SaludScreen** — medicación + recordatorios
8. **FotoACita** — cámara + Claude Vision + agenda Supabase
9. **FamiliaScreen** — placeholder + definir alcance con Roberto
10. **Despliegue** — Docker + Hetzner puerto 3007

---

## 15. Contacto

Roberto · hub@mobilcity.es · Mobilcity Hub · Laredo, Cantabria  
Número validación SOS: 691 025 645
