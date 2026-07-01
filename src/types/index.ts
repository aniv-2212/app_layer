export interface AttackEvent {
  id: string
  timestamp: string
  sourceCountry: string
  destinationCountry: string
  sourceIp: string
  endpoint: string
  httpMethod: string
  attackType: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  status: string
  requests: number
  latitude: number
  longitude: number
}

export interface DashboardKpi {
  id: string
  title: string
  value: string
  change: string
  icon: string
  sparkline: number[]
  accent: string
}

export interface CountrySummary {
  country: string
  flag: string
  totalRequests: number
  blockedRequests: number
  attackRate: number
  threatScore: number
  topAttackType: string
  topTargetEndpoint: string
  topSourceCountries: string[]
  trend: number[]
  aiSummary: string
}

export interface FilterState {
  attackType: string
  country: string
  severity: string
  httpMethod: string
  statusCode: string
  timeRange: string
}

export interface AttackLogRow {
  id: string
  timestamp: string
  sourceIp: string
  destination: string
  endpoint: string
  attackType: string
  httpMethod: string
  country: string
  severity: string
  status: string
}
