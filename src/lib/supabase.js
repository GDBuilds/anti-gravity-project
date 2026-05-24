import { createClient } from '@supabase/supabase-js'

// Use fallback values to prevent Vite/Supabase from crashing the entire app if .env is missing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase credentials missing. App is running in local offline/mock mode. Create a .env file to enable live integration.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
