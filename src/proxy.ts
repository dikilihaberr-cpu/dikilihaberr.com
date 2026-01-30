import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting storage (in-memory, production'da Redis kullanılmalı)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMITS = {
  '/api/auth/login': { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  '/api/comments': { maxRequests: 10, windowMs: 60 * 1000 }, // 10 requests per minute
  default: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
}

function getRateLimitConfig(pathname: string) {
  if (pathname.includes('/api/auth/login')) return RATE_LIMITS['/api/auth/login']
  if (pathname.includes('/api/comments')) return RATE_LIMITS['/api/comments']
  return RATE_LIMITS.default
}

function checkRateLimit(ip: string, pathname: string): { allowed: boolean; retryAfter?: number } {
  const config = getRateLimitConfig(pathname)
  const now = Date.now()
  
  // IP sanitization - prevent injection attacks
  const sanitizedIp = ip.replace(/[^a-zA-Z0-9.:-]/g, '')
  const sanitizedPathname = pathname.replace(/[^a-zA-Z0-9/_-]/g, '')
  const key = `${sanitizedIp}:${sanitizedPathname}`

  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    // Yeni window başlat
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return { allowed: true }
  }

  if (record.count >= config.maxRequests) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000)
    return { allowed: false, retryAfter }
  }

  // Count artır
  record.count++
  rateLimitMap.set(key, record)
  return { allowed: true }
}

// Cleanup old entries (her 5 dakikada bir)
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 5 * 60 * 1000)

// Next.js 16: middleware → proxy (aynı API)
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'

  // Rate limiting kontrolü (sadece API routes için)
  if (pathname.startsWith('/api/')) {
    const rateLimit = checkRateLimit(ip, pathname)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.',
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter),
            'X-RateLimit-Limit': String(getRateLimitConfig(pathname).maxRequests),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }
  }

  // Security Headers ekle
  const response = NextResponse.next()

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co", // Supabase için gerekli
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-src 'self' https://*.supabase.co",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ')

  // Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('Content-Security-Policy', csp)

  // Rate limit headers (API routes için)
  if (pathname.startsWith('/api/')) {
    const config = getRateLimitConfig(pathname)
    const record = rateLimitMap.get(`${ip}:${pathname}`)
    const remaining = record ? Math.max(0, config.maxRequests - record.count) : config.maxRequests
    response.headers.set('X-RateLimit-Limit', String(config.maxRequests))
    response.headers.set('X-RateLimit-Remaining', String(remaining))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
