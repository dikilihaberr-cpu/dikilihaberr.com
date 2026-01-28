// Custom error classes

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, details)
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Kaynak bulunamadı') {
    super(message, 404)
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Yetkiniz yok') {
    super(message, 403)
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Oturum açmanız gerekiyor') {
    super(message, 401)
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Kaynak zaten var') {
    super(message, 409)
    Object.setPrototypeOf(this, ConflictError.prototype)
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Çok fazla istek gönderdiniz') {
    super(message, 429)
    Object.setPrototypeOf(this, RateLimitError.prototype)
  }
}

// Helper to determine if error is from Supabase
export function isSupabaseError(error: any): boolean {
  return error?.code || error?.message?.includes('PGRST') || error?.message?.includes('42P01')
}

// Friendly error messages
export function getErrorMessage(error: any): string {
  if (error instanceof AppError) {
    return error.message
  }

  if (isSupabaseError(error)) {
    const code = error.code
    const message = error.message || ''

    // Common Supabase error codes
    if (code === 'PGRST116') return 'Kaynak bulunamadı'
    if (code === 'UNIQUE_VIOLATION' || code === '23505') return 'Bu veriler zaten var'
    if (code === 'FOREIGN_KEY_VIOLATION' || code === '23503') return 'İlişkili kaynak bulunamadı'
    if (code === 'UNAUTHORIZED' || message.includes('permission')) return 'Yetkiniz yok'
    if (code === '42P01') return 'Veritabanı tablosu bulunamadı'

    return message || 'Veritabanı hatası'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Bir hata oluştu'
}
