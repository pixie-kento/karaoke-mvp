import { QueueItem } from '@/types'
import { QueueItem as QueueItemComponent } from './QueueItem'
import { Loader2 } from 'lucide-react'

interface QueueListProps {
  items: QueueItem[]
  isLoading: boolean
  isHost: boolean
  onRemove?: (itemId: string) => void
}

export function QueueList({ items, isLoading, isHost, onRemove }: QueueListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Queue is empty. Add some songs to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <QueueItemComponent
          key={item.id}
          item={item}
          position={index + 1}
          isHost={isHost}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

