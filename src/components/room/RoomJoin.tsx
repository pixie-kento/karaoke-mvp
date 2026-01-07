import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { joinRoomByCode } from '@/lib/room'
import { useRoomStore } from '@/stores/roomStore'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export function RoomJoin() {
  const [roomCode, setRoomCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setCurrentRoom, setIsHost } = useRoomStore()
  const { toast } = useToast()

  const handleJoin = async () => {
    const code = roomCode.trim().toUpperCase()
    
    if (!code || code.length !== 6) {
      toast({
        title: 'Invalid room code',
        description: 'Please enter a 6-character room code',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    const { room, error } = await joinRoomByCode(code)

    if (error || !room) {
      toast({
        title: 'Failed to join room',
        description: error || 'Room not found',
        variant: 'destructive',
      })
      setIsLoading(false)
      return
    }

    setCurrentRoom(room)
    setIsHost(false) // Joining user is not the host
    navigate(`/room/${room.code}`)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Join Room</CardTitle>
        <CardDescription>
          Enter a room code to join a karaoke session
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="room-code" className="text-sm font-medium">
            Room Code
          </label>
          <Input
            id="room-code"
            placeholder="ABC123"
            value={roomCode}
            onChange={(e) => {
              const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
              setRoomCode(value.slice(0, 6))
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            disabled={isLoading}
            maxLength={6}
            className="text-center text-2xl font-mono tracking-widest"
          />
        </div>

        <Button
          onClick={handleJoin}
          disabled={isLoading || roomCode.length !== 6}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : (
            'Join Room'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

