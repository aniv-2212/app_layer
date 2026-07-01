import { create } from 'zustand'
import type { AttackEvent, CountrySummary } from '../types'

interface MapStore {
  drawerOpen: boolean
  selectedCountry: CountrySummary | null
  hoveredAttack: AttackEvent | null
  setDrawerOpen: (value: boolean) => void
  setSelectedCountry: (country: CountrySummary | null) => void
  setHoveredAttack: (attack: AttackEvent | null) => void
}

export const useMapStore = create<MapStore>((set) => ({
  drawerOpen: false,
  selectedCountry: null,
  hoveredAttack: null,
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  setSelectedCountry: (selectedCountry) => set({ selectedCountry }),
  setHoveredAttack: (hoveredAttack) => set({ hoveredAttack }),
}))
