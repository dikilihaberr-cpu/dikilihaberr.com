import { NextResponse } from 'next/server'
import { AppError, getErrorMessage } from './errors'

// Standardize API responses
export function successResponse<T>(
  data: T,
  message: string = 'Başarılı',
  statusCode: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data
    },
    { status: statusCode }
  )
}

export function errorResponse(
  error: any,
  fallbackMessage: string = 'Bir hata oluştu'
) {
  const message = getErrorMessage(error) || fallbackMessage
  const statusCode = error instanceof AppError ? error.statusCode : 500

  return NextResponse.json(
    {
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && { details: error.details || error.message })
    },
    { status: statusCode }
  )
}

// Pagination helper
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function getPaginationParams(
  searchParams: Record<string, any>
): { page: number; limit: number; offset: number } {
  const page = Math.max(1, parseInt(searchParams.page) || 1)
  const limit = Math.min(100, parseInt(searchParams.limit) || 10)
  const offset = (page - 1) * limit

  return { page, limit, offset }
}

// Logging helper
export function logAction(
  userId: string | null,
  action: string,
  resource: string,
  resourceId: string,
  details?: any
) {
  const timestamp = new Date().toISOString()
  const log = {
    timestamp,
    userId,
    action,
    resource,
    resourceId,
    details
  }

  // Send to logging service (if configured)
  if (process.env.LOGGING_ENDPOINT) {
    fetch(process.env.LOGGING_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log)
    }).catch((err) => console.error('Logging failed:', err))
  } else {
    console.log(JSON.stringify(log))
  }
}
