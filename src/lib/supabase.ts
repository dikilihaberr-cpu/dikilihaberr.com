import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { logger } from './utils/logger'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

let supabase: SupabaseClient | null = null

// Only create client if we have valid credentials
if (supabaseUrl && supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('placeholder') &&
    supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
    logger.log('Supabase client initialized successfully')
  } catch (error) {
    logger.warn('Failed to create Supabase client:', error)
  }
} else {
  logger.warn('Supabase credentials not properly configured')
}

export { supabase }

// Auth functions
export const signUp = async (email: string, password: string) => {
  if (!supabase) return { error: 'Supabase not initialized' }
  
  // Email redirect URL ekle
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://dikilihaber.com')
  const redirectTo = `${siteUrl}/auth/callback`
  
  return await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      emailRedirectTo: redirectTo,
      data: {
        email_confirm: true
      }
    }
  })
}

export const signIn = async (email: string, password: string) => {
  if (!supabase) return { error: 'Supabase not initialized' }
  return await supabase.auth.signInWithPassword({ email, password })
}

export const signOut = async () => {
  if (!supabase) return { error: 'Supabase not initialized' }
  return await supabase.auth.signOut()
}

export const getCurrentUser = async () => {
  if (!supabase) return null
  return await supabase.auth.getUser()
}

export const getSession = async () => {
  if (!supabase) return null
  return await supabase.auth.getSession()
}

// User roles and permissions
export const isAdmin = async () => {
  if (!supabase) return false
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  // Check if user has admin role in user metadata or a separate admins table
  const { data: adminUser } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  return !!adminUser
}

// Comments functions
export interface Comment {
  id: string
  news_id: string
  user_id: string
  user_email: string
  user_name?: string
  content: string
  created_at: string
  updated_at: string
  status?: 'pending' | 'approved' | 'rejected' // Comment approval status
  is_approved?: boolean // Legacy field - use status instead
  is_hidden?: boolean // Whether comment is hidden
}

export const getCommentsByNewsId = async (newsId: string, includePending?: boolean): Promise<Comment[]> => {
  if (!supabase) return []

  // UUID validation
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newsId)) {
    logger.error('Invalid news ID format in getCommentsByNewsId:', newsId)
    return []
  }

  let query = supabase
    .from('comments')
    .select('*')
    .eq('news_id', newsId)

  // Only show approved comments unless includePending is true
  // Support both status field and legacy is_approved field
  if (!includePending) {
    query = query.or('status.eq.approved,is_approved.eq.true').eq('is_hidden', false)
  }

  try {
    const { data, error } = await query
      .order('created_at', { ascending: true })

    if (error) {
      return []
    }

    // Normalize status field - ensure all comments have status
    return (data || []).map((comment: Comment): Comment => ({
      ...comment,
      status: (comment.status || (comment.is_approved ? 'approved' : 'pending')) as 'pending' | 'approved' | 'rejected'
    }))
  } catch (err: unknown) {
    logger.error('Error fetching comments:', err)
    return []
  }
}

export const addComment = async (newsId: string, content: string): Promise<Comment | null> => {
  if (!supabase) return null

  // Server-side validation ve sanitization
  const { sanitizeInput, isSuspiciousInput } = await import('./utils/sanitization')
  const sanitizedContent = sanitizeInput(content, 'text')
  
  // XSS kontrolü
  if (isSuspiciousInput(sanitizedContent)) {
    logger.error('Suspicious content detected in comment:', { newsId })
    return null
  }

  // UUID validation
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newsId)) {
    logger.error('Invalid newsId format:', { newsId })
    return null
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('comments')
    .insert([{
      news_id: newsId,
      user_id: user.id,
      user_email: user.email,
      user_name: user.user_metadata?.full_name || user.email?.split('@')[0],
      content: content.trim(),
    }])
    .select()
    .single()

  if (error) {
    logger.error('Error adding comment:', error)
    return null
  }

  return data
}

