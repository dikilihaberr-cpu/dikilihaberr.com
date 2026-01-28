import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/utils/logger'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 }
      )
    }

    // Get auth token from request
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Create client with user's token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }

    // KRİTİK GÜVENLİK: Sadece super_admin veya service role ile admin eklenebilir
    // Bu endpoint sadece ilk kurulum için kullanılmalı, production'da devre dışı bırakılmalı
    if (!supabaseServiceKey) {
      return NextResponse.json(
        { error: 'This endpoint requires service role key. Disabled in production for security.' },
        { status: 403 }
      )
    }

    // Service role ile admin kontrolü yap
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Kullanıcının zaten admin olup olmadığını kontrol et
    const { data: existingAdmin } = await serviceClient
      .from('admins')
      .select('user_id, role')
      .eq('user_id', user.id)
      .maybeSingle()

    // Eğer kullanıcı zaten admin değilse ve super_admin değilse, admin ekleme izni yok
    if (!existingAdmin) {
      // İlk kurulum için: Eğer hiç admin yoksa, ilk kullanıcıyı admin yapabilir
      const { data: adminCount } = await serviceClient
        .from('admins')
        .select('user_id', { count: 'exact', head: true })

      if (adminCount && adminCount > 0) {
        return NextResponse.json(
          { error: 'Unauthorized - Only existing admins can add new admins' },
          { status: 403 }
        )
      }
    }

    // Try to create admins table if it doesn't exist (using service role if available)
    let tableCreated = false
    if (supabaseServiceKey) {
      try {
        const serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        })

        // Create table using RPC or direct SQL (if available)
        // Note: This might not work without proper RPC function
        // Fallback: User needs to create table manually via SQL Editor
        const { error: createError } = await serviceClient.rpc('exec_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS public.admins (
              user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
              role TEXT DEFAULT 'admin',
              email TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
            
            DROP POLICY IF EXISTS "Admins can read self" ON public.admins;
            
            CREATE POLICY "Admins can read self" ON public.admins
              FOR SELECT USING (auth.uid() = user_id);
          `
        })

        if (!createError) {
          tableCreated = true
        }
      } catch (err) {
        // RPC might not be available, that's okay
        console.log('Could not create table via RPC, user needs to create manually')
      }
    }

    // Check if admins table exists by trying to query it
    const { error: checkError } = await supabase
      .from('admins')
      .select('user_id')
      .limit(1)

    if (checkError) {
      // Table doesn't exist
      if (checkError.code === '42P01' || checkError.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'Admins table does not exist',
            message: 'Please run SETUP_ADMIN.sql in Supabase SQL Editor first',
            sqlFile: 'SETUP_ADMIN.sql'
          },
          { status: 400 }
        )
      }
      
      // RLS infinite recursion error
      if (checkError.message?.includes('infinite recursion') || 
          checkError.message?.includes('recursion detected')) {
        return NextResponse.json(
          { 
            error: 'RLS infinite recursion detected',
            message: 'Please run FIX_RLS_RECURSION.sql in Supabase SQL Editor to fix this issue',
            sqlFile: 'FIX_RLS_RECURSION.sql'
          },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: `Database error: ${checkError.message}` },
        { status: 500 }
      )
    }

    // Add current user as admin
    const { data: adminData, error: insertError } = await supabase
      .from('admins')
      .insert({
        user_id: user.id,
        email: user.email,
        role: 'admin'
      })
      .select()
      .single()

    if (insertError) {
      // Might already exist, try to update
      if (insertError.code === '23505') {
        const { data: updateData, error: updateError } = await supabase
          .from('admins')
          .update({
            role: 'admin',
            email: user.email
          })
          .eq('user_id', user.id)
          .select()
          .single()

        if (updateError) {
          return NextResponse.json(
            { error: `Failed to update admin: ${updateError.message}` },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'Admin status updated successfully',
          admin: updateData,
          tableCreated
        })
      }

      return NextResponse.json(
        { error: `Failed to add admin: ${insertError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Admin added successfully',
      admin: adminData,
      tableCreated
    })

  } catch (error: any) {
    logger.error('Setup admin error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
