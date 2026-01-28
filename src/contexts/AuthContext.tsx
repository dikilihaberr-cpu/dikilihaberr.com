// Auth Context
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase, isAdmin as checkIsAdmin } from '@/lib/supabase'
import { logger } from '@/lib/utils/logger'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Global abort error handler - abort hatalarını sessizce handle et
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason
      const errorMessage = error?.message || error?.toString() || ''
      const errorName = error?.name || ''
      
      // Abort hatalarını sessizce handle et
      if (
        errorMessage.includes('aborted') || 
        errorMessage.includes('signal') || 
        errorName === 'AbortError' ||
        errorMessage.includes('AbortError')
      ) {
        event.preventDefault() // Console'a yazdırma
        return
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    let subscription: { unsubscribe: () => void } | null = null
    const abortController = new AbortController()

    // Simple session check
    const checkSession = async () => {
      try {
        if (!supabase) {
          logger.error('❌ Supabase not available')
          logger.error('📋 .env.local dosyasını kontrol edin: NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY')
          if (mounted) setLoading(false)
          return
        }

        // Check if already aborted
        if (abortController.signal.aborted) {
          return
        }

        // Database bağlantı kontrolü
        const { data: { session }, error } = await supabase.auth.getSession()

        // Check if aborted during async operation
        if (abortController.signal.aborted || !mounted) {
          return
        }

        if (error) {
          // Abort hatalarını sessizce handle et (component unmount olduğunda normal)
          if (error.message?.includes('aborted') || error.message?.includes('signal') || error.name === 'AbortError') {
            return
          }
          logger.error('❌ Session error:', error.message || error)
          if (error.message?.includes('JWT') || error.message?.includes('token')) {
            logger.error('🔍 Token hatası - Supabase bağlantısını kontrol edin')
          }
        } else {
          logger.log('✅ Session loaded:', session?.user?.email || 'No session')
          if (mounted && !abortController.signal.aborted) {
            setSession(session)
            setUser(session?.user ?? null)

            if (session?.user) {
              // Admin check'i sadece bir kez yap
              try {
                const adminStatus = await checkIsAdmin()
                if (mounted && !abortController.signal.aborted) {
                  logger.log('🔐 Initial admin check:', session.user.email, '=', adminStatus ? '✅ ADMIN' : '❌ NOT ADMIN')
                  setIsAdmin(adminStatus)
                }
              } catch (adminError: unknown) {
                // Abort hatalarını sessizce handle et
                const error = adminError as Error
                if (error?.message?.includes('aborted') || error?.message?.includes('signal') || error?.name === 'AbortError') {
                  return
                }
                logger.error('❌ Admin check failed:', error?.message || String(adminError))
                if (mounted && !abortController.signal.aborted) setIsAdmin(false)
              }
            } else {
              if (mounted && !abortController.signal.aborted) setIsAdmin(false)
            }
          }
        }
      } catch (error: unknown) {
        // Abort hatalarını sessizce handle et (component unmount olduğunda normal)
        const err = error as Error
        const errorMessage = err?.message || String(error)
        const errorName = err?.name || ''
        
        if (
          errorMessage.includes('aborted') || 
          errorMessage.includes('signal') || 
          errorName === 'AbortError' ||
          errorMessage.includes('AbortError') ||
          abortController.signal.aborted ||
          !mounted
        ) {
          // Component unmount oldu veya abort edildi - bu normal, sessizce çık
          return
        }
        logger.error('❌ Session check error:', errorMessage || error)
      } finally {
        if (mounted && !abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }

    checkSession()

    // Listen for auth state changes - ama admin check'i sadece SIGNED_IN'de yap
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted || abortController.signal.aborted) return

        logger.log('Auth state changed:', event, session?.user?.email || 'No user')
        
        if (event === 'SIGNED_IN') {
          // Sadece SIGNED_IN'de admin check yap (TOKEN_REFRESHED'de yapma - sonsuz döngüye neden olur)
          if (mounted && !abortController.signal.aborted) {
            setSession(session)
            setUser(session?.user ?? null)
            
            if (session?.user) {
              try {
                const adminStatus = await checkIsAdmin()
                if (mounted && !abortController.signal.aborted) {
                  logger.log('Auth change - admin check:', session.user.email, '=', adminStatus ? 'ADMIN ✅' : 'NOT ADMIN ❌')
                  setIsAdmin(adminStatus)
                }
              } catch (adminError: unknown) {
                // Abort hatalarını sessizce handle et
                const err = adminError as Error
                if (err?.message?.includes('aborted') || err?.message?.includes('signal') || err?.name === 'AbortError') {
                  return
                }
                logger.error('Admin check error:', err?.message || String(adminError))
                if (mounted && !abortController.signal.aborted) setIsAdmin(false)
              }
            }
          }
        } else if (event === 'TOKEN_REFRESHED') {
          // Token refresh'te sadece session'ı güncelle, admin check yapma
          if (mounted && !abortController.signal.aborted) {
            setSession(session)
            setUser(session?.user ?? null)
            // Admin status'u değiştirme - zaten biliyoruz
          }
        } else if (event === 'SIGNED_OUT') {
          if (mounted && !abortController.signal.aborted) {
            setSession(null)
            setUser(null)
            setIsAdmin(false)
          }
        }
      })
      subscription = data.subscription
    }

    return () => {
      mounted = false
      abortController.abort()
      subscription?.unsubscribe()
    }
  }, []) // Boş dependency array - sadece mount'ta çalış

  const signIn = async (email: string, password: string) => {
    try {
      if (!supabase) {
        return { error: { message: 'Supabase client not initialized' } }
      }

      const result = await supabase.auth.signInWithPassword({ email, password })

      if (!result.error && result.data?.user) {
        // Manually update state after successful login
        setUser(result.data.user)
        setSession(result.data.session)

        // Check admin status
        const adminStatus = await checkIsAdmin()
        setIsAdmin(adminStatus)
      }

      return result
    } catch (error) {
      logger.error('Sign in error:', error)
      return { error: { message: 'An unexpected error occurred during sign in' } }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      if (!supabase) {
        return { error: { message: 'Supabase client not initialized' } }
      }

      // Email redirect URL ekle (e-posta doğrulama linki için)
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      const redirectTo = `${siteUrl}/auth/callback`

      const result = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: redirectTo,
          // E-posta gönderimini zorla (development için)
          data: {
            email_confirm: true
          }
        }
      })

      // Hata kontrolü ve loglama
      if (result.error) {
        logger.error('Sign up error:', result.error)
        
        // Özel hata mesajları
        if (result.error.message?.includes('email')) {
          return { 
            error: { 
              message: 'E-posta gönderilemedi. Lütfen Supabase Dashboard\'da email ayarlarını kontrol edin.' 
            } 
          }
        }
        
        return result
      }

      // Başarılı kayıt kontrolü
      if (result.data?.user && !result.data.session) {
        // E-posta doğrulaması gerekiyor
        logger.log('Kullanıcı oluşturuldu, e-posta doğrulaması bekleniyor:', email)
      }

      return result
    } catch (error) {
      logger.error('Sign up error:', error)
      return { error: { message: 'Bir hata oluştu. Lütfen tekrar deneyin.' } }
    }
  }

  const signOut = async () => {
    try {
      if (!supabase) {
        return { error: { message: 'Supabase client not initialized' } }
      }

      const result = await supabase.auth.signOut()

      if (!result.error) {
        // Manually clear state
        setUser(null)
        setSession(null)
        setIsAdmin(false)
      }

      return result
    } catch (error) {
      logger.error('Sign out error:', error)
      return { error: { message: 'An unexpected error occurred during sign out' } }
    }
  }

  const value = {
    user,
    session,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}