export const updateComment = async (commentId: string, content: string): Promise<Comment | null> => {
  if (!supabase) return null

  // UUID validation
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(commentId)) {
    logger.error('Invalid comment ID format:', commentId)
    return null
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    logger.error('User not authenticated for comment update')
    return null
  }

  // Check if comment exists and belongs to user (IDOR prevention)
  const { data: existingComment, error: checkError } = await supabase
    .from('comments')
    .select('user_id')
    .eq('id', commentId)
    .maybeSingle()

  if (checkError || !existingComment) {
    logger.error('Comment not found:', commentId)
    return null
  }

  // Authorization check: User can only update their own comments
  // Admin can update any comment (RLS policy will handle this)
  const { data: adminCheck } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  const isAdmin = !!adminCheck
  const isOwner = existingComment.user_id === user.id

  if (!isAdmin && !isOwner) {
    logger.error('Unauthorized comment update attempt:', { commentId, userId: user.id })
    return null
  }

  // Server-side sanitization
  const { sanitizeInput, isSuspiciousInput } = await import('./utils/sanitization')
  const sanitizedContent = sanitizeInput(content, 'text')
  
  if (isSuspiciousInput(sanitizedContent)) {
    logger.error('Suspicious content in comment update:', { commentId })
    return null
  }

  const { data, error } = await supabase
    .from('comments')
    .update({ content: sanitizedContent, updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .select()
    .single()

  if (error) {
    logger.error('Error updating comment:', error)
    return null
  }

  // Normalize status field
  return {
    ...data,
    status: (data.status || (data.is_approved ? 'approved' : 'pending')) as 'pending' | 'approved' | 'rejected'
  }
}

export const deleteComment = async (commentId: string): Promise<boolean> => {
  if (!supabase) return false

  // UUID validation
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(commentId)) {
    logger.error('Invalid comment ID format for deletion:', commentId)
    return false
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    logger.error('User not authenticated for comment deletion')
    return false
  }

  // Check if comment exists and belongs to user (IDOR prevention)
  const { data: existingComment, error: checkError } = await supabase
    .from('comments')
    .select('user_id')
    .eq('id', commentId)
    .maybeSingle()

  if (checkError || !existingComment) {
    logger.error('Comment not found for deletion:', commentId)
    return false
  }

  // Authorization check: User can only delete their own comments
  // Admin can delete any comment (RLS policy will handle this)
  const { data: adminCheck } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  const isAdmin = !!adminCheck
  const isOwner = existingComment.user_id === user.id

  if (!isAdmin && !isOwner) {
    logger.error('Unauthorized comment deletion attempt:', { commentId, userId: user.id })
    return false
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) {
    logger.error('Error deleting comment:', error)
    return false
  }

  return true
}

// Database types
export interface NewsItem {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  featured: boolean
  is_trending?: boolean // Trending haber mi?
  is_daily_news?: boolean // Günün haberi mi?
  published_at: string
  image_url: string
  images: string[] // Array of image URLs for slideshow
  video_url?: string // Optional video URL
  is_published?: boolean // Admin approval status
  is_draft?: boolean // Draft status
  slug: string
  created_at: string
  updated_at: string
  seo_title?: string // SEO meta title
  meta_description?: string // SEO meta description
  tags?: string[] // Article tags
  location_tags?: string[] // Location tags
  status?: 'draft' | 'published' | 'archived' | 'removed' // Document status
  scheduled_publish_at?: string // Scheduled publish time
  source?: string // News source
  views?: number // View count
  is_read?: boolean
  news_slug?: string
}

// API Functions
export const getAllNews = async (): Promise<NewsItem[]> => {
  if (!supabase) {
    logger.error('getAllNews: Supabase not initialized')
    return []
  }

  try {
    // RLS policy zaten filtreliyor - query'de filtreleme yapmıyoruz
    // RLS policy: status = 'published' AND is_published = TRUE
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false })

    if (error) {
      logger.error('Error fetching all news:', {
        code: error.code,
        message: error.message,
        details: error.details
      })
      // RLS hatası ise daha detaylı log
      if (error.code === '42501') {
        logger.error('🔒 RLS Policy Error: Public kullanıcılar haberleri göremiyor')
        logger.error('📋 ÇÖZÜM: RLS_FINAL_FIX.sql dosyasını Supabase SQL Editor\'da çalıştırın')
      }
      return []
    }
    
    // Detaylı log - her haberin durumunu kontrol et
    if (data && data.length > 0) {
      const statusCounts = data.reduce((acc, item) => {
        acc[item.status || 'unknown'] = (acc[item.status || 'unknown'] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      logger.log(`Fetched ${data.length} published news items`, { statusCounts })
    } else {
      logger.log('No news items found')
    }
    
    return data || []
  } catch (err: unknown) {
    logger.error('Unexpected error in getAllNews:', err)
    return []
  }
}

export const getNewsById = async (id: string): Promise<NewsItem | null> => {
  if (!supabase) {
    logger.error('getNewsById: Supabase not initialized')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      logger.error('getNewsById error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      return null
    }

    if (data) {
      logger.log('getNewsById success:', {
        id: data.id,
        title: data.title,
        status: data.status,
        is_published: data.is_published
      })
    }

    return data
  } catch (err: unknown) {
    logger.error('getNewsById unexpected error:', err)
    return null
  }
}

// Admin için özel fonksiyon - RLS policy'yi bypass eder (admin policy'si sayesinde)
export const getNewsByIdAdmin = async (id: string): Promise<NewsItem | null> => {
  if (!supabase) {
    logger.error('getNewsByIdAdmin: Supabase not initialized')
    return null
  }

  // UUID validation
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    logger.error('Invalid news ID format:', id)
    return null
  }

  // SERVER-SIDE ADMIN CHECK - Güvenlik için kritik!
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    logger.error('User not authenticated for admin news access')
    return null
  }

  // Check if user is admin
  const { data: adminCheck } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!adminCheck) {
    logger.error('Unauthorized admin access attempt:', { userId: user.id, newsId: id })
    return null
  }

  try {
    // Admin policy'si sayesinde tüm haberleri görebilir (draft dahil)
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      logger.error('getNewsByIdAdmin error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        id
      })
      return null
    }

    if (data) {
      logger.log('getNewsByIdAdmin success:', {
        id: data.id,
        title: data.title,
        status: data.status,
        is_published: data.is_published
      })
    }

    return data
  } catch (err: unknown) {
    logger.error('getNewsByIdAdmin unexpected error:', err)
    return null
  }
}

