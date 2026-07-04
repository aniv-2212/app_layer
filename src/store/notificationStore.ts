import { create } from 'zustand'
import notificationsData from '../mock/notifications.json'

type NotificationItem = {
  id: string
  title: string
  detail: string
  time: string
  severity: string
}

interface NotificationStore {
  items: NotificationItem[]
  open: boolean
  setOpen: (value: boolean) => void
  clearAll: () => void
  addNotification: (item: NotificationItem) => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  items: notificationsData.items,
  open: false,
  setOpen: (open) => set({ open }),
  clearAll: () => set({ items: [] }),
  addNotification: (item) => set((state) => ({ items: [item, ...state.items].slice(0, 8) })),
}))
