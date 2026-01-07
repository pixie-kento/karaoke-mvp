export interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  channelName: string
  publishedAt?: string
}

export interface Room {
  id: string
  name: string
  code: string
  host_user_id: string | null
  created_at: string
  is_active: boolean
  type: 'home' | 'business'
}

export interface QueueItem {
  id: string
  room_id: string
  video_id: string
  video_title: string
  video_thumbnail: string
  added_by_user_id: string | null
  added_by_name: string | null
  played_at: string | null
  created_at: string
  position: number
}

export interface User {
  id: string
  email: string | null
  display_name: string | null
  created_at: string
}

export interface Playlist {
  id: string
  user_id: string
  name: string
  description?: string | null
  is_public?: boolean
  play_count?: number
  created_at: string
  updated_at?: string
}

export interface PlaylistSong {
  id: string
  playlist_id: string
  video_id: string
  video_title: string
  video_thumbnail?: string
  position: number
  created_at?: string
}

