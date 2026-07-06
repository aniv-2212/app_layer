import { Activity, Brain, CircleDashed, Cpu, ShieldCheck, Sparkles, Waves } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { KPICard } from '../components/cards/KPICard'
import { StatusCard } from '../components/cards/StatusCard'
import { AlertCard } from '../components/cards/AlertCard'
import { ChartCard } from '../components/cards/ChartCard'
import { MiniThreatMap } from '../components/maps/MiniThreatMap'
import { Toast } from '../components/ui/Toast'
import { api } from '../services/api'
import { useAnalyticsStore } from '../store/analyticsStore'
import { useDashboardStore } from '../store/dashboardStore'

export function DashboardPage() {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null)
  const [toast, setToast] = useState(false)
  const timeRange = useAnalyticsStore((state) => state.timeRange)
  const kpis = useDashboardStore((state) => state.kpis)
  const alerts = useDashboardStore((state) => state.alerts)
  const activities = useDashboardStore((state) => state.activities)
  const statistics = useDashboardStore((state) => state.statistics)
  const stream = useDashboardStore((state) => state.stream)
  const hydrate = useDashboardStore((state) => state.hydrate)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  const visibleKpis = useMemo(() => kpis.slice(0, 4), [kpis])
  const summary = statistics?.summary
  const detected = summary?.total_attacks ?? 0
  const blocked = statistics ? Math.round((statistics.mitigated_percentage / 100) * detected) : 0
  const escalated = summary?.critical ?? 0
  const topFunnel = useMemo(
    () => Object.entries(statistics?.top_attack_types ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 3),
    [statistics],
  )

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await api.streamSnapshot()
      await hydrate()
    } catch (error) {
      console.warn('Refresh failed', error)
    } finally {
      setRefreshing(false)
      setToast(true)
      window.setTimeout(() => setToast(false), 1600)
    }
  }

  return (
    <>
      <PageShell
        title="Dashboard"
        subtitle="SOC overview with real-time telemetry, risk posture, and response readiness."
        actions={
          <button onClick={handleRefresh} className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white">
            {refreshing ? 'Refreshing…' : 'Run AI Triage'}
          </button>
        }
        filters={
          <>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">Critical {summary?.critical ?? 0}</span>
            <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">{timeRange} window</span>
            <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">All regions</span>
          </>
        }
        kpiSection={visibleKpis.map((kpi) => (
          <KPICard key={kpi.id} item={kpi} />
        ))}
      >
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <ChartCard title="Threat Summary" subtitle="Attack signal concentration across the last 24 hours">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-4">
              <p className="text-sm text-cyan-300">Detected</p>
              <p className="mt-2 text-3xl font-semibold text-white">{detected.toLocaleString()}</p>
            </div>
            <div className="rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/10 p-4">
              <p className="text-sm text-fuchsia-300">Blocked</p>
              <p className="mt-2 text-3xl font-semibold text-white">{blocked.toLocaleString()}</p>
            </div>
            <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 p-4">
              <p className="text-sm text-emerald-300">Escalated</p>
              <p className="mt-2 text-3xl font-semibold text-white">{escalated.toLocaleString()}</p>
            </div>
          </div>
        </ChartCard>
        <ChartCard title="Global Presence" subtitle="Live threats worldwide">
          <div className="h-40">
            <MiniThreatMap />
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="Recent Alerts" subtitle="Prioritized incidents from the SOC queue">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <button key={alert.id} onClick={() => setSelectedAlert(alert.id)} className="w-full text-left">
                <AlertCard title={alert.title} detail={alert.detail} time={alert.time} severity={alert.severity as 'Critical' | 'High' | 'Medium' | 'Low'} />
              </button>
            ))}
          </div>
          <AnimatePresence>
            {selectedAlert ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mt-4 rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">
                <p className="font-medium">Selected alert detail</p>
                <p className="mt-1 text-cyan-100">{alerts.find((item) => item.id === selectedAlert)?.detail}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </ChartCard>

        <div className="space-y-6">
          <ChartCard title="AI Summary" subtitle="Recommended next actions from the co-pilot">
            <div className="space-y-3">
              <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-4">
                <div className="mb-2 flex items-center gap-2 text-cyan-300">
                  <Brain className="h-4 w-4" />
                  <span className="text-sm font-medium">Risk Forecast</span>
                </div>
                <p className="text-sm text-slate-400">Elevated brute-force pressure is expected over the next two hours.</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-4">
                <div className="mb-2 flex items-center gap-2 text-fuchsia-300">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">Automation Suggestion</span>
                </div>
                <p className="text-sm text-slate-400">Auto-apply mitigation rules to the top three abused endpoints.</p>
              </div>
            </div>
          </ChartCard>
          <ChartCard title="Quick Actions" subtitle="Operational controls for the watch floor">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Isolate suspicious host', 'border-cyan-400/20 bg-cyan-500/10 text-cyan-200'],
                ['Open incident playbook', 'border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-200'],
                ['Run forensic snapshot', 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200'],
                ['Generate report', 'border-white/10 bg-slate-900/70 text-slate-300'],
              ].map(([label, className]) => (
                <button key={label} onClick={() => setToast(true)} className={`rounded-[20px] border p-3 text-left text-sm ${className}`}>
                  {label}
                </button>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard title="Recent Activity" subtitle="Latest analyst interactions and detections">
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" /> {activity.title}</span>
                <span className="text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Live Status Panel" subtitle="Telemetry pulse from the SOC stack">
          <div className="space-y-3">
            {[
              ['Attack Stream', stream?.running ? 'Streaming' : 'Paused', `${stream?.stored_attacks ?? 0}/${stream?.buffer_size ?? 500} events buffered`],
              ['Session Volume', 'Live', `${stream?.session_total ?? 0} attacks this session`],
              ['Socket Clients', stream ? 'Connected' : 'Offline', `${stream?.connected_clients ?? 0} dashboards attached`],
            ].map(([label, status, detail]) => (
              <div key={label} className="flex items-center justify-between rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-white">{label}</p>
                  <p className="text-slate-500">{detail}</p>
                </div>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-emerald-300">{status}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ChartCard title="Attack Funnel" subtitle="Most active pathways this hour">
          <div className="space-y-3">
            {(topFunnel.length ? topFunnel : [['Awaiting stream…', 0] as [string, number]]).map(([name, count]) => (
              <div key={name} className="flex items-center justify-between rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
                <span>{name}</span>
                <span className="text-cyan-300">{count || 'High'}</span>
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Network Pulse" subtitle="Traffic pattern summary">
          <div className="flex items-center justify-between rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-4">
            <div>
              <p className="text-sm text-cyan-300">Peak Throughput</p>
              <p className="mt-1 text-3xl font-semibold text-white">1.84 Tbps</p>
            </div>
            <Waves className="h-8 w-8 text-cyan-200" />
          </div>
        </ChartCard>
        <ChartCard title="Analyst Load" subtitle="Coverage across active queues">
          <div className="flex items-center justify-between rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/10 p-4">
            <div>
              <p className="text-sm text-fuchsia-300">Queue Depth</p>
              <p className="mt-1 text-3xl font-semibold text-white">68</p>
            </div>
            <CircleDashed className="h-8 w-8 text-fuchsia-200" />
          </div>
        </ChartCard>
      </div>
      </PageShell>
      <Toast message="Dashboard refreshed" open={toast} />
    </>
  )
}
