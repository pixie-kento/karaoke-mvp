import { YouTubeVideo } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Plus } from 'lucide-react'

interface SearchResultsProps {
  results: YouTubeVideo[]
  isLoading: boolean
  onAddToQueue: (video: YouTubeVideo) => void
  isAdding?: boolean
}

export function SearchResults({ results, isLoading, onAddToQueue, isAdding }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No karaoke videos found. Try a different search term.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((video) => (
        <Card key={video.id} className="overflow-hidden">
          <div className="relative aspect-video">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-2 line-clamp-2">
              {video.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              {video.channelName}
            </p>
            <Button
              size="sm"
              className="w-full"
              onClick={() => onAddToQueue(video)}
              disabled={isAdding}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Queue
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

