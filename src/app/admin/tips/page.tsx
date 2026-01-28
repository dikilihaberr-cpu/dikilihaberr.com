'use client'

import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function TipsPage() {
  const { isAdmin, loading } = useAdminAuth()

  if (loading) {
    return <LoadingSpinner fullScreen text="Yükleniyor..." />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Erişim Reddedildi</h1>
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <AlertCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Okuyucu İpuçları</h1>
          <p className="text-gray-600 mb-4">Bu sayfa yakında doldurulacaktır</p>
          <Link href="/admin" className="text-blue-600 hover:text-blue-700">
            Admin paneline geri dön
          </Link>
        </div>
      </div>
    </div>
  )
}
