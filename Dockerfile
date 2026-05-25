# ─────────────────────────────────────────────────────────
#  MobiSenior — Dockerfile
#  Multi-stage: build → nginx
#  Puerto: 3007
# ─────────────────────────────────────────────────────────

# ── Stage 1: Build ────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Todas las VITE_ vars declaradas como ARG + ENV (regla crítica)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_CLAUDE_API_KEY
ARG VITE_ELEVENLABS_API_KEY
ARG VITE_ELEVENLABS_VOICE_ID
ARG VITE_N8N_WEBHOOK_SOS
ARG VITE_N8N_WEBHOOK_CITA

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_CLAUDE_API_KEY=$VITE_CLAUDE_API_KEY
ENV VITE_ELEVENLABS_API_KEY=$VITE_ELEVENLABS_API_KEY
ENV VITE_ELEVENLABS_VOICE_ID=$VITE_ELEVENLABS_VOICE_ID
ENV VITE_N8N_WEBHOOK_SOS=$VITE_N8N_WEBHOOK_SOS
ENV VITE_N8N_WEBHOOK_CITA=$VITE_N8N_WEBHOOK_CITA

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Serve ────────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3007

CMD ["nginx", "-g", "daemon off;"]
