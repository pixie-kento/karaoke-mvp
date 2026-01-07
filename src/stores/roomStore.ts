import { create } from 'zustand'
import { Room } from '@/types'

interface RoomState {
  currentRoom: Room | null
  setCurrentRoom: (room: Room | null) => void
  isHost: boolean
  setIsHost: (isHost: boolean) => void
}

export const useRoomStore = create<RoomState>((set) => ({
  currentRoom: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),
  isHost: false,
  setIsHost: (isHost) => set({ isHost }),
}))

