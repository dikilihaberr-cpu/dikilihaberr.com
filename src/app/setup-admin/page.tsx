'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'

export default function SetupAdminPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    tableCreated?: boolean
  } | null>(null)
  const router = useRouter()

  const setupAdmin = async () => {
    setLoading(true)
    setResult(null)

    try {
      // Check if supabase is initialized
      if (!supabase) {
        setResult({
          success: false,
          message: 'Supabase bağlantısı kurulamadı. Lütfen .env.local dosyasını kontrol edin.'
        })
        setLoading(false)
        return
      }
      
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        setResult({
          success: false,
          message: 'Lütfen önce giriş yapın!'
        })
        setLoading(false)
        return
      }

      // Call setup API
      const response = await fetch('/api/setup-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        // Check if table doesn't exist error
        if (data.error === 'Admins table does not exist' || data.message?.includes('does not exist')) {
          setResult({
            success: false,
            message: 'Admins tablosu bulunamadı. Lütfen önce SETUP_ADMIN.sql dosyasını Supabase SQL Editor\'da çalıştırın.'
          })
        } 
        // Check if RLS infinite recursion error
        else if (data.error === 'RLS infinite recursion detected' || data.message?.includes('recursion')) {
          setResult({
            success: false,
            message: 'RLS sonsuz döngü hatası tespit edildi. Lütfen FIX_RLS_RECURSION.sql dosyasını Supabase SQL Editor\'da çalıştırın.'
          })
        } 
        else {
          setResult({
            success: false,
            message: data.error || data.message || 'Bir hata oluştu'
          })
        }
        setLoading(false)
        return
      }

      setResult({
        success: true,
        message: data.message || 'Admin başarıyla eklendi!',
        tableCreated: data.tableCreated
      })

      // Redirect to admin panel after 2 seconds
      setTimeout(() => {
        router.push('/admin')
      }, 2000)

    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'Beklenmedik bir hata oluştu'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Kurulumu</h1>
          <p className="text-gray-600 text-sm">
            Bu sayfa sizi otomatik olarak admin olarak ekleyecek
          </p>
        </div>

        {!result && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Önemli:</p>
                  <p className="mb-2">
                    Eğer "Admins table does not exist" hatası alırsanız, önce{' '}
                    <code className="bg-blue-100 px-1 rounded">SETUP_ADMIN.sql</code> dosyasını
                    Supabase SQL Editor'da çalıştırmanız gerekiyor.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={setupAdmin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Kurulum yapılıyor...
                </>
              ) : (
                'Admin Olarak Ekle'
              )}
            </button>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className={`flex items-start p-4 rounded-lg ${
              result.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`font-semibold mb-1 ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? 'Başarılı!' : 'Hata'}
                </p>
                <p className={`text-sm ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.message}
                </p>
                {result.tableCreated && (
                  <p className="text-xs text-green-600 mt-2">
                    ✅ Admins tablosu otomatik olarak oluşturuldu
                  </p>
                )}
              </div>
            </div>

            {result.success ? (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Admin paneline yönlendiriliyorsunuz...
                </p>
                <Link
                  href="/admin"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Hemen Git →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
            {(result.message.includes('does not exist') || result.message.includes('RLS sonsuz döngü')) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 font-semibold mb-2">
                  Çözüm:
                </p>
                <ol className="text-xs text-yellow-700 space-y-1 list-decimal list-inside">
                  <li>Supabase Dashboard'a gidin</li>
                  <li>SQL Editor'a tıklayın</li>
                  <li>
                    {result.message.includes('RLS sonsuz döngü') ? (
                      <>
                        <code className="bg-yellow-100 px-1 rounded">FIX_RLS_RECURSION.sql</code> dosyasını açın
                      </>
                    ) : (
                      <>
                        <code className="bg-yellow-100 px-1 rounded">SETUP_ADMIN.sql</code> dosyasını açın
                      </>
                    )}
                  </li>
                  <li>İçeriğini kopyalayıp SQL Editor'a yapıştırın</li>
                  <li>"Run" butonuna tıklayın</li>
                  <li>Bu sayfayı yenileyin ve tekrar deneyin</li>
                </ol>
              </div>
            )}
                <button
                  onClick={() => {
                    setResult(null)
                    router.refresh()
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Tekrar Dene
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 text-center block"
          >
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  )
}
