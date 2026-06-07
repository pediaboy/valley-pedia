'use client';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  _supabase = createClient(url, key);
  return _supabase;
}

// Backward-compat: proxy yang hanya create client saat dipanggil method-nya
export const supabase = {
  from: (table: string) => getSupabase().from(table),
  auth: new Proxy({} as SupabaseClient['auth'], {
    get(_, prop) {
      return (getSupabase().auth as any)[prop];
    }
  }),
  storage: new Proxy({} as SupabaseClient['storage'], {
    get(_, prop) {
      return (getSupabase().storage as any)[prop];
    }
  }),
};
