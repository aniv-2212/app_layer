import { Bug, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { KPICard } from '../components/cards/KPICard'
import { ChartCard } from '../components/cards/ChartCard'
import { Toast } from '../components/ui/Toast'
import { seedKpis } from '../mock/data'
import { useAnalyticsStore } from '../store/analyticsStore'

export function ThreatIntelligencePage() {
  const [selectedFeed, setSelectedFeed] = useState<string | null>(null)
  const [toastOpen, setToastOpen] = useState(false)
  const timeRange = useAnalyticsStore((state) => state.timeRange)
  const feeds = useMemo(() => [
    { id: 'cve', title: 'CVE-2026-4112 — Authentication bypass', badge: 'Critical' },
    { id: 'zero', title: 'CVE-2026-4028 — Zero-day in web parser', badge: 'High' },
    { id: 'priv', title: 'CVE-2026-3901 — Privilege escalation', badge: 'Medium' },
  ], [])

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
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">Critical CVEs 24</span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">{timeRange} window</span>
        </>
      }
      kpiSection={seedKpis.slice(4, 8).map((kpi) => (
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
            {['Apache Struts', 'Fortinet SSL VPN', 'Ivanti Connect Secure'].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
                <span>{item}</span>
                <span className="text-cyan-300">Hot</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ChartCard title="Zero-Day Alerts" subtitle="Immediate attention items">
          <div className="rounded-[24px] border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-200">Three unpatched edge components are under active exploitation.</div>
        </ChartCard>
        <ChartCard title="IOC Search" subtitle="Indicators of compromise">
          <div className="space-y-2 text-sm text-slate-300">
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">hash: 1f3b…</div>
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">domain: c2-bot.net</div>
          </div>
        </ChartCard>
        <ChartCard title="Malware Families" subtitle="Observed relationships">
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-center gap-2"><Bug className="h-4 w-4 text-fuchsia-300" /> LoaderX</div>
            <div className="flex items-center gap-2"><Bug className="h-4 w-4 text-cyan-300" /> Gorgon</div>
          </div>
        </ChartCard>
        <ChartCard title="MITRE ATT&CK Preview" subtitle="Technique coverage">
          <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">T1055, T1078, T1204, T1566</div>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard title="Threat News Timeline" subtitle="Recent narrative updates">
          <div className="space-y-3">
            {['08:20 UTC — New loader campaign', '09:05 UTC — Sector-specific phishing wave', '10:40 UTC — Actor shifts to cloud apps'].map((item) => (
              <div key={item} className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">{item}</div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Top Threat Actors" subtitle="Most active adversaries">
          <div className="space-y-3">
            {['APT-29', 'FIN7', 'Lazarus'].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
                <span>{item}</span>
                <TrendingUp className="h-4 w-4 text-cyan-300" />
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Risk Distribution" subtitle="Advisory severity mix">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">Critical 8</div>
          <div className="rounded-[24px] border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-200">High 15</div>
          <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">Medium 23</div>
        </div>
      </ChartCard>
      <Toast message={selectedFeed ? `Feed ${selectedFeed} queued` : 'Feed import queued'} open={toastOpen} />
    </PageShell>
  )
}
