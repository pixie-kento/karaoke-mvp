import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { QueueList } from '@/components/queue/QueueList'
import { AppLayout } from '@/components/layout/AppLayout'
import { useRoomStore } from '@/stores/roomStore'
import { getRoomByCode } from '@/lib/room'
import { useQueue } from '@/hooks/useQueue'
import { searchYouTubeKaraoke } from '@/lib/youtube'
import { addToQueue, removeFromQueue } from '@/lib/queue'
import { Loader2, Play, Pause, SkipForward } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { YouTubeVideo } from '@/types'

function Controller() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { currentRoom, setCurrentRoom, isHost } = useRoomStore()
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const { queueItems, isLoading: queueLoading } = useQueue(currentRoom?.id || null)
  const currentSong = queueItems[0] || null
  const mySongs = queueItems.filter(
    (item) => item.added_by_name === 'Guest' // TODO: Replace with actual user name
  )

  useEffect(() => {
    const loadRoom = async () => {
      if (!code) {
        navigate('/')
        return
      }

      if (currentRoom && currentRoom.code === code.toUpperCase()) {
        return
      }

      setIsLoading(true)
      const { room, error } = await getRoomByCode(code)

      if (error || !room) {
        navigate('/')
        toast.error('Room not found', {
          description: error || 'Please create or join a room from the home page',
        })
        setIsLoading(false)
        return
      }

      setCurrentRoom(room)
      setIsLoading(false)
    }

    loadRoom()
  }, [code, navigate, currentRoom, setCurrentRoom])

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    const { items, error } = await searchYouTubeKaraoke({ query, maxResults: 12 })

    if (error) {
      toast.error('Search failed', {
        description: error,
      })
      setSearchResults([])
    } else {
      setSearchResults(items)
    }

    setIsSearching(false)
  }

  const handleAddToQueue = async (video: YouTubeVideo) => {
    if (!currentRoom) return

    setIsAdding(true)
    const { item, error } = await addToQueue(
      currentRoom.id,
      video.id,
      video.title,
      video.thumbnail,
      'Guest', // TODO: Get from auth
      undefined
    )

    if (error || !item) {
      toast.error('Failed to add song', {
        description: error || 'Unknown error occurred',
      })
    } else {
      toast.success('Song added!', {
        description: `${video.title} added to queue`,
      })
    }

    setIsAdding(false)
  }

  const handleRemoveFromQueue = async (itemId: string) => {
    const { error } = await removeFromQueue(itemId)

    if (error) {
      toast.error('Failed to remove song', {
        description: error,
      })
    } else {
      toast.success('Song removed')
    }
  }

  if (isLoading || !currentRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <AppLayout showHeader={false} showFooter={false}>
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-xl font-bold">{currentRoom.name}</h1>
                <p className="text-sm text-muted-foreground">Room: {currentRoom.code}</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="now-playing" className="w-full">
          <TabsList className="grid w-full grid-cols-4 sticky top-[73px] z-10 bg-background/95 backdrop-blur">
            <TabsTrigger value="now-playing" className="text-xs">
              Now
            </TabsTrigger>
            <TabsTrigger value="search" className="text-xs">
              Search
            </TabsTrigger>
            <TabsTrigger value="queue" className="text-xs">
              Queue
            </TabsTrigger>
            <TabsTrigger value="my-songs" className="text-xs">
              My Songs
            </TabsTrigger>
          </TabsList>

          {/* Now Playing Tab */}
          <TabsContent value="now-playing" className="p-4 space-y-4">
            {currentSong ? (
              <>
                <Card>
                  <div className="relative aspect-video">
                    <img
                      src={currentSong.video_thumbnail}
                      alt={currentSong.video_title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h2 className="text-xl font-bold mb-2 line-clamp-2">
                      {currentSong.video_title}
                    </h2>
                    {currentSong.added_by_name && (
                      <p className="text-sm text-muted-foreground mb-4">
                        Added by {currentSong.added_by_name}
                      </p>
                    )}

                    {isHost && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Play className="h-4 w-4 mr-2" />
                          Play
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <SkipForward className="h-4 w-4 mr-2" />
                          Skip
                        </Button>
                      </div>
                    )}

                    {!isHost && (
                      <div className="text-center text-muted-foreground text-sm">
                        Host controls are available on the TV screen
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Next up */}
                {queueItems.length > 1 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                      Up Next
                    </h3>
                    <Card>
                      <CardContent className="p-3 flex items-center gap-3">
                        <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={queueItems[1].video_thumbnail}
                            alt={queueItems[1].video_title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {queueItems[1].video_title}
                          </p>
                          {queueItems[1].added_by_name && (
                            <p className="text-xs text-muted-foreground">
                              {queueItems[1].added_by_name}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No song playing</p>
                <p className="text-sm mt-2">Add songs to the queue to get started</p>
              </div>
            )}
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="p-4 space-y-4">
            <SearchBar onSearch={handleSearch} />
            <SearchResults
              results={searchResults}
              isLoading={isSearching}
              onAddToQueue={handleAddToQueue}
              isAdding={isAdding}
            />
          </TabsContent>

          {/* Queue Tab */}
          <TabsContent value="queue" className="p-4">
            <QueueList
              items={queueItems}
              isLoading={queueLoading}
              isHost={isHost}
              onRemove={handleRemoveFromQueue}
            />
          </TabsContent>

          {/* My Songs Tab */}
          <TabsContent value="my-songs" className="p-4">
            {mySongs.length > 0 ? (
              <QueueList
                items={mySongs}
                isLoading={false}
                isHost={isHost}
                onRemove={handleRemoveFromQueue}
              />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>You haven't added any songs yet</p>
                <p className="text-sm mt-2">Search and add songs to see them here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}

export default Controller

