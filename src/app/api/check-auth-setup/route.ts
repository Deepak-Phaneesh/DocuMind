import { supabaseAdmin } from '@/lib/supabase';

// Force dynamic rendering - don't try to pre-render at build time
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Test 1: Check if user_id column exists
        const { data: tableInfo, error: tableError } = await supabaseAdmin
            .from('documents')
            .select('user_id')
            .limit(1);

        if (tableError) {
            return Response.json({
                success: false,
                issue: 'user_id column does not exist',
                error: tableError.message,
                fix: 'Run the migration script: supabase/migrations/add_auth.sql'
            }, { status: 500 });
        }

        // Test 2: Try calling match_documents with user_id_param
        const testEmbedding = new Array(384).fill(0);
        const testUserId = '00000000-0000-0000-0000-000000000000';

        const { data: rpcData, error: rpcError } = await supabaseAdmin
            .rpc('match_documents', {
                query_embedding: testEmbedding,
                match_threshold: 0.3,
                match_count: 1,
                user_id_param: testUserId,
            });

        if (rpcError) {
            return Response.json({
                success: false,
                issue: 'match_documents function not updated',
                error: rpcError.message,
                hint: rpcError.hint,
                fix: 'Run this in Supabase SQL Editor:\n\n' +
                    'DROP FUNCTION IF EXISTS match_documents(vector, float, int);\n' +
                    'Then run the full migration script from add_auth.sql'
            }, { status: 500 });
        }

        return Response.json({
            success: true,
            message: 'Database is correctly configured for authentication!',
            userIdColumn: 'exists',
            matchDocumentsFunction: 'updated with user_id_param'
        });

    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
