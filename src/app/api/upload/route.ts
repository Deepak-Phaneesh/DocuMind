import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { parsePDF, chunkText } from '@/lib/pdf-loader';
import { storeDocuments } from '@/lib/vector-store';

// Force dynamic rendering - don't try to pre-render at build time
export const dynamic = 'force-dynamic';

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
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const text = await parsePDF(buffer);
        const chunks = chunkText(text);

        const fileId = crypto.randomUUID();
        const fileName = file.name;

        await storeDocuments(fileId, chunks, fileName, user.id);

        return NextResponse.json({
            message: 'File uploaded and processed',
            fileId,
            fileName
        }, { status: 200 });
    } catch (error) {
        console.error('Upload error:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        });

        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({
            error: 'Upload failed',
            details: errorMessage
        }, { status: 500 });
    }
}
