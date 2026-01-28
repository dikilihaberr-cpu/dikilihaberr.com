'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Search, Image as ImageIcon, X, Loader2 } from 'lucide-react'
import { logger } from '@/lib/utils/logger'
import { showToast } from './ui/Toast'

interface ImageUploadProps {
  onImageSelect: (url: string) => void
  currentImages?: string[]
  onRemoveImage?: (index: number) => void
  maxImages?: number
}

export default function ImageUpload({
  onImageSelect,
  currentImages = [],
  onRemoveImage,
  maxImages = 10
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'search' | 'auto'>('upload')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Dosya sürükleme işlemleri
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await handleFileUpload(files[0])
    }
  }, [])

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

  // Dosya yükleme işlemi
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Lütfen sadece resim dosyası seçin!', 'error')
      return
    }

    if (file.size > 15 * 1024 * 1024) { // 15MB limit
      showToast('Dosya boyutu 15MB\'dan küçük olmalıdır!', 'error')
      return
    }

    setIsUploading(true)

    try {
      // Resmi optimize et (kaliteyi koruyarak boyutu küçült)
      const optimizedFile = await optimizeImage(file)
      
      // Import uploadImage function dynamically to avoid circular imports
      const { uploadImage } = await import('@/lib/supabase')

      const uploadedUrl = await uploadImage(optimizedFile, 'news-images')

      if (uploadedUrl) {
        onImageSelect(uploadedUrl)
        showToast('Resim başarıyla yüklendi ve optimize edildi!', 'success')
      } else {
        showToast('Resim yüklenirken hata oluştu!', 'error')
      }

    } catch (error) {
      logger.error('Upload error:', error)
      showToast('Resim yüklenirken hata oluştu!', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  // Dosya seçme
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  // Google resim arama simülasyonu
  const searchGoogleImages = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    try {
      // Import searchImages function dynamically
      const { searchImages } = await import('@/lib/supabase')

      const results = await searchImages(searchQuery)
      setSearchResults(results)

    } catch (error) {
      logger.error('Search error:', error)
      showToast('Resim arama sırasında hata oluştu!', 'error')
    } finally {
      setIsSearching(false)
    }
  }

  // Otomatik resim önerisi
  const generateAutoImages = async (title: string) => {
    setIsSearching(true)

    try {
      // Başlıktan anahtar kelimeler çıkar
      const keywords = title.toLowerCase().split(' ').slice(0, 3).join(' ')

      // Import searchImages function dynamically
      const { searchImages } = await import('@/lib/supabase')

      const results = await searchImages(keywords)
      setSearchResults(results)

    } catch (error) {
      logger.error('Auto generate error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-600">
        {[
          { id: 'upload', label: 'Bilgisayardan', icon: Upload },
          { id: 'url', label: 'URL', icon: ImageIcon },
          { id: 'search', label: 'Google Arama', icon: Search },
          { id: 'auto', label: 'Otomatik', icon: ImageIcon },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setActiveTab(id as any)
            }}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
            aria-label={`${label} sekmesi`}
            aria-selected={activeTab === id}
            role="tab"
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="animate-spin" size={48} />
              <p className="text-gray-400">Resim yükleniyor...</p>
            </div>
          ) : (
            <>
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-2">Resmi sürükleyin veya seçin</p>
              <p className="text-gray-400 mb-4">PNG, JPG, GIF (max 5MB)</p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
              >
                Dosya Seç
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </>
          )}
        </div>
      )}

      {/* URL Tab */}
      {activeTab === 'url' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Resim URL'si girin (https://...)"
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement
                  if (input.value.trim()) {
                    onImageSelect(input.value.trim())
                    input.value = ''
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const input = document.querySelector('input[type="url"]') as HTMLInputElement
                if (input && input.value.trim()) {
                  onImageSelect(input.value.trim())
                  input.value = ''
                }
              }}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
            >
              Ekle
            </button>
          </div>
        </div>
      )}

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Resim ara (ör: doğa, şehir, teknoloji)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchGoogleImages()}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                searchGoogleImages()
              }}
              disabled={isSearching || !searchQuery.trim()}
              className="px-4 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition flex items-center gap-2"
            >
              {isSearching ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
              Ara
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {searchResults.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Search result ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onImageSelect(url)
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onImageSelect(url)
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg"
                  >
                    <span className="text-white font-medium">Seç</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Auto Tab */}
      {activeTab === 'auto' && (
        <div className="space-y-4">
          <div className="text-center p-6 bg-gray-700/50 rounded-lg">
            <ImageIcon size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-2">Otomatik Resim Önerisi</p>
            <p className="text-gray-400 mb-4">Haber başlığına göre ilgili resimler öner</p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const titleInput = document.querySelector('input[name="title"]') as HTMLInputElement
                if (titleInput?.value) {
                  generateAutoImages(titleInput.value)
                } else {
                  showToast('Önce haber başlığını girin!', 'warning')
                }
              }}
              disabled={isSearching}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition flex items-center gap-2 mx-auto"
            >
              {isSearching ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={16} />}
              Önerileri Getir
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {searchResults.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Auto suggestion ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onImageSelect(url)
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onImageSelect(url)
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg"
                  >
                    <span className="text-white font-medium">Seç</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Current Images */}
      {currentImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Eklenen Resimler ({currentImages.length}/{maxImages})</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentImages.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Current ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                {onRemoveImage && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onRemoveImage(index)
                    }}
                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={14} className="text-white" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}