export const getNewsBySlug = async (slug: string): Promise<NewsItem | null> => {
  if (!supabase) {
    logger.error('getNewsBySlug: Supabase not initialized')
    return null
  }

  try {
    // Use maybeSingle() instead of single() to handle cases where no result or multiple results
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (error) {
      logger.error('getNewsBySlug error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      return null
    }

    if (data) {
      logger.log('getNewsBySlug success:', {
        id: data.id,
        title: data.title,
        status: data.status,
        is_published: data.is_published
      })
    }

    return data
  } catch (err: unknown) {
    logger.error('getNewsBySlug unexpected error:', err)
    return null
  }
}

export const getNewsByCategory = async (category: string): Promise<NewsItem[]> => {
  if (!supabase) {
    logger.error('getNewsByCategory: Supabase not initialized')
    return []
  }

  try {
    // Decode URL-encoded category name and sanitize
    const decodedCategory = decodeURIComponent(category)
    // Sanitize category input (remove dangerous characters)
    const { sanitizeInput } = await import('./utils/sanitization')
    const sanitizedCategory = sanitizeInput(decodedCategory, 'text').substring(0, 50)
    
    // Capitalize first letter to match database format (e.g., "gündem" -> "Gündem")
    const normalizedCategory = sanitizedCategory.charAt(0).toUpperCase() + sanitizedCategory.slice(1).toLowerCase()
    
    // Try exact match first, then case-insensitive if no results
    let { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('category', normalizedCategory)
      .order('published_at', { ascending: false })

    // If no results with normalized category, try case-insensitive search
    if (!data || data.length === 0) {
      const { escapeLikePattern } = await import('./utils/sanitization')
      const safePattern = `%${escapeLikePattern(sanitizedCategory)}%`
      const { data: caseInsensitiveData, error: caseInsensitiveError } = await supabase
        .from('news')
        .select('*')
        .ilike('category', safePattern)
        .order('published_at', { ascending: false })
      
      if (caseInsensitiveData && caseInsensitiveData.length > 0) {
        data = caseInsensitiveData
        error = caseInsensitiveError
      }
    }

    if (error) {
      logger.error('getNewsByCategory error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        category,
        normalizedCategory
      })
      return []
    }

    logger.log(`getNewsByCategory success: Found ${data?.length || 0} news for category "${normalizedCategory}"`)
    return data || []
  } catch (err: unknown) {
    logger.error('getNewsByCategory unexpected error:', err)
    return []
  }
}

export const getFeaturedNews = async (): Promise<NewsItem[]> => {
  if (!supabase) {
    return []
  }

  try {
    // RLS policy zaten filtreliyor - sadece featured filtresi ekliyoruz
    // RLS policy: status = 'published' AND is_published = TRUE
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(5)

    if (error) {
      // Sessizce boş array döndür - hata yönetimi component seviyesinde
      return []
    }

    return data || []
  } catch (err: any) {
    // Sessizce boş array döndür
    return []
  }
}

export const getTrendingNews = async (limit: number = 5): Promise<NewsItem[]> => {
  if (!supabase) {
    return []
  }

  try {
    // RLS policy zaten filtreliyor - sadece is_trending filtresi ekliyoruz
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_trending', true)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      logger.error('Error fetching trending news:', error)
      return []
    }

    return data || []
  } catch (err: unknown) {
    logger.error('Unexpected error in getTrendingNews:', err)
    return []
  }
}

export const getDailyNews = async (): Promise<NewsItem | null> => {
  if (!supabase) {
    return null
  }

  try {
    // RLS policy zaten filtreliyor - sadece is_daily_news filtresi ekliyoruz
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_daily_news', true)
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      logger.error('Error fetching daily news:', error)
      return null
    }

    return data
  } catch (err: unknown) {
    logger.error('Unexpected error in getDailyNews:', err)
    return null
  }
}

