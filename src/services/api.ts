import { getBackendUrl } from './socket'
import type { HeatmapPayload, LiveAttack, LiveStatistics } from '../types/liveThreatMap'

export type AttackFilters = {
  country?: string
  severity?: string
  attack_type?: string
  status?: string
  time_range?: string
  limit?: number
  offset?: number
}

export type AttackListResponse = {
  total: number
  items: LiveAttack[]
}

export type CountryInfo = {
  name: string
  country_code: string
  latitude: number
  longitude: number
  continent: string
  risk_level: string
}

export type CountryListResponse = {
  total: number
  items: CountryInfo[]
}

export type StatisticsSummary = {
  total_attacks: number
  critical: number
  high: number
  medium: number
  low: number
}

export type ReplayResponse = {
  total: number
  capacity: number
  items: LiveAttack[]
}

export type CountryRollup = {
  country: string
  requests: number
  attacks: number
  blocked: number
  threat_score: number
  top_attack: string
  top_sources: string[]
}

export type DashboardMetadata = {
  attack_types: string[]
  severities: string[]
  statuses: string[]
  http_methods: string[]
  protocols: string[]
  countries: string[]
  continents: string[]
  time_ranges: string[]
}

export type StreamStatus = {
  running: boolean
  socket_interval: number
  summary_interval: number
  buffer_size: number
  stored_attacks: number
  session_total: number
  connected_clients: number
}

export type DashboardSnapshot = {
  attacks: LiveAttack[]
  statistics: LiveStatistics
  heatmap: HeatmapPayload
  replay: ReplayResponse
  countries: CountryInfo[]
  stream: StreamStatus
}

