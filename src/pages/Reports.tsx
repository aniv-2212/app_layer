import { BarChart3, FileText, FileUp, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { StatusCard } from '../components/cards/StatusCard'
import { ChartCard } from '../components/cards/ChartCard'
import { Toast } from '../components/ui/Toast'

export function ReportsPage() {
  const [generating, setGenerating] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    setToastOpen(true)
    window.setTimeout(() => setGenerating(false), 1000)
  }

  return (
    <PageShell
      title="Reports"
      subtitle="Executive summaries, scheduled reports, and export-ready SOC reporting."
      actions={
        <button onClick={handleGenerate} className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white">
          {generating ? 'Generating…' : 'Generate Report'}
        </button>
      }
      filters={
        <>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">Weekly digest</span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">Executive</span>
        </>
      }
      kpiSection={[
        <StatusCard key="cards" title="Report Cards" value="12" detail="Templates ready" icon={FileText} accent="from-cyan-500 to-sky-600" />,
        <StatusCard key="scheduled" title="Scheduled Reports" value="6" detail="Automated runs" icon={Sparkles} accent="from-fuchsia-500 to-violet-600" />,
        <StatusCard key="pdf" title="PDF Export" value="98%" detail="Ready to share" icon={FileUp} accent="from-amber-400 to-orange-600" />,
        <StatusCard key="csv" title="CSV Export" value="100%" detail="Structured data" icon={BarChart3} accent="from-emerald-500 to-teal-600" />,
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="Report Cards" subtitle="Core report packages">
          <div className="space-y-3 text-sm text-slate-300">
            {['Security posture summary', 'Threat intelligence digest', 'Executive incident overview'].map((item) => (
              <button key={item} onClick={() => setToastOpen(true)} className="w-full rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-left">{item}</button>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Generate Report" subtitle="Create a new export package">
          <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">One-click report generation with curated analytics and charts.</div>
        </ChartCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ChartCard title="Scheduled Reports" subtitle="Recurring automations">
          <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300">Daily, weekly, monthly cadence</div>
        </ChartCard>
        <ChartCard title="PDF Export" subtitle="Board-ready documents">
          <div className="rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/10 p-4 text-sm text-fuchsia-200">Last export 10 mins ago</div>
        </ChartCard>
        <ChartCard title="CSV Export" subtitle="Machine-readable analytics">
          <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">Ready for BI workflows</div>
        </ChartCard>
        <ChartCard title="Executive Summary" subtitle="Narrative highlights">
          <div className="rounded-[24px] border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-200">Threat posture remains elevated</div>
        </ChartCard>
      </div>

      <ChartCard title="Historical Reports" subtitle="Previously generated packages">
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setToastOpen(true)} className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">2026-06-30</button>
          <button onClick={() => setToastOpen(true)} className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-2 text-sm text-fuchsia-200">2026-06-23</button>
          <button onClick={() => setToastOpen(true)} className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">2026-06-14</button>
        </div>
      </ChartCard>
      <Toast message={generating ? 'Report generation in progress' : 'Report generated'} open={toastOpen} />
    </PageShell>
  )
}
