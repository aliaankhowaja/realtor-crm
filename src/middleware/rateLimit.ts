const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(ip: string, limitPerMinute: number): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now >= entry.resetTime) {
    // Create new entry or reset if window expired
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 })
    return true
  }

  // Within window - increment count
  entry.count++

  if (entry.count > limitPerMinute) {
    return false
  }

  return true
}

export function agentRateLimit(ip: string): boolean {
  return checkRateLimit(ip, 50)
}

export function adminRateLimit(ip: string): boolean {
  return checkRateLimit(ip, 500)
}
