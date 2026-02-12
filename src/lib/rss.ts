// RSS Feed Parser ve Yönetimi
// Yasal: Sadece başlık, özet ve link çeker, tam içerik kopyalamaz

import Parser from 'rss-parser'

export interface RSSFeedItem {
  title: string
  description: string // Özet
  link: string // Orijinal haber linki
  pubDate: string
  source: string // Kaynak site adı
  imageUrl?: string
}

export interface RSSFeed {
  title: string
  description: string
  link: string
  items: RSSFeedItem[]
}

const parser = new Parser({
  customFields: {
    item: ['media:content', 'enclosure'],
  },
})

/**
 * RSS Feed'i parse et
 * Yasal: Sadece başlık, özet ve link alır, tam içerik kopyalamaz
 */
export async function parseRSSFeed(feedUrl: string): Promise<RSSFeed | null> {
  try {
    const feed = await parser.parseURL(feedUrl)

    const items: RSSFeedItem[] = feed.items.slice(0, 20).map((item) => {
      // HTML tag'lerini temizle (sadece metin al)
      const cleanDescription = (item.contentSnippet || item.content || (item as any).description || '').toString()
      const textOnly = cleanDescription
        .replace(/<[^>]*>/g, '') // HTML tag'lerini kaldır
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .trim()
        .substring(0, 200) // Max 200 karakter

      // Image URL'i bul
      let imageUrl: string | undefined
      const itemAny = item as any
      if (item.enclosure?.url && item.enclosure.type?.startsWith('image/')) {
        imageUrl = item.enclosure.url
      }
      if (itemAny['media:content']?.['$']?.url && !imageUrl) {
        imageUrl = itemAny['media:content']['$'].url
      }
      if (itemAny.itunes?.image && !imageUrl) {
        imageUrl = itemAny.itunes.image
      }

      return {
        title: item.title || '',
        description: textOnly,
        link: item.link || '',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        source: new URL(feedUrl).hostname.replace('www.', ''),
        imageUrl,
      }
    }).filter(item => item.title && item.link) // Boş item'ları filtrele

    return {
      title: feed.title || 'RSS Feed',
      description: feed.description || '',
      link: feed.link || feedUrl,
      items,
    }
  } catch (error) {
    console.error('RSS feed parse hatası:', error)
    return null
  }
}

/**
 * Birden fazla RSS feed'i birleştir
 */
export async function parseMultipleFeeds(feedUrls: string[]): Promise<RSSFeedItem[]> {
  const allItems: RSSFeedItem[] = []

  await Promise.all(
    feedUrls.map(async (url) => {
      const feed = await parseRSSFeed(url)
      if (feed) {
        allItems.push(...feed.items)
      }
    })
  )

  // Tarihe göre sırala (en yeni önce)
  return allItems.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime()
    const dateB = new Date(b.pubDate).getTime()
    return dateB - dateA
  })
}
