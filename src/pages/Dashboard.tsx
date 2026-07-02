import { Activity, AlertTriangle, Brain, Bot, CircleDashed, Cpu, ShieldCheck, Sparkles, TrendingUp, Waves } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { KPICard } from '../components/cards/KPICard'
import { StatusCard } from '../components/cards/StatusCard'
import { AlertCard } from '../components/cards/AlertCard'
import { ChartCard } from '../components/cards/ChartCard'
import { seedKpis } from '../mock/data'

export function DashboardPage() {
  return (
    <PageShell
      title="Dashboard"
      subtitle="SOC overview with real-time telemetry, risk posture, and response readiness."
      actions={
        <button className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white">
          Run AI Triage
        </button>
      }
      filters={
        <>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">Critical 12</span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">24h window</span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">All regions</span>
        </>
      }
      kpiSection={seedKpis.slice(0, 4).map((kpi) => (
        <KPICard key={kpi.id} item={kpi} />
      ))}
    >
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <ChartCard title="Threat Summary" subtitle="Attack signal concentration across the last 24 hours">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-4">
              <p className="text-sm text-cyan-300">Detected</p>
              <p className="mt-2 text-3xl font-semibold text-white">4.2K</p>
            </div>
            <div className="rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/10 p-4">
              <p className="text-sm text-fuchsia-300">Blocked</p>
              <p className="mt-2 text-3xl font-semibold text-white">3.8K</p>
            </div>
            <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 p-4">
              <p className="text-sm text-emerald-300">Escalated</p>
              <p className="mt-2 text-3xl font-semibold text-white">126</p>
            </div>
          </div>
        </ChartCard>
        <ChartCard title="System Health" subtitle="Platform availability and workload balance">
          <div className="space-y-3">
            <StatusCard title="Edge Nodes" value="97.2%" detail="Healthy and synced" icon={Cpu} accent="from-cyan-500 to-sky-600" />
            <StatusCard title="Detection Latency" value="184ms" detail="Within SLA threshold" icon={Activity} accent="from-fuchsia-500 to-violet-600" />
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="Recent Alerts" subtitle="Prioritized incidents from the SOC queue">
          <div className="space-y-3">
            <AlertCard title="Credential stuffing surge" detail="Global login abuse from distributed IP clusters" time="2m ago" severity="Critical" />
            <AlertCard title="Suspicious lateral movement" detail="Beaconing detected across East Asia fabric" time="11m ago" severity="High" />
            <AlertCard title="Unusual API burst" detail="Large spike in payment endpoint access" time="24m ago" severity="Medium" />
          </div>
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
              <button className="rounded-[20px] border border-cyan-400/20 bg-cyan-500/10 p-3 text-left text-sm text-cyan-200">Isolate suspicious host</button>
              <button className="rounded-[20px] border border-fuchsia-400/20 bg-fuchsia-500/10 p-3 text-left text-sm text-fuchsia-200">Open incident playbook</button>
              <button className="rounded-[20px] border border-emerald-400/20 bg-emerald-500/10 p-3 text-left text-sm text-emerald-200">Run forensic snapshot</button>
              <button className="rounded-[20px] border border-white/10 bg-slate-900/70 p-3 text-left text-sm text-slate-300">Generate report</button>
            </div>
          </ChartCard>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard title="Recent Activity" subtitle="Latest analyst interactions and detections">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Rule updated</span>
              <span className="text-slate-500">08:21 UTC</span>
            </div>
            <div className="flex items-center justify-between rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
              <span className="flex items-center gap-2"><Bot className="h-4 w-4 text-cyan-300" /> AI model retrained</span>
              <span className="text-slate-500">07:48 UTC</span>
            </div>
            <div className="flex items-center justify-between rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
              <span className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-fuchsia-300" /> Threat score elevated</span>
              <span className="text-slate-500">06:14 UTC</span>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Live Status Panel" subtitle="Telemetry pulse from the SOC stack">
          <div className="space-y-3">
            {[
              ['Detection Engines', 'Operational', '12/12 healthy'],
              ['Threat Feed', 'Syncing', 'Updated 2m ago'],
              ['Case Routing', 'Ready', '99.6% SLA'],
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
            {['Web login abuse', 'API token probing', 'Malware beaconing'].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
                <span>{item}</span>
                <span className="text-cyan-300">High</span>
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
  )
}
