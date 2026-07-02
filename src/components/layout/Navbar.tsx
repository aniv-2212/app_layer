import { Bell, Download, MoonStar, Search, UserCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

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

  return (
    <motion.header initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-slate-950/70 px-5 py-4 shadow-xl shadow-cyan-950/20 backdrop-blur-xl">
      <div>
        <p className="text-sm uppercase tracking-[0.32em] text-cyan-400">{current.eyebrow}</p>
        <h1 className="text-2xl font-semibold text-white">{current.title}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <select className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-300 outline-none">
          <option>24h</option>
          <option>7d</option>
          <option>30d</option>
        </select>
        <select className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-300 outline-none">
          <option>All Countries</option>
          <option>US</option>
          <option>DE</option>
        </select>
        <label className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-400">
          <Search className="h-4 w-4" />
          <input className="w-32 bg-transparent outline-none" placeholder="Search" />
        </label>
        <button className="rounded-full border border-white/10 bg-slate-900/80 p-2 text-slate-300"><Bell className="h-4 w-4" /></button>
        <button className="rounded-full border border-white/10 bg-slate-900/80 p-2 text-slate-300"><MoonStar className="h-4 w-4" /></button>
        <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white"><Download className="h-4 w-4" /> Export</button>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-3 py-2">
          <UserCircle2 className="h-5 w-5 text-cyan-300" />
          <span className="text-sm text-slate-300">Ops Team</span>
        </div>
      </div>
    </motion.header>
  )
}
