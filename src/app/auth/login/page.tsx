'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { signInSchema } from '@/lib/validators/schemas'
import { logger } from '@/lib/utils/logger'
import { checkClientRateLimit, resetRateLimit } from '@/lib/utils/rateLimit'
import { sanitizeInput } from '@/lib/utils/sanitization'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL parametrelerini kontrol et
  useEffect(() => {
    const verified = searchParams.get('verified')
    const errorParam = searchParams.get('error')
    
    if (verified === 'true') {
      setSuccess('✅ E-posta doğrulaması başarılı! Giriş yapabilirsiniz.')
    }
    if (errorParam === 'verification_failed') {
      setError('❌ E-posta doğrulaması başarısız. Lütfen tekrar deneyin.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setFieldErrors({})

    // Rate limiting kontrolü
    const rateLimit = checkClientRateLimit('login')
    if (!rateLimit.allowed) {
      setError(`Çok fazla deneme yaptınız. Lütfen ${Math.ceil((rateLimit.retryAfter || 0) / 60)} dakika sonra tekrar deneyin.`)
      setLoading(false)
      return
    }

    // Input sanitization
    const sanitizedEmail = sanitizeInput(email, 'email')
    const sanitizedPassword = sanitizeInput(password, 'text')

    // Client-side validation
    const validationResult = signInSchema.safeParse({ email: sanitizedEmail, password: sanitizedPassword })

    if (!validationResult.success) {
      const errors: { email?: string; password?: string } = {}
      validationResult.error.issues.forEach((err) => {
        const field = err.path[0]
        if (typeof field === 'string') {
          if (field === 'email') {
            errors.email = err.message === 'Invalid email' ? 'Geçerli bir e-posta adresi giriniz' : err.message
          } else if (field === 'password') {
            errors.password = err.message === 'String must contain at least 6 character(s)' 
              ? 'Şifre en az 6 karakter olmalıdır' 
              : err.message
          }
        }
      })
      setFieldErrors(errors)
      setLoading(false)
      return
    }

    try {
      const result = await signIn(sanitizedEmail, sanitizedPassword)
      
      // Başarılı girişte rate limit'i sıfırla
      if (!result.error) {
        resetRateLimit('login')
      }

      if (result.error) {
        setError(result.error.message)
        setLoading(false)
        return
      }

      // Başarılı giriş - admin kontrolü yap
      if (!supabase) {
        setError('Supabase yapılandırılmamış. Lütfen .env.local dosyasını kontrol edin.')
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Giriş başarısız. Lütfen tekrar deneyin.')
        setLoading(false)
        return
      }

      // E-posta doğrulaması kontrolü (opsiyonel - development için kapatılabilir)
      // const emailConfirmed = user.email_confirmed_at || (user as any).confirmed_at
      // if (!emailConfirmed) {
      //   setError('E-posta doğrulaması yapılmamış. Lütfen e-postanızı kontrol edin.')
      //   await supabase.auth.signOut()
      //   setLoading(false)
      //   return
      // }

      // Admin kontrolü - maybeSingle kullan (hata vermez)
      logger.log('🔍 Admin kontrolü başlatılıyor...', { userId: user.id, email: user.email })
      
      const { data: adminUser, error: adminError } = await supabase
        .from('admins')
        .select('user_id, role, email')
        .eq('user_id', user.id)
        .maybeSingle()

      // Hata kontrolü - sessizce handle et
      if (adminError) {
        // PGRST116 = No rows returned (kullanıcı admin değil - bu normal, hata değil)
        if (adminError.code === 'PGRST116') {
          // Kullanıcı admin değil - normal durum
          logger.log('Kullanıcı admin değil:', user.email)
          setError('Giriş başarılı. Bu hesap admin yetkisine sahip değil.')
          setLoading(false)
          setTimeout(() => {
            router.push('/')
          }, 2000)
          return
        }
        
        // Tablo yoksa - kurulum yapılmamış
        if (adminError.code === '42P01' || 
            adminError.message?.includes('relation') || 
            adminError.message?.includes('does not exist') ||
            (adminError.message?.includes('table') && adminError.message?.includes('not exist'))) {
          logger.log('Database kurulumu eksik - admins tablosu bulunamadı')
          setError('⚠️ Database kurulumu eksik!\n\n' +
            'Otomatik kurulum için: /setup-admin sayfasına gidin\n\n' +
            'Veya manuel kurulum:\n' +
            '1. Supabase Dashboard > SQL Editor\n' +
            '2. SETUP_ADMIN.sql dosyasını çalıştırın\n\n' +
            'Kurulumdan sonra sayfayı yenileyin.')
          setLoading(false)
          return
        }
        
        // RLS hatası
        if (adminError.code === '42501' || 
            adminError.message?.includes('permission') || 
            adminError.message?.includes('policy') ||
            adminError.message?.includes('row-level security')) {
          // Sessizce handle et - kullanıcıya zaten UI'da mesaj gösteriliyor
          logger.log('RLS Policy hatası:', adminError.code)
          setError('Yetkilendirme hatası. Lütfen database kurulumunu kontrol edin.')
          setLoading(false)
          return
        }
        
        // Diğer hatalar - sessizce handle et
        logger.log('Admin kontrol hatası:', adminError.code)
        setError('Giriş başarılı ancak admin kontrolü yapılamadı. Normal kullanıcı olarak devam ediliyor.')
        setLoading(false)
        setTimeout(() => {
          router.push('/')
        }, 2000)
        return
      }

      // Admin kontrolü başarılı
      if (adminUser) {
        const role = (adminUser as any)?.role as string | undefined
        const isAllowedAdmin = role === 'admin' || role === 'super_admin' || !role
        
        logger.log('✅ Admin user bulundu:', {
          email: adminUser.email || user.email,
          role: role || 'legacy',
          isAllowed: isAllowedAdmin
        })
        
        if (isAllowedAdmin) {
          logger.log('✅ Admin user confirmed, redirecting to admin panel')
          setLoading(false)
          router.push('/admin')
        } else {
          logger.log('❌ User has admin record but role is not allowed:', role)
          setError('Bu hesap admin yetkisine sahip değil.')
          setLoading(false)
          setTimeout(() => {
            router.push('/')
          }, 2000)
        }
      } else {
        // Admin değil - normal kullanıcı olarak giriş yapıldı
        setError('Giriş başarılı. Bu hesap admin yetkisine sahip değil.')
        setLoading(false)
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }
    } catch (err) {
      logger.error('Login error:', err)
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          DikiliHaber'a Giriş Yap
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hesabınız yok mu?{' '}
          <Link href="/auth/register" className="font-medium text-primary hover:text-blue-500">
            Kayıt olun
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta Adresi
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined })
                  }}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
                    fieldErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined })
                  }}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
                    fieldErrors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm text-center">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm text-center">
                {success}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Veya</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/" className="text-primary hover:text-blue-500">
                Ana sayfaya dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Yükleniyor...</div>}>
      <LoginForm />
    </Suspense>
  )
}