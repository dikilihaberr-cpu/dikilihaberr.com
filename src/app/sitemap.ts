import { MetadataRoute } from 'next'
import { getAllNews } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dikilihaber.com'
  
  // Get all published news
  const allNews = await getAllNews()
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    // Category pages
    ...['Gündem', 'Siyaset', 'Ekonomi', 'Spor', 'Magazin', 'Teknoloji', 'Çevre', 'Hayvan Hakları'].map(category => ({
      url: `${baseUrl}/category/${category.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ]

  // Dynamic news pages
  const newsPages: MetadataRoute.Sitemap = allNews
    .filter(news => news.status === 'published' || (!news.status && news.is_published))
    .map(news => ({
      url: `${baseUrl}/news/${news.slug}`,
      lastModified: new Date(news.updated_at || news.published_at || news.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  return [...staticPages, ...newsPages]
}