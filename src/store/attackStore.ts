import { create } from 'zustand'
import { getThreatSocket } from '../services/socket'
import { api } from '../services/api'
import type { DashboardMetadata } from '../services/api'
import { useLiveThreatStore } from './liveThreatStore'
import { useStatisticsStore } from './statisticsStore'
import { useNotificationStore, notifyAttack } from './notificationStore'
import { useDashboardStore, toAttackEvent } from './dashboardStore'
import { useIntelStore } from './intelStore'
import { useAnalyticsStore } from './analyticsStore'
import type { IntelSnapshot } from '../services/api'
import type { AttackLogRow } from '../types'
import type { HeatmapPayload, LiveAttack, LiveStatistics, TimelinePayload } from '../types/liveThreatMap'

interface AttackState {
  attacks: LiveAttack[]
  attackLogs: AttackLogRow[]
  requestSeries: Array<{ name: string; data: number[] }>
  attackSeries: number[]
  heatmap: HeatmapPayload
  statistics: LiveStatistics | null
  timeline: any[]
  metadata: DashboardMetadata | null
  connected: boolean
  connectionStatus: string
  addAttack: (attack: LiveAttack) => void
  setAttackLogs: (logs: AttackLogRow[]) => void
  appendLog: (log: AttackLogRow) => void
  setRequestSeries: (series: Array<{ name: string; data: number[] }>) => void
  setAttackSeries: (series: number[]) => void
  setHeatmap: (heatmap: HeatmapPayload) => void
  setStatistics: (statistics: LiveStatistics) => void
  setTimeline: (timeline: any[]) => void
  setConnected: (connected: boolean, status?: string) => void
  hydrateFromBackend: () => Promise<void>
  fetchMetadata: () => Promise<void>
  replaying: boolean
  setReplaying: (replaying: boolean) => void
  startLiveStream: () => void
  disconnectStream: () => void
}

