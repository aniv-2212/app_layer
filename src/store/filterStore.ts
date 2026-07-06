import { create } from 'zustand'

interface FilterState {
  filters: { country: string; severity: string; attackType: string; status: string; statusCode: string; protocol: string; httpMethod: string; timeRange: string; search: string }
  setFilters: (filters: Partial<FilterState['filters']>) => void
  updateFilter: (key: keyof FilterState['filters'], value: string) => void
}

export const useFilterStore = create<FilterState>((set) => ({
  filters: { country: 'All', severity: 'All', attackType: 'All', status: 'All', statusCode: 'All', protocol: 'All', httpMethod: 'All', timeRange: '24h', search: '' },
  setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  updateFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
}))
