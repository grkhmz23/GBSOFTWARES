const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 3

export function checkRateLimit(key: string): { allowed: boolean; waitMs: number } {
  try {
    const raw = localStorage.getItem(`rl_${key}`)
    const now = Date.now()
    const timestamps: number[] = raw ? JSON.parse(raw) : []
    const recent = timestamps.filter(t => now - t < WINDOW_MS)

    if (recent.length >= MAX_ATTEMPTS) {
      const oldest = Math.min(...recent)
      return { allowed: false, waitMs: WINDOW_MS - (now - oldest) }
    }

    recent.push(now)
    localStorage.setItem(`rl_${key}`, JSON.stringify(recent))
    return { allowed: true, waitMs: 0 }
  } catch {
    return { allowed: true, waitMs: 0 }
  }
}

export function formatWaitTime(ms: number): string {
  const minutes = Math.ceil(ms / 60000)
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`
}
