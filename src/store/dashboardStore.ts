import { create } from 'zustand'
import { api } from '../services/api'
import type { CountryInfo, StreamStatus } from '../services/api'
import type { LiveAttack, LiveStatistics } from '../types/liveThreatMap'
import type { AttackEvent, CountrySummary, DashboardKpi } from '../types'

export type DashboardAlert = {
  id: string
  title: string
  detail: string
  time: string
  severity: string
}

export type DashboardActivity = {
  id: string
  title: string
  detail: string
  time: string
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en', {
    notation: value > 9999 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value)
}

function flagEmoji(countryCode: string) {
  const code = countryCode.slice(0, 2).toUpperCase()
  if (!/^[A-Z]{2}$/.test(code)) return '🌐'
  return code.replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

export function toAttackEvent(attack: LiveAttack): AttackEvent {
  return {
    id: String(attack.id),
    timestamp: attack.timestamp,
    sourceCountry: attack.source_country,
    destinationCountry: attack.destination_country,
    sourceIp: attack.source_ip,
    endpoint: attack.endpoint,
    httpMethod: attack.http_method,
    attackType: attack.attack_type,
    severity: (attack.severity as AttackEvent['severity']) ?? 'Low',
    status: String(attack.status),
    requests: attack.request_count,
    latitude: attack.source_latitude,
    longitude: attack.source_longitude,
  }
}

function minuteBuckets(attacks: LiveAttack[], take = 8): number[] {
  const buckets = new Map<string, number>()
  attacks.forEach((attack) => {
    const key = String(attack.timestamp).slice(0, 16)
    buckets.set(key, (buckets.get(key) ?? 0) + 1)
  })
  const values = Array.from(buckets.keys()).sort().map((key) => buckets.get(key) ?? 0)
  return values.length ? values.slice(-take) : [0]
}

function changeLabel(sparkline: number[]) {
  const first = sparkline[0] || 1
  const last = sparkline[sparkline.length - 1] ?? first
  const delta = ((last - first) / first) * 100
  return `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%`
}

function buildKpis(statistics: LiveStatistics, attacks: LiveAttack[]): DashboardKpi[] {
  const spark = minuteBuckets(attacks)
  const change = changeLabel(spark)
  const summary = statistics.summary
  const attackRate = summary.total_attacks
    ? Math.min(100, (summary.total_attacks / Math.max(statistics.total_requests, 1)) * 100)
    : 0
  const mitigated = Math.round((statistics.mitigated_percentage / 100) * summary.total_attacks)
  const topAttack = Object.entries(statistics.top_attack_types).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'None'
  const uniqueSources = new Set(attacks.map((attack) => attack.source_ip)).size

  return [
    { id: 'requests', title: 'Total Requests', value: formatNumber(statistics.total_requests), change, icon: 'Globe2', sparkline: spark, accent: 'from-cyan-500 to-sky-600' },
    { id: 'attacks', title: 'Attack Requests', value: formatNumber(summary.total_attacks), change, icon: 'ShieldAlert', sparkline: spark, accent: 'from-fuchsia-500 to-violet-600' },
    { id: 'rate', title: 'Attack Rate', value: `${attackRate.toFixed(2)}%`, change: `${statistics.attacks_per_minute.toFixed(1)}/min`, icon: 'Activity', sparkline: spark, accent: 'from-amber-400 to-orange-600' },
    { id: 'visitors', title: 'Unique Visitors', value: formatNumber(uniqueSources), change, icon: 'Users', sparkline: spark, accent: 'from-emerald-500 to-teal-600' },
    { id: 'mitigated', title: 'Mitigated Requests', value: formatNumber(mitigated), change: `${statistics.mitigated_percentage.toFixed(1)}%`, icon: 'Radar', sparkline: spark, accent: 'from-cyan-400 to-blue-500' },
    { id: 'topAttack', title: 'Top Attack Type', value: topAttack, change: formatNumber(statistics.top_attack_types[topAttack] ?? 0), icon: 'Bug', sparkline: spark, accent: 'from-purple-500 to-indigo-600' },
    { id: 'countries', title: 'Countries Targeted', value: String(statistics.active_countries), change, icon: 'Map', sparkline: spark, accent: 'from-pink-500 to-rose-600' },
    { id: 'aiScore', title: 'AI Threat Score', value: `${Math.round(statistics.average_risk_score)}/100`, change, icon: 'Brain', sparkline: spark, accent: 'from-indigo-500 to-cyan-600' },
  ]
}

export function relativeTime(timestamp: string) {
  const elapsedMs = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.max(0, Math.round(elapsedMs / 60000))
  if (minutes < 1) return 'now'
  if (minutes < 60) return `${minutes}m ago`
  return `${Math.round(minutes / 60)}h ago`
}

function buildAlerts(attacks: LiveAttack[]): DashboardAlert[] {
  return attacks
    .filter((attack) => attack.severity === 'Critical' || attack.severity === 'High')
    .slice(0, 3)
    .map((attack) => ({
      id: `alert-${attack.id}`,
      title: `${attack.attack_type} from ${attack.source_country}`,
      detail: `${attack.http_method} ${attack.endpoint} targeting ${attack.destination_country} — ${attack.request_count} requests, risk ${attack.risk_score}/100`,
      time: relativeTime(attack.timestamp),
      severity: String(attack.severity),
    }))
}

function buildActivities(attacks: LiveAttack[]): DashboardActivity[] {
  return attacks
    .filter((attack) => attack.status === 'Blocked' || attack.status === 'Mitigated')
    .slice(0, 3)
    .map((attack) => ({
      id: `activity-${attack.id}`,
      title: `${attack.status}: ${attack.attack_type}`,
      detail: `${attack.source_ip} → ${attack.endpoint}`,
      time: new Date(attack.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }))
}

async function buildCountrySummaries(
  heatmapData: Record<string, number>,
  countries: CountryInfo[],
  attacks: LiveAttack[],
): Promise<CountrySummary[]> {
  const topCountries = Object.entries(heatmapData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name)

  const rollups = await Promise.all(topCountries.map((name) => api.countryRollup(name).catch(() => null)))

  return rollups
    .filter((rollup): rollup is NonNullable<typeof rollup> => rollup !== null)
    .map((rollup) => {
      const country = countries.find((c) => c.name === rollup.country)
      const related = attacks.filter(
        (attack) => attack.destination_country === rollup.country || attack.source_country === rollup.country,
      )
      const endpointCounts = related.reduce<Map<string, number>>(
        (acc, attack) => acc.set(attack.endpoint, (acc.get(attack.endpoint) ?? 0) + 1),
        new Map(),
      )
      const endpoint = Array.from(endpointCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

      return {
        country: rollup.country,
        flag: country ? flagEmoji(country.country_code) : '🌐',
        totalRequests: rollup.requests,
        blockedRequests: rollup.blocked,
        attackRate: rollup.requests ? Number(((rollup.attacks / Math.max(rollup.requests, 1)) * 100).toFixed(1)) : 0,
        threatScore: rollup.threat_score,
        topAttackType: rollup.top_attack,
        topTargetEndpoint: endpoint,
        topSourceCountries: rollup.top_sources.slice(0, 3),
        trend: related.slice(0, 7).map((attack) => attack.risk_score).reverse(),
        aiSummary: `${rollup.top_attack} is the dominant vector against ${rollup.country}: ${rollup.attacks} attacks observed, ${rollup.blocked} blocked, threat score ${rollup.threat_score}/100.`,
      }
    })
}

interface DashboardStore {
  kpis: DashboardKpi[]
  eventFeed: AttackEvent[]
  countrySummaries: CountrySummary[]
  alerts: DashboardAlert[]
  activities: DashboardActivity[]
  statistics: LiveStatistics | null
  stream: StreamStatus | null
  connectedClients: number
  hydrated: boolean
  hydrate: () => Promise<void>
  setKpis: (kpis: DashboardKpi[]) => void
  setEventFeed: (events: AttackEvent[]) => void
  appendEvent: (event: AttackEvent) => void
  setCountrySummaries: (summaries: CountrySummary[]) => void
}

let hydrating = false

export const useDashboardStore = create<DashboardStore>((set) => ({
  kpis: [],
  eventFeed: [],
  countrySummaries: [],
  alerts: [],
  activities: [],
  statistics: null,
  stream: null,
  connectedClients: 0,
  hydrated: false,
  hydrate: async () => {
    if (hydrating) return
    hydrating = true
    try {
      const [statistics, attackList, heatmap, countryList, health, stream] = await Promise.all([
        api.statistics(),
        api.attacks({ limit: 100 }),
        api.heatmap(),
        api.countries(),
        api.health().catch(() => null),
        api.streamStatus().catch(() => null),
      ])
      const attacks = attackList.items
      const countrySummaries = await buildCountrySummaries(heatmap.data, countryList.items, attacks)

      set({
        kpis: buildKpis(statistics, attacks),
        eventFeed: attacks.slice(0, 8).map(toAttackEvent),
        countrySummaries,
        alerts: buildAlerts(attacks),
        activities: buildActivities(attacks),
        statistics,
        stream,
        connectedClients: health?.connected_clients ?? 0,
        hydrated: true,
      })
    } catch (error) {
      console.warn('Unable to hydrate dashboard store', error)
    } finally {
      hydrating = false
    }
  },
  setKpis: (kpis) => set({ kpis }),
  setEventFeed: (eventFeed) => set({ eventFeed }),
  appendEvent: (event) => set((state) => ({ eventFeed: [event, ...state.eventFeed].slice(0, 8) })),
  setCountrySummaries: (countrySummaries) => set({ countrySummaries }),
}))
