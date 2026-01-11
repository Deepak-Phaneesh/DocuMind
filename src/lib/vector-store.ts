import { supabaseAdmin } from './supabase';
import { generateHuggingFaceEmbedding, generateMockEmbedding } from './embeddings-hf';

// Choose embedding provider based on environment
const EMBEDDING_PROVIDER = process.env.EMBEDDING_PROVIDER || 'huggingface'; // 'openai', 'huggingface', or 'mock'

export async function generateEmbedding(text: string): Promise<number[]> {
    switch (EMBEDDING_PROVIDER) {
        case 'huggingface':
            // Free Hugging Face API (384 dimensions)
            return await generateHuggingFaceEmbedding(text);

        case 'openai':
            // OpenAI (1536 dimensions) - requires paid API
            const { openai } = await import('@ai-sdk/openai');
            const { embed } = await import('ai');
            const { embedding } = await embed({
                model: openai.embedding('text-embedding-3-small'),
                value: text.replace(/\n/g, ' '),
            });
            return embedding;

        case 'mock':
            // Mock embeddings for testing UI only (384 dimensions)
            return generateMockEmbedding(text, 384);

        default:
            throw new Error(`Unknown embedding provider: ${EMBEDDING_PROVIDER}`);
    }
}

export async function storeDocuments(fileId: string, chunks: string[], fileName?: string, userId?: string) {
    const embeddings = await Promise.all(
        chunks.map(async (chunk) => {
            const embedding = await generateEmbedding(chunk);
            return {
                content: chunk,
                embedding,
                user_id: userId,
                metadata: {
                    file_id: fileId,
                    file_name: fileName || 'unknown.pdf'
                },
            };
        })
    );

    const { error } = await supabaseAdmin
        .from('documents')
        .insert(embeddings);

    if (error) {
        console.error('Error storing documents:', error);
        throw error;
    }
}
