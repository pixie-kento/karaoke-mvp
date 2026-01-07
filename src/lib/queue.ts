import { supabase } from './supabase'
import { QueueItem } from '@/types'

/**
 * Add a song to the queue
 */
export async function addToQueue(
  roomId: string,
  videoId: string,
  videoTitle: string,
  videoThumbnail: string,
  addedByName?: string,
  addedByUserId?: string
): Promise<{ item: QueueItem | null; error: string | null }> {
  // Get the current max position for this room
  const { data: maxPositionData } = await supabase
    .from('queue_items')
    .select('position')
    .eq('room_id', roomId)
    .order('position', { ascending: false })
    .limit(1)
    .single()

  const nextPosition = maxPositionData?.position != null 
    ? (maxPositionData.position + 1) 
    : 0

  const { data, error } = await supabase
    .from('queue_items')
    .insert({
      room_id: roomId,
      video_id: videoId,
      video_title: videoTitle,
      video_thumbnail: videoThumbnail,
      added_by_name: addedByName || null,
      added_by_user_id: addedByUserId || null,
      position: nextPosition,
    })
    .select()
    .single()

  if (error) {
    return { item: null, error: error.message }
  }

  return { item: data as QueueItem, error: null }
}

/**
 * Get queue items for a room
 */
export async function getQueueItems(
  roomId: string
): Promise<{ items: QueueItem[]; error: string | null }> {
  const { data, error } = await supabase
    .from('queue_items')
    .select('*')
    .eq('room_id', roomId)
    .is('played_at', null)
    .order('position', { ascending: true })

  if (error) {
    return { items: [], error: error.message }
  }

  return { items: (data || []) as QueueItem[], error: null }
}

/**
 * Remove a song from the queue
 */
export async function removeFromQueue(
  itemId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('queue_items')
    .delete()
    .eq('id', itemId)

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Mark a song as played
 */
export async function markAsPlayed(
  itemId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('queue_items')
    .update({ played_at: new Date().toISOString() })
    .eq('id', itemId)

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Reorder queue items
 */
export async function reorderQueue(
  roomId: string,
  updates: { id: string; position: number }[]
): Promise<{ error: string | null }> {
  // Update positions in a transaction-like manner
  const promises = updates.map(({ id, position }) =>
    supabase
      .from('queue_items')
      .update({ position })
      .eq('id', id)
  )

  const results = await Promise.all(promises)
  const hasError = results.some((result) => result.error)

  if (hasError) {
    return { error: 'Failed to reorder queue' }
  }

  return { error: null }
}

