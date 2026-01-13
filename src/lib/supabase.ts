import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization - clients are only created when first accessed
// This prevents build-time errors when environment variables aren't available
let _supabaseAdmin: SupabaseClient | null = null;
let _supabaseClient: SupabaseClient | null = null;

// This client should only be used on the server side because it uses the Service Role Key
export const getSupabaseAdmin = (): SupabaseClient => {
    if (!_supabaseAdmin) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
        }

        _supabaseAdmin = createClient(supabaseUrl, supabaseKey);
    }
    return _supabaseAdmin;
};

// For backward compatibility with existing code
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
    get(target, prop) {
        return getSupabaseAdmin()[prop as keyof SupabaseClient];
    }
});

// For client-side operations (if any, like auth), use the anon key
export const getSupabaseClient = (): SupabaseClient => {
    if (!_supabaseClient) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required');
        }

        _supabaseClient = createClient(supabaseUrl, supabaseKey);
    }
    return _supabaseClient;
};

// For backward compatibility with existing code
export const supabaseClient = new Proxy({} as SupabaseClient, {
    get(target, prop) {
        return getSupabaseClient()[prop as keyof SupabaseClient];
    }
});
