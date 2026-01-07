import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.\n' +
    `URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}\n` +
    `Key: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}`
  )
}

// Warn if key format looks incorrect
if (supabaseAnonKey && !supabaseAnonKey.startsWith('eyJ')) {
  console.warn(
    '⚠️ Supabase key format looks incorrect. ' +
    'Anon keys should be JWT tokens starting with "eyJ". ' +
    'Please verify your key from Supabase Dashboard → Settings → API → anon public key'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

