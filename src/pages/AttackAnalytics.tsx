import { Activity, Globe2, ShieldCheck, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { PageShell } from '../components/layout/PageShell'
import { StatusCard } from '../components/cards/StatusCard'
import { ChartCard } from '../components/cards/ChartCard'
import { AttackTable } from '../components/tables/AttackTable'
import { BarChart } from '../components/charts/BarChart'
import { LineChart } from '../components/charts/LineChart'
import { PieChart } from '../components/charts/PieChart'
import { api, downloadFile } from '../services/api'
import { useAnalyticsStore } from '../store/analyticsStore'
import { useAttackStore } from '../store/attackStore'

export function AttackAnalyticsPage() {
  const [busy, setBusy] = useState<string | null>(null)
  const timeRange = useAnalyticsStore((state) => state.timeRange)
  const country = useAnalyticsStore((state) => state.country)
  const attacks = useAttackStore((state) => state.attacks)
  const attackLogs = useAttackStore((state) => state.attackLogs)
  const statistics = useAttackStore((state) => state.statistics)
  const timeline = useAttackStore((state) => state.timeline)

  const topCountries = useMemo(() => Object.entries(statistics?.top_source_countries ?? attacks.reduce<Record<string, number>>((acc, attack) => {
    const key = attack.source_country ?? 'Unknown'
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6), [attacks, statistics])

  const attackTypes = useMemo(() => Object.entries(statistics?.top_attack_types ?? attacks.reduce<Record<string, number>>((acc, attack) => {
    const key = attack.attack_type ?? 'Unknown'
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6), [attacks, statistics])

  const handleExport = async (format: 'csv' | 'json') => {
    setBusy(format)
    try {
      if (format === 'csv') {
        const csv = await api.exportCsv()
        downloadFile('cyberai-attacks.csv', csv, 'text/csv')
      } else {
        const payload = await api.exportJson()
        downloadFile('cyberai-attacks.json', JSON.stringify(payload, null, 2), 'application/json')
      }
      toast.success(`Exported as ${format.toUpperCase()}`)
    } catch {
      toast.error('Export failed')
    } finally {
      setBusy(null)
    }
  }

  const timelineValues = useMemo(() => {
    const buckets = timeline.length ? timeline.slice(-16) : attacks.slice(0, 16).reverse().map((attack) => ({ label: new Date(attack.timestamp).toLocaleTimeString(), count: attack.request_count ?? attack.risk_score ?? 1 }))
    return {
      labels: buckets.map((bucket: any) => bucket.label ?? bucket.time ?? bucket.timestamp ?? ''),
      values: buckets.map((bucket: any) => bucket.count ?? bucket.attacks ?? 0),
    }
  }, [attacks, timeline])

  return (
    <PageShell
      title="Attack Analytics"
      subtitle="Historical attack trends, regional patterns, and performance analysis for the SOC team."
      actions={
        <button onClick={() => handleExport('csv')} disabled={busy === 'csv'} className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {busy === 'csv' ? 'Exporting…' : 'Export Analytics'}
        </button>
      }
      filters={
        <>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">{timeRange} period</span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">{country}</span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">All vectors</span>
        </>
      }
      kpiSection={[
        <StatusCard key="growth" title="Attack Growth" value="+17.2%" detail="Week over week" icon={TrendingUp} accent="from-cyan-500 to-sky-600" />,
        <StatusCard key="blocked" title="Blocked Requests" value="98.3%" detail="Average mitigation rate" icon={ShieldCheck} accent="from-fuchsia-500 to-violet-600" />,
        <StatusCard key="hours" title="Peak Hours" value="14:00" detail="Highest attack volume" icon={Activity} accent="from-amber-400 to-orange-600" />,
        <StatusCard key="endpoints" title="Top Endpoints" value="24" detail="Compromised targets" icon={Globe2} accent="from-emerald-500 to-teal-600" />,
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="Attack Growth" subtitle="Volume trend over the selected period">
          <LineChart data={timelineValues} height={240} />
        </ChartCard>
        <ChartCard title="Attack Timeline" subtitle="Concentrated bursts across the day">
          <BarChart data={timelineValues} height={240} />
        </ChartCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ChartCard title="Country Analytics" subtitle="High-risk geographies">
          <div className="space-y-2 text-sm text-slate-300">
            {topCountries.map(([name, value]) => (
              <button key={name} onClick={() => toast.success(`Country: ${name} — ${value.toLocaleString()} attacks`)} className="flex w-full justify-between rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-left">
                <span>{name}</span><span className="text-cyan-300">{value.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Attack Success Rate" subtitle="Observed breach attempts">
          <PieChart data={[{ name: 'Blocked', value: attackLogs.filter((row) => row.status === 'Blocked' || row.status === 'Mitigated').length }, { name: 'Observed', value: attackLogs.filter((row) => row.status !== 'Blocked' && row.status !== 'Mitigated').length }]} height={220} />
        </ChartCard>
        <ChartCard title="Top Endpoints" subtitle="Most targeted resources">
          <div className="space-y-2 text-sm text-slate-300">
            {Array.from(new Set(attackLogs.map((row) => row.endpoint))).slice(0, 4).map((endpoint) => (
              <div key={endpoint} className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">{endpoint}</div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Attack Categories" subtitle="Signals grouped by behavior">
          <PieChart data={attackTypes.map(([name, value]) => ({ name, value }))} height={220} />
        </ChartCard>
      </div>

      <ChartCard title="Recent Attack Rows" subtitle="Timestamp, source, destination, severity, and status">
        <AttackTable data={attacks.length ? attacks.slice(0, 12) : attackLogs.slice(0, 12)} />
      </ChartCard>

      <ChartCard title="Export Analytics" subtitle="Download summaries for reporting and investigations">
        <div className="flex flex-wrap gap-3">
          <button onClick={() => { toast.success('Opening print dialog'); window.print() }} className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">PDF report</button>
          <button onClick={() => handleExport('csv')} disabled={busy === 'csv'} className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-2 text-sm text-fuchsia-200 disabled:opacity-60">{busy === 'csv' ? 'Exporting…' : 'CSV export'}</button>
          <button onClick={() => handleExport('json')} disabled={busy === 'json'} className="rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-300 disabled:opacity-60">{busy === 'json' ? 'Exporting…' : 'Share snapshot'}</button>
        </div>
      </ChartCard>
    </PageShell>
  )
}
