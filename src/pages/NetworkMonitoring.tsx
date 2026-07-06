import { Activity, Network, Radio, ShieldAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { StatusCard } from '../components/cards/StatusCard'
import { ChartCard } from '../components/cards/ChartCard'
import { Toast } from '../components/ui/Toast'
import { api } from '../services/api'
import { useAnalyticsStore } from '../store/analyticsStore'
import { useAttackStore } from '../store/attackStore'

function prettyCount(value: number) {
  return value > 999 ? `${(value / 1000).toFixed(1)}K` : String(value)
}

export function NetworkMonitoringPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const timeRange = useAnalyticsStore((state) => state.timeRange)
  const attacks = useAttackStore((state) => state.attacks)
  const statistics = useAttackStore((state) => state.statistics)
  const hydrate = useAttackStore((state) => state.hydrateFromBackend)

  // Derived live metrics: statistics update via the statistics:update socket
  // event, attacks via attack:new — no polling needed.
  const metrics = useMemo(() => {
    const recent = attacks.slice(0, 50)
    const medianDuration = recent.length
      ? [...recent].map((attack) => attack.duration_ms).sort((a, b) => a - b)[Math.floor(recent.length / 2)]
      : 0
    return {
      live_topology_devices: statistics?.active_countries ?? 0,
      active_connections_pretty: prettyCount(statistics?.total_requests ?? 0),
      latency_ms: medianDuration / 1000,
      network_health_percent: statistics?.mitigated_percentage ?? 0,
    }
  }, [attacks, statistics])

  const protocolMix = useMemo(() => {
    const counts = new Map<string, number>()
    attacks.forEach((attack) => counts.set(attack.protocol, (counts.get(attack.protocol) ?? 0) + 1))
    const total = attacks.length || 1
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([protocol, count]) => `${protocol} ${Math.round((count / total) * 100)}%`)
      .join(', ')
  }, [attacks])

  const connectionRows = useMemo(() => {
    const byMethod = new Map<string, number>()
    attacks.forEach((attack) => byMethod.set(attack.http_method, (byMethod.get(attack.http_method) ?? 0) + attack.request_count))
    return Array.from(byMethod.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([method, count]) => `${prettyCount(count)} ${method} requests`)
  }, [attacks])

  const topSources = useMemo(() => attacks.slice(0, 2).map((attack) => attack.source_ip), [attacks])

  const handleRefresh = async () => {
    setRefreshing(true)
    setToastOpen(true)
    try {
      await api.streamSnapshot()
      await hydrate()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <PageShell
      title="Network Monitoring"
      subtitle="Visibility into topology, active sessions, traffic patterns, and network health."
      actions={
        <button onClick={handleRefresh} className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white">
          {refreshing ? 'Refreshing…' : 'Refresh Topology'}
        </button>
      }
      filters={
        <>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">Live flows</span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">{timeRange} window</span>
        </>
      }
      kpiSection={[
        <StatusCard key="topology" title="Live Topology" value={metrics.live_topology_devices.toString()} detail="Connected devices" icon={Network} accent="from-cyan-500 to-sky-600" />,
        <StatusCard key="active" title="Active Connections" value={metrics.active_connections_pretty} detail="Current session count" icon={Activity} accent="from-fuchsia-500 to-violet-600" />,
        <StatusCard key="latency" title="Latency Monitor" value={`${metrics.latency_ms.toFixed(1)}ms`} detail="Median network latency" icon={Radio} accent="from-amber-400 to-orange-600" />,
        <StatusCard key="health" title="Network Health" value={`${metrics.network_health_percent.toFixed(1)}%`} detail="Stable and resilient" icon={ShieldAlert} accent="from-emerald-500 to-teal-600" />,
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="Live Network Topology" subtitle="Gateway and branch connectivity map">
          <div className="h-56 rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.14)_0%,rgba(15,23,42,0.9)_100%)]" />
        </ChartCard>
        <ChartCard title="Active Connections" subtitle="Current sessions and flows">
          <div className="space-y-3 text-sm text-slate-300">
            {(connectionRows.length ? connectionRows : ['Awaiting live stream…']).map((item) => (
              <div key={item} className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">{item}</div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ChartCard title="Device List" subtitle="Critical infrastructure inventory">
          <div className="space-y-2 text-sm text-slate-300">
            {(topSources.length ? topSources : ['Awaiting live stream…']).map((source) => (
              <button key={source} onClick={() => setToastOpen(true)} className="w-full rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-left">{source}</button>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="DNS Requests" subtitle="Recent lookup volume">
          <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">{prettyCount(statistics?.total_requests ?? 0)} requests observed</div>
        </ChartCard>
        <ChartCard title="Protocol Distribution" subtitle="Traffic mix">
          <div className="rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/10 p-4 text-sm text-fuchsia-200">{protocolMix || 'Awaiting live stream…'}</div>
        </ChartCard>
        <ChartCard title="Traffic Timeline" subtitle="Bandwidth and throughput">
          <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">{(statistics?.attacks_per_minute ?? 0).toFixed(1)} attacks/min peak</div>
        </ChartCard>
      </div>

      <ChartCard title="Packet Statistics" subtitle="Visibility into packet health and loss">
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setToastOpen(true)} className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">Packet loss 0.04%</button>
          <button onClick={() => setToastOpen(true)} className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-2 text-sm text-fuchsia-200">Jitter 3.2ms</button>
          <button onClick={() => setToastOpen(true)} className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">Bandwidth trend +6%</button>
        </div>
      </ChartCard>
      <Toast message={refreshing ? 'Topology refresh in progress' : 'Topology refreshed'} open={toastOpen} />
    </PageShell>
  )
}
