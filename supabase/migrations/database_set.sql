-- Create the posts table
CREATE TABLE public.posts (
    id uuid not null default gen_random_uuid(),
    user_id uuid null,
    body text null,
    created_at timestamp with time zone null default now(),
    constraint posts_pkey primary key (id),
    constraint posts_body_check check ((char_length(body) <= 280))
) TABLESPACE pg_default;

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows everyone to select posts
CREATE POLICY "Allow public read access" ON posts
    FOR SELECT USING (true);

-- Create a policy that allows everyone to insert posts
CREATE POLICY "Allow public insert access" ON posts
    FOR INSERT WITH CHECK (true);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE posts; 