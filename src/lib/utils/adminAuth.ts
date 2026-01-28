// Admin authentication utility
// Centralized admin check function to be used across admin pages

import { supabase } from '../supabase'

export interface AdminCheckResult {
  isAdmin: boolean
  userEmail: string | null
  error: string | null
}

/**
 * Check if current user is admin
 * Returns admin status, user email, and any error
 */
export async function checkAdminAccess(): Promise<AdminCheckResult> {
  try {
    if (!supabase) {
      return {
        isAdmin: false,
        userEmail: null,
        error: 'Supabase not initialized',
      }
    }

    // Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      return {
        isAdmin: false,
        userEmail: null,
        error: 'No active session',
      }
    }

    // Check if user is admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admins')
      .select('user_id, role, email')
      .eq('user_id', session.user.id)
      .maybeSingle()

    // Tablo yoksa - kurulum eksik
    if (adminError?.code === '42P01' || 
        adminError?.message?.includes('relation') || 
        adminError?.message?.includes('does not exist') ||
        (adminError?.message?.includes('table') && adminError?.message?.includes('not exist'))) {
      return {
        isAdmin: false,
        userEmail: session.user.email || null,
        error: 'Database kurulumu eksik - admins tablosu bulunamadı',
      }
    }

    if (adminError || !adminUser) {
      return {
        isAdmin: false,
        userEmail: session.user.email || null,
        error: adminError?.code === 'PGRST116' ? 'User is not admin' : (adminError?.message || 'User is not admin'),
      }
    }

    return {
      isAdmin: true,
      userEmail: session.user.email || adminUser.email || null,
      error: null,
    }
  } catch (error: any) {
    return {
      isAdmin: false,
      userEmail: null,
      error: error?.message || 'Unknown error',
    }
  }
}
