import { create } from 'zustand'
import { buildSyntheticEvent } from '../mock/data'
import { useAttackStore } from './attackStore'
import { useDashboardStore } from './dashboardStore'

interface SocketStore {
  connected: boolean
  status: string
  connect: () => void
}

export const useSocketStore = create<SocketStore>((set) => ({
  connected: true,
  status: 'Live',
  connect: () => {
    set({ connected: true, status: 'Streaming' })
    const tick = () => {
      const event = buildSyntheticEvent(Date.now() % 1000)
      const dashboard = useDashboardStore.getState()
      const attackStore = useAttackStore.getState()
      dashboard.appendEvent(event)
      attackStore.appendLog({
        id: event.id,
        timestamp: new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        sourceIp: event.sourceIp,
        destination: event.destinationCountry,
        endpoint: event.endpoint,
        attackType: event.attackType,
        httpMethod: event.httpMethod,
        country: event.sourceCountry,
        severity: event.severity,
        status: event.status,
      })
      const kpis = dashboard.kpis.map((item) => {
        if (item.id === 'requests') {
          return { ...item, value: `${(Number.parseFloat(item.value) + 0.02).toFixed(2)}M` }
        }
        if (item.id === 'attacks') {
          return { ...item, value: `${(Number.parseFloat(item.value) + 0.5).toFixed(1)}K` }
        }
        if (item.id === 'aiScore') {
          return { ...item, value: `${Math.min(99, Number.parseInt(item.value, 10) + 1)}/100` }
        }
        return item
      })
      dashboard.setKpis(kpis)
      attackStore.setAttackSeries([32, 60, 74, 69, 44, 36, 88])
      setTimeout(tick, 1800 + (Date.now() % 1000))
    }
    tick()
  },
}))
