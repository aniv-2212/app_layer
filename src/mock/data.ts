import type { AttackEvent, AttackLogRow, CountrySummary, DashboardKpi } from '../types'

export const seedKpis: DashboardKpi[] = [
  { id: 'requests', title: 'Total Requests', value: '2.84M', change: '+12.4%', icon: 'Globe2', sparkline: [20, 42, 38, 64, 78, 76, 92], accent: 'from-cyan-500 to-sky-600' },
  { id: 'attacks', title: 'Attack Requests', value: '184.2K', change: '+8.1%', icon: 'ShieldAlert', sparkline: [12, 18, 15, 24, 22, 31, 34], accent: 'from-fuchsia-500 to-violet-600' },
  { id: 'rate', title: 'Attack Rate', value: '6.49%', change: '-1.2%', icon: 'Activity', sparkline: [44, 41, 46, 43, 40, 39, 37], accent: 'from-amber-400 to-orange-600' },
  { id: 'visitors', title: 'Unique Visitors', value: '918K', change: '+5.8%', icon: 'Users', sparkline: [36, 48, 44, 55, 54, 63, 70], accent: 'from-emerald-500 to-teal-600' },
  { id: 'mitigated', title: 'Mitigated Requests', value: '182.7K', change: '+14.9%', icon: 'Radar', sparkline: [22, 29, 32, 35, 43, 48, 56], accent: 'from-cyan-400 to-blue-500' },
  { id: 'topAttack', title: 'Top Attack Type', value: 'SQLi', change: '+3.2%', icon: 'Bug', sparkline: [15, 19, 22, 23, 27, 30, 31], accent: 'from-purple-500 to-indigo-600' },
  { id: 'countries', title: 'Countries Targeted', value: '64', change: '+2.3%', icon: 'Map', sparkline: [18, 20, 25, 26, 28, 30, 32], accent: 'from-pink-500 to-rose-600' },
  { id: 'aiScore', title: 'AI Threat Score', value: '92/100', change: '+7.1%', icon: 'Brain', sparkline: [48, 53, 57, 60, 68, 72, 78], accent: 'from-indigo-500 to-cyan-600' },
]

export const seedEvents: AttackEvent[] = [
  {
    id: 'evt-1',
    timestamp: '2026-07-01T18:05:12Z',
    sourceCountry: 'United States',
    destinationCountry: 'Germany',
    sourceIp: '198.51.100.24',
    endpoint: '/api/v1/login',
    httpMethod: 'POST',
    attackType: 'SQL Injection',
    severity: 'Critical',
    status: 'Blocked',
    requests: 382,
    latitude: 39.8,
    longitude: -98.6,
  },
  {
    id: 'evt-2',
    timestamp: '2026-07-01T18:04:32Z',
    sourceCountry: 'Brazil',
    destinationCountry: 'Singapore',
    sourceIp: '203.0.113.58',
    endpoint: '/auth/token',
    httpMethod: 'GET',
    attackType: 'Credential Stuffing',
    severity: 'High',
    status: 'Observed',
    requests: 216,
    latitude: -14.2,
    longitude: -51.9,
  },
  {
    id: 'evt-3',
    timestamp: '2026-07-01T18:03:54Z',
    sourceCountry: 'Russia',
    destinationCountry: 'United Kingdom',
    sourceIp: '198.51.100.77',
    endpoint: '/api/health',
    httpMethod: 'PUT',
    attackType: 'Path Traversal',
    severity: 'Medium',
    status: 'Blocked',
    requests: 141,
    latitude: 61.5,
    longitude: 105.3,
  },
]

export const seedLogs: AttackLogRow[] = [
  { id: 'log-1', timestamp: '18:05:12', sourceIp: '198.51.100.24', destination: 'fra-edge-01', endpoint: '/api/v1/login', attackType: 'SQL Injection', httpMethod: 'POST', country: 'US', severity: 'Critical', status: 'Blocked' },
  { id: 'log-2', timestamp: '18:04:32', sourceIp: '203.0.113.58', destination: 'sgw-04', endpoint: '/auth/token', attackType: 'Credential Stuffing', httpMethod: 'GET', country: 'BR', severity: 'High', status: 'Observed' },
  { id: 'log-3', timestamp: '18:03:54', sourceIp: '198.51.100.77', destination: 'uk-edge-02', endpoint: '/api/health', attackType: 'Path Traversal', httpMethod: 'PUT', country: 'RU', severity: 'Medium', status: 'Blocked' },
]

export const seedCountrySummaries: CountrySummary[] = [
  { country: 'Germany', flag: '🇩🇪', totalRequests: 48200, blockedRequests: 41200, attackRate: 8.4, threatScore: 88, topAttackType: 'SQL Injection', topTargetEndpoint: '/api/login', topSourceCountries: ['US', 'NL', 'FR'], trend: [42, 54, 61, 70, 78, 84, 88], aiSummary: 'A sustained botnet campaign is concentrating on authentication endpoints with elevated SQLi attempts.' },
  { country: 'Singapore', flag: '🇸🇬', totalRequests: 35600, blockedRequests: 32100, attackRate: 6.7, threatScore: 81, topAttackType: 'XSS', topTargetEndpoint: '/pages/profile', topSourceCountries: ['AU', 'JP', 'IN'], trend: [38, 43, 49, 56, 64, 72, 81], aiSummary: 'Cross-site scripting probes are clustering around profile and search endpoints.' },
  { country: 'United Kingdom', flag: '🇬🇧', totalRequests: 29100, blockedRequests: 26900, attackRate: 5.3, threatScore: 74, topAttackType: 'Command Injection', topTargetEndpoint: '/admin/tools', topSourceCountries: ['IE', 'DE', 'NL'], trend: [30, 35, 41, 52, 60, 69, 74], aiSummary: 'Administrative tooling is receiving repeated command injection probes from a small set of hosts.' },
]

const attackTypes = ['SQL Injection', 'XSS', 'Command Injection', 'RCE', 'Path Traversal', 'File Inclusion']
const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
const countries = ['United States', 'Germany', 'Singapore', 'United Kingdom', 'Brazil', 'Russia', 'Japan', 'India', 'France', 'Canada']

export const buildSyntheticEvent = (seed: number): AttackEvent => {
  const attackType = attackTypes[seed % attackTypes.length]
  const method = methods[(seed + 2) % methods.length]
  const sourceCountry = countries[seed % countries.length]
  const destinationCountry = countries[(seed + 3) % countries.length]
  const severity: AttackEvent['severity'] = seed % 4 === 0 ? 'Critical' : seed % 4 === 1 ? 'High' : seed % 4 === 2 ? 'Medium' : 'Low'
  return {
    id: `evt-${seed}`,
    timestamp: new Date(seed).toISOString(),
    sourceCountry,
    destinationCountry,
    sourceIp: `10.${(seed % 200) + 1}.${(seed % 100) + 1}.${(seed % 80) + 1}`,
    endpoint: ['/api/login', '/graphql', '/upload', '/search', '/admin'].at(seed % 5) ?? '/api/login',
    httpMethod: method,
    attackType,
    severity,
    status: severity === 'Critical' ? 'Blocked' : 'Observed',
    requests: 120 + (seed % 300),
    latitude: 20 + (seed % 60),
    longitude: -120 + (seed % 240),
  }
}
