-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  host_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  type TEXT NOT NULL CHECK (type IN ('home', 'business'))
);

-- Create index on room code for fast lookups
CREATE INDEX IF NOT EXISTS idx_rooms_code ON rooms(code);
CREATE INDEX IF NOT EXISTS idx_rooms_is_active ON rooms(is_active);

-- Queue items table
CREATE TABLE IF NOT EXISTS queue_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  video_title TEXT NOT NULL,
  video_thumbnail TEXT,
  added_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  added_by_name TEXT,
  played_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  position INTEGER NOT NULL DEFAULT 0
);

-- Create indexes for queue items
CREATE INDEX IF NOT EXISTS idx_queue_items_room_id ON queue_items(room_id);
CREATE INDEX IF NOT EXISTS idx_queue_items_position ON queue_items(room_id, position);
CREATE INDEX IF NOT EXISTS idx_queue_items_played_at ON queue_items(room_id, played_at) WHERE played_at IS NULL;

-- Playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on playlists user_id
CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON playlists(user_id);

-- Playlist songs table
CREATE TABLE IF NOT EXISTS playlist_songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  video_title TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0
);

-- Create index on playlist songs
CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist_id ON playlist_songs(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_position ON playlist_songs(playlist_id, position);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
DROP POLICY IF EXISTS "Users can view all users" ON users;
CREATE POLICY "Users can view all users" ON users
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own user" ON users;
CREATE POLICY "Users can insert their own user" ON users
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own user" ON users;
CREATE POLICY "Users can update their own user" ON users
  FOR UPDATE USING (true);

-- RLS Policies for rooms
DROP POLICY IF EXISTS "Anyone can view active rooms" ON rooms;
CREATE POLICY "Anyone can view active rooms" ON rooms
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Anyone can create rooms" ON rooms;
CREATE POLICY "Anyone can create rooms" ON rooms
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Room hosts can update their rooms" ON rooms;
CREATE POLICY "Room hosts can update their rooms" ON rooms
  FOR UPDATE USING (true);

-- RLS Policies for queue_items
DROP POLICY IF EXISTS "Anyone can view queue items for active rooms" ON queue_items;
CREATE POLICY "Anyone can view queue items for active rooms" ON queue_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM rooms 
      WHERE rooms.id = queue_items.room_id 
      AND rooms.is_active = true
    )
  );

DROP POLICY IF EXISTS "Anyone can add to queue for active rooms" ON queue_items;
CREATE POLICY "Anyone can add to queue for active rooms" ON queue_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM rooms 
      WHERE rooms.id = queue_items.room_id 
      AND rooms.is_active = true
    )
  );

DROP POLICY IF EXISTS "Anyone can update queue items for active rooms" ON queue_items;
CREATE POLICY "Anyone can update queue items for active rooms" ON queue_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM rooms 
      WHERE rooms.id = queue_items.room_id 
      AND rooms.is_active = true
    )
  );

DROP POLICY IF EXISTS "Anyone can delete queue items for active rooms" ON queue_items;
CREATE POLICY "Anyone can delete queue items for active rooms" ON queue_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM rooms 
      WHERE rooms.id = queue_items.room_id 
      AND rooms.is_active = true
    )
  );

-- RLS Policies for playlists
DROP POLICY IF EXISTS "Users can view their own playlists" ON playlists;
CREATE POLICY "Users can view their own playlists" ON playlists
  FOR SELECT USING (auth.uid()::text = user_id::text OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can create their own playlists" ON playlists;
CREATE POLICY "Users can create their own playlists" ON playlists
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own playlists" ON playlists;
CREATE POLICY "Users can update their own playlists" ON playlists
  FOR UPDATE USING (auth.uid()::text = user_id::text OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can delete their own playlists" ON playlists;
CREATE POLICY "Users can delete their own playlists" ON playlists
  FOR DELETE USING (auth.uid()::text = user_id::text OR user_id IS NULL);

-- RLS Policies for playlist_songs
DROP POLICY IF EXISTS "Users can view songs in their playlists" ON playlist_songs;
CREATE POLICY "Users can view songs in their playlists" ON playlist_songs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_songs.playlist_id
      AND (auth.uid()::text = playlists.user_id::text OR playlists.user_id IS NULL)
    )
  );

DROP POLICY IF EXISTS "Users can add songs to their playlists" ON playlist_songs;
CREATE POLICY "Users can add songs to their playlists" ON playlist_songs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_songs.playlist_id
      AND (auth.uid()::text = playlists.user_id::text OR playlists.user_id IS NULL)
    )
  );

DROP POLICY IF EXISTS "Users can update songs in their playlists" ON playlist_songs;
CREATE POLICY "Users can update songs in their playlists" ON playlist_songs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_songs.playlist_id
      AND (auth.uid()::text = playlists.user_id::text OR playlists.user_id IS NULL)
    )
  );

DROP POLICY IF EXISTS "Users can delete songs from their playlists" ON playlist_songs;
CREATE POLICY "Users can delete songs from their playlists" ON playlist_songs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_songs.playlist_id
      AND (auth.uid()::text = playlists.user_id::text OR playlists.user_id IS NULL)
    )
  );

-- Enable real-time for queue_items
-- Note: This may fail if already added, but that's okay
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'queue_items'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE queue_items;
  END IF;
END $$;

