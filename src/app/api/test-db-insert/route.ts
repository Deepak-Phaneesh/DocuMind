import { supabaseAdmin } from '@/lib/supabase';
import { generateEmbedding } from '@/lib/vector-store';

// Force dynamic rendering - don't try to pre-render at build time
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Generate a test embedding
        const testEmbedding = await generateEmbedding("test");
        console.log('Test embedding length:', testEmbedding.length);

        // Try to insert it into the database
        const { data, error } = await supabaseAdmin
            .from('documents')
            .insert({
                content: 'Test content',
                embedding: testEmbedding,
                metadata: { test: true }
            })
            .select();

        if (error) {
            return Response.json({
                success: false,
                error: error.message,
                hint: error.hint,
                details: error.details,
                code: error.code,
                embeddingLength: testEmbedding.length,
                suggestion: 'The database might still be configured for 1536 dimensions (OpenAI). Please update using the new init.sql script.'
            }, { status: 500 });
        }

        // Clean up test data
        if (data && data.length > 0) {
            await supabaseAdmin
                .from('documents')
                .delete()
                .eq('id', data[0].id);
        }

        return Response.json({
            success: true,
            message: 'Database schema is correctly configured for current embedding provider',
            embeddingLength: testEmbedding.length
        });

    } catch (error) {
        console.error('Database test error:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
