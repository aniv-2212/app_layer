import { Activity, AlertTriangle, Filter, MapPinned, ShieldAlert, TimerReset, TrendingUp } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { ChartCard } from '../components/cards/ChartCard'
import { StatusCard } from '../components/cards/StatusCard'
import attacksData from '../mock/attacks.json'
import { useAnalyticsStore } from '../store/analyticsStore'
import { useThreatStore } from '../store/threatStore'
import { useMapStore } from '../store/mapStore'

export function LiveThreatMapPage() {
  const [playing, setPlaying] = useState(true)
  const [activeAttack, setActiveAttack] = useState(attacksData.items[0])
  const timeRange = useAnalyticsStore((state) => state.timeRange)
  const country = useAnalyticsStore((state) => state.country)
  const setSelectedCountry = useMapStore((state) => state.setSelectedCountry)
  const setDrawerOpen = useMapStore((state) => state.setDrawerOpen)
  const setHoveredAttack = useMapStore((state) => state.setHoveredAttack)
  const threatItems = useThreatStore((state) => state.threatItems)

  const visibleAttacks = useMemo(() => {
    return threatItems.filter((item) => (country === 'All' ? true : item.country === 'United States' ? country === 'US' : item.country === 'Germany' ? country === 'DE' : item.country === 'Singapore' ? country === 'SG' : item.country === 'Brazil' ? country === 'BR' : item.country === 'United Kingdom' ? country === 'GB' : true))
  }, [country, threatItems])

  return (
    <PageShell
      title="Live Threat Map"
      subtitle="Global telemetry and live attack patterns rendered as a premium, interactive map surface."
      actions={
        <button onClick={() => setPlaying((value) => !value)} className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white">
          {playing ? 'Pause Replay' : 'Play Replay'}
        </button>
      }
      filters={
        <>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">{playing ? 'Realtime' : 'Paused'}</span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">{timeRange} window</span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">{country === 'All' ? 'All vectors' : country}</span>
        </>
      }
      kpiSection={[
        <StatusCard key="vol" title="Attack Volume" value={visibleAttacks.length.toString()} detail="Live events per minute" icon={Activity} accent="from-cyan-500 to-sky-600" />,
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
              {visibleAttacks.slice(0, 3).map((item) => (
                <button key={item.id} onClick={() => {
                  setActiveAttack(item)
                  setSelectedCountry(item.country)
                  setDrawerOpen(true)
                  setHoveredAttack(item.id)
                }} className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-300">
                  {item.title}
                </button>
              ))}
            </div>
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />
            <AnimatePresence mode="wait">
              <motion.div key={activeAttack.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="absolute left-[25%] top-[20%] h-24 w-24 rounded-full border border-cyan-400/30 bg-cyan-500/10" />
            </AnimatePresence>
            <div className="absolute right-[18%] top-[34%] h-16 w-16 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10" />
          </div>
        </ChartCard>

        <div className="space-y-6">
          <ChartCard title="Timeline" subtitle="Event burst sequence">
            <div className="space-y-3">
              {visibleAttacks.slice(0, 3).map((item) => (
                <button key={item.id} onClick={() => setActiveAttack(item)} className="w-full rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-left text-sm text-slate-300">
                  {item.time} — {item.title}
                </button>
              ))}
            </div>
          </ChartCard>
          <ChartCard title="Live Attack Feed" subtitle="Most recent detections">
            <div className="space-y-3">
              {visibleAttacks.slice(0, 3).map((item) => (
                <button key={item.id} onClick={() => setActiveAttack(item)} className="flex w-full items-center justify-between rounded-[20px] border border-white/10 bg-slate-900/70 px-4 py-3 text-left text-sm text-slate-300">
                  <span>{item.title}</span>
                  <AlertTriangle className="h-4 w-4 text-amber-300" />
                </button>
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
