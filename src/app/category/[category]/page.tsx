// Category page
import React from 'react';
import type { Metadata } from 'next';
import NewsCard from '@/components/ui/NewsCard';
import { getNewsByCategory, NewsItem } from '@/lib/supabase';
import { logger } from '@/lib/utils/logger';

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryDisplayName = decodeURIComponent(category);
  
  return {
    title: `${categoryDisplayName} Haberleri | DikiliHaber`,
    description: `${categoryDisplayName} kategorisindeki en güncel haberler ve gelişmeler.`,
    openGraph: {
      title: `${categoryDisplayName} Haberleri`,
      description: `${categoryDisplayName} kategorisindeki en güncel haberler.`,
      type: 'website',
    },
  };
}

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params }) => {
  const { category } = await params;

  // Decode category name first
  const decodedCategory = decodeURIComponent(category);
  
  // Get news from Supabase with error handling
  let categoryNews: NewsItem[] = [];
  let hasError = false;
  try {
    // Pass decoded category to getNewsByCategory (it will normalize it)
    categoryNews = await getNewsByCategory(decodedCategory) || [];
  } catch (error) {
    logger.error('Error fetching category news:', error);
    categoryNews = [];
    hasError = true;
  }

  // Capitalize first letter for display
  const categoryDisplayName = decodedCategory.charAt(0).toUpperCase() + decodedCategory.slice(1).toLowerCase();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8 capitalize">
          {categoryDisplayName} Haberleri
        </h1>
        
        {/* Error State */}
        {hasError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">Hata Oluştu</h2>
            <p className="text-red-600 mb-4">Haberler yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin.</p>
            <a href="/" className="text-primary hover:text-blue-700 font-medium">Ana Sayfaya Dön</a>
          </div>
        )}

        {/* Empty State */}
        {!hasError && categoryNews.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Henüz Haber Yok</h2>
            <p className="text-gray-500 mb-8">Bu kategoride henüz haber yayınlanmamış.</p>
            <a href="/admin/news/new" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              İlk Haberi Ekle
            </a>
          </div>
        )}

        {/* News Grid */}
        {!hasError && categoryNews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryNews.map((news, index) => (
              <NewsCard
                key={news?.id || `category-${decodedCategory}-${index}`}
                title={news?.title || 'Haber Başlığı'}
                category={news?.category || 'Gündem'}
                publishedAt={news?.published_at ? new Date(news.published_at).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR')}
                imageUrl={news?.image_url || (news?.images && news.images.length > 0 ? news.images[0] : 'https://via.placeholder.com/400x300?text=Resim+Yok')}
                slug={news?.slug}
                excerpt={news?.excerpt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;