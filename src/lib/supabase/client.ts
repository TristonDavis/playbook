import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types'

// Use in Client Components
export function createClient() {
  return createBrowserClient<Database, 'public', any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
