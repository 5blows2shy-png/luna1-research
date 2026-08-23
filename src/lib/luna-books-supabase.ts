import "server-only";
import { createClient } from "@supabase/supabase-js";

export function getLunaBooksUserClient(accessToken: string) {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey || !accessToken.trim()) return null;
  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Financial routes must use a user-scoped client so Postgres RLS evaluates
// auth.uid(). The service-role client intentionally is not exposed here.
