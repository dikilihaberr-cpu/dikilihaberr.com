'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getCommentsByNewsId, addComment, Comment } from '@/lib/supabase'
import { MessageCircle, Send, Edit2, Trash2, AlertCircle, RefreshCw } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'
import { checkClientRateLimit, resetRateLimit } from '@/lib/utils/rateLimit'
import { sanitizeInput, sanitizeHTML } from '@/lib/utils/sanitization'

interface CommentsSectionProps {
  newsId: string
}

export default function CommentsSection({ newsId }: CommentsSectionProps): React.JSX.Element {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadComments()
  }, [newsId]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadComments = async () => {
    setLoading(true)
    setError(null)
    try {
      // Kullanıcı kendi yorumlarını görmek istiyorsa includePending = true
      const commentsData = await getCommentsByNewsId(newsId, !!user)
      setComments(commentsData)
    } catch (error: any) {
      setError('Yorumlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    setSubmitting(true)
    setError(null)

    // Rate limiting kontrolü
    const rateLimit = checkClientRateLimit('comment')
    if (!rateLimit.allowed) {
      setError(`Çok hızlı yorum gönderiyorsunuz. Lütfen ${Math.ceil((rateLimit.retryAfter || 0))} saniye sonra tekrar deneyin.`)
      setSubmitting(false)
      return
    }

    // Input sanitization
    const sanitizedComment = sanitizeInput(newComment.trim(), 'text')
    
    // XSS kontrolü
    if (sanitizedComment !== newComment.trim()) {
      setError('Yorumunuzda izin verilmeyen karakterler bulundu.')
      setSubmitting(false)
      return
    }

    try {
      const comment = await addComment(newsId, sanitizedComment)
      
      // Başarılı yorumda rate limit'i sıfırla
      if (comment) {
        resetRateLimit('comment')
      }
      if (comment) {
        setComments(prev => [comment, ...prev])
        setNewComment('')
        // Success feedback - could be replaced with toast notification
      } else {
        setError('Yorum eklenirken hata oluştu. Lütfen tekrar deneyin.')
      }
    } catch (error: unknown) {
      const err = error as Error
      setError(`Yorum eklenirken bir hata oluştu: ${err?.message || 'Bilinmeyen hata'}. Lütfen tekrar deneyin.`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-12 bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <MessageCircle className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-2xl font-bold text-primary">Yorumlar ({comments.length})</h2>
      </div>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Yorumunuzu yazın..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={3}
                required
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitting ? 'Gönderiliyor...' : 'Yorum Yap'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 text-center">
          <p className="text-gray-600 mb-4">Yorum yapmak için giriş yapmanız gerekiyor.</p>
          <a
            href="/auth/login"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Giriş Yap
          </a>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={loadComments}
                className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium flex items-center space-x-1"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Tekrar Dene</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <LoadingSpinner text="Yorumlar yükleniyor..." />
        </div>
      ) : error && comments.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Yorumlar yüklenemedi.</p>
          <button
            onClick={loadComments}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Tekrar Dene</span>
          </button>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center font-semibold">
                    {comment.user_name?.[0] || comment.user_email?.[0]?.toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      {comment.user_name || comment.user_email}
                    </span>
                    {comment.status !== 'approved' && comment.user_id === user?.id && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">
                        ⏳ Onay Bekliyor
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p 
                    className={`leading-relaxed ${comment.status !== 'approved' && comment.user_id !== user?.id ? 'text-gray-400 italic' : 'text-gray-700'}`}
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(comment.content) }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}