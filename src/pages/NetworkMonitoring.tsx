import { Activity, Network, Radio, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { StatusCard } from '../components/cards/StatusCard'
import { ChartCard } from '../components/cards/ChartCard'
import { Toast } from '../components/ui/Toast'
import { useAnalyticsStore } from '../store/analyticsStore'

export function NetworkMonitoringPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const timeRange = useAnalyticsStore((state) => state.timeRange)

  const handleRefresh = () => {
    setRefreshing(true)
    setToastOpen(true)
    window.setTimeout(() => setRefreshing(false), 1000)
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
        <StatusCard key="topology" title="Live Topology" value="214" detail="Connected devices" icon={Network} accent="from-cyan-500 to-sky-600" />,
        <StatusCard key="active" title="Active Connections" value="91.2K" detail="Current session count" icon={Activity} accent="from-fuchsia-500 to-violet-600" />,
        <StatusCard key="latency" title="Latency Monitor" value="19ms" detail="Median network latency" icon={Radio} accent="from-amber-400 to-orange-600" />,
        <StatusCard key="health" title="Network Health" value="99.1%" detail="Stable and resilient" icon={ShieldAlert} accent="from-emerald-500 to-teal-600" />,
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="Live Network Topology" subtitle="Gateway and branch connectivity map">
          <div className="h-56 rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.14)_0%,rgba(15,23,42,0.9)_100%)]" />
        </ChartCard>
        <ChartCard title="Active Connections" subtitle="Current sessions and flows">
          <div className="space-y-3 text-sm text-slate-300">
            {['12.8K web sessions', '8.1K secure tunnels', '4.2K API streams'].map((item) => (
              <div key={item} className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">{item}</div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ChartCard title="Device List" subtitle="Critical infrastructure inventory">
          <div className="space-y-2 text-sm text-slate-300">
            <button onClick={() => setToastOpen(true)} className="w-full rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-left">fw-edge-01</button>
            <button onClick={() => setToastOpen(true)} className="w-full rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-left">sw-core-04</button>
          </div>
        </ChartCard>
        <ChartCard title="DNS Requests" subtitle="Recent lookup volume">
          <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">82K requests in 10 min</div>
        </ChartCard>
        <ChartCard title="Protocol Distribution" subtitle="Traffic mix">
          <div className="rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/10 p-4 text-sm text-fuchsia-200">TLS 61%, DNS 17%, SSH 12%</div>
        </ChartCard>
        <ChartCard title="Traffic Timeline" subtitle="Bandwidth and throughput">
          <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">Peak at 3.4 Tbps</div>
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