export const addNews = async (news: Omit<NewsItem, 'id' | 'published_at' | 'slug' | 'created_at' | 'updated_at'>): Promise<NewsItem | null> => {
  if (!supabase) {
    logger.error('Supabase client not initialized')
    return null
  }

  // SERVER-SIDE ADMIN CHECK - Güvenlik için kritik!
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    logger.error('User not authenticated for news creation')
    return null
  }

  // Check if user is admin
  const { data: adminCheck } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!adminCheck) {
    logger.error('Unauthorized news creation attempt:', { userId: user.id })
    return null
  }

  try {
    // SERVER-SIDE VALIDATION - Güvenlik için kritik!
    const { sanitizeInput, isSuspiciousInput } = await import('./utils/sanitization')
    
    // Input sanitization
    const sanitizedTitle = sanitizeInput(news.title || '', 'text')
    const sanitizedContent = sanitizeInput(news.content || '', 'html')
    const sanitizedExcerpt = sanitizeInput(news.excerpt || '', 'text')
    const sanitizedAuthor = sanitizeInput(news.author || '', 'text')
    const sanitizedCategory = sanitizeInput(news.category || '', 'text')

    // XSS kontrolü
    if (isSuspiciousInput(sanitizedTitle) || isSuspiciousInput(sanitizedContent) || isSuspiciousInput(sanitizedExcerpt)) {
      logger.error('Suspicious content detected in news:', { title: sanitizedTitle.substring(0, 50) })
      return null
    }

    // Length validation
    if (!sanitizedTitle || sanitizedTitle.length < 5 || sanitizedTitle.length > 200) {
      logger.error('Invalid title length')
      return null
    }

    if (!sanitizedContent || sanitizedContent.length < 50) {
      logger.error('Content too short')
      return null
    }

    // Create a unique slug
    let slug = sanitizedTitle.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Check if slug already exists and make it unique
    let counter = 1
    let originalSlug = slug
    while (true) {
      const { data: existing, error: slugCheckError } = await supabase
        .from('news')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()

      // Eğer kayıt yoksa veya hata varsa (PGRST116 = no rows), slug kullanılabilir
      if (!existing || slugCheckError?.code === 'PGRST116') break

      slug = `${originalSlug}-${counter}`
      counter++
      
      // Sonsuz döngü önleme
      if (counter > 100) {
        slug = `${originalSlug}-${Date.now()}`
        break
      }
    }

    // Status ve published_at'i doğru ayarla
    const isPublished = news.is_published === true
    const newsData = {
      title: sanitizedTitle,
      excerpt: sanitizedExcerpt,
      content: sanitizedContent,
      category: sanitizedCategory,
      author: sanitizedAuthor,
      featured: Boolean(news.featured), // Boolean coercion for security
      is_trending: Boolean(news.is_trending), // Boolean coercion
      is_daily_news: Boolean(news.is_daily_news), // Boolean coercion
      image_url: news.image_url ? sanitizeInput(news.image_url, 'url') : null,
      images: Array.isArray(news.images) ? news.images.map(img => sanitizeInput(img, 'url')).filter(Boolean) : [],
      video_url: news.video_url ? sanitizeInput(news.video_url, 'url') : null,
      status: isPublished ? 'published' : 'draft', // RLS policy için kritik!
      is_published: Boolean(isPublished),
      is_draft: !Boolean(isPublished),
      slug,
      published_at: isPublished ? new Date().toISOString() : null,
    }

    logger.log('Adding news with data:', {
      title: newsData.title,
      status: newsData.status,
      is_published: newsData.is_published,
      is_draft: newsData.is_draft,
      published_at: newsData.published_at
    })

    const { data, error } = await supabase
      .from('news')
      .insert([newsData])
      .select()
      .single()

    if (error) {
      logger.error('Supabase insert error:', error)
      logger.error('Error code:', error.code)
      logger.error('Error message:', error.message)
      logger.error('Error details:', error.details || 'No details available')
      logger.error('Error hint:', error.hint || 'No hint available')
      return null
    }

    logger.log('News added successfully:', {
      id: data?.id,
      title: data?.title,
      status: data?.status,
      is_published: data?.is_published,
      published_at: data?.published_at
    })
    return data
  } catch (err) {
    logger.error('Unexpected error in addNews:', err)
    if (err instanceof Error) {
      logger.error('Error name:', err.name)
      logger.error('Error message:', err.message)
      logger.error('Error stack:', err.stack)
    }
    return null
  }
}

