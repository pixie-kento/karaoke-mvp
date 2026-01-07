import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { usePlaylistSongs } from '@/hooks/usePlaylists'
import { useRoomStore } from '@/stores/roomStore'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trash2, Music2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { searchYouTubeKaraoke } from '@/lib/youtube'
import { YouTubeVideo } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'

function PlaylistDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { currentRoom } = useRoomStore()
  const {
    songs,
    isLoading,
    addSong,
    removeSong,
    addToQueue,
    isAddingSong,
    isRemovingSong,
    isAddingToQueue,
  } = usePlaylistSongs(id || null)

  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    const { items, error } = await searchYouTubeKaraoke({ query, maxResults: 12 })

    if (error) {
      toast.error('Search failed', { description: error })
      setSearchResults([])
    } else {
      setSearchResults(items)
    }

    setIsSearching(false)
  }

  const handleAddSong = async (video: YouTubeVideo) => {
    if (!id) return

    try {
      await addSong({
        videoId: video.id,
        videoTitle: video.title,
        videoThumbnail: video.thumbnail,
      })
      toast.success('Song added to playlist!')
    } catch (error: any) {
      toast.error('Failed to add song', { description: error.message })
    }
  }

  const handleRemoveSong = async (songId: string) => {
    try {
      await removeSong(songId)
      toast.success('Song removed from playlist')
    } catch (error: any) {
      toast.error('Failed to remove song', { description: error.message })
    }
  }

  const handleAddToQueue = async () => {
    if (!currentRoom || !id) {
      toast.error('Please join a room first')
      return
    }

    try {
      await addToQueue({
        roomId: currentRoom.id,
        addedByName: user?.email || 'Guest',
        addedByUserId: user?.id,
      })
      toast.success('Playlist added to queue!')
    } catch (error: any) {
      toast.error('Failed to add playlist to queue', { description: error.message })
    }
  }

  return (
    <AppLayout>
      <div className="container py-10">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/playlists')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Playlists
          </Button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Playlist</h1>
            <p className="text-muted-foreground">
              {songs.length} {songs.length === 1 ? 'song' : 'songs'}
            </p>
          </div>
          {currentRoom && (
            <Button onClick={handleAddToQueue} disabled={isAddingToQueue || songs.length === 0}>
              <Music2 className="mr-2 h-4 w-4" />
              {isAddingToQueue ? 'Adding...' : 'Add All to Queue'}
            </Button>
          )}
        </div>

        <Tabs defaultValue="songs" className="w-full">
          <TabsList>
            <TabsTrigger value="songs">Songs ({songs.length})</TabsTrigger>
            <TabsTrigger value="add">Add Songs</TabsTrigger>
          </TabsList>

          <TabsContent value="songs" className="space-y-4">
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : songs.length === 0 ? (
              <div className="text-center py-12">
                <Music2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No songs yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add songs to your playlist using the "Add Songs" tab
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {songs.map((song: any, index: number) => (
                  <Card key={song.id}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden">
                        <img
                          src={song.video_thumbnail}
                          alt={song.video_title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{song.video_title}</p>
                        <p className="text-sm text-muted-foreground">#{index + 1}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSong(song.id)}
                        disabled={isRemovingSong}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <SearchBar onSearch={handleSearch} />
            <SearchResults
              results={searchResults}
              isLoading={isSearching}
              onAddToQueue={handleAddSong}
              isAdding={isAddingSong}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}

export default PlaylistDetail

