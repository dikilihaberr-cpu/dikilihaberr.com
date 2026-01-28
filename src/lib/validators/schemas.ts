import { z } from 'zod'

// ==========================================
// AUTH VALIDATION
// ==========================================

// Simplified schemas for frontend forms
export const signUpSchema = z.object({
  email: z.string()
    .min(1, 'E-posta gereklidir')
    .email('Geçerli bir e-posta adresi giriniz')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .max(100, 'Şifre çok uzun'),
  confirmPassword: z.string()
    .min(1, 'Şifre tekrarı gereklidir'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
})

export const signInSchema = z.object({
  email: z.string()
    .min(1, 'E-posta gereklidir')
    .email('Geçerli bir e-posta adresi giriniz')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(1, 'Şifre gereklidir')
})

// ==========================================
// NEWS VALIDATION
// ==========================================

export const newsCreateSchema = z.object({
  title: z.string()
    .min(5, 'Başlık en az 5 karakterlikdir')
    .max(200, 'Başlık en fazla 200 karakterlikdir')
    .trim(),
  
  slug: z.string()
    .min(3, 'Slug en az 3 karakterlikdir')
    .regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harfler, rakamlar ve tire içerebilir')
    .optional(),
  
  excerpt: z.string()
    .min(10, 'Özet en az 10 karakterlikdir')
    .max(500, 'Özet en fazla 500 karakterlikdir')
    .trim(),
  
  content: z.record(z.string(), z.any()).or(z.array(z.any())),  // Portable text
  
  category_id: z.string().uuid('Geçersiz kategori ID'),
  
  featured_image_id: z.string().uuid('Geçersiz resim ID').optional(),
  
  seo_title: z.string()
    .max(60, 'SEO başlığı en fazla 60 karakterlikdir')
    .optional(),
  
  meta_description: z.string()
    .min(50, 'Meta description en az 50 karakterlikdir')
    .max(160, 'Meta description en fazla 160 karakterlikdir')
    .optional(),
  
  focus_keyword: z.string()
    .max(50, 'Focus keyword en fazla 50 karakterlikdir')
    .optional(),
  
  featured: z.boolean().optional(),
  scheduled_at: z.string().datetime().optional()
})

export const newsUpdateSchema = newsCreateSchema.partial().strict()

// ==========================================
// COMMENT VALIDATION
// ==========================================

export const commentCreateSchema = z.object({
  news_id: z.string().uuid('Geçersiz haber ID'),
  content: z.string()
    .min(3, 'Yorum en az 3 karakterlikdir')
    .max(2000, 'Yorum en fazla 2000 karakterlikdir')
    .trim()
    // XSS protection - basic
    .refine(
      (val: string) => !/<script|<iframe|javascript:/i.test(val),
      'Yorum HTML/JavaScript içeremez'
    )
})

// ==========================================
// CATEGORY VALIDATION
// ==========================================

export const categoryCreateSchema = z.object({
  name: z.string()
    .min(3, 'Kategori adı en az 3 karakterlikdir')
    .max(50, 'Kategori adı en fazla 50 karakterlikdir')
    .trim(),
  
  slug: z.string()
    .regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harfler, rakamlar ve tire içerebilir'),
  
  description: z.string().max(300).optional(),
  icon_url: z.string().url().optional(),
  order_index: z.number().int().min(0).optional()
})

// ==========================================
// TAG VALIDATION
// ==========================================

export const tagCreateSchema = z.object({
  name: z.string()
    .min(2, 'Etiket en az 2 karakterlikdir')
    .max(50, 'Etiket en fazla 50 karakterlikdir')
    .trim(),
  
  slug: z.string()
    .regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harfler, rakamlar ve tire içerebilir'),
  
  description: z.string().max(200).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Geçersiz hex renk').optional()
})

// ==========================================
// USER/ROLE VALIDATION
// ==========================================

export const userUpdateSchema = z.object({
  full_name: z.string().min(3).max(100).optional(),
  avatar_url: z.string().url().optional(),
  bio: z.string().max(500).optional()
})

export const assignRoleSchema = z.object({
  user_id: z.string().uuid(),
  role_id: z.string().uuid()
})

// ==========================================
// TYPE EXPORTS
// ==========================================

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type NewsCreateInput = z.infer<typeof newsCreateSchema>
export type NewsUpdateInput = z.infer<typeof newsUpdateSchema>
export type CommentCreateInput = z.infer<typeof commentCreateSchema>
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>
export type TagCreateInput = z.infer<typeof tagCreateSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
export type AssignRoleInput = z.infer<typeof assignRoleSchema>
