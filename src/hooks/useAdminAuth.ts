// Admin authentication hook
// Use this hook in all admin pages to check admin access

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkAdminAccess, AdminCheckResult } from '@/lib/utils/adminAuth'

export function useAdminAuth() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    
    const checkAccess = async () => {
      setLoading(true)
      const result: AdminCheckResult = await checkAdminAccess()

      if (!mounted) return // Component unmount kontrolü

      if (!result.isAdmin) {
        // Not admin - redirect to login or home
        if (result.error === 'No active session') {
          router.push('/auth/login')
        } else {
          router.push('/')
        }
        setLoading(false)
        return
      }

      // User is admin
      if (mounted) {
        setIsAdmin(true)
        setUserEmail(result.userEmail)
        setLoading(false)
      }
    }

    checkAccess()
    
    return () => {
      mounted = false // Cleanup
    }
  }, []) // router dependency kaldırıldı - sonsuz döngü önleme

  return { isAdmin, loading, userEmail }
}
