import { supabase } from '@/lib/supabase'
import { ForbiddenError, UnauthorizedError, AppError } from './errors'

// Permission types
export type Permission =
  | 'create_news'
  | 'edit_news'
  | 'delete_news'
  | 'publish_news'
  | 'approve_news'
  | 'manage_users'
  | 'manage_roles'
  | 'manage_comments'
  | 'view_analytics'
  | 'manage_categories'
  | 'manage_media'

export type RoleType = 'super_admin' | 'admin' | 'editor' | 'author' | 'moderator' | 'viewer'

// ==========================================
// AUTHORIZATION CHECKS
// ==========================================

/**
 * Get user role(s)
 */
export async function getUserRoles(userId: string): Promise<RoleType[]> {
  if (!supabase) throw new AppError('Database not initialized')

  const { data: userRoles, error } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', userId)

  if (error && error.code !== 'PGRST116') {
    throw new AppError('Failed to fetch user roles', 500, error)
  }

  return (userRoles || []).map((ur: any) => ur.roles.name as RoleType)
}

/**
 * Check if user has specific role
 */
export async function userHasRole(
  userId: string,
  roleNames: RoleType | RoleType[]
): Promise<boolean> {
  const roles = await getUserRoles(userId)
  const roleArray = Array.isArray(roleNames) ? roleNames : [roleNames]
  return roleArray.some(r => roles.includes(r))
}

/**
 * Check if user has specific permission
 */
export async function userHasPermission(
  userId: string,
  permission: Permission
): Promise<boolean> {
  if (!supabase) throw new AppError('Database not initialized')

  const { data, error } = await supabase
    .rpc('check_user_permission', {
      p_user_id: userId,
      p_permission: permission
    })

  if (error) {
    console.error('Permission check error:', error)
    return false
  }

  return data === true
}

/**
 * Require authentication
 */
export async function requireAuth(userId?: string | null) {
  if (!userId) {
    throw new UnauthorizedError('Oturum açmanız gerekiyor')
  }
  return userId
}

/**
 * Require specific role
 */
export async function requireRole(userId: string, roleNames: RoleType | RoleType[]) {
  const hasRole = await userHasRole(userId, roleNames)
  if (!hasRole) {
    throw new ForbiddenError('Bu işlemi gerçekleştirmek için yetkiniz yok')
  }
}

/**
 * Require specific permission
 */
export async function requirePermission(userId: string, permission: Permission) {
  const hasPermission = await userHasPermission(userId, permission)
  if (!hasPermission) {
    throw new ForbiddenError(`${permission} yetkisine sahip değilsiniz`)
  }
}

// ==========================================
// RESOURCE OWNERSHIP CHECKS
// ==========================================

/**
 * Check if user is news author
 */
export async function isNewsAuthor(userId: string, newsId: string): Promise<boolean> {
  if (!supabase) throw new AppError('Database not initialized')

  const { data, error } = await supabase
    .from('news')
    .select('author_id')
    .eq('id', newsId)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new AppError('Failed to check news ownership', 500, error)
  }

  return data?.author_id === userId
}

/**
 * Check if user is comment author
 */
export async function isCommentAuthor(userId: string, commentId: string): Promise<boolean> {
  if (!supabase) throw new AppError('Database not initialized')

  const { data, error } = await supabase
    .from('comments')
    .select('user_id')
    .eq('id', commentId)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new AppError('Failed to check comment ownership', 500, error)
  }

  return data?.user_id === userId
}

// ==========================================
// HELPER: Check multiple conditions
// ==========================================

/**
 * Check access: User must have either role OR own the resource
 */
export async function checkResourceAccess(
  userId: string,
  resourceOwnerId: string | null,
  allowedRoles?: RoleType[]
): Promise<boolean> {
  // Own resource always has access
  if (resourceOwnerId === userId) return true

  // Check roles if provided
  if (allowedRoles && allowedRoles.length > 0) {
    return await userHasRole(userId, allowedRoles)
  }

  return false
}

// ==========================================
// SQL HELPER: For use in RLS policies
// ==========================================

/**
 * Can be used in Supabase SQL if needed:
 * 
 * CREATE OR REPLACE FUNCTION check_user_permission(
 *   p_user_id UUID,
 *   p_permission TEXT
 * ) RETURNS BOOLEAN AS $$
 * BEGIN
 *   RETURN EXISTS (
 *     SELECT 1
 *     FROM user_roles ur
 *     JOIN role_permissions rp ON ur.role_id = rp.role_id
 *     JOIN permissions p ON rp.permission_id = p.id
 *     WHERE ur.user_id = p_user_id
 *     AND p.name = p_permission
 *   );
 * END;
 * $$ LANGUAGE plpgsql;
 */
