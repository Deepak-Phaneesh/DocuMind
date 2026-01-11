-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store your documents
-- IMPORTANT: Using 384 dimensions for Hugging Face sentence-transformers/all-MiniLM-L6-v2
-- If switching to OpenAI, change to vector(1536)
create table if not exists documents (
  id bigserial primary key,
  content text,
  metadata jsonb,
  embedding vector(384),
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Create index on user_id for faster queries
create index if not exists documents_user_id_idx on documents(user_id);

-- Enable Row Level Security
alter table documents enable row level security;

-- Create policy: Users can only see their own documents
create policy "Users can view own documents"
  on documents for select
  using (auth.uid() = user_id);

-- Create policy: Users can insert their own documents
create policy "Users can insert own documents"
  on documents for insert
  with check (auth.uid() = user_id);

-- Create policy: Users can delete their own documents
create policy "Users can delete own documents"
  on documents for delete
  using (auth.uid() = user_id);

-- Create a function to search for user's documents only
create or replace function match_documents (
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  user_id_param uuid
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 
    documents.user_id = user_id_param
    and 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
