import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createRoom } from '@/lib/room'
import { useRoomStore } from '@/stores/roomStore'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export function RoomCreate() {
  const [roomName, setRoomName] = useState('')
  const [roomType, setRoomType] = useState<'home' | 'business'>('home')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setCurrentRoom, setIsHost } = useRoomStore()
  const { toast } = useToast()

  const handleCreate = async () => {
    if (!roomName.trim()) {
      toast({
        title: 'Room name required',
        description: 'Please enter a name for your room',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    const { room, error } = await createRoom(roomName.trim(), roomType)

    if (error || !room) {
      toast({
        title: 'Failed to create room',
        description: error || 'Unknown error occurred',
        variant: 'destructive',
      })
      setIsLoading(false)
      return
    }

    setCurrentRoom(room)
    setIsHost(true)
    navigate(`/room/${room.code}`)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Room</CardTitle>
        <CardDescription>
          Start a new karaoke session
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="room-name" className="text-sm font-medium">
            Room Name
          </label>
          <Input
            id="room-name"
            placeholder="My Karaoke Party"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Room Type</label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={roomType === 'home' ? 'default' : 'outline'}
              onClick={() => setRoomType('home')}
              disabled={isLoading}
              className="flex-1"
            >
              🏠 Home
            </Button>
            <Button
              type="button"
              variant={roomType === 'business' ? 'default' : 'outline'}
              onClick={() => setRoomType('business')}
              disabled={isLoading}
              className="flex-1"
            >
              🏢 Business
            </Button>
          </div>
        </div>

        <Button
          onClick={handleCreate}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Room'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

