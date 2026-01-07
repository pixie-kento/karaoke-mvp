import { supabase } from './supabase'
import { Room } from '@/types'

/**
 * Generate a unique 6-character room code
 */
function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * Create a new room
 */
export async function createRoom(
  name: string,
  type: 'home' | 'business' = 'home',
  hostUserId?: string
): Promise<{ room: Room | null; error: string | null }> {
  let code = generateRoomCode()
  let attempts = 0
  const maxAttempts = 10

  // Try to generate a unique code
  while (attempts < maxAttempts) {
    const { data: existingRoom } = await supabase
      .from('rooms')
      .select('id')
      .eq('code', code)
      .single()

    if (!existingRoom) {
      break // Code is unique
    }

    code = generateRoomCode()
    attempts++
  }

  if (attempts >= maxAttempts) {
    return {
      room: null,
      error: 'Failed to generate unique room code. Please try again.',
    }
  }

  const { data, error } = await supabase
    .from('rooms')
    .insert({
      name,
      code,
      type,
      host_user_id: hostUserId || null,
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    return { room: null, error: error.message }
  }

  return { room: data as Room, error: null }
}

/**
 * Join a room by code
 */
export async function joinRoomByCode(
  code: string
): Promise<{ room: Room | null; error: string | null }> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()

  if (error) {
    return {
      room: null,
      error: error.code === 'PGRST116' ? 'Room not found' : error.message,
    }
  }

  if (!data) {
    return { room: null, error: 'Room not found or inactive' }
  }

  return { room: data as Room, error: null }
}

/**
 * Get room by code
 */
export async function getRoomByCode(
  code: string
): Promise<{ room: Room | null; error: string | null }> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()

  if (error) {
    return {
      room: null,
      error: error.code === 'PGRST116' ? 'Room not found' : error.message,
    }
  }

  return { room: data as Room, error: null }
}

/**
 * Get room by ID
 */
export async function getRoomById(
  id: string
): Promise<{ room: Room | null; error: string | null }> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    return { room: null, error: error.message }
  }

  return { room: data as Room, error: null }
}

/**
 * End a room session
 */
export async function endRoom(roomId: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('rooms')
    .update({ is_active: false })
    .eq('id', roomId)

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

