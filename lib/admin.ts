import { createClient } from './supabase/server'

export interface AdminCheckResult {
  isAdmin: boolean
  user: any | null
  error: string | null
}

export async function checkAdminAccess(): Promise<AdminCheckResult> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return {
      isAdmin: false,
      user: null,
      error: 'Not authenticated'
    }
  }
  
  const adminEmail = process.env.ADMIN_EMAIL
  
  if (!adminEmail) {
    console.error('ADMIN_EMAIL environment variable is not set')
    return {
      isAdmin: false,
      user: null,
      error: 'Admin configuration error'
    }
  }
  
  const isAdmin = user.email === adminEmail
  
  if (!isAdmin) {
    return {
      isAdmin: false,
      user,
      error: 'Unauthorized - Admin access required'
    }
  }
  
  return {
    isAdmin: true,
    user,
    error: null
  }
}