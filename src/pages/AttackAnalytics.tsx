import { Activity, BarChart3, Globe2, ShieldCheck, TrendingUp } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { StatusCard } from '../components/cards/StatusCard'
import { ChartCard } from '../components/cards/ChartCard'

export function AttackAnalyticsPage() {
  return (
    <PageShell
      title="Attack Analytics"
      subtitle="Historical attack trends, regional patterns, and performance analysis for the SOC team."
      actions={
        <button className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white">
          Export Analytics
        </button>
      }
      filters={
        <>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">30d period</span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">All regions</span>
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
          <div className="h-48 rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.15)_0%,rgba(15,23,42,0.92)_100%)] p-4" />
        </ChartCard>
        <ChartCard title="Attack Timeline" subtitle="Concentrated bursts across the day">
          <div className="space-y-3 text-sm text-slate-300">
            {['04:12 UTC — 1.3K requests', '08:41 UTC — 2.8K requests', '15:26 UTC — 4.1K requests'].map((item) => (
              <div key={item} className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">{item}</div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ChartCard title="Country Analytics" subtitle="High-risk geographies">
          <div className="space-y-2 text-sm text-slate-300">
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">US — 14.8K</div>
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">DE — 9.2K</div>
          </div>
        </ChartCard>
        <ChartCard title="Attack Success Rate" subtitle="Observed breach attempts">
          <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">Success rate: 2.1%</div>
        </ChartCard>
        <ChartCard title="Top Endpoints" subtitle="Most targeted resources">
          <div className="space-y-2 text-sm text-slate-300">
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">/login</div>
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">/api/token</div>
          </div>
        </ChartCard>
        <ChartCard title="Attack Categories" subtitle="Signals grouped by behavior">
          <div className="rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/10 p-4 text-sm text-fuchsia-200">SQLi, XSS, RCE, credential abuse</div>
        </ChartCard>
      </div>

      <ChartCard title="Export Analytics" subtitle="Download summaries for reporting and investigations">
        <div className="flex flex-wrap gap-3">
          <button className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">PDF report</button>
          <button className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-2 text-sm text-fuchsia-200">CSV export</button>
          <button className="rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-300">Share snapshot</button>
        </div>
      </ChartCard>
    </PageShell>
  )
}
