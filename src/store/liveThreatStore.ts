import { create } from 'zustand'
import type { CountryRollup, HeatmapPayload, LiveAttack, LiveStatistics, LiveThreatFilters, TimelineBucket, TimelinePayload } from '../types/liveThreatMap'

const initialFilters: LiveThreatFilters = {
  country: 'All',
  severity: 'All',
  attackType: 'All',
  timeRange: 'Live',
  status: 'All',
  protocol: 'All',
  httpMethod: 'All',
  search: '',
}

type LiveThreatStore = {
  attacks: LiveAttack[]
  statistics: LiveStatistics | null
  heatmap: HeatmapPayload
  timeline: TimelineBucket[]
  selectedCountry: string | null
  filters: LiveThreatFilters
  connected: boolean
  connectionStatus: string
  replaying: boolean
  addAttack: (attack: LiveAttack) => void
  updateStatistics: (statistics: LiveStatistics) => void
  updateHeatmap: (heatmap: HeatmapPayload) => void
  updateTimeline: (timeline: TimelinePayload) => void
  selectCountry: (country: string | null) => void
  setConnected: (connected: boolean, connectionStatus?: string) => void
  setFilters: (filters: Partial<LiveThreatFilters>) => void
  setReplaying: (replaying: boolean) => void
  clear: () => void
}

function normalizeTimeline(payload: TimelinePayload): TimelineBucket[] {
  if (Array.isArray(payload)) return payload
  return payload.data ?? payload.buckets ?? []
}

export const useLiveThreatStore = create<LiveThreatStore>((set) => ({
  attacks: [],
  statistics: null,
  heatmap: { data: {}, total: 0, updated_at: new Date().toISOString() },
  timeline: [],
  selectedCountry: null,
  filters: initialFilters,
  connected: false,
  connectionStatus: 'Offline',
  replaying: false,
  addAttack: (attack) =>
    set((state) => ({
      attacks: [attack, ...state.attacks].slice(0, 500),
    })),
  updateStatistics: (statistics) => set({ statistics }),
  updateHeatmap: (heatmap) => set({ heatmap }),
  updateTimeline: (timeline) => set({ timeline: normalizeTimeline(timeline).slice(-120) }),
  selectCountry: (selectedCountry) => set({ selectedCountry }),
  setConnected: (connected, connectionStatus = connected ? 'Connected' : 'Offline') => set({ connected, connectionStatus }),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  setReplaying: (replaying) => set({ replaying }),
  clear: () =>
    set({
      attacks: [],
      statistics: null,
      heatmap: { data: {}, total: 0, updated_at: new Date().toISOString() },
      timeline: [],
      selectedCountry: null,
      filters: initialFilters,
    }),
}))

export function selectFilteredAttacks(attacks: LiveAttack[], filters: LiveThreatFilters) {
  const query = filters.search.trim().toLowerCase()

  return attacks.filter((attack) => {
    const countryMatch = filters.country === 'All' || attack.source_country === filters.country || attack.destination_country === filters.country
    const severityMatch = filters.severity === 'All' || attack.severity === filters.severity
    const attackMatch = filters.attackType === 'All' || attack.attack_type === filters.attackType
    const statusMatch = filters.status === 'All' || attack.status === filters.status
    const protocolMatch = filters.protocol === 'All' || attack.protocol === filters.protocol
    const methodMatch = filters.httpMethod === 'All' || attack.http_method === filters.httpMethod
    const queryMatch = !query || [attack.source_country, attack.destination_country, attack.source_ip, attack.destination_ip, attack.endpoint, attack.attack_type, attack.http_method, attack.status].join(' ').toLowerCase().includes(query)

    return countryMatch && severityMatch && attackMatch && statusMatch && protocolMatch && methodMatch && queryMatch
  })
}

export function buildCountryRollup(attacks: LiveAttack[], country: string): CountryRollup {
  const related = attacks.filter((attack) => attack.destination_country === country || attack.source_country === country)
  const attackCounts = related.reduce<Record<string, number>>((acc, attack) => {
    acc[attack.attack_type] = (acc[attack.attack_type] ?? 0) + 1
    return acc
  }, {})
  const sourceCounts = related.reduce<Record<string, number>>((acc, attack) => {
    if (attack.source_country !== country) acc[attack.source_country] = (acc[attack.source_country] ?? 0) + 1
    return acc
  }, {})

  return {
    country,
    requests: related.reduce((sum, attack) => sum + attack.request_count, 0),
    attacks: related.length,
    blocked: related.filter((attack) => attack.status === 'Blocked' || attack.status === 'Mitigated').length,
    threatScore: Math.round(related.reduce((sum, attack) => sum + attack.risk_score, 0) / Math.max(related.length, 1)),
    topAttack: Object.entries(attackCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'No attacks',
    topSources: Object.entries(sourceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name]) => name),
  }
}
