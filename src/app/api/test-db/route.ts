import { supabaseAdmin } from '@/lib/supabase';

// Force dynamic rendering - don't try to pre-render at build time
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Test 1: Check if can connect to Supabase
        console.log('Testing Supabase connection...');

        // Test 2: Check if documents table exists
        const { data, error } = await supabaseAdmin
            .from('documents')
            .select('count')
            .limit(1);

        if (error) {
            console.error('Database error:', error);
            return Response.json({
                success: false,
                error: 'Database table error',
                details: error.message,
                hint: error.hint,
                code: error.code
            }, { status: 500 });
        }

        // Test 3: Check if match_documents function exists
        const { data: rpcData, error: rpcError } = await supabaseAdmin
            .rpc('match_documents', {
                query_embedding: new Array(1536).fill(0),
                match_threshold: 0.5,
                match_count: 1
            });

        if (rpcError) {
            console.error('RPC function error:', rpcError);
            return Response.json({
                success: false,
                error: 'match_documents function not found or failed',
                details: rpcError.message,
                hint: rpcError.hint,
                code: rpcError.code,
                suggestion: 'Please run the SQL script in supabase/migrations/init.sql'
            }, { status: 500 });
        }

        return Response.json({
            success: true,
            message: 'Database setup is correct',
            documentsTable: 'exists',
            matchDocumentsFunction: 'exists'
        });

    } catch (error) {
        console.error('Test error:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
