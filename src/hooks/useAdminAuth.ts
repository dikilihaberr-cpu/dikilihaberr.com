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
    const checkAccess = async () => {
      setLoading(true)
      const result: AdminCheckResult = await checkAdminAccess()

      if (!result.isAdmin) {
        // Not admin - redirect to login or home
        if (result.error === 'No active session') {
          router.push('/auth/login')
        } else {
          router.push('/')
        }
        return
      }

      // User is admin
      setIsAdmin(true)
      setUserEmail(result.userEmail)
      setLoading(false)
    }

    checkAccess()
  }, [router])

  return { isAdmin, loading, userEmail }
}
