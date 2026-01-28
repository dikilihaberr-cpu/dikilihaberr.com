'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAllNewsAdmin, deleteNews, updateNews, NewsItem } from '@/lib/supabase'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Edit2, Trash2, Eye, Plus } from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { logger } from '@/lib/utils/logger'
import { showToast } from '@/components/ui/Toast'

export default function NewsManagement() {
  const router = useRouter()
  const [news, setNews] = useState<NewsItem[]>([])
  const [filtered, setFiltered] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  const { isAdmin: adminStatus, loading: authLoading } = useAdminAuth()

  useEffect(() => {
    setIsAdmin(adminStatus)
    
    if (adminStatus && !authLoading) {
      loadNews()
    } else if (!authLoading && !adminStatus) {
      setLoading(false)
    }
  }, [adminStatus, authLoading])

  const loadNews = async () => {
    setLoading(true)
    try {
      const allNews = await getAllNewsAdmin()
      setNews(allNews)
      filterNews(allNews, searchTerm, filterStatus, filterCategory)
    } catch (error) {
      logger.error('Error loading news:', error)
      showToast('Haberler yüklenirken hata oluştu', 'error')
    } finally {
      setLoading(false)
    }
  }

  const filterNews = (items: NewsItem[], search: string, status: string, category: string) => {
    let result = items

    if (search) {
      result = result.filter(n => n.title.toLowerCase().includes(search.toLowerCase()))
    }

    if (status !== 'all') {
      if (status === 'published') result = result.filter(n => n.is_published)
      else if (status === 'draft') result = result.filter(n => n.is_draft)
    }

    if (category !== 'all') {
      result = result.filter(n => n.category === category)
    }

    setFiltered(result)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterNews(news, term, filterStatus, filterCategory)
  }

  const handleStatusFilter = (status: string) => {
    setFilterStatus(status)
    filterNews(news, searchTerm, status, filterCategory)
  }

  const handleCategoryFilter = (category: string) => {
    setFilterCategory(category)
    filterNews(news, searchTerm, filterStatus, category)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Haberi silmek istediğinizden emin misiniz?')) return

    try {
      await deleteNews(id)
      setNews(news.filter(n => n.id !== id))
      filterNews(news.filter(n => n.id !== id), searchTerm, filterStatus, filterCategory)
      showToast('Haber başarıyla silindi!', 'success')
    } catch (error) {
      logger.error('Error deleting news:', error)
      showToast('Haber silinemedi', 'error')
    }
  }

  const handleToggleFeature = async (id: string, feature: 'featured' | 'is_trending' | 'is_daily_news', value: boolean) => {
    try {
      const updates: Partial<NewsItem> = { [feature]: value }
      const success = await updateNews(id, updates)
      
      if (success) {
        const featureNames = {
          featured: 'Öne Çıkan',
          is_trending: 'Trend Haber',
          is_daily_news: 'Günün Haberi'
        }
        showToast(
          `${featureNames[feature]} ${value ? 'aktif' : 'pasif'} edildi!`,
          'success'
        )
        // Haber listesini güncelle
        const updatedNews = news.map(n => n.id === id ? { ...n, [feature]: value } : n)
        setNews(updatedNews)
        filterNews(updatedNews, searchTerm, filterStatus, filterCategory)
      } else {
        showToast('Özellik güncellenirken hata oluştu!', 'error')
      }
    } catch (error) {
      logger.error('Error toggling feature:', error)
      showToast('Özellik güncellenirken beklenmedik bir hata oluştu!', 'error')
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Haberler yükleniyor..." />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Erişim Reddedildi</h1>
          <p className="text-gray-600 mb-6">Bu sayfaya erişmek için admin yetkisine sahip olmalısınız.</p>
          <Link href="/admin" className="text-blue-600 hover:text-blue-700">
            Admin Paneline Dön
          </Link>
        </div>
      </div>
    )
  }

  const categories = [...new Set(news.map(n => n.category))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Haberler Yönetimi</h1>
              <p className="text-sm text-gray-600 mt-1">{filtered.length} haber</p>
            </div>
            <Link
              href="/admin/news/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Yeni Haber
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Haber ara..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="published">Yayında</option>
              <option value="draft">Taslak</option>
            </select>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* News Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Resim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Başlık</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Özellikler</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Görüntülenme</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Tarih</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      Haber bulunamadı
                    </td>
                  </tr>
                ) : (
                  filtered.map(newsItem => (
                    <tr key={newsItem.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100">
                          {newsItem.image_url || (newsItem.images && newsItem.images.length > 0) ? (
                            <img
                              src={newsItem.image_url || (newsItem.images && newsItem.images[0])}
                              alt={newsItem.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150?text=Resim+Yok'
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              Resim Yok
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm font-medium text-gray-900 line-clamp-2">{newsItem.title}</div>
                          {newsItem.excerpt && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-1">{newsItem.excerpt}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {newsItem.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          newsItem.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {newsItem.is_published ? 'Yayında' : 'Taslak'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleFeature(newsItem.id, 'featured', !newsItem.featured)}
                            className={`text-xs px-2 py-1 rounded transition-colors ${
                              newsItem.featured
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            title="Öne Çıkan"
                          >
                            ⭐
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleFeature(newsItem.id, 'is_trending', !(newsItem.is_trending || false))}
                            className={`text-xs px-2 py-1 rounded transition-colors ${
                              newsItem.is_trending
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            title="Trend Haber"
                          >
                            🔥
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleFeature(newsItem.id, 'is_daily_news', !(newsItem.is_daily_news || false))}
                            className={`text-xs px-2 py-1 rounded transition-colors ${
                              newsItem.is_daily_news
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            title="Günün Haberi"
                          >
                            📰
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{newsItem.views || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex flex-col">
                          <span>{new Date(newsItem.created_at).toLocaleDateString('tr-TR')}</span>
                          {newsItem.updated_at && newsItem.updated_at !== newsItem.created_at && (
                            <span className="text-xs text-gray-400">Güncelleme: {new Date(newsItem.updated_at).toLocaleDateString('tr-TR')}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Link
                            href={`/news/${newsItem.slug}`}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Görüntüle"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/news/edit/${newsItem.id}`}
                            className="text-yellow-600 hover:text-yellow-900 transition-colors"
                            title="Düzenle"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(newsItem.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