export const saveDraft = async (news: Partial<NewsItem>): Promise<boolean> => {
  if (!supabase) {
    logger.error('Supabase client not initialized')
    return false
  }

  try {
    // Create a unique slug for drafts
    let slug = `draft-${(news.title || 'untitled').toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()}-${Date.now()}`

    const draftData = {
      title: news.title,
      excerpt: news.excerpt,
      content: news.content,
      category: news.category,
      author: news.author,
      featured: news.featured,
      image_url: news.image_url,
      images: news.images || [],
      video_url: news.video_url || null,
      status: 'draft', // Taslaklar her zaman draft
      is_published: false,
      is_draft: true,
      slug,
      published_at: null, // Drafts don't have published_at
    }

    logger.log('Saving draft with data:', draftData)

    const { data, error } = await supabase
      .from('news')
      .insert([draftData])
      .select()
      .single()

    if (error) {
      logger.error('Supabase insert error for draft:', error)
      return false
    }

    logger.log('Draft saved successfully:', data)
    return true
  } catch (err) {
    logger.error('Unexpected error in saveDraft:', err)
    return false
  }
}

export const updateNews = async (id: string, updates: Partial<NewsItem>): Promise<NewsItem | null> => {
  if (!supabase) {
    logger.error('updateNews: Supabase not initialized')
    return null
  }

  // UUID validation
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    logger.error('Invalid news ID format:', id)
    return null
  }

  // SERVER-SIDE ADMIN CHECK - Güvenlik için kritik!
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    logger.error('User not authenticated for news update')
    return null
  }

  // Check if user is admin
  const { data: adminCheck } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!adminCheck) {
    logger.error('Unauthorized news update attempt:', { userId: user.id, newsId: id })
    return null
  }

  try {
    // SERVER-SIDE VALIDATION ve SANITIZATION
    const { sanitizeInput, isSuspiciousInput } = await import('./utils/sanitization')
    
    // Sanitize updates
    const sanitizedUpdates: Partial<NewsItem> = {}
    
    if (updates.title !== undefined) {
      const sanitized = sanitizeInput(String(updates.title), 'text')
      if (isSuspiciousInput(sanitized) || sanitized.length < 5 || sanitized.length > 200) {
        logger.error('Invalid title in update')
        return null
      }
      sanitizedUpdates.title = sanitized
    }
    
    if (updates.content !== undefined) {
      const sanitized = sanitizeInput(String(updates.content), 'html')
      if (isSuspiciousInput(sanitized) || sanitized.length < 50) {
        logger.error('Invalid content in update')
        return null
      }
      sanitizedUpdates.content = sanitized
    }
    
    if (updates.excerpt !== undefined) {
      sanitizedUpdates.excerpt = sanitizeInput(String(updates.excerpt), 'text')
    }
    
    if (updates.author !== undefined) {
      sanitizedUpdates.author = sanitizeInput(String(updates.author), 'text')
    }
    
    if (updates.category !== undefined) {
      sanitizedUpdates.category = sanitizeInput(String(updates.category), 'text')
    }
    
    if (updates.image_url !== undefined) {
      sanitizedUpdates.image_url = updates.image_url ? sanitizeInput(updates.image_url, 'url') : null
    }
    
    if (updates.video_url !== undefined) {
      sanitizedUpdates.video_url = updates.video_url ? sanitizeInput(updates.video_url, 'url') : null
    }
    
    // Boolean fields - coercion for security
    if (updates.featured !== undefined) sanitizedUpdates.featured = Boolean(updates.featured)
    if (updates.is_trending !== undefined) sanitizedUpdates.is_trending = Boolean(updates.is_trending)
    if (updates.is_daily_news !== undefined) sanitizedUpdates.is_daily_news = Boolean(updates.is_daily_news)
    if (updates.is_published !== undefined) sanitizedUpdates.is_published = Boolean(updates.is_published)
    if (updates.is_draft !== undefined) sanitizedUpdates.is_draft = Boolean(updates.is_draft)

    const { data, error } = await supabase
      .from('news')
      .update(sanitizedUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      logger.error('Error updating news:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        id,
        updates
      })
      return null
    }

    logger.log('News updated successfully:', {
      id: data?.id,
      title: data?.title
    })

    return data
  } catch (err: unknown) {
    logger.error('Unexpected error in updateNews:', err)
    return null
  }
}

export const deleteNews = async (id: string): Promise<boolean> => {
  if (!supabase) {
    return false
  }

  // UUID validation - prevent injection attacks
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    logger.error('Invalid news ID format for deletion:', id)
    return false
  }

  // SERVER-SIDE ADMIN CHECK - Güvenlik için kritik!
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    logger.error('User not authenticated for news deletion')
    return false
  }

  // Check if user is admin
  const { data: adminCheck } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!adminCheck) {
    logger.error('Unauthorized news deletion attempt:', { userId: user.id, newsId: id })
    return false
  }

  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id)

  if (error) {
    logger.error('Error deleting news:', error)
    return false
  }

  return true
}

