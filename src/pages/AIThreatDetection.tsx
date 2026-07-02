import { Brain, Cpu, Radar, Sparkles } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { StatusCard } from '../components/cards/StatusCard'
import { ChartCard } from '../components/cards/ChartCard'

export function AIThreatDetectionPage() {
  return (
    <PageShell
      title="AI Threat Detection"
      subtitle="Machine-learning insights, anomaly forecasting, and behavior-based triage."
      actions={
        <button className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white">
          Retrain Models
        </button>
      }
      filters={
        <>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">Confidence 92%</span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">Behavioral signals</span>
        </>
      }
      kpiSection={[
        <StatusCard key="score" title="AI Risk Score" value="92/100" detail="High confidence" icon={Brain} accent="from-cyan-500 to-sky-600" />,
        <StatusCard key="prediction" title="Threat Prediction" value="+24%" detail="Next 2 hrs" icon={Radar} accent="from-fuchsia-500 to-violet-600" />,
        <StatusCard key="confidence" title="Confidence Meter" value="96%" detail="Model certainty" icon={Cpu} accent="from-amber-400 to-orange-600" />,
        <StatusCard key="recommend" title="Recommendations" value="7" detail="Actionable insights" icon={Sparkles} accent="from-emerald-500 to-teal-600" />,
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard title="Threat Prediction" subtitle="Probability of high severity activity">
          <div className="h-48 rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.12)_0%,rgba(15,23,42,0.9)_100%)]" />
        </ChartCard>
        <ChartCard title="Confidence Meter" subtitle="Signal confidence by channel">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">Endpoint telemetry — 96%</div>
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">Identity behaviour — 92%</div>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ChartCard title="AI Recommendation Panel" subtitle="Suggested playbooks">
          <div className="space-y-2 text-sm text-slate-300">
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">Disable suspect token</div>
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3">Isolate compromised profile</div>
          </div>
        </ChartCard>
        <ChartCard title="Suspicious Users" subtitle="High-risk actor clusters">
          <div className="rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/10 p-4 text-sm text-fuchsia-200">8 users with anomalous access patterns</div>
        </ChartCard>
        <ChartCard title="Anomaly Timeline" subtitle="Behavior shifts over time">
          <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">Earlier than baseline by 18 mins</div>
        </ChartCard>
        <ChartCard title="Feature Importance Chart" subtitle="Top driver factors">
          <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">Geo velocity, token reuse, 3rd party beacon</div>
        </ChartCard>
      </div>

      <ChartCard title="Behavior Analysis" subtitle="Observed activity clusters">
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">Credential abuse</span>
          <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-2 text-sm text-fuchsia-200">Impossible travel</span>
          <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">New device</span>
        </div>
      </ChartCard>
    </PageShell>
  )
}
