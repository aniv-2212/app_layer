import { create } from 'zustand'

type ThemeMode = 'Dark' | 'Dark Blue' | 'Midnight' | 'Cyber Neon'

type SettingsStore = {
  theme: ThemeMode
  accent: string
  notificationsEnabled: boolean
  autoRefresh: boolean
  activeTab: 'Preferences' | 'Security' | 'Notifications' | 'Users' | 'API Keys' | 'Roles' | 'Theme'
  setTheme: (theme: ThemeMode) => void
  setAccent: (accent: string) => void
  toggleNotifications: () => void
  toggleAutoRefresh: () => void
  setActiveTab: (tab: SettingsStore['activeTab']) => void
  reset: () => void
}

const initialState = {
  theme: 'Dark' as ThemeMode,
  accent: 'cyan',
  notificationsEnabled: true,
  autoRefresh: true,
  activeTab: 'Preferences' as const,
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  ...initialState,
  setTheme: (theme) => set({ theme }),
  setAccent: (accent) => set({ accent }),
  toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
  toggleAutoRefresh: () => set((state) => ({ autoRefresh: !state.autoRefresh })),
  setActiveTab: (activeTab) => set({ activeTab }),
  reset: () => set(initialState),
}))
