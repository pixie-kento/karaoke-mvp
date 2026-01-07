import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePlaylists } from '@/hooks/usePlaylists'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Music, Trash2, Play } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { useNavigate } from 'react-router-dom'

const playlistSchema = z.object({
  name: z.string().min(1, 'Playlist name is required'),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
})

type PlaylistForm = z.infer<typeof playlistSchema>

function Playlists() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { playlists, isLoading, createPlaylist, deletePlaylist, isCreating, isDeleting } =
    usePlaylists(user?.id || null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const form = useForm<PlaylistForm>({
    resolver: zodResolver(playlistSchema),
    defaultValues: {
      isPublic: false,
    },
  })

  const handleCreate = async (data: PlaylistForm) => {
    if (!user) return

    try {
      await createPlaylist({
        name: data.name,
        description: data.description,
        isPublic: data.isPublic,
      })
      toast.success('Playlist created!')
      setDialogOpen(false)
      form.reset()
    } catch (error: any) {
      toast.error('Failed to create playlist', {
        description: error.message,
      })
    }
  }

  const handleDelete = async (playlistId: string) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return

    try {
      await deletePlaylist(playlistId)
      toast.success('Playlist deleted')
    } catch (error: any) {
      toast.error('Failed to delete playlist', {
        description: error.message,
      })
    }
  }

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="container py-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Sign in required</h1>
            <p className="text-muted-foreground mb-4">
              Please sign in to view and manage your playlists
            </p>
            <Button onClick={() => navigate('/')}>Go to Home</Button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Playlists</h1>
            <p className="text-muted-foreground">Save and organize your favorite karaoke songs</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Playlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Playlist</DialogTitle>
                <DialogDescription>
                  Give your playlist a name and description
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="My Favorite Songs"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description (optional)
                  </label>
                  <Input
                    id="description"
                    {...form.register('description')}
                    placeholder="A collection of my favorite karaoke songs"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Playlist'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : playlists.length === 0 ? (
          <div className="text-center py-12">
            <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first playlist to save your favorite songs
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Playlist
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <Card key={playlist.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">{playlist.name}</CardTitle>
                      {playlist.description && (
                        <CardDescription className="line-clamp-2 mt-1">
                          {playlist.description}
                        </CardDescription>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(playlist.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {playlist.is_public ? 'Public' : 'Private'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/playlists/${playlist.id}`)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default Playlists

