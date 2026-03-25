# 📄 PDF Analyser - RAG Application

A powerful **Retrieval-Augmented Generation (RAG)** application that allows you to upload PDF documents and chat with them using AI. Built with Next.js and powered by free AI services including Hugging Face embeddings and Groq API.

## ✨ Features

- 📤 **PDF Upload**: Upload and process PDF documents
- 🤖 **AI-Powered Chat**: Ask questions about your uploaded documents using natural language
- 🔍 **Semantic Search**: Find relevant information using advanced embedding-based search
- 💬 **Streaming Responses**: Get real-time, streaming AI responses for better UX
- 💰 **100% Free**: Uses free tier services (Hugging Face, Groq API, Supabase)
- 🎨 **Modern UI**: Beautiful, responsive interface with animations

## 🏗 Architecture

Frontend (Next.js)
↓
API Layer
↓
Embedding + Vector DB
↓
Retriever
↓
LLM (Answer generation)

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **AI & Embeddings**:
  - Hugging Face (384-dimension embeddings)
  - Groq SDK (streaming chat responses)
- **Database**: Supabase (vector storage with pgvector)
- **PDF Processing**: pdf-parse
- **UI Components**: Radix UI, Lucide React icons

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (v20.0.0 or higher)
- npm or yarn package manager
- A [Hugging Face](https://huggingface.co/) account (free)
- A [Supabase](https://supabase.com/) account (free)
- A [Groq](https://groq.com/) account (free)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd PDF-analyser
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Services
HUGGINGFACE_API_KEY=hf_your_token_here
GROQ_API_KEY=your_groq_api_key

# Embedding Provider (huggingface, openai, or mock)
EMBEDDING_PROVIDER=huggingface

# Chat Provider (groq or openai)
CHAT_PROVIDER=groq
```

### 4. Set Up Supabase Database

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Run the migration script from `supabase/migrations/init.sql`

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📖 Detailed Setup

For detailed setup instructions including how to get API keys and configure the database, see [SETUP_FREE.md](./SETUP_FREE.md).

## 🎯 Usage

1. **Upload a PDF**: Click the upload button and select a PDF file from your computer
2. **Wait for Processing**: The application will extract text and generate embeddings
3. **Ask Questions**: Type your question in the chat interface
4. **Get Answers**: Receive AI-generated responses based on your document's content

## 🏗️ Project Structure

```
PDF-analyser/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── chat/         # Chat endpoint with streaming
│   │   │   ├── check-auth-setup/
│   │   │   └── check-schema/
│   │   ├── page.tsx          # Main page
│   │   └── layout.tsx        # Root layout
│   ├── components/           # React components
│   └── lib/                  # Utility functions
├── supabase/
│   └── migrations/           # Database migrations
├── public/                   # Static assets
├── .env.local               # Environment variables (not in git)
├── next.config.mjs          # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── package.json             # Dependencies
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔄 Switching Providers

The application supports multiple providers for embeddings and chat:

### Embedding Providers

- `huggingface` - Free, 384 dimensions
- `openai` - Paid, 1536 dimensions
- `mock` - Testing only

### Chat Providers

- `groq` - Free, streaming responses
- `openai` - Paid

Update `EMBEDDING_PROVIDER` and `CHAT_PROVIDER` in `.env.local` to switch providers.

**⚠️ Important**: If you switch embedding providers, you'll need to re-upload all documents since embeddings are incompatible between providers.

## 📊 Features Comparison

| Feature             | Status                 |
| ------------------- | ---------------------- |
| PDF Upload          | ✅ Working             |
| Text Extraction     | ✅ Working             |
| Vector Embeddings   | ✅ Hugging Face (Free) |
| Semantic Search     | ✅ Supabase pgvector   |
| AI Chat             | ✅ Groq SDK (Free)     |
| Streaming Responses | ✅ Real-time           |
| File Management     | ✅ Display filename    |

## 🐛 Troubleshooting

### PDF Upload Fails

- Check that your Hugging Face API key is valid
- Ensure the Supabase database schema is correctly set up (384 dimensions)
- Verify that the `documents` table exists in Supabase

### Chat Not Working

- Verify your Groq API key is set in `.env.local`
- Check the browser console for error messages
- Ensure you've uploaded a PDF first

### Database Schema Mismatch

- Run the migration script in `supabase/migrations/init.sql`
- Make sure the vector dimension is set to 384 for Hugging Face

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

ISC

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for free embeddings
- [Groq](https://groq.com/) for free streaming chat API
- [Supabase](https://supabase.com/) for vector database hosting
- [Vercel](https://vercel.com/) for Next.js framework

## 📧 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and AI
