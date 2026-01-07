import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRoomStore } from '@/stores/roomStore'

export function RoomCode() {
  const { currentRoom } = useRoomStore()

  if (!currentRoom) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Code</CardTitle>
        <CardDescription>Share this code with others to join</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-6xl font-mono font-bold tracking-widest text-primary mb-4">
            {currentRoom.code}
          </div>
          <p className="text-sm text-muted-foreground">
            Room: {currentRoom.name}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

