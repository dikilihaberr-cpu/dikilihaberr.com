'use client'

import { useState, useEffect, Suspense } from 'react'
import type { Metadata } from 'next'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import NewsCard from '@/components/ui/NewsCard'
import { searchNews, NewsItem } from '@/lib/supabase'
import { Search, Loader2 } from 'lucide-react'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(query)

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const newsResults = await searchNews(searchTerm)
      setResults(newsResults)
    } catch (error) {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">Haber Ara</h1>
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Aramak istediğiniz haberi yazın..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
            />
            <button
              type="submit"
              className="absolute left-4 top-3.5 text-gray-400 hover:text-primary transition-colors"
            >
              <Search className="h-6 w-6" />
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Aranıyor...</p>
          </div>
        ) : query ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                <span className="font-semibold">{results.length}</span> sonuç bulundu: &quot;
                <span className="font-semibold text-primary">{query}</span>&quot;
              </p>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-600 mb-2">Sonuç Bulunamadı</h2>
                <p className="text-gray-500 mb-6">
                  &quot;{query}&quot; için arama sonucu bulunamadı. Farklı kelimeler deneyin.
                </p>
                <Link
                  href="/"
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Ana Sayfaya Dön
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((news, index) => (
                  <NewsCard
                    key={news?.id || `search-${query}-${index}`}
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
          </>
        ) : (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Arama Yapın</h2>
            <p className="text-gray-500">Yukarıdaki arama kutusuna aramak istediğiniz kelimeyi yazın.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
