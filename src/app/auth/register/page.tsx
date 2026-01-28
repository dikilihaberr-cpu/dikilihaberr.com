'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { signUpSchema } from '@/lib/validators/schemas'
import { logger } from '@/lib/utils/logger'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({})
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    setFieldErrors({})

    // Client-side validation
    const validationResult = signUpSchema.safeParse({ email, password, confirmPassword })

    if (!validationResult.success) {
      const errors: { email?: string; password?: string; confirmPassword?: string } = {}
      validationResult.error.issues.forEach((err) => {
        const field = err.path[0]
        if (typeof field === 'string') {
          if (field === 'email') {
            errors.email = err.message === 'Invalid email' ? 'Geçerli bir e-posta adresi giriniz' : err.message
          } else if (field === 'password') {
            errors.password = err.message === 'String must contain at least 6 character(s)' 
              ? 'Şifre en az 6 karakter olmalıdır' 
              : err.message
          } else if (field === 'confirmPassword') {
            errors.confirmPassword = err.message.includes('match') 
              ? 'Şifreler eşleşmiyor' 
              : err.message
          }
        }
      })
      setFieldErrors(errors)
      setLoading(false)
      return
    }

    try {
      const result = await signUp(email, password)

      if (result.error) {
        // Detaylı hata mesajları
        if (result.error.message?.includes('email')) {
          setError('E-posta gönderilemedi. Lütfen Supabase Dashboard\'da email ayarlarını kontrol edin.')
        } else if (result.error.message?.includes('already')) {
          setError('Bu e-posta adresi zaten kullanılıyor.')
        } else {
          setError(result.error.message || 'Kayıt sırasında bir hata oluştu.')
        }
      } else {
        // Başarılı kayıt
        if (result.data?.user && !result.data?.session) {
          // E-posta doğrulaması gerekiyor
          setSuccess('Kayıt başarılı! E-posta adresinize gönderilen doğrulama linkine tıklayarak hesabınızı aktifleştirin. (E-posta gelmediyse spam klasörünü kontrol edin)')
        } else if (result.data?.session) {
          // Otomatik giriş yapıldı (email confirmation kapalıysa)
          setSuccess('Kayıt başarılı! Yönlendiriliyorsunuz...')
          setTimeout(() => {
            router.push('/')
          }, 1500)
          return
        } else {
          setSuccess('Kayıt başarılı! E-posta adresinizi kontrol ederek hesabınızı doğrulayın.')
        }
        
        setTimeout(() => {
          router.push('/auth/login')
        }, 5000)
      }
    } catch (err) {
      logger.error('Register error:', err)
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          DikiliHaber'a Kayıt Ol
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Zaten hesabınız var mı?{' '}
          <Link href="/auth/login" className="font-medium text-primary hover:text-blue-500">
            Giriş yapın
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
                  autoComplete="new-password"
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
                <p className="mt-1 text-xs text-gray-500">En az 6 karakter</p>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Şifre Tekrar
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: undefined })
                  }}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
                    fieldErrors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-600 text-sm text-center">
                {success}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
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