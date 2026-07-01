import { Bell, Download, MoonStar, Search, UserCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function Navbar() {
  return (
    <motion.header initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-slate-950/70 px-5 py-4 shadow-xl shadow-cyan-950/20 backdrop-blur-xl">
      <div>
        <p className="text-sm uppercase tracking-[0.32em] text-cyan-400">Application Layer</p>
        <h1 className="text-2xl font-semibold text-white">Adaptive Application Security</h1>
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
