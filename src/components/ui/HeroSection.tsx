// HeroSection component
import React from 'react';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import { getFeaturedNews, getTrendingNews, getDailyNews, getAllNews, NewsItem } from '@/lib/supabase';

const HeroSection = async (): Promise<React.JSX.Element> => {
  // Hata yönetimi ile haberleri getir
  let featuredNews: NewsItem[] = [];
  let trendingNews: NewsItem[] = [];
  let dailyNews: NewsItem | null = null;
  let allNews: NewsItem[] = [];
  
  try {
    featuredNews = await getFeaturedNews() || [];
  } catch (error) {
    featuredNews = [];
  }
  
  try {
    trendingNews = await getTrendingNews(5) || [];
  } catch (error) {
    trendingNews = [];
  }
  
  try {
    dailyNews = await getDailyNews();
  } catch (error) {
    dailyNews = null;
  }
  
  try {
    allNews = await getAllNews() || [];
  } catch (error) {
    allNews = [];
  }

  // Günün haberi varsa onu göster, yoksa featured news'in ilkini göster
  const mainNews = dailyNews || featuredNews[0];
  const sideNews = featuredNews.slice(1, 4);

  // If no main news, show default content
  if (!mainNews) {
    return (
      <section className="bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-primary mb-4">DikiliHaber'e Hoş Geldiniz</h2>
            <p className="text-gray-600 mb-8">Yakında öne çıkan haberler burada görünecek.</p>
          </div>
        </div>
      </section>
    );
  }

  // Trending news'i formatla
  const formattedTrendingNews = trendingNews.length > 0
    ? trendingNews.map((news) => ({
        id: news.id,
        title: news.title,
        category: news.category,
        slug: news.slug,
        views: news.views ? `${(news.views / 1000).toFixed(1)}K` : '0K',
      }))
    : (allNews.length > 4 
      ? allNews.slice(3, 7).map((news) => ({
          id: news.id,
          title: news.title,
          category: news.category,
          slug: news.slug,
          views: news.views ? `${(news.views / 1000).toFixed(1)}K` : '0K',
        }))
      : []);

  return (
    <section className="bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Featured News */}
          {mainNews && (
            <div className="lg:col-span-2">
              <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-2xl">
                <SafeImage
                  src={mainNews.image_url || (mainNews.images && mainNews.images.length > 0 ? mainNews.images[0] : 'https://via.placeholder.com/800x600?text=Resim+Yok')}
                  alt={mainNews.title || 'Haber'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <span className="inline-block bg-accent text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
                      {mainNews.category || 'Gündem'}
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4 drop-shadow-lg">
                      {mainNews.title || 'Haber Başlığı'}
                    </h2>
                    <p className="text-lg text-gray-200 mb-6 line-clamp-2">
                      {mainNews.excerpt || mainNews.content?.substring(0, 150) || ''}
                    </p>
                    <Link href={`/news/${mainNews.slug || 'haber'}`} className="inline-block bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 shadow-lg">
                      Devamını Oku
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trending List - Enhanced */}
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-primary">🔥 Trend Haberler</h3>
              {formattedTrendingNews.length > 0 && <span className="text-sm text-gray-500">Canlı</span>}
            </div>
            {formattedTrendingNews.length > 0 ? (
              <>
                <ul className="space-y-4">
                  {formattedTrendingNews.map((news, index) => (
                    <li key={news.id}>
                      <Link href={`/news/${news.slug}`} className="group block cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-start space-x-3">
                          <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-accent to-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs text-accent font-semibold uppercase tracking-wider mb-1 block">
                              {news.category}
                            </span>
                            <h4 className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                              {news.title}
                            </h4>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <span>{news.views} görüntülenme</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/"
                  className="w-full mt-6 bg-primary hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors duration-200 block text-center"
                >
                  Tüm Trendleri Gör
                </Link>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Henüz trend haber yok</p>
                <p className="text-gray-400 text-xs mt-2">Daha fazla haber eklendikçe burada görünecek</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;