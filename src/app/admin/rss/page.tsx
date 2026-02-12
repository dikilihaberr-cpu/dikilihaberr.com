'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { showToast } from '@/components/ui/Toast'
import { Plus, Trash2, RefreshCw, ExternalLink, Download } from 'lucide-react'
import { logger } from '@/lib/utils/logger'

interface RSSFeedConfig {
  id: string
  name: string
  url: string
  enabled: boolean
  category?: string
}

export default function RSSManagement() {
  const { isAdmin, loading } = useAdminAuth()
  const [feeds, setFeeds] = useState<RSSFeedConfig[]>([])
  const [loadingFeeds, setLoadingFeeds] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newFeed, setNewFeed] = useState({ name: '', url: '', category: '' })
  const [testingUrl, setTestingUrl] = useState('')
  const [testResult, setTestResult] = useState<any>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)

  useEffect(() => {
    if (isAdmin && !loading) {
      loadFeeds()
    }
  }, [isAdmin, loading])

  const loadFeeds = async () => {
    setLoadingFeeds(true)
    try {
      // LocalStorage'dan RSS feed'leri yükle (production'da Supabase'e taşınabilir)
      const saved = localStorage.getItem('rssFeeds')
      if (saved) {
        setFeeds(JSON.parse(saved))
      }
    } catch (error) {
      logger.error('Error loading RSS feeds:', error)
    } finally {
      setLoadingFeeds(false)
    }
  }

  const saveFeeds = (updatedFeeds: RSSFeedConfig[]) => {
    localStorage.setItem('rssFeeds', JSON.stringify(updatedFeeds))
    setFeeds(updatedFeeds)
  }

  const addFeed = () => {
    if (!newFeed.name || !newFeed.url) {
      showToast('Lütfen isim ve URL girin!', 'warning')
      return
    }

    const feed: RSSFeedConfig = {
      id: Date.now().toString(),
      name: newFeed.name,
      url: newFeed.url,
      enabled: true,
      category: newFeed.category || undefined,
    }

    saveFeeds([...feeds, feed])
    setNewFeed({ name: '', url: '', category: '' })
    setShowAddForm(false)
    showToast('RSS feed eklendi!', 'success')
  }

  const deleteFeed = (id: string) => {
    if (confirm('Bu RSS feed\'i silmek istediğinizden emin misiniz?')) {
      saveFeeds(feeds.filter(f => f.id !== id))
      showToast('RSS feed silindi!', 'success')
    }
  }

  const toggleFeed = (id: string) => {
    saveFeeds(feeds.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))
  }

  const testFeed = async () => {
    if (!testingUrl) {
      showToast('Lütfen bir URL girin!', 'warning')
      return
    }

    try {
      const response = await fetch(`/api/rss/parse?url=${encodeURIComponent(testingUrl)}`)
      const data = await response.json()

      if (data.error) {
        setTestResult({ error: data.error })
        showToast('RSS feed test edilemedi!', 'error')
      } else {
        setTestResult(data)
        showToast('RSS feed başarıyla test edildi!', 'success')
      }
    } catch (error) {
      logger.error('Error testing RSS feed:', error)
      showToast('RSS feed test edilemedi!', 'error')
    }
  }

  const importNews = async () => {
    const activeFeeds = feeds.filter(f => f.enabled)
    
    if (activeFeeds.length === 0) {
      showToast('Aktif RSS feed bulunamadı!', 'warning')
      return
    }

    setImporting(true)
    setImportResult(null)

    try {
      const response = await fetch('/api/rss/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feeds: activeFeeds.map(f => ({
            name: f.name,
            url: f.url,
            category: f.category,
            enabled: f.enabled
          }))
        })
      })

      const data = await response.json()

      if (data.error) {
        setImportResult({ error: data.error })
        showToast('Haber çekilemedi!', 'error')
      } else {
        setImportResult(data)
        const total = data.totalImported || 0
        const skipped = data.totalSkipped || 0
        showToast(`${total} haber çekildi, ${skipped} haber atlandı!`, 'success')
      }
    } catch (error) {
      logger.error('Error importing RSS news:', error)
      showToast('Haber çekilemedi!', 'error')
      setImportResult({ error: 'Sunucu hatası' })
    } finally {
      setImporting(false)
    }
  }

  if (loading) {
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Admin Paneline Dön
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">RSS Feed Yönetimi</h1>
          <p className="text-gray-600 mt-2">
            Başka haber sitelerinden RSS feed'leri ekleyerek haberleri otomatik çekebilirsiniz.
            <br />
            <span className="text-sm text-orange-600 font-semibold">
              ⚠️ Yasal Uyarı: Sadece başlık, özet ve link çekilir. Tam içerik kopyalanmaz.
            </span>
          </p>
        </div>

        {/* Test RSS Feed */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">RSS Feed Test Et</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={testingUrl}
              onChange={(e) => setTestingUrl(e.target.value)}
              placeholder="RSS Feed URL'i (örn: https://example.com/rss.xml)"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
            />
            <button
              onClick={testFeed}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              <RefreshCw className="h-5 w-5 inline mr-2" />
              Test Et
            </button>
          </div>
          {testResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              {testResult.error ? (
                <p className="text-red-600">❌ {testResult.error}</p>
              ) : (
                <div>
                  <p className="text-green-600 font-semibold mb-2">✅ RSS Feed geçerli!</p>
                  <p><strong>Başlık:</strong> {testResult.title}</p>
                  <p><strong>Haber Sayısı:</strong> {testResult.items?.length || 0}</p>
                  {testResult.items && testResult.items.length > 0 && (
                    <div className="mt-3">
                      <p className="font-semibold mb-2">Örnek Haberler:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {testResult.items.slice(0, 3).map((item: any, idx: number) => (
                          <li key={idx}>{item.title}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RSS Feed Listesi */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">RSS Feed'ler</h2>
            <div className="flex gap-3">
              {feeds.filter(f => f.enabled).length > 0 && (
                <button
                  onClick={importNews}
                  disabled={importing}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center"
                >
                  {importing ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Çekiliyor...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5 mr-2" />
                      RSS'den Haber Çek
                    </>
                  )}
                </button>
              )}
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Yeni Feed Ekle
              </button>
            </div>
          </div>

          {/* Import Sonuçları */}
          {importResult && (
            <div className={`mb-6 p-4 rounded-lg ${importResult.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              {importResult.error ? (
                <p className="text-red-800 font-semibold">❌ Hata: {importResult.error}</p>
              ) : (
                <div>
                  <p className="text-green-800 font-semibold mb-2">✅ Haber Çekme Tamamlandı!</p>
                  <p className="text-sm text-green-700">
                    <strong>{importResult.totalImported || 0}</strong> yeni haber eklendi,{' '}
                    <strong>{importResult.totalSkipped || 0}</strong> haber atlandı (zaten mevcut).
                  </p>
                  {importResult.feedResults && importResult.feedResults.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-semibold text-green-800">Feed Bazında Sonuçlar:</p>
                      {importResult.feedResults.map((result: any, idx: number) => (
                        <div key={idx} className="text-sm text-green-700 pl-4">
                          • <strong>{result.feedName}</strong>: {result.imported} eklendi, {result.skipped} atlandı
                          {result.errors && result.errors.length > 0 && (
                            <div className="text-red-600 text-xs pl-4 mt-1">
                              Hatalar: {result.errors.slice(0, 3).join(', ')}
                              {result.errors.length > 3 && ` (+${result.errors.length - 3} daha)`}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <Link
                    href="/admin/news?status=draft"
                    className="mt-3 inline-block text-blue-600 hover:text-blue-700 text-sm font-semibold"
                  >
                    → Çekilen haberleri görüntüle ve onayla
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Add Form */}
          {showAddForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-4">Yeni RSS Feed Ekle</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newFeed.name}
                  onChange={(e) => setNewFeed({ ...newFeed, name: e.target.value })}
                  placeholder="Feed İsmi (örn: Hürriyet Gündem)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
                <input
                  type="url"
                  value={newFeed.url}
                  onChange={(e) => setNewFeed({ ...newFeed, url: e.target.value })}
                  placeholder="RSS Feed URL'i"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
                <input
                  type="text"
                  value={newFeed.category}
                  onChange={(e) => setNewFeed({ ...newFeed, category: e.target.value })}
                  placeholder="Kategori (opsiyonel)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addFeed}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                  >
                    Ekle
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setNewFeed({ name: '', url: '', category: '' })
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-semibold transition"
                  >
                    İptal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Feed List */}
          {loadingFeeds ? (
            <LoadingSpinner text="Yükleniyor..." />
          ) : feeds.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Henüz RSS feed eklenmemiş.</p>
              <p className="text-sm mt-2">Yukarıdaki "Yeni Feed Ekle" butonuna tıklayarak ekleyebilirsiniz.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {feeds.map((feed) => (
                <div
                  key={feed.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={feed.enabled}
                        onChange={() => toggleFeed(feed.id)}
                        className="w-5 h-5"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{feed.name}</h3>
                        <p className="text-sm text-gray-600">{feed.url}</p>
                        {feed.category && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
                            {feed.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={feed.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                      title="RSS Feed'i Aç"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                    <button
                      onClick={() => deleteFeed(feed.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Sil"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bilgilendirme */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">📚 RSS Feed Nasıl Kullanılır?</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-blue-800">
            <li>RSS feed URL'lerini ekleyerek başka haber sitelerinden haberleri otomatik çekebilirsiniz.</li>
            <li>Sadece <strong>başlık, özet ve link</strong> çekilir - tam içerik kopyalanmaz (yasal).</li>
            <li>Çekilen haberler admin panelinde görüntülenir ve onaylandıktan sonra yayınlanır.</li>
            <li>Örnek RSS feed URL'leri: <code className="bg-blue-100 px-1 rounded">https://www.hurriyet.com.tr/rss/gundem</code></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
