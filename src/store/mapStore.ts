import { create } from 'zustand'

interface MapState {
  viewState: { longitude: number; latitude: number; zoom: number; pitch: number; bearing: number }
  setViewState: (viewState: any) => void
  hoveredObject: any | null
  setHoveredObject: (obj: any | null) => void
  selectedCountry: any | null
  setSelectedCountry: (country: any | null) => void
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
  hoveredAttack: any | null
  setHoveredAttack: (attack: any | null) => void
}

export const useMapStore = create<MapState>((set) => ({
  viewState: { longitude: 35, latitude: 23, zoom: 1.45, pitch: 28, bearing: 0 },
  setViewState: (viewState) => set({ viewState }),
  hoveredObject: null,
  setHoveredObject: (hoveredObject) => set({ hoveredObject }),
  selectedCountry: null,
  setSelectedCountry: (selectedCountry) => set({ selectedCountry }),
  drawerOpen: false,
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  hoveredAttack: null,
  setHoveredAttack: (hoveredAttack) => set({ hoveredAttack }),
}))
