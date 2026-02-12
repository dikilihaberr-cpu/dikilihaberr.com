import { NextRequest, NextResponse } from 'next/server'
import { importAllRSSFeeds } from '@/lib/rssImporter'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/utils/logger'

/**
 * RSS Feed'lerden Haber Çekme API
 * POST /api/rss/import
 * Admin yetkisi gerekli
 */
export async function POST(request: NextRequest) {
  try {
    // Admin kontrolü
    const { data: { user } } = await supabase!.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Oturum bulunamadı' },
        { status: 401 }
      )
    }

    const { data: adminCheck } = await supabase!
      .from('admins')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!adminCheck) {
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
