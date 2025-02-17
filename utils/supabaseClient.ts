import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Las variables de entorno de Supabase no están configuradas correctamente.');
}

const validSupabaseUrl = new URL(supabaseUrl).toString(); // Valida la URL

export const supabase = createClient(validSupabaseUrl, supabaseKey);