function attackToLog(attack: LiveAttack): AttackLogRow {
  return {
    id: String(attack.id),
    timestamp: new Date(attack.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    sourceIp: attack.source_ip,
    destination: attack.destination_country,
    endpoint: attack.endpoint,
    attackType: attack.attack_type,
    httpMethod: attack.http_method,
    country: attack.source_country,
    severity: String(attack.severity),
    status: String(attack.status),
  }
}

function normalizeTimeline(payload: TimelinePayload) {
  if (Array.isArray(payload)) return payload
  return payload.data ?? payload.buckets ?? []
}

function buildSeries(attacks: LiveAttack[]) {
  const latest = attacks.slice(0, 12).reverse()
  return {
    requestSeries: [
      { name: 'Requests', data: latest.map((attack) => attack.request_count ?? 0) },
      { name: 'Blocked', data: latest.map((attack) => attack.status === 'Blocked' || attack.status === 'Mitigated' ? attack.request_count ?? 0 : 0) },
    ],
    attackSeries: latest.map((attack) => attack.risk_score ?? 0),
  }
}

function syncLiveStore(snapshot: { attacks?: LiveAttack[]; statistics?: LiveStatistics; heatmap?: HeatmapPayload; replay?: { items?: LiveAttack[] } }) {
  const liveStore = useLiveThreatStore.getState()
  snapshot.attacks?.slice().reverse().forEach((attack) => liveStore.addAttack(attack))
  if (snapshot.statistics) liveStore.updateStatistics(snapshot.statistics)
  if (snapshot.heatmap) liveStore.updateHeatmap(snapshot.heatmap)
  if (snapshot.replay?.items) liveStore.updateTimeline(snapshot.replay.items)
}

let streamStarted = false

export const useAttackStore = create<AttackState>((set) => ({
  attacks: [],
  attackLogs: [],
  requestSeries: [
    { name: 'Requests', data: [] },
    { name: 'Blocked', data: [] },
  ],
  attackSeries: [],
  heatmap: { data: {}, total: 0, updated_at: new Date().toISOString() },
  statistics: null,
  timeline: [],
  metadata: null,
  connected: false,
  connectionStatus: 'Offline',
  addAttack: (attack) => set((state) => ({ attacks: [attack, ...state.attacks].slice(0, 500) })),
  setAttackLogs: (attackLogs) => set({ attackLogs }),
  appendLog: (log) => set((state) => ({ attackLogs: [log, ...state.attackLogs].slice(0, 10) })),
  setRequestSeries: (requestSeries) => set({ requestSeries }),
  setAttackSeries: (attackSeries) => set({ attackSeries }),
  setHeatmap: (heatmap) => set({ heatmap }),
  setStatistics: (statistics) => set({ statistics }),
  setTimeline: (timeline) => set({ timeline }),
  setConnected: (connected, connectionStatus = connected ? 'Streaming' : 'Offline') => set({ connected, connectionStatus }),
  hydrateFromBackend: async () => {
    try {
      const snapshot = await api.dashboardSnapshot({ limit: 100 })
      const attacks = snapshot.attacks ?? []
      const replayItems = snapshot.replay?.items ?? []
      const series = buildSeries(attacks)

      set({
        attacks,
        attackLogs: attacks.map(attackToLog),
        requestSeries: series.requestSeries,
        attackSeries: series.attackSeries,
        heatmap: snapshot.heatmap,
        statistics: snapshot.statistics,
        timeline: replayItems,
        connected: Boolean(snapshot.stream?.running),
        connectionStatus: snapshot.stream?.running ? 'Backend ready' : 'Backend paused',
      })
      syncLiveStore(snapshot)
      useNotificationStore.getState().hydrateFromAttacks(attacks)
      if (snapshot.statistics) useStatisticsStore.getState().setStatistics(snapshot.statistics)
      if (replayItems.length) useStatisticsStore.getState().setTimeline(replayItems)
    } catch (error) {
      console.warn('Unable to hydrate dashboard snapshot', error)
      set({ connected: false, connectionStatus: 'Backend unavailable' })
    }
  },
  fetchMetadata: async () => {
    try {
      set({ metadata: await api.dashboardMetadata() })
    } catch (error) {
      console.warn('Unable to fetch dashboard metadata', error)
    }
  },
  replaying: false,
  setReplaying: (replaying) => set({ replaying }),
  startLiveStream: () => {
    if (streamStarted) return
    streamStarted = true
    useAttackStore.getState().hydrateFromBackend()
    useAttackStore.getState().fetchMetadata()
    useDashboardStore.getState().hydrate()
    useAnalyticsStore.getState().hydrate()
    useIntelStore.getState().hydrate()

    const socket = getThreatSocket()
    const liveStore = useLiveThreatStore.getState()

    const onConnect = () => {
      set({ connected: true, connectionStatus: 'Connected' })
      liveStore.setConnected(true, 'Connected')
    }
    const onDisconnect = () => {
      set({ connected: false, connectionStatus: 'Reconnecting' })
      liveStore.setConnected(false, 'Reconnecting')
    }
    const onConnectError = () => {
      set({ connected: false, connectionStatus: 'Backend unavailable' })
      liveStore.setConnected(false, 'Backend unavailable')
    }
    const onAttack = (attack: LiveAttack) => {
      set((state) => ({
        attacks: [attack, ...state.attacks].slice(0, 500),
        attackLogs: [attackToLog(attack), ...state.attackLogs].slice(0, 50),
        attackSeries: [...state.attackSeries.slice(-11), attack.risk_score],
        requestSeries: state.requestSeries.map((series) =>
          series.name === 'Requests'
            ? { ...series, data: [...series.data.slice(-11), attack.request_count] }
            : { ...series, data: [...series.data.slice(-11), attack.status === 'Blocked' || attack.status === 'Mitigated' ? attack.request_count : 0] },
        ),
      }))
      liveStore.addAttack(attack)
      useDashboardStore.getState().appendEvent(toAttackEvent(attack))
      notifyAttack(attack)
    }
    const onHeatmap = (heatmap: HeatmapPayload) => {
      set({ heatmap })
      useLiveThreatStore.getState().updateHeatmap(heatmap)
    }
    const onStatistics = (statistics: LiveStatistics) => {
      set({ statistics })
      useLiveThreatStore.getState().updateStatistics(statistics)
      useStatisticsStore.getState().setStatistics(statistics)
    }
    const onTimeline = (payload: TimelinePayload) => {
      const timeline = normalizeTimeline(payload)
      set({ timeline })
      useLiveThreatStore.getState().updateTimeline(payload)
      useStatisticsStore.getState().setTimeline(timeline)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)
    socket.on('connection:success', onConnect)
    socket.on('attack:new', onAttack)
    socket.on('heatmap:update', onHeatmap)
    socket.on('statistics:update', onStatistics)
    socket.on('timeline:update', onTimeline)
    socket.on('intel:update', (snapshot: IntelSnapshot) => useIntelStore.getState().applySnapshot(snapshot))
    socket.connect()
  },
  disconnectStream: () => {
    const socket = getThreatSocket()
    socket.removeAllListeners('attack:new')
    socket.removeAllListeners('heatmap:update')
    socket.removeAllListeners('statistics:update')
    socket.removeAllListeners('timeline:update')
    socket.disconnect()
    streamStarted = false
    set({ connected: false, connectionStatus: 'Offline' })
  },
}))
