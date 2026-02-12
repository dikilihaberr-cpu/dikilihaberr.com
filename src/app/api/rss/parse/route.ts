import { NextRequest, NextResponse } from 'next/server'
import { parseRSSFeed, parseMultipleFeeds } from '@/lib/rss'

// Rate limiting için basit cache
const requestCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 dakika

/**
 * RSS Feed Parse API
 * GET /api/rss/parse?url=... veya POST body'de { urls: [...] }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json(
        { error: 'URL parametresi gerekli' },
        { status: 400 }
      )
    }

    // Cache kontrolü
    const cacheKey = `rss:${url}`
    const cached = requestCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      })
    }

    const feed = await parseRSSFeed(url)

    if (!feed) {
      return NextResponse.json(
        { error: 'RSS feed yüklenemedi veya parse edilemedi' },
        { status: 500 }
      )
    }

    // Cache'e kaydet
    requestCache.set(cacheKey, { data: feed, timestamp: Date.now() })

    return NextResponse.json(feed, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('RSS parse API error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { urls } = body

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'urls array gerekli' },
        { status: 400 }
      )
    }

    const items = await parseMultipleFeeds(urls)

    return NextResponse.json({ items }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('RSS parse API error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
