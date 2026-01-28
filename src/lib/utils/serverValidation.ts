/**
 * Server-side Validation Utility
 * Zod schemas ile server-side validation
 */

import { z } from 'zod'
import { sanitizeInput } from './sanitization'

// Server-side validation schemas
export const serverSignInSchema = z.object({
  email: z.string()
    .min(1, 'E-posta gereklidir')
    .email('Geçerli bir e-posta adresi giriniz')
    .max(255, 'E-posta çok uzun')
    .transform((val) => sanitizeInput(val.toLowerCase().trim(), 'email')),
  password: z.string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .max(100, 'Şifre çok uzun'),
})

export const serverCommentSchema = z.object({
  newsId: z.string()
    .uuid('Geçersiz haber ID')
    .min(1, 'Haber ID gereklidir'),
  content: z.string()
    .min(3, 'Yorum en az 3 karakter olmalıdır')
    .max(2000, 'Yorum en fazla 2000 karakter olabilir')
    .transform((val) => sanitizeInput(val.trim(), 'text'))
    .refine(
      (val) => !/<script|<iframe|javascript:|on\w+\s*=/i.test(val),
      'Yorum HTML/JavaScript içeremez'
    ),
})

export const serverNewsSchema = z.object({
  title: z.string()
    .min(5, 'Başlık en az 5 karakter olmalıdır')
    .max(200, 'Başlık en fazla 200 karakter olabilir')
    .transform((val) => sanitizeInput(val.trim(), 'text')),
  content: z.string()
    .min(50, 'İçerik en az 50 karakter olmalıdır')
    .max(50000, 'İçerik çok uzun')
    .transform((val) => sanitizeInput(val, 'html')),
  category: z.string()
    .min(1, 'Kategori gereklidir')
    .max(50, 'Kategori çok uzun'),
  excerpt: z.string()
    .max(500, 'Özet en fazla 500 karakter olabilir')
    .optional()
    .transform((val) => val ? sanitizeInput(val.trim(), 'text') : undefined),
})

/**
 * Validate server-side input
 */
export function validateServerInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.safeParse(data)
    if (result.success) {
      return { success: true, data: result.data }
    } else {
      const firstError = result.error.errors[0]
      return {
        success: false,
        error: firstError?.message || 'Geçersiz veri',
      }
    }
  } catch (error) {
    return {
      success: false,
      error: 'Validation hatası',
    }
  }
}
