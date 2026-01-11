# 🚀 Setup Instructions for Free RAG Application

## Step 1: Get a FREE Hugging Face API Token

1. Go to [Hugging Face](https://huggingface.co/)
2. Sign up for a free account (if you don't have one)
3. Navigate to **Settings → Access Tokens**: https://huggingface.co/settings/tokens
4. Click **"New token"**
5. Give it a name (e.g., "RAG App")
6. Select **"Read"** permission (free tier)
7. Click **"Generate"**
8. **Copy the token** (starts with `hf_...`)

## Step 2: Update Environment Variables

1. Open `.env.local` in your project root
2. Replace `your_huggingface_token_here` with your actual token:
   ```
   HUGGINGFACE_API_KEY=hf_your_token_here
   ```
3. Save the file

## Step 3: Update Supabase Database Schema

Since we changed from 1536 dimensions (OpenAI) to 384 dimensions (Hugging Face), you need to:

### Option A: Drop and Recreate (if no important data)
1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Run this command to drop the old table:
   ```sql
   DROP TABLE IF EXISTS documents CASCADE;
   DROP FUNCTION IF EXISTS match_documents;
   ```
4. Then run the updated init.sql script from `supabase/migrations/init.sql`

### Option B: Alter Existing Table (if you have data)
1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Run:
   ```sql
   -- Backup existing data
   CREATE TABLE documents_backup AS SELECT * FROM documents;
   
   -- Drop and recreate with new dimensions
   DROP TABLE documents CASCADE;
   CREATE TABLE documents (
     id bigserial primary key,
     content text,
     metadata jsonb,
     embedding vector(384)
   );
   
   -- Recreate the function
   -- (copy from supabase/migrations/init.sql)
   ```

## Step 4: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

## Step 5: Test Upload

1. Go to `http://localhost:3000`
2. Upload a PDF file
3. It should now work with FREE Hugging Face embeddings!

## 📊 Embedding Provider Comparison

| Provider | Free Tier | Dimensions | Quality | Speed |
|----------|-----------|------------|---------|-------|
| **Hugging Face** | ✅ Generous | 384 | Good | Fast |
| **OpenAI** | ❌ Paid only | 1536 | Excellent | Very Fast |
| **Mock** | ✅ Unlimited | 384 | Poor | Instant |

## 🔄 Switching Providers Later

To switch embedding providers, just change in `.env.local`:

```bash
# Use Hugging Face (free)
EMBEDDING_PROVIDER=huggingface

# Use OpenAI (requires credits)
EMBEDDING_PROVIDER=openai

# Use Mock (testing UI only, no real AI)
EMBEDDING_PROVIDER=mock
```

**Important:** If you switch providers, you'll need to re-upload all documents since embeddings are incompatible between providers.
