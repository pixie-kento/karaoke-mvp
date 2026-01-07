import { RoomCreate } from '@/components/room/RoomCreate'
import { RoomJoin } from '@/components/room/RoomJoin'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AppLayout } from '@/components/layout/AppLayout'

function Home() {
  return (
    <AppLayout showHeader={false} showFooter={false}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-4">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4">🎤 Karaoke MVP</h1>
            <p className="text-xl mb-8">Sing together, anywhere</p>
          </div>

          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create Room</TabsTrigger>
              <TabsTrigger value="join">Join Room</TabsTrigger>
            </TabsList>
            <TabsContent value="create" className="flex justify-center">
              <RoomCreate />
            </TabsContent>
            <TabsContent value="join" className="flex justify-center">
              <RoomJoin />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}

export default Home

