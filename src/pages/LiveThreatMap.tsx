import 'maplibre-gl/dist/maplibre-gl.css'

import DeckGL from '@deck.gl/react'
import { HeatmapLayer } from '@deck.gl/aggregation-layers'
import { ArcLayer, ScatterplotLayer } from '@deck.gl/layers'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, AlertTriangle, Download, Filter, Flame, Globe2, Pause, Play, RotateCcw, Search, ShieldCheck, Square, Wifi, WifiOff, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Map from 'react-map-gl/maplibre'
import toast from 'react-hot-toast'
import { PageShell } from '../components/layout/PageShell'
import { ChartCard } from '../components/cards/ChartCard'
import { StatusCard } from '../components/cards/StatusCard'
import { buildCountryRollup, selectFilteredAttacks, useLiveThreatStore } from '../store/liveThreatStore'
import { useSocket } from '../hooks/useSocket'
import { api } from '../services/api'
import type { LiveAttack, TimelineBucket } from '../types/liveThreatMap'

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

const ATTACK_TYPES = ['SQL Injection', 'XSS', 'Command Injection', 'Credential Stuffing', 'Bot Attack', 'Brute Force', 'RCE', 'DDoS', 'API Abuse']
const SEVERITIES = ['Low', 'Medium', 'High', 'Critical']
const STATUSES = ['Blocked', 'Mitigated', 'Detected', 'Investigating', 'Allowed']
const PROTOCOLS = ['HTTPS', 'HTTP', 'TCP', 'UDP']
const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']

function formatNumber(value: number) {
  return new Intl.NumberFormat('en', { notation: value > 9999 ? 'compact' : 'standard' }).format(value)
}

function severityColor(severity: string): [number, number, number] {
  if (severity === 'Critical') return [239, 68, 68]
  if (severity === 'High') return [249, 115, 22]
  if (severity === 'Medium') return [234, 179, 8]
  return [34, 197, 94]
}

