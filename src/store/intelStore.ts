import { create } from 'zustand'
import { api } from '../services/api'
import type { IntelSnapshot } from '../services/api'

interface IntelStore {
  snapshot: IntelSnapshot | null
  lastUpdated: string | null
  hydrated: boolean
  applySnapshot: (snapshot: IntelSnapshot) => void
  hydrate: () => Promise<void>
}

/** Holds the aggregated external-intel snapshot; refreshed by REST hydrate and
 *  by the backend's `intel:update` Socket.IO broadcast. */
export const useIntelStore = create<IntelStore>((set, get) => ({
  snapshot: null,
  lastUpdated: null,
  hydrated: false,
  applySnapshot: (snapshot) =>
    set({ snapshot, lastUpdated: new Date().toISOString(), hydrated: true }),
  hydrate: async () => {
    if (get().hydrated) return
    try {
      get().applySnapshot(await api.intelSnapshot())
    } catch (error) {
      console.warn('Unable to hydrate intel snapshot', error)
    }
  },
}))
