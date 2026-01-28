/**
 * Rate Limiting Utility
 * Client-side rate limiting için helper functions
 */

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface RateLimitResult {
  allowed: boolean
  retryAfter?: number
  remaining?: number
}

// Client-side rate limit storage (localStorage)
const CLIENT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  comment: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 comments per minute
  news: { maxRequests: 3, windowMs: 60 * 1000 }, // 3 news per minute
}

export function checkClientRateLimit(
  action: 'login' | 'comment' | 'news'
): RateLimitResult {
  if (typeof window === 'undefined') {
    return { allowed: true }
  }

  const config = CLIENT_RATE_LIMITS[action]
  const storageKey = `rate_limit_${action}`
  const now = Date.now()

  try {
    const stored = localStorage.getItem(storageKey)
    let record: { count: number; resetTime: number }

    if (stored) {
      record = JSON.parse(stored)
      if (now > record.resetTime) {
        // Window expired, reset
        record = { count: 1, resetTime: now + config.windowMs }
      } else if (record.count >= config.maxRequests) {
        // Rate limit exceeded
        const retryAfter = Math.ceil((record.resetTime - now) / 1000)
        return {
          allowed: false,
          retryAfter,
          remaining: 0,
        }
      } else {
        // Increment count
        record.count++
      }
    } else {
      // First request
      record = { count: 1, resetTime: now + config.windowMs }
    }

    localStorage.setItem(storageKey, JSON.stringify(record))
    return {
      allowed: true,
      remaining: config.maxRequests - record.count,
    }
  } catch (error) {
    // localStorage error, allow request
    return { allowed: true }
  }
}

export function resetRateLimit(action: 'login' | 'comment' | 'news'): void {
  if (typeof window === 'undefined') return
  const storageKey = `rate_limit_${action}`
  localStorage.removeItem(storageKey)
}