// Image upload functions
export const uploadImage = async (file: File, folder: string = 'news-images'): Promise<string | null> => {
  if (!supabase) {
    logger.error('Supabase client not initialized')
    return null
  }

  try {
    // SERVER-SIDE FILE VALIDATION - Güvenlik için kritik!
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 15 * 1024 * 1024 // 15MB

    // File type validation
    if (!allowedTypes.includes(file.type)) {
      logger.error('Invalid file type:', file.type)
      return null
    }

    // File size validation
    if (file.size > maxSize) {
      logger.error('File too large:', file.size)
      return null
    }

    // MIME type validation (double check)
    if (!file.type.startsWith('image/')) {
      logger.error('File is not an image:', file.type)
      return null
    }

    // Filename sanitization - prevent path traversal
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileExt = sanitizedFileName.split('.').pop()?.toLowerCase()
    
    // Validate extension
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      logger.error('Invalid file extension:', fileExt)
      return null
    }

    // Create unique filename
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      logger.error('Error uploading image:', error)
      return null
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    logger.log('Image uploaded successfully:', publicUrl)
    return publicUrl

  } catch (error) {
    logger.error('Unexpected error uploading image:', error)
    return null
  }
}

// Search images using Google Custom Search API (placeholder)
export const searchImages = async (query: string): Promise<string[]> => {
  try {
    // This would normally use Google Custom Search API
    // For now, return placeholder images
    const mockResults = [
      `https://via.placeholder.com/400x300?text=${encodeURIComponent(query)}+1`,
      `https://via.placeholder.com/400x300?text=${encodeURIComponent(query)}+2`,
      `https://via.placeholder.com/400x300?text=${encodeURIComponent(query)}+3`,
      `https://via.placeholder.com/400x300?text=${encodeURIComponent(query)}+4`,
      `https://via.placeholder.com/400x300?text=${encodeURIComponent(query)}+5`,
      `https://via.placeholder.com/400x300?text=${encodeURIComponent(query)}+6`,
    ]

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    return mockResults
  } catch (error) {
    return []
  }
}

// Admin Dashboard Functions
export const getAllNewsAdmin = async (): Promise<NewsItem[]> => {
  if (!supabase) {
    logger.error('getAllNewsAdmin: Supabase not initialized')
    return []
  }

  // SERVER-SIDE ADMIN CHECK - Güvenlik için kritik!
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    logger.error('User not authenticated for admin news access')
    return []
  }

  // Check if user is admin
  const { data: adminCheck } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!adminCheck) {
    logger.error('Unauthorized admin access attempt:', { userId: user.id })
    return []
  }
  
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      logger.error('Error fetching admin news:', {
        code: error.code,
        message: error.message,
        details: error.details
      })
      return []
    }
    
    logger.log(`getAllNewsAdmin success: Found ${data?.length || 0} news items`)
    return data || []
  } catch (err: unknown) {
    logger.error('getAllNewsAdmin unexpected error:', err)
    return []
  }
}

