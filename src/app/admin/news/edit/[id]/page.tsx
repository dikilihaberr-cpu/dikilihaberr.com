'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getNewsByIdAdmin, updateNews, NewsItem } from '@/lib/supabase'
import ImageUpload from '@/components/ImageUpload'
import { showToast } from '@/components/ui/Toast'
import { use } from 'react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { logger } from '@/lib/utils/logger'

interface EditNewsPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditNewsPage({ params }: EditNewsPageProps) {
  const { isAdmin, loading: authLoading } = useAdminAuth()
  // Next.js 16'da params artık Promise, React.use() ile unwrap etmeliyiz
  const { id } = use(params)
  
  // TÜM HOOK'LAR ERKEN RETURN'LERDEN ÖNCE ÇAĞRILMALI (React Rules of Hooks)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    featured: false,
    isTrending: false,
    isDailyNews: false,
    imageUrl: '',
    images: [] as string[],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const categories = ['Gündem', 'Siyaset', 'Ekonomi', 'Spor', 'Magazin', 'Teknoloji']

  // TÜM HOOK'LAR ERKEN RETURN'LERDEN ÖNCE ÇAĞRILMALI
  useEffect(() => {
    // Admin kontrolü yapılmadan önce hook çağrılmamalı, bu yüzden içeride kontrol ediyoruz
    if (!isAdmin || authLoading) return
    
    const fetchNews = async () => {
      try {
        // Admin için özel fonksiyon kullan - RLS policy'yi bypass eder
        const news = await getNewsByIdAdmin(id)

        if (news) {
          setFormData({
            title: news.title || '',
            excerpt: news.excerpt || '',
            content: news.content || '',
            category: news.category || '',
            author: news.author || '',
            featured: news.featured || false,
            isTrending: news.is_trending || false,
            isDailyNews: news.is_daily_news || false,
            imageUrl: news.image_url || '',
            images: news.images || [],
          })
        } else {
          showToast('Haber bulunamadı!', 'error')
          router.push('/admin/news')
        }
      } catch (error) {
        logger.error('Error fetching news:', error)
        showToast('Haber yüklenirken hata oluştu!', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [id, router, isAdmin, authLoading])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageSelect = (url: string) => {
    // Ek resimler listesine ekle
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }))
  }

  const handleMainImageSelect = (url: string) => {
    // Ana görseli güncelle
    setFormData(prev => ({ ...prev, imageUrl: url }))
  }

  // Resim optimizasyonu için helper fonksiyon
  const optimizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve(file)
            return
          }

