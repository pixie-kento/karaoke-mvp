import { supabase } from './supabase'
import { Playlist, PlaylistSong } from '@/types'

/**
 * Get user's playlists
 */
export async function getUserPlaylists(
  userId: string
): Promise<{ playlists: Playlist[]; error: string | null }> {
  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    return { playlists: [], error: error.message }
  }

  return { playlists: (data || []) as Playlist[], error: null }
}

/**
 * Create a new playlist
 */
export async function createPlaylist(
  userId: string,
  name: string,
  description?: string,
  isPublic: boolean = false
): Promise<{ playlist: Playlist | null; error: string | null }> {
  const { data, error } = await supabase
    .from('playlists')
    .insert({
      user_id: userId,
      name,
      description: description || null,
      is_public: isPublic,
    })
    .select()
    .single()

  if (error) {
    return { playlist: null, error: error.message }
  }

  return { playlist: data as Playlist, error: null }
}

/**
 * Update a playlist
 */
export async function updatePlaylist(
  playlistId: string,
  updates: {
    name?: string
    description?: string
    isPublic?: boolean
  }
): Promise<{ error: string | null }> {
  const updateData: any = {}
  if (updates.name !== undefined) updateData.name = updates.name
  if (updates.description !== undefined) updateData.description = updates.description
  if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic

  const { error } = await supabase
    .from('playlists')
    .update(updateData)
    .eq('id', playlistId)

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Delete a playlist
 */
export async function deletePlaylist(
  playlistId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('playlists')
    .delete()
    .eq('id', playlistId)

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Get playlist songs
 */
export async function getPlaylistSongs(
  playlistId: string
): Promise<{ songs: PlaylistSong[]; error: string | null }> {
  const { data, error } = await supabase
    .from('playlist_songs')
    .select('*')
    .eq('playlist_id', playlistId)
    .order('position', { ascending: true })

  if (error) {
    return { songs: [], error: error.message }
  }

  return { songs: (data || []) as PlaylistSong[], error: null }
}

/**
 * Add song to playlist
 */
export async function addSongToPlaylist(
  playlistId: string,
  videoId: string,
  videoTitle: string,
  videoThumbnail: string
): Promise<{ song: PlaylistSong | null; error: string | null }> {
  // Get current max position
  const { data: maxPositionData } = await supabase
    .from('playlist_songs')
    .select('position')
    .eq('playlist_id', playlistId)
    .order('position', { ascending: false })
    .limit(1)
    .single()

  const nextPosition = maxPositionData?.position != null
    ? (maxPositionData.position + 1)
    : 0

  const { data, error } = await supabase
    .from('playlist_songs')
    .insert({
      playlist_id: playlistId,
      video_id: videoId,
      video_title: videoTitle,
      video_thumbnail: videoThumbnail,
      position: nextPosition,
    })
    .select()
    .single()

  if (error) {
    return { song: null, error: error.message }
  }

  return { song: data as PlaylistSong, error: null }
}

/**
 * Remove song from playlist
 */
export async function removeSongFromPlaylist(
  songId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('playlist_songs')
    .delete()
    .eq('id', songId)

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Add entire playlist to queue
 */
export async function addPlaylistToQueue(
  roomId: string,
  playlistId: string,
  addedByName?: string,
  addedByUserId?: string
): Promise<{ error: string | null }> {
  // Get all songs from playlist
  const { songs, error: songsError } = await getPlaylistSongs(playlistId)

  if (songsError || songs.length === 0) {
    return { error: songsError || 'Playlist is empty' }
  }

  // Get current max position in queue
  const { data: maxPositionData } = await supabase
    .from('queue_items')
    .select('position')
    .eq('room_id', roomId)
    .order('position', { ascending: false })
    .limit(1)
    .single()

  let nextPosition = maxPositionData?.position != null
    ? (maxPositionData.position + 1)
    : 0

  // Insert all songs
  const queueItems = songs.map((song) => ({
    room_id: roomId,
    video_id: song.video_id,
    video_title: song.video_title,
    video_thumbnail: song.video_thumbnail,
    added_by_name: addedByName || null,
    added_by_user_id: addedByUserId || null,
    position: nextPosition++,
  }))

  const { error } = await supabase
    .from('queue_items')
    .insert(queueItems)

  if (error) {
    return { error: error.message }
  }

  // Note: play_count increment would require a database function or manual query
  // For now, we'll skip this as it's not critical for MVP

  return { error: null }
}

