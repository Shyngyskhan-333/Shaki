-- Create the messages table for storing chat history
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    analysis JSONB,
    encrypted_content TEXT,
    encryption_iv TEXT,
    encrypted_analysis TEXT,
    analysis_iv TEXT,
    is_encrypted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for faster queries
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON public.messages(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
-- You can customize this later based on your auth requirements
CREATE POLICY "Allow all operations for now" ON public.messages
    FOR ALL
    USING (true)
    WITH CHECK (true);
