'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllAds, addAd, updateAd, deleteAd, Ad } from '@/lib/supabase'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { showToast } from '@/components/ui/Toast'
import { logger } from '@/lib/utils/logger'
import { Plus, Edit2, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react'

export default function AdsPage() {
  const { isAdmin, loading: authLoading } = useAdminAuth()
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    position: 'sidebar' as 'sidebar' | 'header' | 'footer' | 'content',
    is_active: true,
    start_date: '',
    end_date: '',
  })

  useEffect(() => {
    if (isAdmin && !authLoading) {
      loadAds()
    }
  }, [isAdmin, authLoading])

  const loadAds = async () => {
    setLoading(true)
    try {
      const allAds = await getAllAds()
      setAds(allAds)
    } catch (error) {
      logger.error('Error loading ads:', error)
      showToast('Reklamlar yüklenirken hata oluştu', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.image_url) {
      showToast('Başlık ve resim URL zorunludur!', 'warning')
      return
    }

    try {
      const adData = {
        ...formData,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
      }

      if (editingAd) {
        const updated = await updateAd(editingAd.id, adData)
        if (updated) {
          showToast('Reklam güncellendi!', 'success')
          setEditingAd(null)
          setShowForm(false)
          resetForm()
          await loadAds()
        } else {
          showToast('Reklam güncellenirken hata oluştu', 'error')
        }
      } else {
        const newAd = await addAd(adData)
        if (newAd) {
          showToast('Reklam eklendi!', 'success')
          setShowForm(false)
          resetForm()
          await loadAds()
        } else {
          showToast('Reklam eklenirken hata oluştu. Lütfen tekrar deneyin.', 'error')
        }
      }
    } catch (error) {
      logger.error('Error saving ad:', error)
      showToast('Bir hata oluştu', 'error')
    }
  }

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad)
    setFormData({
      title: ad.title,
      description: ad.description || '',
      image_url: ad.image_url,
      link_url: ad.link_url || '',
      position: ad.position,
      is_active: ad.is_active,
      start_date: ad.start_date ? ad.start_date.split('T')[0] : '',
      end_date: ad.end_date ? ad.end_date.split('T')[0] : '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu reklamı silmek istediğinizden emin misiniz?')) return

    try {
      const success = await deleteAd(id)
      if (success) {
        showToast('Reklam silindi!', 'success')
        await loadAds()
      } else {
        showToast('Reklam silinirken hata oluştu', 'error')
      }
    } catch (error) {
      logger.error('Error deleting ad:', error)
      showToast('Bir hata oluştu', 'error')
    }
  }

  const toggleActive = async (ad: Ad) => {
    try {
      const updated = await updateAd(ad.id, { is_active: !ad.is_active })
      if (updated) {
        showToast(`Reklam ${!ad.is_active ? 'aktif' : 'pasif'} edildi`, 'success')
        await loadAds()
      }
    } catch (error) {
      logger.error('Error toggling ad:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      position: 'sidebar',
      is_active: true,
      start_date: '',
      end_date: '',
    })
    setEditingAd(null)
  }

  if (authLoading) {
    return <LoadingSpinner fullScreen text="Yükleniyor..." />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Erişim Reddedildi</h1>
          <p className="text-gray-600 mb-6">Bu sayfaya erişmek için admin yetkisine sahip olmalısınız.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Reklamlar yükleniyor..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reklam Yönetimi</h1>
              <p className="text-sm text-gray-600">{ads.length} reklam</p>
            </div>
            <button
              onClick={() => {
                resetForm()
                setShowForm(!showForm)
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              {showForm ? 'İptal' : 'Yeni Reklam'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingAd ? 'Reklam Düzenle' : 'Yeni Reklam Ekle'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resim URL *</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                <input
                  type="url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pozisyon *</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sidebar">Sidebar</option>
                  <option value="header">Header</option>
                  <option value="footer">Footer</option>
                  <option value="content">Content</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="ml-2 text-sm text-gray-700">Aktif</label>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingAd ? 'Güncelle' : 'Ekle'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Ads List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Tüm Reklamlar</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Resim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Başlık</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Pozisyon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">İstatistikler</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Henüz reklam yok
                    </td>
                  </tr>
                ) : (
                  ads.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <img
                          src={ad.image_url}
                          alt={ad.title}
                          className="w-20 h-16 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150?text=Resim+Yok'
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{ad.title}</p>
                          {ad.description && (
                            <p className="text-xs text-gray-500 mt-1">{ad.description.substring(0, 50)}...</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {ad.position}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleActive(ad)}
                          className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${
                            ad.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {ad.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                          {ad.is_active ? 'Aktif' : 'Pasif'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="space-y-1">
                          <p>👁️ {ad.view_count} görüntüleme</p>
                          <p>🖱️ {ad.click_count} tıklama</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(ad)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Düzenle"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ad.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {ad.link_url && (
                            <a
                              href={ad.link_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-900"
                              title="Linki Aç"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
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
