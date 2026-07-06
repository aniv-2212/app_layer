import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { getThreatSocket } from '../services/socket'
import { useLiveThreatStore } from '../store/liveThreatStore'
import type { HeatmapPayload, LiveAttack, LiveStatistics, TimelinePayload } from '../types/liveThreatMap'

export function useSocket() {
  const addAttack = useLiveThreatStore((state) => state.addAttack)
  const updateStatistics = useLiveThreatStore((state) => state.updateStatistics)
  const updateHeatmap = useLiveThreatStore((state) => state.updateHeatmap)
  const updateTimeline = useLiveThreatStore((state) => state.updateTimeline)
  const setConnected = useLiveThreatStore((state) => state.setConnected)

  useEffect(() => {
    const socket = getThreatSocket()

    const onConnect = () => setConnected(true, 'Connected')
    const onDisconnect = () => setConnected(false, 'Reconnecting')
    const onConnectError = () => setConnected(false, 'Backend unavailable')
    const onConnectionSuccess = (payload: { message?: string }) => {
      setConnected(true, 'Streaming')
      if (payload.message) toast.success(payload.message)
    }
    const onAttack = (attack: LiveAttack) => {
      console.info('Attack Received', attack.attack_type, `${attack.source_country} -> ${attack.destination_country}`)
      addAttack(attack)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)
    socket.on('connection:success', onConnectionSuccess)
    socket.on('attack:new', onAttack)
    socket.on('statistics:update', updateStatistics as (statistics: LiveStatistics) => void)
    socket.on('heatmap:update', updateHeatmap as (heatmap: HeatmapPayload) => void)
    socket.on('timeline:update', updateTimeline as (timeline: TimelinePayload) => void)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)
      socket.off('connection:success', onConnectionSuccess)
      socket.off('attack:new', onAttack)
      socket.off('statistics:update', updateStatistics as (statistics: LiveStatistics) => void)
      socket.off('heatmap:update', updateHeatmap as (heatmap: HeatmapPayload) => void)
      socket.off('timeline:update', updateTimeline as (timeline: TimelinePayload) => void)
    }
  }, [addAttack, setConnected, updateHeatmap, updateStatistics, updateTimeline])
}
