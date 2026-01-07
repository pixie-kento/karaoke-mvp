import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { QueueItem } from '@/types'
import { getQueueItems } from '@/lib/queue'

export function useQueue(roomId: string | null) {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!roomId) {
      setQueueItems([])
      setIsLoading(false)
      return
    }

    // Initial load
    const loadQueue = async () => {
      setIsLoading(true)
      const { items, error: queueError } = await getQueueItems(roomId)
      
      if (queueError) {
        setError(queueError)
        setIsLoading(false)
        return
      }

      setQueueItems(items)
      setIsLoading(false)
    }

    loadQueue()

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`queue:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queue_items',
          filter: `room_id=eq.${roomId}`,
        },
        async () => {
          // Reload queue on any change
          const { items } = await getQueueItems(roomId)
          setQueueItems(items)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  return { queueItems, isLoading, error }
}