export const getTodayNews = async (): Promise<NewsItem[]> => {
  if (!supabase) return []

  // SERVER-SIDE ADMIN CHECK - Güvenlik için kritik!
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    logger.error('User not authenticated for today news access')
    return []
  }

  // Check if user is admin
  const { data: adminCheck } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!adminCheck) {
    logger.error('Unauthorized today news access attempt:', { userId: user.id })
    return []
  }

  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`)
    .order('created_at', { ascending: false })
  if (error) {
    logger.error('Error fetching today news:', error)
    return []
  }
  return data || []
}

export const getMostViewedNews = async (limit: number = 5): Promise<NewsItem[]> => {
  if (!supabase) return []

  // SERVER-SIDE ADMIN CHECK - Güvenlik için kritik!
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    logger.error('User not authenticated for most viewed news access')
    return []
  }

  // Check if user is admin
  const { data: adminCheck } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!adminCheck) {
    logger.error('Unauthorized most viewed news access attempt:', { userId: user.id })
    return []
  }

  // Limit validation - prevent DoS
  const safeLimit = Math.min(Math.max(1, limit), 100)

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(safeLimit)
  if (error) {
    logger.error('Error fetching most viewed news:', error)
    return []
  }
  return data || []
}

export interface CommentWithNews extends Comment {
  news_title?: string
  status: 'pending' | 'approved' | 'rejected' // Ensure status is always present
}

export const getPendingComments = async (): Promise<CommentWithNews[]> => {
  if (!supabase) return []

  // SERVER-SIDE ADMIN CHECK - Güvenlik için kritik!
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    logger.error('User not authenticated for pending comments access')
    return []
  }

  // Check if user is admin
  const { data: adminCheck } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!adminCheck) {
    logger.error('Unauthorized pending comments access attempt:', { userId: user.id })
    return []
  }

  const { data, error } = await supabase
    .from('comments')
    .select('*, news(title)')
    .or('status.eq.pending,status.is.null,is_approved.eq.false')
    .order('created_at', { ascending: false })
    .limit(10)
  if (error) {
    logger.error('Error fetching pending comments:', error)
    return []
  }
  return (data || []).map((comment: Comment & { news?: { title?: string } }): CommentWithNews => ({
    ...comment,
    status: (comment.status || (comment.is_approved ? 'approved' : 'pending')) as 'pending' | 'approved' | 'rejected',
    news_title: comment.news?.title || 'Unknown'
  }))
}

export interface Tip {
  id: string
  content: string
  source: string
  created_at: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface Ad {
  id: string
  title: string
  description?: string
  image_url: string
  link_url?: string
  position: 'sidebar' | 'header' | 'footer' | 'content'
  is_active: boolean
  start_date?: string
  end_date?: string
  click_count: number
  view_count: number
  created_at: string
  updated_at: string
}

export const getUnreadTips = async (): Promise<Tip[]> => {
  if (!supabase) return []

  // SERVER-SIDE ADMIN CHECK - Güvenlik için kritik!
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    logger.error('User not authenticated for tips access')
    return []
  }

  // Check if user is admin
  const { data: adminCheck } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!adminCheck) {
    logger.error('Unauthorized tips access attempt:', { userId: user.id })
    return []
  }

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .or('status.eq.pending,status.is.null,is_approved.eq.false')
    .order('created_at', { ascending: false })
    .limit(10)
  if (error) {
    logger.error('Error fetching tips:', error)
    return []
  }
  return (data || []).map((item: Comment) => ({
    id: item.id,
    content: item.content,
    source: item.user_email || item.user_name || 'Anonymous',
    created_at: item.created_at,
    status: 'pending' as const
  }))
}

// Search function
export const searchNews = async (query: string): Promise<NewsItem[]> => {
  if (!supabase || !query.trim()) return []
  
  try {
    // SQL Injection koruması: Özel karakterleri escape et ve uzunluk sınırı koy
    const { escapeLikePattern } = await import('./utils/sanitization')
    const sanitizedQuery = escapeLikePattern(query.trim().substring(0, 100))
    const searchPattern = `%${sanitizedQuery}%`
    
    // RLS policy zaten filtreliyor - query'de filtreleme yapmıyoruz
    // Supabase .or() ile güvenli parametrize sorgu kullanıyoruz
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .or(`title.ilike.${searchPattern},excerpt.ilike.${searchPattern},content.ilike.${searchPattern}`)
      .order('published_at', { ascending: false })
      .limit(20)
    
    if (error) {
      logger.error('Error searching news:', {
        code: error.code,
        message: error.message,
        details: error.details
      })
      return []
    }
    
    return data || []
  } catch (err: any) {
    logger.error('Unexpected error in searchNews:', err)
    return []
  }
}

// Ads functions
export const getActiveAds = async (position?: 'sidebar' | 'header' | 'footer' | 'content'): Promise<Ad[]> => {
  if (!supabase) {
    logger.error('getActiveAds: Supabase not initialized')
    return []
  }

  try {
    const now = new Date().toISOString()
    
    // Position validation - sadece izin verilen değerler
    const allowedPositions = ['sidebar', 'header', 'footer', 'content']
    const validPosition = position && allowedPositions.includes(position) ? position : undefined
    
    let query = supabase
      .from('ads')
      .select('*')
      .eq('is_active', true)
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gte.${now}`)

    if (validPosition) {
      query = query.eq('position', validPosition)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching ads:', {
        code: error.code,
        message: error.message,
        details: error.details,
        position
      })
      return []
    }

    // Client-side filtering for date ranges (Supabase .or() can be tricky)
    const filtered = (data || []).filter((ad: Ad) => {
      const nowDate = new Date()
      const startDate = ad.start_date ? new Date(ad.start_date) : null
      const endDate = ad.end_date ? new Date(ad.end_date) : null
      
      if (startDate && startDate > nowDate) return false
      if (endDate && endDate < nowDate) return false
      return true
    })

    return filtered
  } catch (err: unknown) {
    logger.error('Error fetching ads:', err)
    return []
  }
}

export const getAllAds = async (): Promise<Ad[]> => {
  if (!supabase) return []

  // SERVER-SIDE ADMIN CHECK - Güvenlik için kritik!
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    logger.error('User not authenticated for ads access')
    return []
  }

  // Check if user is admin
  const { data: adminCheck } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!adminCheck) {
    logger.error('Unauthorized ads access attempt:', { userId: user.id })
    return []
  }

  try {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching all ads:', error)
      return []
    }

    return data || []
  } catch (err: unknown) {
    logger.error('Error fetching all ads:', err)
    return []
  }
}

