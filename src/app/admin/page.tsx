'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAllNewsAdmin, getTodayNews, getMostViewedNews, getPendingComments, getUnreadTips, NewsItem, CommentWithNews, Tip } from '@/lib/supabase'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { BarChart3, Users, MessageSquare, FileText, TrendingUp, AlertCircle } from 'lucide-react'
import { logger } from '@/lib/utils/logger'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { showToast } from '@/components/ui/Toast'

interface DashboardStats {
  totalNews: number
  todayNews: number
  draftNews: number
  pendingComments: number
  unreadTips: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalNews: 0,
    todayNews: 0,
    draftNews: 0,
    pendingComments: 0,
    unreadTips: 0,
  })
  
  const [recentNews, setRecentNews] = useState<NewsItem[]>([])
  const [todayNews, setTodayNews] = useState<NewsItem[]>([])
  const [mostViewed, setMostViewed] = useState<NewsItem[]>([])
  const [pendingComments, setPendingComments] = useState<CommentWithNews[]>([])
  const [tips, setTips] = useState<Tip[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const { isAdmin: adminStatus, loading: authLoading, userEmail: authEmail } = useAdminAuth()

  useEffect(() => {
    setIsAdmin(adminStatus)
    setUserEmail(authEmail)
    
    if (adminStatus && !authLoading) {
      loadDashboardData()
    } else if (!authLoading && !adminStatus) {
      setLoading(false)
    }
  }, [adminStatus, authLoading, authEmail])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [allNews, today, mostView, comments, unread] = await Promise.all([
        getAllNewsAdmin(),
        getTodayNews(),
        getMostViewedNews(5),
        getPendingComments(),
        getUnreadTips(),
      ])

      setRecentNews(allNews.slice(0, 5))
      setTodayNews(today)
      setMostViewed(mostView)
      setPendingComments(comments)
      setTips(unread)

      const draftCount = allNews.filter((n) => n.is_draft).length

      setStats({
        totalNews: allNews.length,
        todayNews: today.length,
        draftNews: draftCount,
        pendingComments: comments.length,
        unreadTips: unread.length,
      })
    } catch (error) {
      logger.error('Error loading dashboard data:', error)
      showToast('Dashboard verileri yüklenirken hata oluştu', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Auth loading kontrolü - sonsuz döngü önleme
  if (authLoading) {
    return <LoadingSpinner fullScreen text="Yükleniyor..." />
  }

  if (loading && !authLoading) {
    return <LoadingSpinner fullScreen text="Veriler yükleniyor..." />
  }

  if (!isAdmin && !authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
          <h1 className="text-2xl font-bold mb-4 mt-4">Erişim Reddedildi</h1>
          <p className="text-gray-600 mb-6">Bu sayfaya erişmek için admin yetkisine sahip olmalısınız.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 mt-2">{userEmail}</p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Siteyi Görüntüle
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            label="Toplam Haber"
            value={stats.totalNews}
            icon={<FileText className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            label="Bugün Eklenen"
            value={stats.todayNews}
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            label="Taslak"
            value={stats.draftNews}
            icon={<BarChart3 className="w-6 h-6" />}
            color="yellow"
          />
          <StatCard
            label="Beklemede Yorum"
            value={stats.pendingComments}
            icon={<MessageSquare className="w-6 h-6" />}
            color="red"
          />
          <StatCard
            label="Okunmamış İpucu"
            value={stats.unreadTips}
            icon={<AlertCircle className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <QuickActionButton href="/admin/news/new" label="+ Yeni Haber" color="blue" />
          <QuickActionButton href="/admin/news" label="📝 Haberleri Yönet" color="green" />
          <QuickActionButton href="/admin/users" label="👥 Kullanıcıları Yönet" color="purple" />
          <QuickActionButton href="/admin/comments" label="💬 Yorumları Kontrol Et" color="red" />
          <QuickActionButton href="/admin/ads" label="📢 Reklamları Yönet" color="yellow" />
          <QuickActionButton href="/admin/rss" label="📡 RSS Feed Yönet" color="blue" />
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent News */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Son Haberler</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentNews.length === 0 ? (
                <p className="px-6 py-4 text-gray-500">Haber bulunamadı</p>
              ) : (
                recentNews.map((news) => (
                  <div key={news.id} className="px-6 py-4 hover:bg-gray-50">
                    <p className="font-medium text-gray-900">{news.title}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">{news.category}</span>
                      <Link
                        href={`/admin/news/edit/${news.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Düzenle
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Link href="/admin/news" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Tüm Haberleri Görüntüle →
              </Link>
            </div>
          </div>

          {/* Pending Comments */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Beklemede Yorumlar</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {pendingComments.length === 0 ? (
                <p className="px-6 py-4 text-gray-500">Beklemede yorum yok</p>
              ) : (
                pendingComments.slice(0, 5).map((comment) => (
                  <div key={comment.id} className="px-6 py-4 hover:bg-gray-50">
                    <p className="text-sm text-gray-600">{comment.news_title}</p>
                    <p className="text-sm font-medium text-gray-900 mt-1 line-clamp-2">{comment.content}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">{comment.user_email}</span>
                      <Link
                        href="/admin/comments"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Düzenle
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Link href="/admin/comments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Tüm Yorumları Görüntüle →
              </Link>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        {tips.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">📨 Okuyucu İpuçları</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {tips.map((tip) => (
                <div key={tip.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">{tip.source}</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{tip.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(tip.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <button className="ml-4 px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded hover:bg-green-200">
                      Onayla
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' }) {
  const colorClasses: Record<'blue' | 'green' | 'yellow' | 'red' | 'purple', string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`${colorClasses[color]} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-gray-600 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  )
}

function QuickActionButton({ href, label, color }: { href: string; label: string; color: 'blue' | 'green' | 'purple' | 'red' | 'yellow' }) {
  const colorClasses: Record<'blue' | 'green' | 'purple' | 'red' | 'yellow', string> = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    red: 'bg-red-600 hover:bg-red-700',
    yellow: 'bg-yellow-600 hover:bg-yellow-700',
  }

  return (
    <Link
      href={href}
      className={`${colorClasses[color]} text-white font-medium py-3 px-4 rounded-lg text-center block transition`}
    >
      {label}
    </Link>
  )
}
