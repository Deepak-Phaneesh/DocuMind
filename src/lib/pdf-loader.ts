// import pdf from 'pdf-parse'; // removed

export async function parsePDF(buffer: Buffer): Promise<string> {
    const pdf = require('pdf-parse');
    const data = await pdf(buffer);
    return data.text;
}

export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
        const end = start + chunkSize;
        let chunk = text.slice(start, end);

        // If we're not at the end of the text, try to find the last period or newline to break at
        if (end < text.length) {
            const lastPeriod = chunk.lastIndexOf('.');
            const lastNewline = chunk.lastIndexOf('\n');
            const breakPoint = Math.max(lastPeriod, lastNewline);

            if (breakPoint > -1) {
                chunk = chunk.slice(0, breakPoint + 1);
                start += breakPoint + 1 - overlap; // Move start back by overlap amount, relative to the break point
            } else {
                start += chunkSize - overlap;
            }
        } else {
            start += chunkSize; // End of loop
        }

        // clean up whitespace
        const cleanChunk = chunk.replace(/\s+/g, ' ').trim();
        if (cleanChunk.length > 0) {
            chunks.push(cleanChunk);
        }
    }

    return chunks;
}
