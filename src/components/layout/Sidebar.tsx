// Sidebar component
'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import NewsCard from '@/components/ui/NewsCard';
import WeatherWidget from '@/components/ui/WeatherWidget';
import AdBanner from '@/components/ui/AdBanner';
import { getAllNews, NewsItem } from '@/lib/supabase';

const Sidebar = (): React.JSX.Element => {
  const [recentNews, setRecentNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentNews();
  }, []);

  const loadRecentNews = async () => {
    try {
      const news = await getAllNews() || [];
      // En son 5 haberi al
      setRecentNews(news.slice(0, 5));
    } catch (error) {
      setRecentNews([]);
    } finally {
      setLoading(false);
    }
  };

  // Kategorilere göre haber sayısını hesapla
  const categories = ['Gündem', 'Siyaset', 'Ekonomi', 'Spor', 'Magazin', 'Teknoloji'];
  const popularCategories = categories.map(category => ({
    name: category,
    count: recentNews.filter(n => n.category === category).length
  })).filter(cat => cat.count > 0);

  return (
    <aside className="space-y-8">
      {/* Weather Widget */}
      <WeatherWidget />

      {/* Sidebar Ad Banner - ÜST */}
      <AdBanner position="sidebar" className="w-full" />

      {/* Recent News */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
          <span className="mr-2">📰</span> Son Haberler
        </h3>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4 text-gray-500">Yükleniyor...</div>
          ) : recentNews.length > 0 ? (
            recentNews.map((news) => (
              <div key={news.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                <Link href={`/news/${news.slug}`} className="block">
                  <div className="flex items-start space-x-3">
                    {news.image_url && (
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={news.image_url || (news.images && news.images.length > 0 ? news.images[0] : 'https://via.placeholder.com/200x150?text=Resim+Yok')}
                          alt={news.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-primary transition-colors">
                        {news.title}
                      </h4>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>{news.published_at ? new Date(news.published_at).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">Henüz haber yok</div>
          )}
        </div>
      </div>

      {/* Sidebar Ad Banner - ORTA */}
      <AdBanner position="sidebar" className="w-full" />

      {/* Popular Categories */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
          <span className="mr-2">📊</span> Popüler Kategoriler
        </h3>
        <ul className="space-y-3">
          {popularCategories.length > 0 ? (
            popularCategories.map((category) => (
              <li key={category.name}>
                <Link
                  href={`/category/${category.name.toLowerCase()}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <span className="font-medium text-gray-900 group-hover:text-primary">
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </Link>
              </li>
            ))
          ) : (
            <li className="text-center py-4 text-gray-500 text-sm">Henüz kategori yok</li>
          )}
        </ul>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-lg font-bold mb-2">Bültenimize Abone Olun</h3>
        <p className="text-blue-100 mb-4 text-sm">
          En güncel haberleri e-posta ile alın.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="E-posta adresiniz"
            className="w-full px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
          />
          <button className="w-full bg-white text-primary py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
            Abone Ol
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;