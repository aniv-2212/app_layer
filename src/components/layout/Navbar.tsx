import { Bell, Download, MoonStar, Search, SunMedium } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAnalyticsStore } from '../../store/analyticsStore'
import { useNotificationStore } from '../../store/notificationStore'
import { useSettingsStore } from '../../store/settingsStore'
import { ExportModal } from '../ui/ExportModal'
import { NotificationDrawer } from '../ui/NotificationDrawer'
import { UserMenu } from '../ui/UserMenu'
import { Tooltip } from '../ui/Tooltip'

const routeLabels: Record<string, { eyebrow: string; title: string }> = {
  '/dashboard': { eyebrow: 'SOC Overview', title: 'Dashboard' },
  '/live-threat-map': { eyebrow: 'Global Telemetry', title: 'Live Threat Map' },
  '/application-layer': { eyebrow: 'Application Layer', title: 'Adaptive Application Security' },
  '/threat-intelligence': { eyebrow: 'Threat Feed Center', title: 'Threat Intelligence' },
  '/attack-analytics': { eyebrow: 'Historical Analytics', title: 'Attack Analytics' },
  '/vulnerability-center': { eyebrow: 'Asset Security', title: 'Vulnerability Center' },
  '/ai-threat-detection': { eyebrow: 'Machine Learning Insights', title: 'AI Threat Detection' },
  '/malware-analysis': { eyebrow: 'Malware Investigation', title: 'Malware Analysis' },
  '/network-monitoring': { eyebrow: 'Network Visibility', title: 'Network Monitoring' },
  '/incident-response': { eyebrow: 'SOC Case Management', title: 'Incident Response' },
  '/log-analysis': { eyebrow: 'Log Explorer', title: 'Log Analysis' },
  '/reports': { eyebrow: 'Reporting Center', title: 'Reports' },
  '/settings': { eyebrow: 'Application Settings', title: 'Settings' },
}

export function Navbar() {
  const location = useLocation()
  const current = routeLabels[location.pathname] ?? routeLabels['/dashboard']
  const [search, setSearch] = useState('')
  const [openExport, setOpenExport] = useState(false)
  const setTimeRange = useAnalyticsStore((state) => state.setTimeRange)
  const setCountry = useAnalyticsStore((state) => state.setCountry)
  const setOpen = useNotificationStore((state) => state.setOpen)
  const theme = useSettingsStore((state) => state.theme)
  const setTheme = useSettingsStore((state) => state.setTheme)

  return (
    <>
      <motion.header initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-slate-950/70 px-5 py-4 shadow-xl shadow-cyan-950/20 backdrop-blur-xl">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-400">{current.eyebrow}</p>
          <h1 className="text-2xl font-semibold text-white">{current.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select onChange={(event) => setTimeRange(event.target.value)} className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-300 outline-none">
            <option value="24h">24h</option>
            <option value="7d">7d</option>
            <option value="30d">30d</option>
            <option value="90d">90d</option>
          </select>
          <select onChange={(event) => setCountry(event.target.value)} className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-300 outline-none">
            <option value="All">All Countries</option>
            <option value="US">US</option>
            <option value="DE">DE</option>
            <option value="SG">SG</option>
            <option value="BR">BR</option>
            <option value="GB">GB</option>
          </select>
          <label className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-400">
            <Search className="h-4 w-4" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-32 bg-transparent outline-none" placeholder="Search" />
          </label>
          <Tooltip label="Notifications">
            <button onClick={() => setOpen(true)} className="rounded-full border border-white/10 bg-slate-900/80 p-2 text-slate-300"><Bell className="h-4 w-4" /></button>
          </Tooltip>
          <Tooltip label="Theme">
            <button onClick={() => setTheme(theme === 'Dark' ? 'Dark Blue' : theme === 'Dark Blue' ? 'Midnight' : theme === 'Midnight' ? 'Cyber Neon' : 'Dark')} className="rounded-full border border-white/10 bg-slate-900/80 p-2 text-slate-300">
              {theme === 'Dark' ? <MoonStar className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
            </button>
          </Tooltip>
          <Tooltip label="Export">
            <button onClick={() => setOpenExport(true)} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white"><Download className="h-4 w-4" /> Export</button>
          </Tooltip>
          <UserMenu />
        </div>
      </motion.header>
      <NotificationDrawer />
      <ExportModal open={openExport} onClose={() => setOpenExport(false)} />
    </>
  )
}
