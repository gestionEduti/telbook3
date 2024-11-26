import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY,
)

// TODO: agregar los types generados desde supabase y usarlos en el createClient

// import { createClient } from '@supabase/supabase-js'
// import type { Database } from '@/types/supabase'

// export const supabase = createClient<Database>(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_KEY,
// )
