import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { RoomCode } from '@/components/room/RoomCode'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { QueueList } from '@/components/queue/QueueList'
import { useRoomStore } from '@/stores/roomStore'
import { getRoomByCode } from '@/lib/room'
import { useQueue } from '@/hooks/useQueue'
import { searchYouTubeKaraoke } from '@/lib/youtube'
import { addToQueue, removeFromQueue } from '@/lib/queue'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { YouTubeVideo } from '@/types'

function Room() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { currentRoom, setCurrentRoom, isHost } = useRoomStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const { queueItems, isLoading: queueLoading } = useQueue(currentRoom?.id || null)

  useEffect(() => {
    const loadRoom = async () => {
      if (!code) {
        navigate('/')
        return
      }

      // If we already have the room and it matches, don't reload
      if (currentRoom && currentRoom.code === code.toUpperCase()) {
        return
      }

      // Load room by code
      setIsLoading(true)
      const { room, error } = await getRoomByCode(code)

      if (error || !room) {
        navigate('/')
        toast({
          title: 'Room not found',
          description: error || 'Please create or join a room from the home page',
          variant: 'destructive',
        })
        setIsLoading(false)
        return
      }

      setCurrentRoom(room)
      setIsLoading(false)
    }

    loadRoom()
  }, [code, navigate, toast, currentRoom, setCurrentRoom])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    const { items, error } = await searchYouTubeKaraoke({ query, maxResults: 12 })

    if (error) {
      toast({
        title: 'Search failed',
        description: error,
        variant: 'destructive',
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
      undefined // TODO: Get from auth
    )

    if (error || !item) {
      toast({
        title: 'Failed to add song',
        description: error || 'Unknown error occurred',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Song added!',
        description: `${video.title} added to queue`,
      })
    }

    setIsAdding(false)
  }

  const handleRemoveFromQueue = async (itemId: string) => {
    if (!isHost) return

    const { error } = await removeFromQueue(itemId)

    if (error) {
      toast({
        title: 'Failed to remove song',
        description: error,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Song removed',
      })
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
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-6xl mx-auto space-y-6">
        <RoomCode />

        <Tabs defaultValue="search" className="w-full">
          <TabsList>
            <TabsTrigger value="search">Search Songs</TabsTrigger>
            <TabsTrigger value="queue">
              Queue ({queueItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            <SearchBar onSearch={handleSearch} />
            <SearchResults
              results={searchResults}
              isLoading={isSearching}
              onAddToQueue={handleAddToQueue}
              isAdding={isAdding}
            />
          </TabsContent>

          <TabsContent value="queue">
            <QueueList
              items={queueItems}
              isLoading={queueLoading}
              isHost={isHost}
              onRemove={handleRemoveFromQueue}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Room

