import { create } from 'zustand'
import type { LiveAttack } from '../types/liveThreatMap'
import { relativeTime } from './dashboardStore'

type NotificationItem = {
  id: string
  title: string
  detail: string
  time: string
  severity: string
}

function attackToNotification(attack: LiveAttack): NotificationItem {
  return {
    id: `notif-${attack.id}`,
    title: `${attack.severity} ${attack.attack_type}`,
    detail: `${attack.source_country} → ${attack.destination_country} on ${attack.endpoint} (${attack.status})`,
    time: relativeTime(attack.timestamp),
    severity: String(attack.severity).toLowerCase(),
  }
}

interface NotificationStore {
  items: NotificationItem[]
  open: boolean
  setOpen: (value: boolean) => void
  clearAll: () => void
  addNotification: (item: NotificationItem) => void
  hydrateFromAttacks: (attacks: LiveAttack[]) => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  items: [],
  open: false,
  setOpen: (open) => set({ open }),
  clearAll: () => set({ items: [] }),
  addNotification: (item) => set((state) => ({ items: [item, ...state.items].slice(0, 8) })),
  hydrateFromAttacks: (attacks) =>
    set({
      items: attacks
        .filter((attack) => attack.severity === 'Critical' || attack.severity === 'High')
        .slice(0, 8)
        .map(attackToNotification),
    }),
}))

export function notifyAttack(attack: LiveAttack) {
  if (attack.severity !== 'Critical' && attack.severity !== 'High') return
  useNotificationStore.getState().addNotification(attackToNotification(attack))
}
