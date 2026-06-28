import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// સાદો ક્લાયન્ટ બનાવો
export const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// જૂના કોડ સાથે સુસંગતતા માટે આ ફંક્શન રાખો
export const createClient = () => supabase