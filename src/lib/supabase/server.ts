import { createServerClient } from '@supabase/ssr'
import { auth } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'
import { Database } from '@/types'

// Use in Server Components, Server Actions, and API Routes
export async function createClient() {
  // cookies() MUST be awaited before any other async work in Next.js 15.
  // Do not move this into a Promise.all — it must resolve first.
  const cookieStore = await cookies()

  const authObject = await auth()
  let accessToken: string | null = null
  try {
    accessToken = await authObject.getToken({
      template: process.env.CLERK_JWT_TEMPLATE || 'supabase',
    })
  } catch (err) {
    console.error('[supabase/server] getToken failed:', err)
    accessToken = null
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : undefined,
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
            )
          } catch {
            // Called from a Server Component — cookies can't be set.
          }
        },
      },
    }
  )
}

// Use in API routes that need admin access (bypasses RLS)
export function createAdminClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}