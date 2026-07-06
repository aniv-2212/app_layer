import { create } from 'zustand'
import { api } from '../services/api'
import type { LiveAttack } from '../types/liveThreatMap'

type ReportItem = {
  id: string
  name: string
  type: string
  status: string
  date: string
}

type LogItem = {
  id: string
  timestamp: string
  source: string
  type: string
  severity: string
  message: string
  status: string
}

function attackToLogItem(attack: LiveAttack): LogItem {
  return {
    id: `log-${attack.id}`,
    timestamp: attack.timestamp,
    source: attack.source_ip,
    type: attack.attack_type,
    severity: String(attack.severity),
    message: `${attack.http_method} ${attack.endpoint} from ${attack.source_country} (${attack.request_count} requests)`,
    status: String(attack.status),
  }
}

function buildChartSeries(attacks: LiveAttack[]) {
  const latest = attacks.slice(0, 12).reverse()
  return [
    { name: 'Requests', data: latest.map((attack) => attack.request_count ?? 0) },
    { name: 'Blocked', data: latest.map((attack) => (attack.status === 'Blocked' || attack.status === 'Mitigated' ? attack.request_count ?? 0 : 0)) },
  ]
}

interface AnalyticsStore {
  timeRange: string
  country: string
  attackFilter: string
  reportItems: ReportItem[]
  chartSeries: Array<{ name: string; data: number[] }>
  logItems: LogItem[]
  hydrated: boolean
  setTimeRange: (value: string) => void
  setCountry: (value: string) => void
  setAttackFilter: (value: string) => void
  setReportItems: (items: ReportItem[]) => void
  setChartSeries: (series: Array<{ name: string; data: number[] }>) => void
  hydrate: () => Promise<void>
  refreshCharts: () => void
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  timeRange: '24h',
  country: 'All',
  attackFilter: 'All',
  reportItems: [],
  chartSeries: [],
  logItems: [],
  hydrated: false,
  setTimeRange: (timeRange) => set({ timeRange }),
  setCountry: (country) => set({ country }),
  setAttackFilter: (attackFilter) => set({ attackFilter }),
  setReportItems: (reportItems) => set({ reportItems }),
  setChartSeries: (chartSeries) => set({ chartSeries }),
  hydrate: async () => {
    try {
      const [attackList, replay] = await Promise.all([api.attacks({ limit: 100 }), api.replay()])
      const attacks = attackList.items
      set({
        chartSeries: buildChartSeries(attacks),
        logItems: attacks.slice(0, 20).map(attackToLogItem),
        reportItems: [
          { id: 'rep-live', name: 'Live Attack Export', type: 'JSON', status: 'Ready', date: new Date().toISOString().slice(0, 10) },
          { id: 'rep-csv', name: 'Filtered Attack CSV', type: 'CSV', status: 'Ready', date: new Date().toISOString().slice(0, 10) },
          { id: 'rep-replay', name: `Replay Buffer (${replay.total}/${replay.capacity})`, type: 'JSON', status: 'Ready', date: new Date().toISOString().slice(0, 10) },
        ],
        hydrated: true,
      })
    } catch (error) {
      console.warn('Unable to hydrate analytics store', error)
    }
  },
  refreshCharts: () => {
    void get().hydrate()
  },
}))
