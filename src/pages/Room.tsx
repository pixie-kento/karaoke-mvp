import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { RoomCode } from '@/components/room/RoomCode'
import { RoomQRCode } from '@/components/room/RoomQRCode'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { QueueList } from '@/components/queue/QueueList'
import { AppLayout } from '@/components/layout/AppLayout'
import { useRoomStore } from '@/stores/roomStore'
import { getRoomByCode } from '@/lib/room'
import { useQueue } from '@/hooks/useQueue'
import { searchYouTubeKaraoke } from '@/lib/youtube'
import { addToQueue, removeFromQueue } from '@/lib/queue'
import { toast } from 'sonner'
import { Loader2, Tv, Smartphone, QrCode } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { YouTubeVideo } from '@/types'

function Room() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { currentRoom, setCurrentRoom, isHost } = useRoomStore()
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)

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
  }, [code, navigate, toast, currentRoom, setCurrentRoom])

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
      undefined // TODO: Get from auth
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
    if (!isHost) return

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
    <AppLayout>
      <div className="min-h-screen p-4 bg-background">
        <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <RoomCode />
          </div>
          <div className="flex gap-2">
            <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  QR Code
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Join Room</DialogTitle>
                  <DialogDescription>
                    Scan the QR code or share the room code with others
                  </DialogDescription>
                </DialogHeader>
                <RoomQRCode />
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              onClick={() => window.open(`/tv/${currentRoom.code}`, '_blank')}
              className="flex items-center gap-2"
            >
              <Tv className="h-4 w-4" />
              TV Mode
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(`/controller/${currentRoom.code}`, '_blank')}
              className="flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4" />
              Controller
            </Button>
          </div>
        </div>

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
    </AppLayout>
  )
}

export default Room