export type HealthStatus = {
  status: string
  service: string
  connected_clients: number
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getBackendUrl()}${path}`, init)
  if (!response.ok) throw new Error(`Request to ${path} failed with status ${response.status}`)
  return response.json() as Promise<T>
}

function toQuery(params: Record<string, unknown> = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || value === 'All' || value === 'Live') return
    search.set(key, String(value))
  })
  const encoded = search.toString()
  return encoded ? `?${encoded}` : ''
}

export const api = {
  attacks: (filters: AttackFilters = {}) => request<AttackListResponse>(`/api/attacks${toQuery(filters)}`),
  countries: (filters: { continent?: string; risk_level?: string } = {}) =>
    request<CountryListResponse>(`/api/countries${toQuery(filters)}`),
  country: (countryCode: string) => request<CountryInfo>(`/api/countries/${encodeURIComponent(countryCode)}`),
  statistics: (filters: AttackFilters = {}) => request<LiveStatistics>(`/api/statistics${toQuery(filters)}`),
  statisticsSummary: () => request<StatisticsSummary>('/api/statistics/summary'),
  replay: (filters: AttackFilters = {}) => request<ReplayResponse>(`/api/replay${toQuery(filters)}`),
  heatmap: (filters: { country?: string; time_range?: string } = {}) =>
    request<HeatmapPayload>(`/api/heatmap${toQuery(filters)}`),
  dashboardSnapshot: (filters: AttackFilters = {}) =>
    request<DashboardSnapshot>(`/api/dashboard/snapshot${toQuery(filters)}`),
  dashboardMetadata: () => request<DashboardMetadata>('/api/dashboard/metadata'),
  countryRollup: (countryName: string, timeRange?: string) =>
    request<CountryRollup>(`/api/dashboard/countries/${encodeURIComponent(countryName)}/rollup${toQuery({ time_range: timeRange })}`),
  exportJson: (filters: AttackFilters = {}) =>
    request<AttackListResponse>(`/api/dashboard/export${toQuery({ ...filters, format: 'json' })}`),
  exportCsv: async (filters: AttackFilters = {}) => {
    const response = await fetch(`${getBackendUrl()}/api/dashboard/export${toQuery({ ...filters, format: 'csv' })}`)
    if (!response.ok) throw new Error(`CSV export failed with status ${response.status}`)
    return response.text()
  },
  streamStatus: () => request<StreamStatus>('/api/stream/status'),
  streamStart: () => request<StreamStatus>('/api/stream/start', { method: 'POST' }),
  streamStop: () => request<StreamStatus>('/api/stream/stop', { method: 'POST' }),
  streamTick: () =>
    request<{ generated: boolean; attack: LiveAttack; stream: StreamStatus }>('/api/stream/tick', { method: 'POST' }),
  streamSnapshot: () => request<Record<string, unknown>>('/api/stream/snapshot', { method: 'POST' }),
  health: () => request<HealthStatus>('/health'),

  // -- external threat intel (backend/.env keys; see /api/custom/intel/status) --
  intelStatus: () => request<Record<string, IntelServiceStatus>>('/api/custom/intel/status'),
  intelSnapshot: () => request<IntelSnapshot>('/api/custom/intel/snapshot'),
  radarAttacks: (dateRange = '1d') => request<Record<string, unknown>>(`/api/custom/radar/attacks${toQuery({ date_range: dateRange })}`),
  shodanHost: (ip: string) => request<ShodanHost>(`/api/custom/shodan/host/${encodeURIComponent(ip)}`),
  virustotalIp: (ip: string) => request<Record<string, unknown>>(`/api/custom/virustotal/ip/${encodeURIComponent(ip)}`),
  virustotalFile: (hash: string) => request<VirusTotalReport>(`/api/custom/virustotal/file/${encodeURIComponent(hash)}`),
  phishtankCheck: (url: string) => request<PhishTankResult>(`/api/custom/phishtank/check${toQuery({ url })}`),
  abuseipdbCheck: (ip: string) => request<AbuseIpdbResult>(`/api/custom/abuseipdb/check/${encodeURIComponent(ip)}`),
  otxPulses: (limit = 10) => request<OtxPulses>(`/api/custom/otx/pulses${toQuery({ limit })}`),
  otxIp: (ip: string) => request<Record<string, unknown>>(`/api/custom/otx/ip/${encodeURIComponent(ip)}`),
  cisaKev: (limit = 25, search?: string) => request<CisaKev>(`/api/custom/cisa/kev${toQuery({ limit, search })}`),
  ipinfo: (ip: string) => request<Record<string, unknown>>(`/api/custom/ipinfo/${encodeURIComponent(ip)}`),
  hibpBreaches: (limit = 20) => request<HibpBreaches>(`/api/custom/hibp/breaches${toQuery({ limit })}`),
  hibpAccount: (account: string) => request<Record<string, unknown>>(`/api/custom/hibp/account/${encodeURIComponent(account)}`),
}

export type IntelServiceStatus = {
  name: string
  configured: boolean
  requires_key: boolean
  cached_entries: number
  last_success: string | null
  last_error: string | null
}

export type IntelSnapshot = {
  sources: Record<string, any>
  configured: Record<string, boolean>
}

export type KevVulnerability = {
  cve_id: string
  vendor: string
  product: string
  name: string
  date_added: string
  due_date: string
  known_ransomware: string
  description: string
}

export type CisaKev = {
  catalog_version: string
  total: number
  count: number
  vulnerabilities: KevVulnerability[]
}

export type HibpBreach = {
  name: string
  title: string
  domain: string
  breach_date: string
  added_date: string
  pwn_count: number
  data_classes: string[]
  is_verified: boolean
  description: string
}

export type HibpBreaches = { total: number; breaches: HibpBreach[] }

export type OtxPulses = {
  count: number
  pulses: Array<{
    id: string
    name: string
    description: string
    author: string
    created: string
    tags: string[]
    targeted_countries: string[]
    malware_families: string[]
    indicator_count: number
  }>
}

export type PhishTankResult = {
  url: string
  in_database: boolean
  verified: boolean
  valid: boolean
  phish_id?: number
  phish_detail_page?: string
}

export type AbuseIpdbResult = {
  ip: string
  abuse_confidence_score: number
  total_reports: number
  country_code: string
  isp: string
  is_tor: boolean
  last_reported_at: string | null
}

export type ShodanHost = {
  ip: string
  org: string | null
  country: string | null
  ports: number[]
  vulns: string[]
  services: Array<{ port: number; transport: string; product?: string; version?: string }>
}

export type VirusTotalReport = {
  id: string | null
  type: string | null
  reputation: number | null
  last_analysis_stats: Record<string, number>
  tags: string[]
  meaningful_name?: string | null
  popular_threat_classification?: { suggested_threat_label?: string } | null
}

export function downloadFile(filename: string, body: string, type: string) {
  const blob = new Blob([body], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export async function downloadAttacksCsv(filters: AttackFilters = {}, filename = 'cyberai-attacks.csv') {
  const csv = await api.exportCsv(filters)
  downloadFile(filename, csv, 'text/csv')
}

export async function downloadAttacksJson(filters: AttackFilters = {}, filename = 'cyberai-attacks.json') {
  const payload = await api.exportJson(filters)
  downloadFile(filename, JSON.stringify(payload, null, 2), 'application/json')
}
