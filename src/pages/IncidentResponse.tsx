import { ClipboardList, Clock3, ShieldCheck, Users } from 'lucide-react'
import { useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { StatusCard } from '../components/cards/StatusCard'
import { ChartCard } from '../components/cards/ChartCard'
import { Toast } from '../components/ui/Toast'

export function IncidentResponsePage() {
  const [creating, setCreating] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)

  const handleCreate = () => {
    setCreating(true)
    setToastOpen(true)
    window.setTimeout(() => setCreating(false), 1000)
  }

  return (
    <PageShell
      title="Incident Response"
      subtitle="SOC case management, analyst assignments, evidence review, and recovery progress."
      actions={
        <button onClick={handleCreate} className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white">
          {creating ? 'Creating…' : 'New Incident'}
        </button>
      }
      filters={
        <>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">Priority P1</span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">Open cases</span>
        </>
      }
      kpiSection={[
        <StatusCard key="queue" title="Incident Queue" value="24" detail="Active investigations" icon={ClipboardList} accent="from-cyan-500 to-sky-600" />,
        <StatusCard key="analysts" title="Assigned Analysts" value="8" detail="On watch" icon={Users} accent="from-fuchsia-500 to-violet-600" />,
        <StatusCard key="status" title="Status Cards" value="82%" detail="Containment complete" icon={ShieldCheck} accent="from-amber-400 to-orange-600" />,
        <StatusCard key="timeline" title="Resolution Progress" value="67%" detail="Mean time to resolve" icon={Clock3} accent="from-emerald-500 to-teal-600" />,
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard title="Incident Queue" subtitle="Priority-ranked cases">
          <div className="space-y-3 text-sm text-slate-300">
            {['IR-204 — Credential abuse', 'IR-208 — Lateral movement', 'IR-211 — Suspicious admin login'].map((item) => (
              <button key={item} onClick={() => setToastOpen(true)} className="w-full rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-left">{item}</button>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Incident Timeline" subtitle="Stage progression">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">Triage complete</div>
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">Containment in progress</div>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ChartCard title="Assigned Analysts" subtitle="Response owners">
          <div className="space-y-2 text-sm text-slate-300">
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">A. Patel</div>
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">N. Chen</div>
          </div>
        </ChartCard>
        <ChartCard title="Evidence Panel" subtitle="Artifacts ready for review">
          <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">3 logs, 2 screenshots, 1 memory image</div>
        </ChartCard>
        <ChartCard title="Investigation Notes" subtitle="Analyst commentary">
          <div className="rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/10 p-4 text-sm text-fuchsia-200">Containment rule triggered on suspicious auth tokens</div>
        </ChartCard>
        <ChartCard title="Priority Matrix" subtitle="Impact vs urgency">
          <div className="rounded-[24px] border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-200">P1 / high impact</div>
        </ChartCard>
      </div>

      <ChartCard title="Response Statistics" subtitle="Operational readiness and workload">
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setToastOpen(true)} className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">MTTR 34m</button>
          <button onClick={() => setToastOpen(true)} className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-2 text-sm text-fuchsia-200">Escalations 7</button>
          <button onClick={() => setToastOpen(true)} className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">Playbooks 12</button>
        </div>
      </ChartCard>
      <Toast message={creating ? 'Incident drafting in progress' : 'Incident created'} open={toastOpen} />
    </PageShell>
  )
}
