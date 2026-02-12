// RSS Feed'lerden Otomatik Haber Çekme ve Ekleme
import { parseRSSFeed, RSSFeedItem } from './rss'
import { supabase } from './supabase'
import { logger } from './utils/logger'

export interface ImportedNewsItem {
  title: string
  content: string
  excerpt: string
  category: string
  author: string
  image_url?: string
  source_url: string // Orijinal haber linki
  source_name: string // RSS feed kaynağı
  status: 'draft' // RSS'den gelen haberler draft olarak eklenir
  is_published: false
}

/**
 * RSS feed'den haberleri çek ve veritabanına draft olarak ekle
 */
export async function importNewsFromRSS(feedUrl: string, feedName: string, category?: string): Promise<{ imported: number; skipped: number; errors: string[] }> {
  const result = { imported: 0, skipped: 0, errors: [] as string[] }

  try {
    // RSS feed'i parse et
    const feed = await parseRSSFeed(feedUrl)
    
    if (!feed || !feed.items || feed.items.length === 0) {
      result.errors.push(`${feedName}: Haber bulunamadı`)
      return result
    }

    // Her haber için kontrol et ve ekle
    for (const item of feed.items) {
      try {
        // Aynı haber zaten var mı kontrol et
        // Önce source_url ile kontrol et (eğer kolon varsa), yoksa title ile
        if (!supabase) {
          result.errors.push('Supabase bağlantısı yok')
          continue
        }

        let existing = null
        try {
          const response = await supabase
            .from('news')
            .select('id')
            .eq('source_url', item.link)
            .maybeSingle()
          existing = response.data
        } catch (e) {
          // source_url kolonu yoksa title ile kontrol et
          try {
            const response = await supabase
              .from('news')
              .select('id')
              .eq('title', item.title)
              .maybeSingle()
            existing = response.data
          } catch (e2) {
            // Hata durumunda devam et
          }
        }

        if (existing) {
          result.skipped++
          continue // Zaten var, atla
        }

        // Slug oluştur
        const slug = item.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .substring(0, 100)

        // Slug benzersiz mi kontrol et
        const { data: slugExists } = await supabase
          ?.from('news')
          .select('id')
          .eq('slug', slug)
          .maybeSingle()

        const finalSlug = slugExists ? `${slug}-${Date.now()}` : slug

        // Haber içeriğini oluştur (özet + kaynak linki)
        const content = `
          <p>${item.description}</p>
          <p><strong>Kaynak:</strong> <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.source}</a></p>
          <p><em>Bu haber ${feedName} RSS feed'inden otomatik olarak çekilmiştir.</em></p>
        `.trim()

        // Veritabanına ekle
        const newsData: any = {
          title: item.title,
          content: content,
          excerpt: item.description.substring(0, 200),
          category: category || 'Gündem',
          author: `${feedName} (RSS)`,
          image_url: item.imageUrl || null,
          slug: finalSlug,
          status: 'draft',
          is_published: false,
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        }

        // source_url ve source_name kolonları varsa ekle (opsiyonel - migration sonrası)
        // Eğer kolonlar yoksa hata vermez, sadece eklenmez
        newsData.source_url = item.link
        newsData.source_name = feedName

        if (!supabase) {
          result.errors.push('Supabase bağlantısı yok')
          continue
        }

        const { error } = await supabase
          .from('news')
          .insert([newsData])

        if (error) {
          logger.error(`RSS import error for ${item.title}:`, error)
          result.errors.push(`${item.title}: ${error.message}`)
          result.skipped++
        } else {
          result.imported++
        }
      } catch (itemError: any) {
        logger.error(`Error processing RSS item ${item.title}:`, itemError)
        result.errors.push(`${item.title}: ${itemError.message || 'Bilinmeyen hata'}`)
        result.skipped++
      }
    }
  } catch (error: any) {
    logger.error(`RSS import error for ${feedName}:`, error)
    result.errors.push(`${feedName}: ${error.message || 'RSS feed yüklenemedi'}`)
  }

  return result
}

/**
 * Tüm aktif RSS feed'lerden haberleri çek
 */
export async function importAllRSSFeeds(feeds: Array<{ name: string; url: string; category?: string; enabled: boolean }>): Promise<{
  totalImported: number
  totalSkipped: number
  feedResults: Array<{ feedName: string; imported: number; skipped: number; errors: string[] }>
}> {
  const activeFeeds = feeds.filter(f => f.enabled)
  const feedResults: Array<{ feedName: string; imported: number; skipped: number; errors: string[] }> = []
  let totalImported = 0
  let totalSkipped = 0

  for (const feed of activeFeeds) {
    const result = await importNewsFromRSS(feed.url, feed.name, feed.category)
    feedResults.push({
      feedName: feed.name,
      ...result
    })
    totalImported += result.imported
    totalSkipped += result.skipped
  }

  return {
    totalImported,
    totalSkipped,
    feedResults
  }
}
