// BreakingNewsTicker component
import React from 'react'
import { AlertCircle } from 'lucide-react'
import { getAllNews, NewsItem } from '@/lib/supabase'

const BreakingNewsTicker = async (): Promise<React.JSX.Element> => {
  // Hata yönetimi ile haberleri getir
  let allNews: NewsItem[] = [];
  
  try {
    allNews = await getAllNews() || [];
  } catch (error) {
    allNews = [];
  }
  
  const breakingNews = allNews.slice(0, 5)
    .filter(news => news?.title)
    .map(news => ({
      id: news.id,
      title: news.title || ''
    }))

  // If no news, don't show fake data
  if (breakingNews.length === 0) {
    return <></>
  }

  return (
    <div className="bg-accent text-white py-3 overflow-hidden relative" role="status" aria-live="polite" aria-label="Son dakika haberleri">
      <div className="flex items-center space-x-4">
        <AlertCircle className="h-5 w-5 flex-shrink-0 ml-4 animate-pulse z-10" aria-hidden="true" />
        <div className="flex space-x-8 overflow-hidden flex-1">
          <div className="flex space-x-8 animate-marquee whitespace-nowrap">
            {breakingNews.map((news) => (
              <span key={news.id} className="font-semibold inline-block">{news.title}</span>
            ))}
            {/* Duplicate for seamless loop */}
            {breakingNews.map((news) => (
              <span key={`${news.id}-dup`} className="font-semibold inline-block">{news.title}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BreakingNewsTicker