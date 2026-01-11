import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // accessing from server only usually, unless using RLS

// This client should only be used on the server side because it uses the Service Role Key
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

// For client-side operations (if any, like auth), use the anon key
export const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
