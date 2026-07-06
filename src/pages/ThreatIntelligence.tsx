import { Bug, TrendingUp } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { KPICard } from '../components/cards/KPICard'
import { ChartCard } from '../components/cards/ChartCard'
import { BarChart } from '../components/charts/BarChart'
import { Toast } from '../components/ui/Toast'
import { ThreatHeatmap } from '../components/maps/ThreatHeatmap'
import { useAnalyticsStore } from '../store/analyticsStore'
import { useAttackStore } from '../store/attackStore'
import { useDashboardStore } from '../store/dashboardStore'
import { useCisaKev, useHibpBreaches, useOtxPulses, useStatisticsSummary } from '../hooks/useIntel'
import { UrlScanner } from '../components/ui/UrlScanner'

export function ThreatIntelligencePage() {
  const [selectedFeed, setSelectedFeed] = useState<string | null>(null)
  const [toastOpen, setToastOpen] = useState(false)
  const timeRange = useAnalyticsStore((state) => state.timeRange)
  const kpis = useDashboardStore((state) => state.kpis)
  const hydrate = useDashboardStore((state) => state.hydrate)
  const heatmap = useAttackStore((state) => state.heatmap)
  const attacks = useAttackStore((state) => state.attacks)
  const { data: kev } = useCisaKev(10)
  const { data: breaches } = useHibpBreaches(5)
  const { data: pulses } = useOtxPulses(5)
  const { data: severitySummary } = useStatisticsSummary()

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  const feeds = useMemo(
    () =>
      (kev?.vulnerabilities ?? []).slice(0, 3).map((vuln) => ({
        id: vuln.cve_id,
        title: `${vuln.cve_id} — ${vuln.name}`,
        badge: vuln.known_ransomware === 'Known' ? 'Critical' : 'High',
      })),
    [kev],
  )
  const trendingVendors = useMemo(() => {
    const counts = new Map<string, number>()
    ;(kev?.vulnerabilities ?? []).forEach((vuln) => {
      const label = `${vuln.vendor} ${vuln.product}`.trim()
      counts.set(label, (counts.get(label) ?? 0) + 1)
    })
    return Array.from(counts.keys()).slice(0, 3)
  }, [kev])
  const newsTimeline = useMemo(() => {
    if (pulses?.pulses?.length) {
      return pulses.pulses.slice(0, 3).map((pulse) => `${pulse.created?.slice(0, 10)} — ${pulse.name}`)
    }
    return (breaches?.breaches ?? []).slice(0, 3).map(
      (breach) => `${breach.breach_date} — ${breach.title} breach (${(breach.pwn_count ?? 0).toLocaleString()} accounts)`,
    )
  }, [pulses, breaches])
  const topActors = useMemo(
    () => Object.entries(heatmap.data ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name]) => name),
    [heatmap],
  )

  return (
    <PageShell
      title="Threat Intelligence"
      subtitle="A premium threat feed center for CVEs, malware families, actor tracking, and hunt-ready context."
      actions={
        <button className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white">
          Import Feed
        </button>
      }
      filters={
        <>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">Known-exploited CVEs {kev?.total ?? '—'}</span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">{timeRange} window</span>
        </>
      }
      kpiSection={kpis.slice(4, 8).map((kpi) => (
        <KPICard key={kpi.id} item={kpi} />
      ))}
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="Latest CVEs" subtitle="Most relevant advisories"> 
          <div className="space-y-3">
            {feeds.map((item) => (
              <button key={item.id} onClick={() => {
                setSelectedFeed(item.id)
                setToastOpen(true)
              }} className="w-full rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-left text-sm text-slate-300">
                <div className="flex items-center justify-between gap-3">
                  <span>{item.title}</span>
                  <span className="text-cyan-300">{item.badge}</span>
                </div>
              </button>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Trending Vulnerabilities" subtitle="Highest actor interest">
          <div className="space-y-3">
            {(trendingVendors.length ? trendingVendors : ['Loading CISA KEV…']).map((item) => (
              <div key={item} className="flex items-center justify-between rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
                <span>{item}</span>
                <span className="text-cyan-300">Hot</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 mb-6">
        <ChartCard title="AI URL Scanner" subtitle="Analyze links for potential threats using our intelligence engine">
          <UrlScanner />
        </ChartCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ChartCard title="Zero-Day Alerts" subtitle="Immediate attention items">
          <div className="rounded-[24px] border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-200">
            {kev?.vulnerabilities?.[0]
              ? `${kev.vulnerabilities[0].cve_id} (${kev.vulnerabilities[0].vendor}) added to CISA KEV on ${kev.vulnerabilities[0].date_added} — remediation due ${kev.vulnerabilities[0].due_date}.`
              : 'Loading CISA known-exploited vulnerabilities…'}
          </div>
        </ChartCard>
        <ChartCard title="IOC Search" subtitle="Indicators of compromise">
          <div className="space-y-2 text-sm text-slate-300">
            {attacks.slice(0, 2).map((attack) => (
              <div key={attack.id} className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">ip: {attack.source_ip}</div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Malware Families" subtitle="Observed relationships">
          <div className="space-y-2 text-sm text-slate-300">
            {(pulses?.pulses?.flatMap((pulse) => pulse.malware_families).slice(0, 2) ?? ['SQL Injection', 'Bot Attack']).map((family, index) => (
              <div key={family} className="flex items-center gap-2"><Bug className={`h-4 w-4 ${index % 2 ? 'text-cyan-300' : 'text-fuchsia-300'}`} /> {family}</div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="MITRE ATT&CK Preview" subtitle="Technique coverage">
          <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">T1055, T1078, T1204, T1566</div>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard title="Threat News Timeline" subtitle="Recent narrative updates">
          <div className="space-y-3">
            {(newsTimeline.length ? newsTimeline : ['Loading threat feeds…']).map((item) => (
              <div key={item} className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">{item}</div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Top Threat Actors" subtitle="Most active adversaries">
          <div className="space-y-3">
            {(topActors.length ? topActors : ['Awaiting stream…']).map((item) => (
              <div key={item} className="flex items-center justify-between rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
                <span>{item}</span>
                <TrendingUp className="h-4 w-4 text-cyan-300" />
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Risk Distribution" subtitle="Advisory severity mix">
          <BarChart
            height={200}
            data={[
              { value: severitySummary?.critical ?? 0, name: 'Critical', itemStyle: { color: '#ef4444' } },
              { value: severitySummary?.high ?? 0, name: 'High', itemStyle: { color: '#f59e0b' } },
              { value: severitySummary?.medium ?? 0, name: 'Medium', itemStyle: { color: '#10b981' } }
            ]}
          />
        </ChartCard>
        <ChartCard title="Threat Heatmap" subtitle="Active malware clusters">
          <div className="h-64"><ThreatHeatmap /></div>
        </ChartCard>
      </div>
      <Toast message={selectedFeed ? `Feed ${selectedFeed} queued` : 'Feed import queued'} open={toastOpen} />
    </PageShell>
  )
}
