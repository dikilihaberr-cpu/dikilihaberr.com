// Home page
import React from 'react';
import type { Metadata } from 'next';
import HeroSection from '@/components/ui/HeroSection';
import NewsCard from '@/components/ui/NewsCard';
import AdBanner from '@/components/ui/AdBanner';
import Sidebar from '@/components/layout/Sidebar';
import WhatsAppTipLine from '@/components/ui/WhatsAppTipLine';
import { getAllNews, getFeaturedNews, NewsItem } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'DikiliHaber - Güncel Haberler ve Son Dakika',
  description: 'Dikili\'nin en güncel haberleri, son dakika gelişmeleri ve önemli haberler için DikiliHaber\'ı takip edin.',
  keywords: ['dikili', 'haber', 'gündem', 'son dakika', 'izmir', 'dikili haber'],
  openGraph: {
    title: 'DikiliHaber - Güncel Haberler',
    description: 'Dikili\'nin en güncel haberleri ve son dakika gelişmeleri',
    type: 'website',
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DikiliHaber - Güncel Haberler',
    description: 'Dikili\'nin en güncel haberleri ve son dakika gelişmeleri',
  },
};

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

const HomePage: React.FC = async () => {
  // Hata yönetimi ile haberleri getir
  let allNews: NewsItem[] = [];
  let featuredNews: NewsItem[] = [];
  
  try {
    allNews = await getAllNews() || [];
  } catch (error) {
    allNews = [];
  }
  
  try {
    featuredNews = await getFeaturedNews() || [];
  } catch (error) {
    featuredNews = [];
  }

  // If no news, show empty state
  if (allNews.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Henüz Haber Yok</h1>
            <p className="text-gray-600 mb-8">Yakında haberler burada görünecek.</p>
            <p className="text-sm text-gray-500">Admin kullanıcılar için: Haber eklemek için giriş yapın.</p>
          </div>
        </div>
      </div>
    );
  }

  const categories = ['Gündem', 'Siyaset', 'Ekonomi', 'Spor', 'Magazin'];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Ad Banner */}
        <div className="mb-8">
          <AdBanner position="header" className="w-full max-w-4xl mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sol Reklam Alanı - Desktop'ta görünür */}
          <div className="hidden xl:block lg:col-span-1">
            <div className="sticky top-8">
              <AdBanner position="sidebar" className="w-full" />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-7">
            {/* Hero Section */}
            <HeroSection />

            {/* News Grid */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-primary mb-6">Son Haberler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allNews.slice(0, 6).map((news, index) => (
                  <NewsCard
                    key={news?.id || `home-news-${index}`}
                    title={news?.title || 'Haber Başlığı'}
                    category={news?.category || 'Gündem'}
                    publishedAt={news?.published_at ? new Date(news.published_at).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR')}
                    imageUrl={news?.image_url || (news?.images && news.images.length > 0 ? news.images[0] : 'https://via.placeholder.com/400x300?text=Resim+Yok')}
                    slug={news?.slug}
                    excerpt={news?.excerpt}
                  />
                ))}
              </div>
              
              {/* İçerik Reklamı - İlk 6 haberden sonra */}
              <div className="mt-8 mb-8">
                <AdBanner position="content" className="w-full max-w-2xl mx-auto" />
              </div>

              {/* Devam Eden Haberler */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {allNews.slice(6, 12).map((news, index) => (
                  <NewsCard
                    key={news?.id || `home-news-${index + 6}`}
                    title={news?.title || 'Haber Başlığı'}
                    category={news?.category || 'Gündem'}
                    publishedAt={news?.published_at ? new Date(news.published_at).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR')}
                    imageUrl={news?.image_url || (news?.images && news.images.length > 0 ? news.images[0] : 'https://via.placeholder.com/400x300?text=Resim+Yok')}
                    slug={news?.slug}
                    excerpt={news?.excerpt}
                  />
                ))}
              </div>
            </section>

            {/* Category Sections */}
            {categories.map((category) => {
              const categoryNews = allNews.filter(n => n.category === category).slice(0, 3);
              if (categoryNews.length === 0) return null;

              return (
                <section key={category} className="mt-12">
                  <h2 className="text-2xl font-bold text-primary mb-6">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryNews.map((news, newsIndex) => (
                      <NewsCard
                        key={news?.id || `category-${category}-${newsIndex}`}
                        title={news?.title || 'Haber Başlığı'}
                        category={news?.category || 'Gündem'}
                        publishedAt={news?.published_at ? new Date(news.published_at).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR')}
                        imageUrl={news?.image_url || (news?.images && news.images.length > 0 ? news.images[0] : 'https://via.placeholder.com/400x300?text=Resim+Yok')}
                        slug={news?.slug}
                        excerpt={news?.excerpt}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3">
            <Sidebar />
          </div>

          {/* Sağ Reklam Alanı - Sadece çok geniş ekranlarda */}
          <div className="hidden 2xl:block lg:col-span-1">
            <div className="sticky top-8">
              <AdBanner position="sidebar" className="w-full" />
            </div>
          </div>
        </div>

        {/* WhatsApp Tip Line */}
        <WhatsAppTipLine />
      </div>
    </div>
  );
};

export default HomePage;