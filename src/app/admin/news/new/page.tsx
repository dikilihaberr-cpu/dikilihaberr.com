'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { addNews, saveDraft } from '@/lib/supabase'
import ImageUpload from '@/components/ImageUpload'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import RichTextEditor from '@/components/ui/RichTextEditor'
import { logger } from '@/lib/utils/logger'
import { showToast } from '@/components/ui/Toast'

export default function NewNewsPage() {
  const { isAdmin, loading } = useAdminAuth()
  
  // TÜM HOOK'LAR ERKEN RETURN'LERDEN ÖNCE ÇAĞRILMALI (React Rules of Hooks)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    featured: false,
    isTrending: false, // Trending haber
    isDailyNews: false, // Günün haberi
    imageUrl: '',
    images: [] as string[],
    videoUrl: '',
    isPublished: false, // Admin onayı için
    isDraft: true, // Taslak olarak başlar
  })

  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)

  const categories = ['Gündem', 'Siyaset', 'Ekonomi', 'Spor', 'Magazin', 'Teknoloji']

  // LocalStorage'dan form verilerini yükle
  useEffect(() => {
    const savedData = localStorage.getItem('newsDraft')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        // Null değerleri boş string'e çevir
        const sanitized = {
          title: parsed.title || '',
          excerpt: parsed.excerpt || '',
          content: parsed.content || '',
          category: parsed.category || '',
          author: parsed.author || '',
          featured: parsed.featured || false,
          isTrending: parsed.isTrending || false,
          isDailyNews: parsed.isDailyNews || false,
          imageUrl: parsed.imageUrl || '',
          images: parsed.images || [],
          videoUrl: parsed.videoUrl || '',
          isPublished: parsed.isPublished || false,
          isDraft: parsed.isDraft !== undefined ? parsed.isDraft : true,
        }
        setFormData(prev => ({ ...prev, ...sanitized }))
      } catch (error) {
        logger.error('Error loading draft:', error)
      }
    }
  }, [])

  // Form verilerini localStorage'a kaydet (auto-save)
  useEffect(() => {
    if (autoSaveEnabled && formData.title) {
      const timer = setTimeout(() => {
        localStorage.setItem('newsDraft', JSON.stringify(formData))
        setLastSaved(new Date().toLocaleTimeString('tr-TR'))
      }, 2000) // 2 saniye sonra kaydet

      return () => clearTimeout(timer)
    }
  }, [formData, autoSaveEnabled])

  // Admin kontrolü - yüklenene kadar bekle
  if (loading) {
    return <LoadingSpinner fullScreen text="Yükleniyor..." />
  }

  // Admin değilse erişim reddedildi
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
            resolve(file) // Canvas desteklenmiyorsa orijinal dosyayı döndür
            return
          }

          // Maksimum boyutları belirle (kaliteyi koruyarak)
          const maxWidth = 1920
          const maxHeight = 1080
          let width = img.width
          let height = img.height

          // Boyutlandırma (aspect ratio korunarak)
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

          // Yüksek kaliteli rendering
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, width, height)

          // WebP formatına dönüştür (daha küçük dosya boyutu, yüksek kalite)
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
            0.92 // Yüksek kalite (0.92 = %92 kalite)
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
      
      // Resmi optimize et
      const optimizedFile = await optimizeImage(file)
      
      // Supabase'e yükle
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

  const saveAsDraft = async () => {
    if (isSavingDraft || isPublishing) return // Çift tıklama engelleme
    
    setIsSavingDraft(true)
    try {
      const draftData = {
        ...formData,
        image_url: formData.imageUrl,
        is_published: formData.isPublished,
        is_draft: formData.isDraft
      }
      const success = await saveDraft(draftData)

      if (success) {
        localStorage.removeItem('newsDraft') // Taslak kaydedildi, localStorage'ı temizle
        setLastSaved(new Date().toLocaleTimeString('tr-TR'))
        showToast('Taslak başarıyla kaydedildi!', 'success')
      } else {
        showToast('Taslak kaydedilirken hata oluştu!', 'error')
      }
    } catch (error) {
      logger.error('Error saving draft:', error)
      showToast('Taslak kaydedilirken beklenmedik bir hata oluştu!', 'error')
    } finally {
      setIsSavingDraft(false)
    }
  }

  const publishNews = async () => {
    if (isPublishing || isSavingDraft) return // Çift tıklama engelleme
    
    if (!formData.title || !formData.content || !formData.category) {
      showToast('Lütfen zorunlu alanları doldurun!', 'warning')
      return
    }

    setIsPublishing(true)
    try {
      const publishedData = {
        ...formData,
        image_url: formData.imageUrl,
        is_trending: formData.isTrending,
        is_daily_news: formData.isDailyNews,
        is_published: true, // Yayınla butonuna basıldığında her zaman true
        is_draft: false // Yayınlanan haber taslak değil
      }
      
      const result = await addNews(publishedData)

      if (result.data) {
        localStorage.removeItem('newsDraft') // Yayınlandı, localStorage'ı temizle
        showToast('Haber başarıyla yayınlandı!', 'success')
        // Formu sıfırla
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          category: '',
          author: '',
          featured: false,
          isTrending: false,
          isDailyNews: false,
          imageUrl: '',
          images: [],
          videoUrl: '',
          isPublished: false,
          isDraft: true,
        })
        // Başarılı yayınlamadan sonra haber listesine yönlendir
        setTimeout(() => {
          window.location.href = '/admin/news'
        }, 1500)
      } else {
        showToast(result.error || 'Haber yayınlanırken hata oluştu!', 'error')
      }
    } catch (error) {
      logger.error('Error publishing news:', error)
      showToast('Haber yayınlanırken beklenmedik bir hata oluştu!', 'error')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/news" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Haber Yönetimine Dön
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Yeni Haber Oluştur</h1>
          <p className="text-gray-600 mt-2">Detaylı bir haber oluşturmak için formu doldurun</p>
        </div>

        {/* Form */}
        <form className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Başlık */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Başlık *</label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              placeholder="Haber başlığını yazın..."
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          {/* Özet */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Özet *</label>
            <textarea
              name="excerpt"
              value={formData.excerpt || ''}
              onChange={handleInputChange}
              placeholder="Haber özetini yazın (maksimum 150 karakter)..."
              rows={2}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          {/* İçerik */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">İçerik *</label>
            <RichTextEditor
              value={formData.content || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
              placeholder="Haber içeriğini yazın... (Başlık, madde işaretleri, kalın/italik metin, resim ekleyebilirsiniz)"
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 İpucu: Metni seçerek kalın, italik yapabilir, başlık ekleyebilir, madde işaretleri kullanabilirsiniz.
            </p>
          </div>

          {/* Kategori ve Yazar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Kategori *</label>
              <select
                name="category"
                value={formData.category || ''}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              >
                <option value="">Kategori Seçin</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Yazar *</label>
              <input
                type="text"
                name="author"
                value={formData.author || ''}
                onChange={handleInputChange}
                placeholder="Yazar adı..."
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>
          </div>

          {/* Öne Çıkan, Trending ve Günün Haberi */}
          <div className="space-y-3 bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">⭐ Bu haberi öne çıkart (Featured)</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isTrending"
                checked={formData.isTrending}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">🔥 Trend haber olarak göster</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDailyNews"
                checked={formData.isDailyNews}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">📰 Günün haberi olarak göster</label>
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
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Ana Görsel *
                </label>
                <div className="space-y-3">
                  {/* Yükleme Butonu ve URL Input */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl || ''}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg veya dosya yükleyin"
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      />
                    </div>
                    <label className="flex-shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition cursor-pointer">
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

          {/* Video URL */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Video URL (İsteğe bağlı)</label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl || ''}
              onChange={handleInputChange}
              placeholder="YouTube, Vimeo veya başka bir video URL'si..."
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
            {formData.videoUrl && (
              <div className="mt-2 text-sm text-gray-600">
                Video URL eklendi: {formData.videoUrl.length > 50 ? formData.videoUrl.substring(0, 50) + '...' : formData.videoUrl}
              </div>
            )}
          </div>
          {/* Auto-save durumu */}
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={autoSaveEnabled}
                  onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                  className="w-4 h-4 mr-2"
                />
                <label className="text-sm text-gray-700">Otomatik kaydetmeyi etkinleştir</label>
              </div>
              {lastSaved && (
                <span className="text-sm text-green-600">Son kaydedilme: {lastSaved}</span>
              )}
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={publishNews}
              disabled={isPublishing || isSavingDraft}
              className={`bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition ${
                isPublishing || isSavingDraft
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-700'
              }`}
            >
              {isPublishing ? '⏳ Yayınlanıyor...' : '📤 Haber Yayınla'}
            </button>
            <button
              type="button"
              onClick={saveAsDraft}
              disabled={isPublishing || isSavingDraft}
              className={`bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition ${
                isPublishing || isSavingDraft
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-700'
              }`}
            >
              {isSavingDraft ? '⏳ Kaydediliyor...' : '💾 Taslak Olarak Kaydet'}
            </button>
            <Link 
              href="/admin/news" 
              className={`bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold transition text-center inline-block ${
                isPublishing || isSavingDraft
                  ? 'opacity-50 pointer-events-none'
                  : 'hover:bg-gray-300'
              }`}
            >
              ❌ İptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}