          const maxWidth = 1920
          const maxHeight = 1080
          let width = img.width
          let height = img.height

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (height * maxWidth) / width
              width = maxWidth
            } else {
              width = (width * maxHeight) / height
              height = maxHeight
            }
          }

          canvas.width = width
          canvas.height = height

          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
                  type: 'image/webp',
                  lastModified: Date.now()
                })
                resolve(optimizedFile)
              } else {
                resolve(file)
              }
            },
            'image/webp',
            0.92
          )
        }
        img.onerror = () => resolve(file)
        img.src = e.target?.result as string
      }
      reader.onerror = () => resolve(file)
      reader.readAsDataURL(file)
    })
  }

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Lütfen sadece resim dosyası seçin!', 'error')
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast('Dosya boyutu 15MB\'dan küçük olmalıdır!', 'error')
      return
    }

    try {
      showToast('Resim optimize ediliyor...', 'info')
      
      const optimizedFile = await optimizeImage(file)
      
      const { uploadImage } = await import('@/lib/supabase')
      const uploadedUrl = await uploadImage(optimizedFile, 'news-images')

      if (uploadedUrl) {
        handleMainImageSelect(uploadedUrl)
        showToast('Ana görsel başarıyla yüklendi!', 'success')
      } else {
        showToast('Resim yüklenirken hata oluştu!', 'error')
      }
    } catch (error) {
      logger.error('Error uploading main image:', error)
      showToast('Resim yüklenirken hata oluştu!', 'error')
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Form validation
    if (!formData.title.trim()) {
      showToast('Lütfen haber başlığı girin!', 'warning')
      return
    }
    if (!formData.content.trim()) {
      showToast('Lütfen haber içeriği girin!', 'warning')
      return
    }
    if (!formData.category) {
      showToast('Lütfen kategori seçin!', 'warning')
      return
    }
    if (formData.excerpt && formData.excerpt.length > 150) {
      showToast('Özet 150 karakterden uzun olamaz!', 'warning')
      return
    }

    setSaving(true)
    try {
      const success = await updateNews(id, {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        author: formData.author,
        featured: formData.featured,
        is_trending: formData.isTrending,
        is_daily_news: formData.isDailyNews,
        image_url: formData.imageUrl,
        images: formData.images,
      })

      if (success) {
        showToast('Haber başarıyla güncellendi!', 'success')
        setTimeout(() => {
          router.push('/admin/news')
        }, 1000)
      } else {
        showToast('Haber güncellenirken hata oluştu!', 'error')
      }
    } catch (error) {
      logger.error('Error updating news:', error)
      showToast('Haber güncellenirken beklenmedik bir hata oluştu!', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return <LoadingSpinner fullScreen text="Yükleniyor..." />
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/news" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Haber Yönetimine Dön
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Haberi Düzenle</h1>
          <p className="text-gray-600 mt-2">Haber bilgilerini güncelleyin</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Başlık */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-700">
              Başlık *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          {/* Özet */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium mb-2 text-gray-700">
              Özet
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          {/* İçerik */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2 text-gray-700">
              İçerik *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content || ''}
              onChange={handleInputChange}
              rows={10}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          {/* Kategori ve Yazar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2 text-gray-700">
                Kategori *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              >
                <option value="">Kategori Seçin</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium mb-2 text-gray-700">
                Yazar
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          {/* Resim Yönetimi */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">
                📷 Resim Yönetimi
              </label>
              
              {/* Ana Görsel */}
              <div className="mb-4">
                <label htmlFor="imageUrl" className="block text-sm font-medium mb-2 text-gray-700">
                  Ana Görsel *
                </label>
                <div className="space-y-3">
                  {/* Yükleme Butonu ve URL Input */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl || ''}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg veya dosya yükleyin"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      />
                    </div>
                    <label className="flex-shrink-0 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition cursor-pointer flex items-center">
                      <span className="flex items-center gap-2">
                        📷 Dosya Seç
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageUpload}
                          className="hidden"
                        />
                      </span>
                    </label>
                  </div>
                  
                  {/* Önizleme */}
                  {formData.imageUrl && (
                    <div className="relative w-full max-w-md rounded-lg overflow-hidden border-2 border-blue-500 shadow-lg">
                      <img
                        src={formData.imageUrl}
                        alt="Ana görsel önizleme"
                        className="w-full h-auto max-h-64 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150?text=Resim+Yok'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition"
                        title="Ana görseli kaldır"
                      >
                        <span className="text-sm font-bold">×</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Modern Resim Yükleme Sistemi */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Ek Resimler (Opsiyonel)
                </label>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  currentImages={formData.images}
                  onRemoveImage={handleRemoveImage}
                  maxImages={10}
                />
              </div>

              {/* Mevcut Resimler Önizleme */}
              {formData.images && formData.images.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Eklenen Ek Resimler ({formData.images.length})
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Ek resim ${idx + 1}`}
                          className="w-full h-20 object-cover rounded-lg border border-gray-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150?text=Resim+Yok'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <span className="text-xs">×</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Öne Çıkan, Trending ve Günün Haberi */}
          <div className="space-y-3 bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                ⭐ Öne çıkan haber olarak işaretle (Featured)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isTrending"
                name="isTrending"
                checked={formData.isTrending}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isTrending" className="ml-2 block text-sm text-gray-700">
                🔥 Trend haber olarak göster
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDailyNews"
                name="isDailyNews"
                checked={formData.isDailyNews}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isDailyNews" className="ml-2 block text-sm text-gray-700">
                📰 Günün haberi olarak göster
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/news"
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Kaydediliyor...' : 'Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}