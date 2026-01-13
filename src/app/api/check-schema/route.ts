import { supabaseAdmin } from '@/lib/supabase';

// Force dynamic rendering - don't try to pre-render at build time
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Check the actual column definition in the database
        const { data, error } = await supabaseAdmin
            .rpc('pg_typeof', {
                column_name: 'embedding',
                table_name: 'documents'
            })
            .single();

        // Alternative: try to get information from information_schema
        const { data: schemaInfo, error: schemaError } = await supabaseAdmin
            .from('documents')
            .select('*')
            .limit(0);

        return Response.json({
            diagnostics: {
                message: 'Database schema check',
                note: 'If you see dimension mismatch errors, run the updated init.sql in Supabase SQL Editor',
                expectedDimensions: 384,
                actualDimensions: 'unknown - check Supabase dashboard',
                fixInstructions: [
                    '1. Go to Supabase SQL Editor',
                    '2. Run: DROP TABLE IF EXISTS documents CASCADE;',
                    '3. Run: DROP FUNCTION IF EXISTS match_documents;',
                    '4. Run the full init.sql script from supabase/migrations/init.sql'
                ]
            }
        });

    } catch (error) {
        return Response.json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
