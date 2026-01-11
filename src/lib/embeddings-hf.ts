import { HfInference } from '@huggingface/inference';

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

/**
 * Generate embeddings using Hugging Face's free inference API
 * Using sentence-transformers/all-MiniLM-L6-v2 model (384 dimensions, free)
 */
export async function generateHuggingFaceEmbedding(text: string): Promise<number[]> {
    try {
        const result = await hf.featureExtraction({
            model: 'sentence-transformers/all-MiniLM-L6-v2',
            inputs: text.replace(/\n/g, ' '),
        });

        // The result is already an array of numbers
        return Array.isArray(result) ? result : Array.from(result as any);
    } catch (error) {
        console.error('Hugging Face embedding error:', error);
        throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Fallback: Generate mock embeddings for testing
 * Returns a normalized random vector
 */
export function generateMockEmbedding(text: string, dimensions: number = 384): number[] {
    // Use text hash as seed for consistent embeddings for same text
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash) + text.charCodeAt(i);
        hash = hash & hash;
    }

    const embedding = [];
    for (let i = 0; i < dimensions; i++) {
        // Pseudo-random but deterministic based on hash
        const seed = (hash + i) * 2654435761;
        embedding.push((Math.sin(seed) + 1) / 2 - 0.5);
    }

    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
}