function downloadFile(filename: string, body: string, type: string) {
  const blob = new Blob([body], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function toCsv(attacks: LiveAttack[]) {
  const columns = ['timestamp', 'source_country', 'destination_country', 'source_ip', 'attack_type', 'severity', 'status', 'endpoint', 'http_method', 'protocol', 'request_count', 'risk_score']
  return [columns.join(','), ...attacks.map((attack) => columns.map((column) => `"${String(attack[column as keyof LiveAttack] ?? '').replaceAll('"', '""')}"`).join(','))].join('\n')
}

export function LiveThreatMapPage() {
  useSocket()

  const attacks = useLiveThreatStore((state) => state.attacks)
  const statistics = useLiveThreatStore((state) => state.statistics)
  const heatmap = useLiveThreatStore((state) => state.heatmap)
  const timeline = useLiveThreatStore((state) => state.timeline)
  const selectedCountry = useLiveThreatStore((state) => state.selectedCountry)
  const filters = useLiveThreatStore((state) => state.filters)
  const connected = useLiveThreatStore((state) => state.connected)
  const connectionStatus = useLiveThreatStore((state) => state.connectionStatus)
  const replaying = useLiveThreatStore((state) => state.replaying)
  const addAttack = useLiveThreatStore((state) => state.addAttack)
  const updateStatistics = useLiveThreatStore((state) => state.updateStatistics)
  const updateHeatmap = useLiveThreatStore((state) => state.updateHeatmap)
  const updateTimeline = useLiveThreatStore((state) => state.updateTimeline)
  const selectCountry = useLiveThreatStore((state) => state.selectCountry)
  const setFilters = useLiveThreatStore((state) => state.setFilters)
  const setReplaying = useLiveThreatStore((state) => state.setReplaying)
  const clear = useLiveThreatStore((state) => state.clear)
  const [hoveredAttack, setHoveredAttack] = useState<LiveAttack | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    if (attacks.length > 0) return
    let cancelled = false
    api.dashboardSnapshot({ limit: 100 })
      .then((snapshot) => {
        if (cancelled) return
        snapshot.attacks.slice().reverse().forEach(addAttack)
        updateStatistics(snapshot.statistics)
        updateHeatmap(snapshot.heatmap)
        updateTimeline(snapshot.replay.items)
      })
      .catch(() => {
        if (!cancelled) toast.error('Backend telemetry unavailable')
      })
    return () => {
      cancelled = true
    }
  }, [addAttack, attacks.length, updateHeatmap, updateStatistics, updateTimeline])

  useEffect(() => {
    if (!replaying) return
    let cancelled = false
    let timeout: number | undefined
    api.replay({ limit: 100 })
      .then((payload) => {
        if (cancelled) return
        const items = payload.items
        if (!items.length) {
          setReplaying(false)
          return
        }
        let index = 0
        const emitNext = () => {
          if (cancelled) return
          addAttack(items[index])
          index += 1
          if (index >= items.length) {
            setReplaying(false)
            return
          }
          timeout = window.setTimeout(emitNext, 650)
        }
        emitNext()
      })
      .catch(() => {
        if (!cancelled) {
          toast.error('Replay data unavailable')
          setReplaying(false)
        }
      })
    return () => {
      cancelled = true
      if (timeout) window.clearTimeout(timeout)
    }
  }, [addAttack, replaying, setReplaying])

  const filteredAttacks = useMemo(() => selectFilteredAttacks(attacks, filters), [attacks, filters])
  const latestAttacks = filteredAttacks.slice(0, 80)
  const countryOptions = useMemo(() => ['All', ...Array.from(new Set(attacks.flatMap((attack) => [attack.source_country, attack.destination_country]))).sort()], [attacks])
  const attackTypeOptions = useMemo(() => ['All', ...Array.from(new Set(attacks.map((attack) => attack.attack_type))).sort()], [attacks])
  const selectedRollup = useMemo(() => (selectedCountry ? buildCountryRollup(attacks, selectedCountry) : null), [attacks, selectedCountry])
  const timelineBars = useMemo<TimelineBucket[]>(() => {
    if (timeline.length) return timeline
    return filteredAttacks.slice(0, 32).reverse().map((attack) => ({ label: attack.timestamp, count: attack.risk_score }))
  }, [filteredAttacks, timeline])

  const cards = useMemo(() => {
    const totalRequests = statistics?.total_requests ?? filteredAttacks.reduce((sum, attack) => sum + attack.request_count, 0)
    const totalAttacks = statistics?.summary.total_attacks ?? filteredAttacks.length
    const critical = statistics?.summary.critical ?? filteredAttacks.filter((attack) => attack.severity === 'Critical').length
    const blocked = filteredAttacks.filter((attack) => attack.status === 'Blocked' || attack.status === 'Mitigated').length
    const threatScore = Math.round(statistics?.average_risk_score ?? filteredAttacks.reduce((sum, attack) => sum + attack.risk_score, 0) / Math.max(filteredAttacks.length, 1))
    return { totalRequests, totalAttacks, critical, blocked, threatScore }
  }, [filteredAttacks, statistics])

  const layers = useMemo(() => {
    const arcLayer = new ArcLayer<LiveAttack>({
      id: 'live-attack-arcs',
      data: latestAttacks,
      getSourcePosition: (attack) => [attack.source_longitude, attack.source_latitude],
      getTargetPosition: (attack) => [attack.destination_longitude, attack.destination_latitude],
      getSourceColor: (attack) => [...severityColor(String(attack.severity)), 170],
      getTargetColor: [45, 212, 191, 220],
      getWidth: (attack) => Math.max(1.2, Math.min(6, attack.risk_score / 18)),
      pickable: true,
      autoHighlight: true,
      onHover: ({ object }) => setHoveredAttack(object ?? null),
      onClick: ({ object }) => object && selectCountry(object.destination_country),
    })
    const markerLayer = new ScatterplotLayer<LiveAttack>({
      id: 'destination-pulses',
      data: latestAttacks,
      getPosition: (attack) => [attack.destination_longitude, attack.destination_latitude],
      getRadius: (attack) => 28000 + attack.risk_score * 900,
      getFillColor: (attack) => [...severityColor(String(attack.severity)), 145],
      getLineColor: [255, 255, 255, 230],
      lineWidthMinPixels: 1,
      stroked: true,
      pickable: true,
      onHover: ({ object }) => setHoveredAttack(object ?? null),
      onClick: ({ object }) => object && selectCountry(object.destination_country),
    })
    const heatLayer = new HeatmapLayer<LiveAttack>({
      id: 'attack-heatmap',
      data: latestAttacks,
      getPosition: (attack) => [attack.destination_longitude, attack.destination_latitude],
      getWeight: (attack) => attack.risk_score,
      radiusPixels: 44,
      intensity: 1.5,
      threshold: 0.02,
    })
    return [heatLayer, arcLayer, markerLayer]
  }, [latestAttacks, selectCountry])

  const exportData = (format: 'csv' | 'json' | 'pdf') => {
    if (format === 'csv') downloadFile('cyberai-live-threats.csv', toCsv(filteredAttacks), 'text/csv')
    if (format === 'json') downloadFile('cyberai-live-threats.json', JSON.stringify(filteredAttacks, null, 2), 'application/json')
    if (format === 'pdf') {
      toast.success('Opening print dialog for PDF export')
      window.print()
    }
  }

  return (
    <PageShell
      title="Live Threat Map"
      subtitle="Real-time attack streaming with MapLibre, Deck.gl layers, filters, replay, heat intensity, and export-ready telemetry."
      searchPlaceholder="Country, IP, endpoint"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setFiltersOpen((value) => !value)} className="rounded-full border border-white/10 bg-slate-900/80 p-2 text-slate-300" title="Filters">
            <Filter className="h-4 w-4" />
          </button>
          <button onClick={() => setReplaying(!replaying)} className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">
            {replaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {replaying ? 'Pause' : 'Replay'}
          </button>
          <button onClick={() => exportData('csv')} className="rounded-full border border-white/10 bg-slate-900/80 p-2 text-slate-300" title="Export CSV">
            <Download className="h-4 w-4" />
          </button>
        </div>
      }
      filters={
        <>
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${connected ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300' : 'border-amber-400/20 bg-amber-500/10 text-amber-300'}`}>
            {connected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            {connectionStatus}
          </span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">{filteredAttacks.length} visible events</span>
          <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-300">Heat total {formatNumber(heatmap.total || filteredAttacks.length)}</span>
        </>
      }
      kpiSection={[
        <StatusCard key="requests" title="Requests" value={formatNumber(cards.totalRequests)} detail="Current filter scope" icon={Activity} accent="from-cyan-500 to-sky-600" />,
        <StatusCard key="attacks" title="Attacks" value={formatNumber(cards.totalAttacks)} detail={`${statistics?.attacks_per_minute?.toFixed?.(1) ?? filteredAttacks.length}/min stream`} icon={Globe2} accent="from-fuchsia-500 to-violet-600" />,
        <StatusCard key="critical" title="Critical" value={formatNumber(cards.critical)} detail="Priority investigations" icon={AlertTriangle} accent="from-rose-500 to-red-600" />,
        <StatusCard key="blocked" title="Blocked" value={formatNumber(cards.blocked)} detail={`Threat score ${cards.threatScore}/100`} icon={ShieldCheck} accent="from-emerald-500 to-teal-600" />,
      ]}
    >
      <AnimatePresence>
        {filtersOpen ? (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden rounded-[20px] border border-white/10 bg-slate-950/80 p-4">
            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-7">
              <FilterSelect label="Country" value={filters.country} options={countryOptions} onChange={(country) => setFilters({ country })} />
              <FilterSelect label="Severity" value={filters.severity} options={['All', ...SEVERITIES]} onChange={(severity) => setFilters({ severity })} />
              <FilterSelect label="Attack" value={filters.attackType} options={attackTypeOptions.length > 1 ? attackTypeOptions : ['All', ...ATTACK_TYPES]} onChange={(attackType) => setFilters({ attackType })} />
              <FilterSelect label="Status" value={filters.status} options={['All', ...STATUSES]} onChange={(status) => setFilters({ status })} />
              <FilterSelect label="Protocol" value={filters.protocol} options={['All', ...PROTOCOLS]} onChange={(protocol) => setFilters({ protocol })} />
              <FilterSelect label="Method" value={filters.httpMethod} options={['All', ...METHODS]} onChange={(httpMethod) => setFilters({ httpMethod })} />
              <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Search
                <span className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm normal-case tracking-normal text-slate-300">
                  <Search className="h-4 w-4" />
                  <input value={filters.search} onChange={(event) => setFilters({ search: event.target.value })} className="min-w-0 flex-1 bg-transparent outline-none" placeholder="IP, path, attack" />
                </span>
              </label>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.55fr)]">
        <ChartCard
          title="Global Attack Surface"
          subtitle="Dark world map with live arcs, destination pulses, and risk heat"
          action={
            <button onClick={clear} className="rounded-full border border-white/10 bg-slate-900/80 p-2 text-slate-300" title="Clear events">
              <RotateCcw className="h-4 w-4" />
            </button>
          }
        >
          <div className="relative h-[560px] overflow-hidden rounded-[18px] border border-white/10 bg-slate-950">
            <DeckGL
              initialViewState={{ longitude: 35, latitude: 23, zoom: 1.45, pitch: 28, bearing: 0 }}
              controller
              layers={layers}
              getCursor={({ isDragging, isHovering }) => (isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab')}
            >
              <Map mapStyle={MAP_STYLE} reuseMaps attributionControl={false} />
            </DeckGL>
              <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-300 backdrop-blur">
                <div className="flex items-center gap-2 text-cyan-200"><Flame className="h-4 w-4" /> Heatmap intensity</div>
                <div className="mt-3 h-2 w-40 rounded-full bg-gradient-to-r from-emerald-400 via-yellow-300 via-orange-400 to-red-500" />
              </div>
            {hoveredAttack ? <AttackTooltip attack={hoveredAttack} /> : null}
          </div>
        </ChartCard>

        <div className="space-y-6">
          <ChartCard title="Live Feed" subtitle="Newest detections first">
            <div className="max-h-[342px] space-y-3 overflow-auto pr-1">
              {filteredAttacks.slice(0, 18).map((attack) => (
                <button key={attack.id} onClick={() => selectCountry(attack.destination_country)} className="w-full rounded-[18px] border border-white/10 bg-slate-900/70 px-4 py-3 text-left transition hover:border-cyan-400/30 hover:bg-slate-900">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">{new Date(attack.timestamp).toLocaleTimeString()}</span>
                    <span className={`rounded-full px-2 py-1 text-xs ${attack.severity === 'Critical' ? 'bg-red-500/15 text-red-300' : attack.severity === 'High' ? 'bg-orange-500/15 text-orange-300' : 'bg-cyan-500/15 text-cyan-300'}`}>{attack.severity}</span>
                  </div>
                  <div className="mt-2 text-sm font-medium text-white">{attack.source_country} {'->'} {attack.destination_country}</div>
                  <div className="mt-1 flex items-center justify-between gap-3 text-xs text-slate-400">
                    <span>{attack.attack_type}</span>
                    <span>{attack.status}</span>
                  </div>
                </button>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Timeline" subtitle="Recent event density">
            <div className="flex h-24 items-end gap-1">
              {timelineBars.slice(-32).map((bucket, index) => {
                const count = bucket.attacks ?? bucket.count ?? 1
                return <div key={`${bucket.label ?? bucket.timestamp ?? bucket.time ?? index}-${index}`} className="flex-1 rounded-t bg-cyan-400/70" style={{ height: `${Math.max(12, Math.min(96, count))}%` }} title={bucket.label ?? bucket.timestamp ?? bucket.time} />
              })}
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <button onClick={() => setReplaying(true)} className="rounded-full border border-cyan-400/20 bg-cyan-500/10 p-2 text-cyan-200" title="Play replay"><Play className="h-4 w-4" /></button>
              <input value={Math.min(filteredAttacks.length, 500)} readOnly type="range" min="0" max="500" className="w-full accent-cyan-400" />
              <button onClick={() => setReplaying(false)} className="rounded-full border border-white/10 bg-slate-900/80 p-2 text-slate-300" title="Stop replay"><Square className="h-4 w-4" /></button>
            </div>
          </ChartCard>

          <ChartCard title="Export" subtitle="Current filters applied">
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => exportData('csv')} className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-300">CSV</button>
              <button onClick={() => exportData('json')} className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-300">JSON</button>
              <button onClick={() => exportData('pdf')} className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-300">PDF</button>
            </div>
          </ChartCard>
        </div>
      </div>

      <AnimatePresence>
        {selectedRollup ? (
          <motion.aside initial={{ x: 420, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 420, opacity: 0 }} className="fixed bottom-4 right-4 top-4 z-40 w-[min(420px,calc(100vw-32px))] overflow-auto rounded-[24px] border border-white/10 bg-slate-950/95 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Country</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">{selectedRollup.country}</h2>
              </div>
              <button onClick={() => selectCountry(null)} className="rounded-full border border-white/10 bg-slate-900/80 p-2 text-slate-300"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <MiniMetric label="Requests" value={formatNumber(selectedRollup.requests)} />
              <MiniMetric label="Blocked" value={formatNumber(selectedRollup.blocked)} />
              <MiniMetric label="Threat Score" value={`${selectedRollup.threatScore}/100`} />
              <MiniMetric label="Attacks" value={formatNumber(selectedRollup.attacks)} />
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-sm text-slate-400">Top Attack</p>
              <p className="mt-1 text-lg font-semibold text-white">{selectedRollup.topAttack}</p>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-sm text-slate-400">Top Sources</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(selectedRollup.topSources.length ? selectedRollup.topSources : ['No external sources']).map((source) => <span key={source} className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">{source}</span>)}
              </div>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </PageShell>
  )
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm normal-case tracking-normal text-slate-200 outline-none">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

function AttackTooltip({ attack }: { attack: LiveAttack }) {
  return (
    <div className="pointer-events-none absolute right-4 top-4 w-72 rounded-2xl border border-cyan-400/20 bg-slate-950/90 p-4 text-sm shadow-xl shadow-cyan-950/30 backdrop-blur">
      <div className="font-semibold text-white">{attack.attack_type}</div>
      <div className="mt-3 space-y-2 text-slate-300">
        <div className="flex justify-between"><span>Source</span><span>{attack.source_country}</span></div>
        <div className="flex justify-between"><span>Target</span><span>{attack.destination_country}</span></div>
        <div className="flex justify-between"><span>Endpoint</span><span>{attack.endpoint}</span></div>
        <div className="flex justify-between"><span>Method</span><span>{attack.http_method}</span></div>
        <div className="flex justify-between"><span>Severity</span><span>{attack.severity}</span></div>
        <div className="flex justify-between"><span>Status</span><span>{attack.status}</span></div>
      </div>
    </div>
  )
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  )
}
