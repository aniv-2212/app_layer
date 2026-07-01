import { Activity, AlertTriangle, Bot, FileText, Globe2, LayoutDashboard, LogOut, Radar, ShieldCheck, ShieldAlert, SlidersHorizontal, Sparkles, TerminalSquare, TrendingUp, UserCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const items = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Live Threat Map', icon: Globe2 },
  { label: 'Application Layer', icon: ShieldCheck, active: true },
  { label: 'Threat Intelligence', icon: Radar },
  { label: 'Attack Analytics', icon: TrendingUp },
  { label: 'Vulnerability Center', icon: ShieldAlert },
  { label: 'AI Threat Detection', icon: Sparkles },
  { label: 'Malware Analysis', icon: Bot },
  { label: 'Network Monitoring', icon: Activity },
  { label: 'Incident Response', icon: AlertTriangle },
  { label: 'Log Analysis', icon: TerminalSquare },
  { label: 'Reports', icon: FileText },
  { label: 'Settings', icon: SlidersHorizontal },
]

export function Sidebar() {
  return (
    <motion.aside initial={{ x: -24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="hidden lg:flex w-72 flex-col rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-fuchsia-500">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-slate-400">CyberAI</p>
          <h2 className="text-lg font-semibold text-white">SOC Command</h2>
        </div>
      </div>
      <nav className="space-y-1.5">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <button key={item.label} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${item.active ? 'bg-white/15 text-white shadow-lg shadow-cyan-500/10' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
      <div className="mt-auto rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 to-fuchsia-500/10 p-4">
        <div className="mb-3 flex items-center gap-3">
          <UserCircle2 className="h-8 w-8 text-cyan-300" />
          <div>
            <p className="text-sm font-medium text-white">A. Patel</p>
            <p className="text-xs text-slate-400">SOC Lead</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300">
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </motion.aside>
  )
}
