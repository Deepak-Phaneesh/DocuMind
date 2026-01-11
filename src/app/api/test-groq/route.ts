import Groq from 'groq-sdk';

export async function GET() {
    try {
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return Response.json({
                success: false,
                error: 'GROQ_API_KEY not set in environment variables',
                instruction: 'Add your Groq API key to .env.local'
            }, { status: 500 });
        }

        if (apiKey === 'your_groq_api_key_here') {
            return Response.json({
                success: false,
                error: 'GROQ_API_KEY is still set to placeholder value',
                instruction: 'Replace "your_groq_api_key_here" with your actual Groq API key from https://console.groq.com/keys'
            }, { status: 500 });
        }

        const groq = new Groq({ apiKey });

        // Test a simple completion
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: 'Say "Groq API is working!" in one sentence.' }],
            max_tokens: 50,
        });

        return Response.json({
            success: true,
            message: 'Groq API is configured correctly',
            testResponse: completion.choices[0]?.message?.content,
            model: completion.model
        });

    } catch (error) {
        console.error('Groq test error:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
