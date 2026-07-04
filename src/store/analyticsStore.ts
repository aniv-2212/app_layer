import { create } from 'zustand'
import attacksData from '../mock/attacks.json'
import reportsData from '../mock/reports.json'
import logsData from '../mock/logs.json'

type ReportItem = {
  id: string
  name: string
  type: string
  status: string
  date: string
}

interface AnalyticsStore {
  timeRange: string
  country: string
  attackFilter: string
  reportItems: ReportItem[]
  chartSeries: Array<{ name: string; data: number[] }>
  logItems: Array<{ id: string; timestamp: string; source: string; type: string; severity: string; message: string; status: string }>
  setTimeRange: (value: string) => void
  setCountry: (value: string) => void
  setAttackFilter: (value: string) => void
  setReportItems: (items: ReportItem[]) => void
  setChartSeries: (series: Array<{ name: string; data: number[] }>) => void
  refreshCharts: () => void
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  timeRange: '24h',
  country: 'All',
  attackFilter: 'All',
  reportItems: reportsData.items,
  chartSeries: attacksData.series,
  logItems: logsData.items,
  setTimeRange: (timeRange) => set({ timeRange }),
  setCountry: (country) => set({ country }),
  setAttackFilter: (attackFilter) => set({ attackFilter }),
  setReportItems: (reportItems) => set({ reportItems }),
  setChartSeries: (chartSeries) => set({ chartSeries }),
  refreshCharts: () => set({ chartSeries: attacksData.series.map((series) => ({ ...series, data: series.data.map((value) => value + 8) })) }),
}))
