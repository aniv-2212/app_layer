export type ScanStatusClass = 'safe' | 'warning' | 'danger'

export type DomainIntelligence = {
  whois_status: string
  age: string
  registrar: string
  expiration_date: string
  dns_record_count: number
  ip_address: string
  ssl_valid: boolean
}

export type ScanResult = {
  scan_id: string
  url: string
  risk_percentage: number
  verdict: string
  status_class: ScanStatusClass
  model_used: boolean
  extracted_features: Record<string, number>
  domain_intelligence: DomainIntelligence | null
  scanned_at: string
}

export type ScanHistoryEntry = {
  scan_id: string
  url: string
  risk_percentage: number
  verdict: string
  status_class: ScanStatusClass
  scanned_at: string
}

export type ScanHistoryResponse = {
  total: number
  items: ScanHistoryEntry[]
}

export type ScannerHealth = {
  status: string
  model_loaded: boolean
  feature_count: number
  scans_performed: number
}
