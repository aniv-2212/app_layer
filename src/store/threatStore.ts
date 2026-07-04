import { create } from 'zustand'
import threatData from '../mock/attacks.json'
import vulnerabilitiesData from '../mock/vulnerabilities.json'
import malwareData from '../mock/malware.json'

type ThreatItem = {
  id: string
  type: string
  severity: string
  country: string
  requests: number
  region: string
  time: string
}

type VulnerabilityItem = {
  id: string
  name: string
  severity: string
  asset: string
  status: string
  score: string
}

type MalwareItem = {
  id: string
  name: string
  risk: string
  hash: string
  behavior: string
  mitre: string
  yara: string
  timeline: string[]
}

interface ThreatStore {
  threatItems: ThreatItem[]
  vulnerabilities: VulnerabilityItem[]
  malware: MalwareItem[]
  selectedThreat: ThreatItem | null
  selectedVulnerability: VulnerabilityItem | null
  selectedMalware: MalwareItem | null
  filter: string
  severity: string
  setThreatItems: (items: ThreatItem[]) => void
  setVulnerabilities: (items: VulnerabilityItem[]) => void
  setMalware: (items: MalwareItem[]) => void
  setSelectedThreat: (item: ThreatItem | null) => void
  setSelectedVulnerability: (item: VulnerabilityItem | null) => void
  setSelectedMalware: (item: MalwareItem | null) => void
  setFilter: (filter: string) => void
  setSeverity: (severity: string) => void
}

export const useThreatStore = create<ThreatStore>((set) => ({
  threatItems: threatData.items,
  vulnerabilities: vulnerabilitiesData.items,
  malware: malwareData.items,
  selectedThreat: null,
  selectedVulnerability: null,
  selectedMalware: null,
  filter: 'All',
  severity: 'All',
  setThreatItems: (threatItems) => set({ threatItems }),
  setVulnerabilities: (vulnerabilities) => set({ vulnerabilities }),
  setMalware: (malware) => set({ malware }),
  setSelectedThreat: (selectedThreat) => set({ selectedThreat }),
  setSelectedVulnerability: (selectedVulnerability) => set({ selectedVulnerability }),
  setSelectedMalware: (selectedMalware) => set({ selectedMalware }),
  setFilter: (filter) => set({ filter }),
  setSeverity: (severity) => set({ severity }),
}))
