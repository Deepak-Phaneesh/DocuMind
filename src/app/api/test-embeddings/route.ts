import { generateHuggingFaceEmbedding, generateMockEmbedding } from '@/lib/embeddings-hf';

export async function GET() {
    try {
        console.log('Testing Hugging Face embedding...');

        const testText = "This is a test sentence for embedding generation.";

        // Test Hugging Face
        const hfEmbedding = await generateHuggingFaceEmbedding(testText);

        return Response.json({
            success: true,
            message: 'Hugging Face embedding test successful',
            embeddingLength: hfEmbedding.length,
            provider: 'huggingface',
            sample: hfEmbedding.slice(0, 5) // Show first 5 values
        });

    } catch (error) {
        console.error('Embedding test error:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
