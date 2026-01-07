import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getUserPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getPlaylistSongs,
  addSongToPlaylist,
  removeSongFromPlaylist,
  addPlaylistToQueue,
} from '@/lib/playlists'

export function usePlaylists(userId: string | null) {
  const queryClient = useQueryClient()

  const { data: playlists = [], isLoading } = useQuery({
    queryKey: ['playlists', userId],
    queryFn: () => getUserPlaylists(userId!),
    enabled: !!userId,
    select: (data) => data.playlists,
  })

  const createMutation = useMutation({
    mutationFn: ({
      name,
      description,
      isPublic,
    }: {
      name: string
      description?: string
      isPublic?: boolean
    }) => createPlaylist(userId!, name, description, isPublic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists', userId] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      playlistId,
      updates,
    }: {
      playlistId: string
      updates: { name?: string; description?: string; isPublic?: boolean }
    }) => updatePlaylist(playlistId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists', userId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (playlistId: string) => deletePlaylist(playlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists', userId] })
    },
  })

  return {
    playlists,
    isLoading,
    createPlaylist: createMutation.mutateAsync,
    updatePlaylist: updateMutation.mutateAsync,
    deletePlaylist: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

export function usePlaylistSongs(playlistId: string | null) {
  const queryClient = useQueryClient()

  const { data: songs = [], isLoading } = useQuery({
    queryKey: ['playlist-songs', playlistId],
    queryFn: () => getPlaylistSongs(playlistId!),
    enabled: !!playlistId,
    select: (data) => data.songs,
  })

  const addSongMutation = useMutation({
    mutationFn: ({
      videoId,
      videoTitle,
      videoThumbnail,
    }: {
      videoId: string
      videoTitle: string
      videoThumbnail: string
    }) => addSongToPlaylist(playlistId!, videoId, videoTitle, videoThumbnail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlist-songs', playlistId] })
    },
  })

  const removeSongMutation = useMutation({
    mutationFn: (songId: string) => removeSongFromPlaylist(songId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlist-songs', playlistId] })
    },
  })

  const addToQueueMutation = useMutation({
    mutationFn: ({
      roomId,
      addedByName,
      addedByUserId,
    }: {
      roomId: string
      addedByName?: string
      addedByUserId?: string
    }) => addPlaylistToQueue(roomId, playlistId!, addedByName, addedByUserId),
  })

  return {
    songs,
    isLoading,
    addSong: addSongMutation.mutateAsync,
    removeSong: removeSongMutation.mutateAsync,
    addToQueue: addToQueueMutation.mutateAsync,
    isAddingSong: addSongMutation.isPending,
    isRemovingSong: removeSongMutation.isPending,
    isAddingToQueue: addToQueueMutation.isPending,
  }
}

