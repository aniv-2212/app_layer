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
// --- Incident Response types ---

export type IncidentStatus = 'new' | 'investigating' | 'contained' | 'resolved' | 'closed'
export type IncidentPriority = 'low' | 'medium' | 'high' | 'critical'

export interface TimelineEvent {
  id: string
  timestamp: string
  actor: string
  action: string
}

export interface EvidenceItem {
  id: string
  name: string
  type: 'log' | 'screenshot' | 'pcap' | 'file' | 'other'
  addedAt: string
  addedBy: string
  url?: string
}

export interface IncidentNote {
  id: string
  author: string
  content: string
  createdAt: string
}

export interface Incident {
  id: string
  title: string
  description: string
  status: IncidentStatus
  priority: IncidentPriority
  assignedAnalyst: string | null
  createdAt: string
  updatedAt: string
  timeline: TimelineEvent[]
  evidence: EvidenceItem[]
  notes: IncidentNote[]
  resolution: string | null
}

export interface NotificationItem {
  id: string
  message: string
  createdAt: string
  read: boolean
}