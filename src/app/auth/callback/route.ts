import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/auth/login'

  if (code) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Başarılı doğrulama - login sayfasına yönlendir
      return NextResponse.redirect(new URL(`/auth/login?verified=true`, requestUrl.origin))
    }
  }

  // Hata durumunda login sayfasına yönlendir
  return NextResponse.redirect(new URL(`/auth/login?error=verification_failed`, requestUrl.origin))
}
