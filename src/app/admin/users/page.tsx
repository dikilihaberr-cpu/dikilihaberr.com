'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Users as UsersIcon, Shield, Trash2, Plus } from 'lucide-react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { logger } from '@/lib/utils/logger'
import { showToast } from '@/components/ui/Toast'

interface User {
  id: string
  email: string
  created_at: string
  user_metadata?: Record<string, any>
}

interface Admin {
  user_id: string
  role: string
}

export default function UsersManagement() {
  const router = useRouter()
  const { isAdmin, loading: authLoading } = useAdminAuth()
  const [users, setUsers] = useState<User[]>([])
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [newAdminEmail, setNewAdminEmail] = useState('')

  useEffect(() => {
    if (isAdmin && !authLoading) {
      loadUsers()
    }
  }, [isAdmin, authLoading])

  if (authLoading) {
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

  const loadUsers = async () => {
    if (!supabase) {
      logger.error('Supabase bağlantısı kurulamadı')
      showToast('Supabase bağlantısı kurulamadı', 'error')
      return
    }
    
    setLoading(true)
    try {
      // Get all users
      const { data: allUsers } = await supabase.auth.admin?.listUsers() || { data: null }
      if (allUsers) {
        setUsers(allUsers.users as User[])
      }

      // Get admins
      const { data: adminsList } = await supabase
        .from('admins')
        .select('*')

      if (adminsList) {
        setAdmins(adminsList)
      }
    } catch (error) {
      logger.error('Error loading users:', error)
      showToast('Kullanıcılar yüklenirken hata oluştu', 'error')
    } finally {
      setLoading(false)
    }
  }

  const addAdmin = async (email: string) => {
    if (!supabase) {
      showToast('Supabase bağlantısı kurulamadı', 'error')
      return
    }
    
    // Input sanitization
    const sanitizedEmail = email.trim().toLowerCase()
    
    if (!sanitizedEmail) {
      showToast('Email girin', 'warning')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitizedEmail)) {
      showToast('Geçerli bir email adresi girin', 'warning')
      return
    }

    try {
      // Find user by email
      const user = users.find(u => u.email?.toLowerCase() === sanitizedEmail)
      if (!user) {
        showToast('Kullanıcı bulunamadı', 'error')
        return
      }

      // Check if user is already admin
      const isAlreadyAdmin = admins.some(a => a.user_id === user.id)
      if (isAlreadyAdmin) {
        showToast('Bu kullanıcı zaten admin', 'warning')
        return
      }

      // Add to admins table - RLS policy kontrol edecek
      const { error } = await supabase
        .from('admins')
        .insert({
          user_id: user.id,
          email: sanitizedEmail,
          role: 'admin'
        })

      if (error) {
        // RLS policy hatası - kullanıcının yetkisi yok
        if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('policy')) {
          showToast('Bu işlem için yetkiniz yok', 'error')
        } else {
          throw error
        }
        return
      }

      setNewAdminEmail('')
      await loadUsers()
      showToast('Admin başarıyla eklendi', 'success')
    } catch (error) {
      logger.error('Error adding admin:', error)
      showToast('Admin eklenirken hata oluştu', 'error')
    }
  }

  const removeAdmin = async (userId: string) => {
    if (!supabase) {
      showToast('Supabase bağlantısı kurulamadı', 'error')
      return
    }
    
    if (!confirm('Bu kullanıcıyı admin rolünden çıkarmak istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('user_id', userId)

      if (error) throw error

      await loadUsers()
      showToast('Admin başarıyla kaldırıldı', 'success')
    } catch (error) {
      logger.error('Error removing admin:', error)
      showToast('Admin kaldırılırken hata oluştu', 'error')
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Kullanıcılar yükleniyor..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <UsersIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
              <p className="text-sm text-gray-600">{users.length} kullanıcı, {admins.length} admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Add Admin Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Ekle</h2>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Kullanıcı email'i girin..."
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => addAdmin(newAdminEmail)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Ekle
            </button>
          </div>
        </div>

        {/* Admins Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Yöneticiler</h2>
          </div>
          <div className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      Henüz admin yok
                    </td>
                  </tr>
                ) : (
                  admins.map(admin => {
                    const user = users.find(u => u.id === admin.user_id)
                    return (
                      <tr key={admin.user_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-900">{user?.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            {admin.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => removeAdmin(admin.user_id)}
                            className="text-red-600 hover:text-red-900"
                            title="Kaldır"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Tüm Kullanıcılar</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Katılım Tarihi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      Kullanıcı bulunamadı
                    </td>
                  </tr>
                ) : (
                  users.map(user => {
                    const isAdmin = admins.some(a => a.user_id === user.id)
                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            isAdmin
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {isAdmin ? 'Admin' : 'Kullanıcı'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(user.created_at).toLocaleDateString('tr-TR')}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
