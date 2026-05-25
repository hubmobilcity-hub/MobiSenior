// ─────────────────────────────────────────────────────────
//  Haptic feedback — vibración en cada pulsación
//  Regla obligatoria de accesibilidad MobiSenior
// ─────────────────────────────────────────────────────────

export function haptic(pattern: number | number[] = 50): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

export const HAPTIC = {
  tap:      () => haptic(50),
  success:  () => haptic([50, 30, 50]),
  warning:  () => haptic([100, 50, 100]),
  sos:      () => haptic([200, 100, 200, 100, 200]),
  error:    () => haptic([300]),
}
