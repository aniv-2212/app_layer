import { create } from 'zustand'
import { useAttackStore } from './attackStore'

interface SocketStore {
  connected: boolean
  status: string
  connect: () => void
}

export const useSocketStore = create<SocketStore>((set) => ({
  connected: true,
  status: 'Live',
  connect: () => {
    useAttackStore.getState().startLiveStream()
    set({ connected: true, status: 'Streaming' })
  },
}))
