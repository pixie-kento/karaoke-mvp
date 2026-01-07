import QRCodeSVG from 'react-qr-code'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRoomStore } from '@/stores/roomStore'

interface RoomQRCodeProps {
  className?: string
}

export function RoomQRCode({ className }: RoomQRCodeProps) {
  const { currentRoom } = useRoomStore()

  if (!currentRoom) return null

  const roomUrl = `${window.location.origin}/room/${currentRoom.code}`
  const controllerUrl = `${window.location.origin}/controller/${currentRoom.code}`

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Join Room</CardTitle>
        <CardDescription>Scan QR code to join this karaoke session</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-lg">
            <QRCodeSVG value={roomUrl} size={200} />
          </div>
          <div className="text-center">
            <p className="text-sm font-mono font-bold text-2xl mb-2">
              {currentRoom.code}
            </p>
            <p className="text-xs text-muted-foreground">
              Or visit: {roomUrl}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm font-semibold mb-2">Quick Links:</p>
          <div className="space-y-2">
            <a
              href={roomUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-primary hover:underline"
            >
              📱 Room View
            </a>
            <a
              href={controllerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-primary hover:underline"
            >
              🎮 Mobile Controller
            </a>
            <a
              href={`/tv/${currentRoom.code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-primary hover:underline"
            >
              📺 TV Mode
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

