import { Activity, AlertTriangle, Filter, MapPinned, Radar, ShieldAlert, TimerReset, TrendingUp } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { ChartCard } from '../components/cards/ChartCard'
import { StatusCard } from '../components/cards/StatusCard'

export function LiveThreatMapPage() {
  return (
    <PageShell
      title="Live Threat Map"
      subtitle="Global telemetry and live attack patterns rendered as a premium, interactive map surface."
      actions={
        <button className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white">
          Replay Attack Stream
        </button>
      }
      filters={
        <>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">Realtime</span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">Last 60 min</span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">All vectors</span>
        </>
      }
      kpiSection={[
        <StatusCard key="vol" title="Attack Volume" value="3.6K" detail="Live events per minute" icon={Activity} accent="from-cyan-500 to-sky-600" />,
        <StatusCard key="regions" title="Affected Regions" value="34" detail="Active countries" icon={MapPinned} accent="from-fuchsia-500 to-violet-600" />,
        <StatusCard key="latency" title="Threat Feed Latency" value="82ms" detail="Low-latency ingestion" icon={TimerReset} accent="from-amber-400 to-orange-600" />,
        <StatusCard key="risk" title="Risk Surface" value="94/100" detail="Elevated exposure" icon={ShieldAlert} accent="from-emerald-500 to-teal-600" />,
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <ChartCard title="Global Attack Surface" subtitle="Interactive map view with layered threat intelligence">
          <div className="relative min-h-[480px] overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_35%),linear-gradient(135deg,_rgba(15,23,42,0.95)_0%,_rgba(2,6,23,0.95)_100%)] p-4">
            <div className="absolute left-4 top-4 rounded-full border border-cyan-400/20 bg-slate-900/70 px-3 py-2 text-xs text-cyan-200">
              <div className="flex items-center gap-2"><Filter className="h-3.5 w-3.5" /> Floating filter panel</div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-3">
              {['Credential stuffing', 'DDoS pulse', 'Botnet sweep'].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-300">{item}</span>
              ))}
            </div>
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />
            <div className="absolute left-[25%] top-[20%] h-24 w-24 rounded-full border border-cyan-400/30 bg-cyan-500/10" />
            <div className="absolute right-[18%] top-[34%] h-16 w-16 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10" />
          </div>
        </ChartCard>

        <div className="space-y-6">
          <ChartCard title="Timeline" subtitle="Event burst sequence">
            <div className="space-y-3">
              {['09:10 UTC — East Asia spike', '09:22 UTC — API flood', '09:41 UTC — Credential sweep'].map((item) => (
                <div key={item} className="rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">{item}</div>
              ))}
            </div>
          </ChartCard>
          <ChartCard title="Live Attack Feed" subtitle="Most recent detections">
            <div className="space-y-3">
              {['SQLi hits on Europe edge', 'Beaconing in APAC', 'RCE attempts from US'].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
                  <span>{item}</span>
                  <AlertTriangle className="h-4 w-4 text-amber-300" />
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ChartCard title="Attack Statistics" subtitle="Sanitized signal composition">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex justify-between"><span>Volume</span><span className="text-white">3.6K/min</span></div>
            <div className="flex justify-between"><span>Mitigated</span><span className="text-white">92%</span></div>
            <div className="flex justify-between"><span>New countries</span><span className="text-white">7</span></div>
          </div>
        </ChartCard>
        <ChartCard title="Heatmap Legend" subtitle="Threat intensity scale">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <div className="h-3 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
            <span>Low → High intensity</span>
          </div>
        </ChartCard>
        <ChartCard title="Replay Controls" subtitle="Investigate event progression">
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-300">◀</button>
            <button className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-300">▶</button>
            <button className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-300">⏹</button>
          </div>
        </ChartCard>
        <ChartCard title="Threat Trend" subtitle="Escalations this hour">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <TrendingUp className="h-4 w-4 text-cyan-300" />
            <span>+18.4% over the prior 15 min</span>
          </div>
        </ChartCard>
      </div>
    </PageShell>
  )
}
