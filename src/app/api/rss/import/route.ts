import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { importAllRSSFeeds } from '@/lib/rssImporter'
import { logger } from '@/lib/utils/logger'

/**
 * RSS Feed'lerden Haber Çekme API
 * POST /api/rss/import
 * Admin yetkisi gerekli
 */
export async function POST(request: NextRequest) {
  try {
    // Server-side Supabase client oluştur (cookie'leri okur)
    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    })

    // Admin kontrolü
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      logger.error('RSS import auth error:', authError)
      return NextResponse.json(
        { error: 'Oturum bulunamadı. Lütfen tekrar giriş yapın.' },
        { status: 401 }
      )
    }

    const { data: adminCheck, error: adminError } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (adminError || !adminCheck) {
      logger.error('RSS import admin check error:', adminError)
      return NextResponse.json(
        { error: 'Admin yetkisi gerekli' },
        { status: 403 }
      )
    }

    // RSS feed'leri al (request body'den veya localStorage'dan)
    const body = await request.json().catch(() => ({}))
    let feeds = body.feeds

    // Eğer body'de yoksa, localStorage'dan almak için client-side'dan gönderilmesi gerekir
    // Bu durumda hata döndür
    if (!feeds || !Array.isArray(feeds)) {
      return NextResponse.json(
        { error: 'RSS feed listesi gerekli' },
        { status: 400 }
      )
    }

    // RSS feed'lerden haberleri çek
    const result = await importAllRSSFeeds(feeds)

    logger.log('RSS import completed:', result)

    return NextResponse.json({
      success: true,
      ...result
    })
  } catch (error: any) {
    logger.error('RSS import API error:', error)
    return NextResponse.json(
      { error: error.message || 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
