import { create } from 'zustand'
import { seedLogs } from '../mock/data'
import type { AttackLogRow } from '../types'

interface AttackStore {
  attackLogs: AttackLogRow[]
  requestSeries: Array<{ name: string; data: number[] }>
  attackSeries: number[]
  setAttackLogs: (logs: AttackLogRow[]) => void
  appendLog: (log: AttackLogRow) => void
  setRequestSeries: (series: Array<{ name: string; data: number[] }>) => void
  setAttackSeries: (series: number[]) => void
}

export const useAttackStore = create<AttackStore>((set) => ({
  attackLogs: seedLogs,
  requestSeries: [
    { name: 'Requests', data: [240, 260, 310, 290, 340, 360, 380] },
    { name: 'Blocked', data: [180, 210, 240, 220, 280, 300, 320] },
  ],
  attackSeries: [42, 58, 73, 64, 38, 29, 81],
  setAttackLogs: (attackLogs) => set({ attackLogs }),
  appendLog: (log) => set((state) => ({ attackLogs: [log, ...state.attackLogs].slice(0, 10) })),
  setRequestSeries: (requestSeries) => set({ requestSeries }),
  setAttackSeries: (attackSeries) => set({ attackSeries }),
}))
