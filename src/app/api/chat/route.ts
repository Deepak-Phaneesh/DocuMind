import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Groq from 'groq-sdk';
import { supabaseAdmin } from '@/lib/supabase';
import { generateEmbedding } from '@/lib/vector-store';

export const maxDuration = 30;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const USE_OPENAI = process.env.CHAT_PROVIDER === 'openai';

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return new Response('Unauthorized', { status: 401 });
        }

        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1];

        // Generate embedding for the query
        const queryEmbedding = await generateEmbedding(lastMessage.content);

        // Search for relevant documents (user's documents only)
        const { data: documents, error } = await supabaseAdmin.rpc('match_documents', {
            query_embedding: queryEmbedding,
            match_threshold: 0.3,
            match_count: 5,
            user_id_param: user.id,
        });

        if (error) {
            console.error('Error searching documents:', error);
            return new Response('Error searching documents', { status: 500 });
        }

        const context = documents?.map((doc: any) => doc.content).join('\n\n') || '';

        const systemPrompt = `You are a helpful assistant. Answer the user's question based ONLY on the provided context. If the answer is not in the context, say so politely.

Context:
${context}`;

        // Use Groq for fast, free chat with streaming (default)
        if (!USE_OPENAI) {
            const chatMessages = [
                { role: 'system' as const, content: systemPrompt },
                ...messages.map((m: any) => ({
                    role: m.role as 'user' | 'assistant',
                    content: m.content
                }))
            ];

            const completion = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile', // Fast and high quality
                messages: chatMessages,
                temperature: 0.7,
                max_tokens: 1024,
                stream: true,
            });

            // Create a streaming response
            const encoder = new TextEncoder();
            const stream = new ReadableStream({
                async start(controller) {
                    try {
                        for await (const chunk of completion) {
                            const content = chunk.choices[0]?.delta?.content || '';
                            if (content) {
                                controller.enqueue(encoder.encode(content));
                            }
                        }
                        controller.close();
                    } catch (error) {
                        controller.error(error);
                    }
                }
            });

            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'Transfer-Encoding': 'chunked',
                }
            });
        }

        // Use OpenAI if configured (requires credits)
        const { openai } = await import('@ai-sdk/openai');
        const { streamText, convertToModelMessages } = await import('ai');

        const result = await streamText({
            model: openai('gpt-4o-mini'),
            system: systemPrompt,
            messages: await convertToModelMessages(messages),
        });

        return (result as any).toDataStreamResponse();

    } catch (error) {
        console.error('Chat error:', error);
        const errorMsg = error instanceof Error ? error.message : 'Chat failed';
        return new Response(`Error: ${errorMsg}`, { status: 500 });
    }
}
