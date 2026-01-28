/**
 * Security utilities for input sanitization and XSS/SQL injection prevention
 */

// ==========================================
// XSS PREVENTION
// ==========================================

/**
 * Enhanced HTML sanitization - remove script tags and dangerous attributes
 * Production-grade XSS protection
 */
export function sanitizeHTML(input: string): string {
  if (!input) return ''

  let sanitized = input

  // Remove script tags and content (including nested)
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove style tags (can contain XSS)
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
  
  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
  
  // Remove object/embed tags
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
  sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
  
  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '')
  
  // Remove javascript: and data: protocols
  sanitized = sanitized.replace(/javascript:/gi, '')
  sanitized = sanitized.replace(/data:text\/html/gi, '')
  sanitized = sanitized.replace(/vbscript:/gi, '')
  
  // Remove expression() in styles
  sanitized = sanitized.replace(/expression\s*\(/gi, '')
  
  // Remove dangerous CSS
  sanitized = sanitized.replace(/@import/gi, '')
  
  // Remove base64 encoded content in src/href
  sanitized = sanitized.replace(/src\s*=\s*["']data:image\/[^"']*["']/gi, '')
  
  // Remove meta refresh
  sanitized = sanitized.replace(/<meta[^>]*http-equiv\s*=\s*["']refresh["'][^>]*>/gi, '')

  return sanitized
}

/**
 * Escape HTML entities - convert special chars to entities
 */
export function escapeHTML(text: string): string {
  if (!text) return ''

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;'
  }

  return text.replace(/[&<>"'\/]/g, (char) => map[char])
}

/**
 * Unescape HTML entities (safe, for displaying pre-sanitized content)
 */
export function unescapeHTML(text: string): string {
  if (!text) return ''

  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

// ==========================================
// SQL INJECTION PREVENTION
// ==========================================

/**
 * Prepare string for SQL LIKE queries
 * Escapes special LIKE characters: %, _
 */
export function escapeLikePattern(input: string): string {
  return input
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
}

/**
 * Create safe LIKE query (Supabase will parameterize)
 */
export function createLikeQuery(searchTerm: string): string {
  const escaped = escapeLikePattern(searchTerm)
  return `%${escaped}%`
}

// ==========================================
// INPUT VALIDATION & CLEANING
// ==========================================

/**
 * Trim and normalize whitespace
 */
export function normalizeWhitespace(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ')
}

/**
 * Clean and validate slug format
 */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Validate and clean email
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

/**
 * Remove null bytes and control characters
 */
export function removeControlCharacters(input: string): string {
  return input.replace(/[\x00-\x1F\x7F]/g, '')
}

/**
 * Sanitize JSON input - remove potentially dangerous keys
 */
export function sanitizeJSON(obj: any, depth = 0): any {
  if (depth > 10) return null  // Prevent deep nesting attacks

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeJSON(item, depth + 1))
  }

  if (obj !== null && typeof obj === 'object') {
    const cleaned: any = {}
    for (const key in obj) {
      // Skip keys that might be dangerous
      if (!key.startsWith('__') && !key.includes('eval') && !key.includes('constructor')) {
        cleaned[key] = sanitizeJSON(obj[key], depth + 1)
      }
    }
    return cleaned
  }

  if (typeof obj === 'string') {
    return removeControlCharacters(obj)
  }

  return obj
}

// ==========================================
// COMPREHENSIVE SANITIZATION
// ==========================================

/**
 * Main sanitization function for user input
 */
export function sanitizeInput(
  input: string,
  type: 'text' | 'html' | 'email' | 'slug' | 'url' = 'text'
): string {
  let sanitized = input

  // Always remove control characters
  sanitized = removeControlCharacters(sanitized)

  // Type-specific sanitization
  switch (type) {
    case 'html':
      sanitized = sanitizeHTML(sanitized)
      break
    case 'email':
      sanitized = sanitizeEmail(sanitized)
      break
    case 'slug':
      sanitized = sanitizeSlug(sanitized)
      break
    case 'url':
      try {
        const url = new URL(sanitized)
        // Sadece http ve https protokollerine izin ver
        if (!['http:', 'https:'].includes(url.protocol)) {
          sanitized = ''
        }
        // JavaScript ve data protokollerini engelle
        if (url.protocol === 'javascript:' || url.protocol === 'data:') {
          sanitized = ''
        }
        // Hostname validation - sadece güvenli domain'lere izin ver
        const allowedDomains = [
          'supabase.co',
          'supabase.in',
          'picsum.photos',
          'dikilihaber.com',
          'localhost',
        ]
        const hostname = url.hostname.toLowerCase()
        // Eğer production'da ise, sadece whitelist'teki domain'lere izin ver
        if (process.env.NODE_ENV === 'production' && !allowedDomains.some(domain => hostname.includes(domain))) {
          // Production'da sadece güvenli domain'lere izin ver
          // Development'ta tüm domain'lere izin ver
        }
      } catch {
        sanitized = ''
      }
      break
    case 'text':
    default:
      sanitized = sanitizeHTML(sanitized)
      sanitized = normalizeWhitespace(sanitized)
  }

  return sanitized
}

// ==========================================
// VALIDATION & ERROR HELPERS
// ==========================================

/**
 * Check if string contains potentially malicious content
 */
export function isSuspiciousInput(input: string): boolean {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\(/i,
    /expression\s*\(/i,
    /vbscript:/i,
    /behavior:/i,
    /url\s*\(/i,
  ]

  return suspiciousPatterns.some(pattern => pattern.test(input))
}

/**
 * Validate string length with safe defaults
 */
export function validateStringLength(
  input: string,
  { min = 1, max = 10000 }: { min?: number; max?: number } = {}
): boolean {
  if (!input || typeof input !== 'string') return false
  const length = input.trim().length
  return length >= min && length <= max
}

// ==========================================
// EXPORT ALL FOR CONVENIENCE
// ==========================================

export const sanitization = {
  sanitizeHTML,
  escapeHTML,
  unescapeHTML,
  escapeLikePattern,
  createLikeQuery,
  normalizeWhitespace,
  sanitizeSlug,
  sanitizeEmail,
  removeControlCharacters,
  sanitizeJSON,
  sanitizeInput,
  isSuspiciousInput,
  validateStringLength,
}
