import { create } from 'zustand'
import { seedCountrySummaries, seedEvents, seedKpis } from '../mock/data'
import type { AttackEvent, CountrySummary, DashboardKpi } from '../types'

interface DashboardStore {
  kpis: DashboardKpi[]
  eventFeed: AttackEvent[]
  countrySummaries: CountrySummary[]
  setKpis: (kpis: DashboardKpi[]) => void
  setEventFeed: (events: AttackEvent[]) => void
  appendEvent: (event: AttackEvent) => void
  setCountrySummaries: (summaries: CountrySummary[]) => void
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  kpis: seedKpis,
  eventFeed: seedEvents,
  countrySummaries: seedCountrySummaries,
  setKpis: (kpis) => set({ kpis }),
  setEventFeed: (eventFeed) => set({ eventFeed }),
  appendEvent: (event) => set((state) => ({ eventFeed: [event, ...state.eventFeed].slice(0, 8) })),
  setCountrySummaries: (countrySummaries) => set({ countrySummaries }),
}))
