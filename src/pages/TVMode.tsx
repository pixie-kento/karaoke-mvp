import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { VideoPlayer } from '@/components/player/VideoPlayer'
import { useRoomStore } from '@/stores/roomStore'
import { getRoomByCode } from '@/lib/room'
import { useQueue } from '@/hooks/useQueue'
import { markAsPlayed } from '@/lib/queue'
import { Loader2 } from 'lucide-react'
import QRCodeSVG from 'react-qr-code'

function TVMode() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { currentRoom, setCurrentRoom, isHost } = useRoomStore()
  const [isLoading, setIsLoading] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)

  const { queueItems } = useQueue(currentRoom?.id || null)
  const currentSong = queueItems[currentSongIndex] || null
  const nextSong = queueItems[currentSongIndex + 1] || null
  const [volume, setVolume] = useState(100)
  const [keyAdjustment, setKeyAdjustment] = useState(0)
  const [vocalRemoval, setVocalRemoval] = useState(false)

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
        setIsLoading(false)
        return
      }

      setCurrentRoom(room)
      setIsLoading(false)
    }

    loadRoom()
  }, [code, navigate, currentRoom, setCurrentRoom])

  const handleSongEnd = async () => {
    if (currentSong) {
      await markAsPlayed(currentSong.id)
    }

    if (currentSongIndex < queueItems.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1)
    } else {
      // Queue finished
      setCurrentSongIndex(0)
    }
  }

  if (isLoading || !currentRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const roomUrl = `${window.location.origin}/room/${currentRoom.code}`

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Top bar with room code and QR */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded">
          <p className="text-sm text-muted-foreground">Room Code</p>
          <p className="text-2xl font-mono font-bold">{currentRoom.code}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-2 rounded">
          <QRCodeSVG value={roomUrl} size={80} />
        </div>
      </div>

      {/* Main player area */}
      <div className="flex-1 relative">
        <VideoPlayer
          currentSong={currentSong}
          onSongEnd={handleSongEnd}
          isHost={isHost}
          volume={volume}
          onVolumeChange={setVolume}
          keyAdjustment={keyAdjustment}
          onKeyChange={setKeyAdjustment}
          vocalRemoval={vocalRemoval}
          onVocalRemovalToggle={setVocalRemoval}
        />
      </div>

      {/* Bottom info bar */}
      <div className="bg-gradient-to-t from-black to-transparent p-8">
        <div className="max-w-7xl mx-auto">
          {/* Current song */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Now Playing</p>
            <h1 className="text-4xl font-bold line-clamp-2">
              {currentSong?.video_title || 'No song playing'}
            </h1>
          </div>

          {/* Up next */}
          {nextSong && (
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 rounded overflow-hidden flex-shrink-0">
                <img
                  src={nextSong.video_thumbnail}
                  alt={nextSong.video_title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">Up Next</p>
                <p className="text-xl font-semibold truncate">{nextSong.video_title}</p>
              </div>
            </div>
          )}

          {/* Queue count */}
          <div className="mt-4 text-sm text-muted-foreground">
            {queueItems.length - currentSongIndex - 1 > 0
              ? `${queueItems.length - currentSongIndex - 1} more songs in queue`
              : 'Queue empty'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TVMode

