import { create } from 'zustand'
import type { FilterState } from '../types'

interface FilterStore {
  filters: FilterState
  setFilters: (filters: FilterState) => void
  updateFilter: (key: keyof FilterState, value: string) => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  filters: {
    attackType: 'All',
    country: 'All',
    severity: 'All',
    httpMethod: 'All',
    statusCode: 'All',
    timeRange: '24h',
  },
  setFilters: (filters) => set({ filters }),
  updateFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
}))
