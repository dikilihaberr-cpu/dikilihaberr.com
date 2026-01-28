'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getPendingComments, deleteComment, CommentWithNews, supabase } from '@/lib/supabase'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { MessageCircle, Trash2, Check } from 'lucide-react'
import { logger } from '@/lib/utils/logger'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { showToast } from '@/components/ui/Toast'

export default function CommentsManagement() {
  const router = useRouter()
  const [comments, setComments] = useState<CommentWithNews[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  const { isAdmin: adminStatus, loading: authLoading } = useAdminAuth()

  useEffect(() => {
    setIsAdmin(adminStatus)
    
    if (adminStatus && !authLoading) {
      loadComments()
    } else if (!authLoading && !adminStatus) {
      setLoading(false)
    }
  }, [adminStatus, authLoading])

  const loadComments = async () => {
    setLoading(true)
    try {
      const allComments = await getPendingComments()
      setComments(allComments)
    } catch (error) {
      logger.error('Error loading comments:', error)
      showToast('Yorumlar yüklenirken hata oluştu', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (id: string) => {
    if (!confirm('Yorumu silmek istediğinizden emin misiniz?')) return

    // UUID validation
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      showToast('Geçersiz yorum ID', 'error')
      return
    }

    try {
      await deleteComment(id)
      setComments(comments.filter(c => c.id !== id))
      showToast('Yorum silindi', 'success')
    } catch (error) {
      logger.error('Error deleting comment:', error)
      showToast('Yorum silinemedi', 'error')
    }
  }

  const handleApproveComment = async (id: string) => {
    if (!supabase) {
      showToast('Supabase bağlantısı kurulamadı', 'error')
      return
    }

    // UUID validation
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      showToast('Geçersiz yorum ID', 'error')
      return
    }
    
    try {
      const { error } = await supabase
        .from('comments')
        .update({ status: 'approved' })
        .eq('id', id)

      if (error) throw error

      await loadComments()
      showToast('Yorum onaylandı', 'success')
    } catch (error) {
      logger.error('Error approving comment:', error)
      showToast('Yorum onaylanamadı', 'error')
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

  const filteredComments = filterStatus === 'all' 
    ? comments
    : comments.filter(c => c.status === filterStatus)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Yorumlar</h1>
              <p className="text-sm text-gray-600">{filteredComments.length} yorum</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg ${
                filterStatus === 'pending'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Beklemede
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded-lg ${
                filterStatus === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Onaylı
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {filteredComments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Yorum bulunamadı</p>
            </div>
          ) : (
            filteredComments.map(comment => (
              <div key={comment.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{comment.news_title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{comment.user_name || comment.user_email}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded ${
                    (comment as any).status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {(comment as any).status === 'approved' ? 'Onaylı' : 'Beklemede'}
                  </span>
                </div>

                <p className="text-gray-700 text-sm mb-4">{comment.content}</p>

                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <div className="flex gap-2">
                    {comment.status !== 'approved' && (
                      <button
                        onClick={() => handleApproveComment(comment.id)}
                        className="inline-flex items-center px-3 py-1 text-sm font-medium bg-green-600 text-white rounded hover:bg-green-700"
                        title="Onayla"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Onayla
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
