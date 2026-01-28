// News detail page
import React from 'react';
import SafeImage from '@/components/ui/SafeImage';
import { Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import NewsCard from '@/components/ui/NewsCard';
import AdBanner from '@/components/ui/AdBanner';
import CommentsSection from '@/components/ui/CommentsSection';
import type { Metadata } from 'next';
import { getNewsBySlug, getAllNews, NewsItem } from '@/lib/supabase';
import { sanitizeHTML } from '@/lib/utils/sanitization';

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const news = await getNewsBySlug(slug);

    if (!news) {
      return {
        title: 'Haber Bulunamadı | DikiliHaber',
        description: 'Bu haber artık mevcut değil.',
      };
    }

  const seoTitle = news.seo_title || news.title
  const metaDescription = news.meta_description || news.excerpt || news.content?.substring(0, 160) || 'Dikili haberleri'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dikilihaber.com'
  const newsUrl = `${siteUrl}/news/${slug}`

  return {
    title: `${seoTitle} | DikiliHaber`,
    description: metaDescription,
    openGraph: {
      title: news.title,
      description: metaDescription,
      type: 'article',
      url: newsUrl,
      images: [
        {
          url: news.image_url,
          width: 1200,
          height: 630,
          alt: news.title,
        },
      ],
      publishedTime: news.published_at,
      modifiedTime: news.updated_at || news.created_at,
      authors: [news.author],
      section: news.category,
      tags: news.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: news.title,
      description: metaDescription,
      images: [news.image_url || (news.images && news.images.length > 0 ? news.images[0] : '')],
    },
    alternates: {
      canonical: newsUrl,
    },
  };
  } catch (error) {
    return {
      title: 'Haber Bulunamadı | DikiliHaber',
      description: 'Bu haber artık mevcut değil.',
    };
  }
}

const NewsDetailPage: React.FC<NewsDetailPageProps> = async ({ params }) => {
  const { slug } = await params;
  
  // Hata yönetimi ile haberleri getir
  let news: NewsItem | null = null;
  let allNews: NewsItem[] = [];
  
  try {
    news = await getNewsBySlug(slug);
  } catch (error) {
    news = null;
  }
  
  try {
    allNews = await getAllNews() || [];
  } catch (error) {
    allNews = [];
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Haber Bulunamadı</h1>
            <p className="text-gray-600 mb-8">Bu haber artık mevcut değil veya yanlış adrese ulaştınız.</p>
            <a href="/" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              Ana Sayfaya Dön
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Related news (same category, exclude current)
  const relatedNews = allNews
    .filter(n => n.category === news.category && n.id !== news.id)
    .slice(0, 4);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dikilihaber.com'
  const shareUrl = `${siteUrl}/news/${slug}`

  // Schema.org NewsArticle JSON-LD
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    description: news.excerpt || news.content?.substring(0, 160),
    image: news.image_url || (news.images && news.images.length > 0 ? news.images[0] : ''),
    datePublished: news.published_at || news.created_at,
    dateModified: news.updated_at || news.created_at,
    author: {
      '@type': 'Person',
      name: news.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'DikiliHaber',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': shareUrl,
    },
    articleSection: news.category,
    keywords: news.tags?.join(', ') || news.category,
    articleBody: news.content,
    ...(news.source && { sourceOrganization: { '@type': 'Organization', name: news.source } }),
  }

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(schemaData).replace(/</g, '\\u003c') // XSS prevention for JSON-LD
        }}
      />

      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="inline-block bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                {news.category}
              </span>
              {news.is_daily_news && (
                <span className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  📰 Günün Haberi
                </span>
              )}
              {news.is_trending && (
                <span className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  🔥 Trend
                </span>
              )}
              {news.featured && (
                <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  ⭐ Öne Çıkan
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{news.title || 'Haber Başlığı'}</h1>
            {news.excerpt && (
              <p className="text-xl text-gray-600 mb-4 leading-relaxed">{news.excerpt}</p>
            )}
            <div className="flex items-center text-sm text-gray-500 mb-2 flex-wrap">
              <span>📝 {news.author || 'DikiliHaber'}</span>
              {news.source && <><span className="mx-2">•</span><span>📰 Kaynak: {news.source}</span></>}
              <span className="mx-2">•</span>
              <span>📅 {news.published_at || news.created_at ? new Date(news.published_at || news.created_at).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : new Date().toLocaleDateString('tr-TR')}</span>
              {news.views && (
                <>
                  <span className="mx-2">•</span>
                  <span>👁️ {news.views || 0} görüntülenme</span>
                </>
              )}
            </div>
            {news.tags && news.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {news.tags.map((tag, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            {news.location_tags && news.location_tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {news.location_tags.map((location, idx) => (
                  <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
                    📍 {location}
                  </span>
                ))}
              </div>
            )}
          </header>

        {/* Featured Image */}
        <div className="relative h-96 mb-8 rounded-lg overflow-hidden shadow-xl">
          <SafeImage
            src={news.image_url || (news.images && news.images.length > 0 ? news.images[0] : 'https://via.placeholder.com/1200x600?text=Resim+Yok')}
            alt={news.title || 'Haber'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
          />
          {news.is_daily_news && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              📰 Günün Haberi
            </div>
          )}
          {news.is_trending && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              🔥 Trend
            </div>
          )}
        </div>

        {/* Additional Images Gallery */}
        {news.images && news.images.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Haber Görselleri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {news.images.map((imageUrl, index) => (
                <div key={index} className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <SafeImage
                    src={imageUrl}
                    alt={`${news.title} - Görsel ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Görsel {index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-lg max-w-none mb-8">
          <div 
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML((news.content || '').replace(/\n/g, '<br>')) }} 
          />
        </article>

        {/* Video Section */}
        {news.video_url && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Video</h3>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={news.video_url}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Content Ad Banner */}
        <div className="my-8">
          <AdBanner position="content" className="w-full" />
        </div>

        {/* Share Buttons */}
        <div className="flex items-center space-x-4 mb-12">
          <span className="text-gray-700 font-medium">Paylaş:</span>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <Facebook className="h-5 w-5" />
            <span>Facebook</span>
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(news.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-600"
          >
            <Twitter className="h-5 w-5" />
            <span>Twitter</span>
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-700 hover:text-blue-900"
          >
            <Linkedin className="h-5 w-5" />
            <span>LinkedIn</span>
          </a>
        </div>

        {/* Related News */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-6">İlgili Haberler</h2>
          {relatedNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedNews.map((related, index) => (
                <NewsCard
                  key={related?.id || `related-${slug}-${index}`}
                  title={related?.title || 'Haber Başlığı'}
                  category={related?.category || 'Gündem'}
                  publishedAt={related?.published_at ? new Date(related.published_at).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR')}
                  imageUrl={related?.image_url || (related?.images && related.images.length > 0 ? related.images[0] : 'https://via.placeholder.com/400x300?text=Resim+Yok')}
                  slug={related?.slug}
                  excerpt={related?.excerpt}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Henüz ilgili haber yok.</p>
          )}
        </section>

        {/* Comments Section */}
        <CommentsSection newsId={news.id} />
        </div>
      </div>
    </>
  );
};

export default NewsDetailPage;