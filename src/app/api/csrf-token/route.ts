import { NextResponse } from 'next/server'
import { getCSRFToken } from '@/lib/utils/csrf'

export async function GET() {
  try {
    const token = await getCSRFToken()
    return NextResponse.json({ token })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}
