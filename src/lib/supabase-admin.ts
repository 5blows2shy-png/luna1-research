import {createClient} from "@supabase/supabase-js";
export function getSupabaseAdmin(){const url=process.env.SUPABASE_URL;const key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)return null;return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})}
// This server-only client is reserved for report metadata, private drafts,
// newsletter subscribers, and admin authentication. Never import it into a
// client component or expose the service-role key with NEXT_PUBLIC_.
