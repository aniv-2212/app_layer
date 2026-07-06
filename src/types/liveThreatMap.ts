export type Severity = 'Low' | 'Medium' | 'High' | 'Critical'

export type AttackStatus = 'Blocked' | 'Mitigated' | 'Detected' | 'Investigating' | 'Allowed'

export type LiveAttack = {
  id: number | string
  timestamp: string
  source_country: string
  destination_country: string
  source_latitude: number
  source_longitude: number
  destination_latitude: number
  destination_longitude: number
  source_ip: string
  destination_ip: string
  attack_type: string
  severity: Severity | string
  status: AttackStatus | string
  endpoint: string
  http_method: string
  request_count: number
  duration_ms: number
  confidence: number
  risk_score: number
  protocol: string
  user_agent: string
  asn: string
  city: string
  isp: string
  country_code: string
  latitude: number
  longitude: number
}

export type LiveStatistics = {
  summary: {
    total_attacks: number
    critical: number
    high: number
    medium: number
    low: number
  }
  attacks_per_minute: number
  mitigated_percentage: number
  active_countries: number
  top_attack_types: Record<string, number>
  top_source_countries: Record<string, number>
  average_risk_score: number
  total_requests: number
}

export type HeatmapPayload = {
  data: Record<string, number>
  total: number
  updated_at: string
}

export type TimelineBucket = {
  time?: string
  timestamp?: string
  attacks?: number
  count?: number
  label?: string
}

export type TimelinePayload = TimelineBucket[] | { data?: TimelineBucket[]; buckets?: TimelineBucket[] }

export type LiveThreatFilters = {
  country: string
  severity: string
  attackType: string
  timeRange: string
  status: string
  protocol: string
  httpMethod: string
  search: string
}

export type CountryRollup = {
  country: string
  requests: number
  attacks: number
  blocked: number
  threatScore: number
  topAttack: string
  topSources: string[]
}
