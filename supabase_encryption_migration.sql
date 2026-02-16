-- Migration script to add encryption support to existing messages table
-- Run this in your Supabase SQL Editor

-- Add new columns for encryption
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS encrypted_content TEXT,
ADD COLUMN IF NOT EXISTS encryption_iv TEXT,
ADD COLUMN IF NOT EXISTS encrypted_analysis TEXT,
ADD COLUMN IF NOT EXISTS analysis_iv TEXT,
ADD COLUMN IF NOT EXISTS is_encrypted BOOLEAN DEFAULT false;

-- Update existing rows to mark them as unencrypted
UPDATE public.messages 
SET is_encrypted = false 
WHERE is_encrypted IS NULL;

-- Make content column nullable for encrypted messages
ALTER TABLE public.messages 
ALTER COLUMN content DROP NOT NULL;
