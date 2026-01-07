import { QueueItem as QueueItemType } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface QueueItemProps {
  item: QueueItemType
  position: number
  isHost: boolean
  onRemove?: (itemId: string) => void
}

export function QueueItem({ item, position, isHost, onRemove }: QueueItemProps) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
          {position}
        </div>
        <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden">
          <img
            src={item.video_thumbnail}
            alt={item.video_title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">{item.video_title}</h4>
          {item.added_by_name && (
            <p className="text-xs text-muted-foreground">
              Added by {item.added_by_name}
            </p>
          )}
        </div>
        {isHost && onRemove && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            className="flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