export const addAd = async (ad: Omit<Ad, 'id' | 'created_at' | 'updated_at' | 'click_count' | 'view_count'>): Promise<Ad | null> => {
  if (!supabase) return null

  // SERVER-SIDE ADMIN CHECK - Güvenlik için kritik!
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    logger.error('User not authenticated for ad creation')
    return null
  }

  // Check if user is admin
  const { data: adminCheck } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!adminCheck) {
    logger.error('Unauthorized ad creation attempt:', { userId: user.id })
    return null
  }

  // Input sanitization
  const { sanitizeInput, isSuspiciousInput } = await import('./utils/sanitization')
  const sanitizedAd = {
    ...ad,
    title: sanitizeInput(ad.title, 'text'),
    description: ad.description ? sanitizeInput(ad.description, 'text') : undefined,
    image_url: sanitizeInput(ad.image_url, 'url'),
    link_url: ad.link_url ? sanitizeInput(ad.link_url, 'url') : undefined,
  }

  if (isSuspiciousInput(sanitizedAd.title) || (sanitizedAd.description && isSuspiciousInput(sanitizedAd.description))) {
    logger.error('Suspicious content in ad creation')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('ads')
      .insert([sanitizedAd])
      .select()
      .single()

    if (error) {
      logger.error('Error adding ad:', error)
      return null
    }

    return data
  } catch (err: unknown) {
    logger.error('Error adding ad:', err)
    return null
  }
}

export const updateAd = async (id: string, ad: Partial<Ad>): Promise<Ad | null> => {
  if (!supabase) return null

  // UUID validation
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    logger.error('Invalid ad ID format:', id)
    return null
  }

  // SERVER-SIDE ADMIN CHECK - Güvenlik için kritik!
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    logger.error('User not authenticated for ad update')
    return null
  }

  // Check if user is admin
  const { data: adminCheck } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!adminCheck) {
    logger.error('Unauthorized ad update attempt:', { userId: user.id, adId: id })
    return null
  }

  // Input sanitization
  const { sanitizeInput, isSuspiciousInput } = await import('./utils/sanitization')
  const sanitizedAd: Partial<Ad> = {}
  
  if (ad.title !== undefined) {
    sanitizedAd.title = sanitizeInput(String(ad.title), 'text')
    if (isSuspiciousInput(sanitizedAd.title)) {
      logger.error('Suspicious content in ad update')
      return null
    }
  }
  if (ad.description !== undefined) {
    sanitizedAd.description = ad.description ? sanitizeInput(ad.description, 'text') : undefined
  }
  if (ad.image_url !== undefined) {
    sanitizedAd.image_url = sanitizeInput(ad.image_url, 'url')
  }
  if (ad.link_url !== undefined) {
    sanitizedAd.link_url = ad.link_url ? sanitizeInput(ad.link_url, 'url') : undefined
  }
  if (ad.position !== undefined) sanitizedAd.position = ad.position
  if (ad.is_active !== undefined) sanitizedAd.is_active = Boolean(ad.is_active)
  if (ad.start_date !== undefined) sanitizedAd.start_date = ad.start_date
  if (ad.end_date !== undefined) sanitizedAd.end_date = ad.end_date

  try {
    const { data, error } = await supabase
      .from('ads')
      .update(sanitizedAd)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      logger.error('Error updating ad:', error)
      return null
    }

    return data
  } catch (err: unknown) {
    logger.error('Error updating ad:', err)
    return null
  }
}

export const deleteAd = async (id: string): Promise<boolean> => {
  if (!supabase) return false

  // UUID validation
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    logger.error('Invalid ad ID format for deletion:', id)
    return false
  }

  // SERVER-SIDE ADMIN CHECK - Güvenlik için kritik!
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    logger.error('User not authenticated for ad deletion')
    return false
  }

  // Check if user is admin
  const { data: adminCheck } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!adminCheck) {
    logger.error('Unauthorized ad deletion attempt:', { userId: user.id, adId: id })
    return false
  }

  try {
    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', id)

    if (error) {
      logger.error('Error deleting ad:', error)
      return false
    }

    return true
  } catch (err: unknown) {
    logger.error('Error deleting ad:', err)
    return false
  }
}

export const incrementAdClick = async (id: string): Promise<void> => {
  if (!supabase) return

  try {
    const { error } = await supabase.rpc('increment_ad_clicks', { ad_id: id })
    if (error) {
      logger.error('Error incrementing ad click:', error)
    }
  } catch (err: unknown) {
    logger.error('Error incrementing ad click:', err)
  }
}

export const incrementAdView = async (id: string): Promise<void> => {
  if (!supabase) return

  try {
    const { error } = await supabase.rpc('increment_ad_views', { ad_id: id })
    if (error) {
      logger.error('Error incrementing ad view:', error)
    }
  } catch (err: unknown) {
    logger.error('Error incrementing ad view:', err)
  }
}